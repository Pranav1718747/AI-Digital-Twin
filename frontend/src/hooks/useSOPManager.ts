import { useState, useCallback, useEffect } from "react";
import { sopService, SOP } from "@/services/sopService";
import { Edge, Node, Viewport } from "@xyflow/react";

export function useSOPManager() {
  const [sops, setSops] = useState<SOP[]>([]);
  const [activeSopId, setActiveSopId] = useState<string | null>(null);

  const fetchSOPs = useCallback(() => {
    setSops(sopService.getAllSOPs());
  }, []);

  useEffect(() => {
    fetchSOPs();
  }, [fetchSOPs]);

  const saveSOP = useCallback(
    (name: string, description: string, nodes: Node[], edges: Edge[], viewport: Viewport) => {
      const newSOP = sopService.saveSOP({
        name,
        description,
        nodes,
        edges,
        viewport,
      });
      setActiveSopId(newSOP.id);
      fetchSOPs();
      return newSOP;
    },
    [fetchSOPs]
  );

  const updateActiveSOP = useCallback(
    (nodes: Node[], edges: Edge[], viewport: Viewport) => {
      if (!activeSopId) throw new Error("No active SOP to update");
      const updated = sopService.updateSOP(activeSopId, { nodes, edges, viewport });
      fetchSOPs();
      return updated;
    },
    [activeSopId, fetchSOPs]
  );

  const renameSOP = useCallback(
    (id: string, newName: string) => {
      sopService.renameSOP(id, newName);
      fetchSOPs();
    },
    [fetchSOPs]
  );

  const deleteSOP = useCallback(
    (id: string) => {
      sopService.deleteSOP(id);
      if (activeSopId === id) {
        setActiveSopId(null);
      }
      fetchSOPs();
    },
    [activeSopId, fetchSOPs]
  );

  const loadSOP = useCallback((id: string) => {
    const sop = sopService.getSOP(id);
    if (sop) {
      setActiveSopId(id);
      return sop;
    }
    return null;
  }, []);

  const clearActiveSOP = useCallback(() => {
    setActiveSopId(null);
  }, []);

  return {
    sops,
    activeSopId,
    saveSOP,
    updateActiveSOP,
    renameSOP,
    deleteSOP,
    loadSOP,
    clearActiveSOP,
    refreshSOPs: fetchSOPs,
  };
}
