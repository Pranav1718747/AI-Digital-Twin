"""
SentinelOS AI – WebSocket Real-Time Event Broadcaster

Production-grade WebSocket manager that uses Redis Pub/Sub to
broadcast tenant-scoped events to connected dashboard clients.
Supports heartbeat pings, graceful disconnection, and
multi-instance horizontal scaling via Redis channel fanout.
"""

import json
import asyncio
import logging
from uuid import UUID
from typing import Dict, Set

from fastapi import WebSocket, WebSocketDisconnect
from redis.asyncio import Redis

from backend.app.config import settings

logger = logging.getLogger("sentinel.websockets")


class ConnectionManager:
    """
    Manages active WebSocket connections grouped by tenant_id.
    Uses Redis Pub/Sub for cross-instance event broadcasting.
    """

    def __init__(self):
        self._connections: Dict[str, Set[WebSocket]] = {}
        self._redis: Redis | None = None
        self._heartbeat_interval: int = 30  # seconds

    async def _get_redis(self) -> Redis:
        """Lazy-initialize the Redis connection."""
        if self._redis is None:
            self._redis = Redis.from_url(
                settings.REDIS_URL,
                decode_responses=True,
            )
        return self._redis

    async def connect(self, websocket: WebSocket, tenant_id: str) -> None:
        """Accept a WebSocket connection and register it under the tenant."""
        await websocket.accept()
        if tenant_id not in self._connections:
            self._connections[tenant_id] = set()
        self._connections[tenant_id].add(websocket)
        logger.info(f"WebSocket connected: tenant={tenant_id} total={len(self._connections[tenant_id])}")

    def disconnect(self, websocket: WebSocket, tenant_id: str) -> None:
        """Remove a WebSocket connection from the tenant group."""
        if tenant_id in self._connections:
            self._connections[tenant_id].discard(websocket)
            if not self._connections[tenant_id]:
                del self._connections[tenant_id]
        logger.info(f"WebSocket disconnected: tenant={tenant_id}")

    async def broadcast_to_tenant(self, tenant_id: str, message: dict) -> None:
        """Send a JSON message to all WebSocket connections for a tenant."""
        connections = self._connections.get(tenant_id, set())
        if not connections:
            return

        payload = json.dumps(message)
        dead_connections = set()

        for ws in connections:
            try:
                await ws.send_text(payload)
            except Exception:
                dead_connections.add(ws)

        # Clean up dead connections
        for dead_ws in dead_connections:
            self.disconnect(dead_ws, tenant_id)

    async def publish_event(self, tenant_id: str, event_type: str, data: dict) -> None:
        """
        Publish an event to the Redis Pub/Sub channel for cross-instance fanout.
        Other SentinelOS instances subscribed to this channel will receive and
        broadcast the event to their local WebSocket connections.
        """
        redis = await self._get_redis()
        channel = f"sentinel:events:{tenant_id}"
        message = {
            "event_type": event_type,
            "tenant_id": tenant_id,
            "data": data,
        }
        await redis.publish(channel, json.dumps(message))
        logger.debug(f"Event published: channel={channel} type={event_type}")

    async def subscribe_to_tenant_events(self, tenant_id: str) -> None:
        """
        Subscribe to a tenant's Redis Pub/Sub channel and forward
        received events to local WebSocket connections.
        """
        redis = await self._get_redis()
        pubsub = redis.pubsub()
        channel = f"sentinel:events:{tenant_id}"
        await pubsub.subscribe(channel)

        logger.info(f"Subscribed to Redis channel: {channel}")

        try:
            async for message in pubsub.listen():
                if message["type"] == "message":
                    event = json.loads(message["data"])
                    await self.broadcast_to_tenant(tenant_id, event)
        except asyncio.CancelledError:
            await pubsub.unsubscribe(channel)
            logger.info(f"Unsubscribed from Redis channel: {channel}")
        except Exception as e:
            logger.error(f"Redis subscription error on {channel}: {e}")
            await pubsub.unsubscribe(channel)

    async def heartbeat(self, websocket: WebSocket, tenant_id: str) -> None:
        """
        Send periodic ping frames to keep the WebSocket alive
        and detect stale connections.
        """
        try:
            while True:
                await asyncio.sleep(self._heartbeat_interval)
                await websocket.send_json({"type": "ping"})
        except Exception:
            self.disconnect(websocket, tenant_id)

    async def shutdown(self) -> None:
        """Gracefully close all connections and the Redis client."""
        for tenant_id, connections in self._connections.items():
            for ws in connections:
                try:
                    await ws.close()
                except Exception:
                    pass
        self._connections.clear()

        if self._redis:
            await self._redis.close()
            self._redis = None

        logger.info("WebSocket manager shut down gracefully.")


# Global singleton instance
ws_manager = ConnectionManager()
