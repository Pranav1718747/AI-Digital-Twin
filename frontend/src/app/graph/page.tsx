"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { Filter } from "lucide-react";

// Cytoscape requires window object, so we must dynamically import it with ssr: false
const GraphExplorer = dynamic(() => import("@/components/GraphExplorer"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[600px] glass-panel flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  ),
});

export default function GraphPage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In production, this would fetch from /api/v1/graph/snapshot
    // For now, we simulate network delay before rendering default mock graph
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Knowledge Graph</h1>
          <p className="text-gray-400 text-sm">Visualizing organizational topology from Neo4j.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 glass-panel hover:bg-white/5 transition-colors text-sm font-medium">
          <Filter size={16} />
          Filter Nodes
        </button>
      </div>

      <div className="flex-1 rounded-xl overflow-hidden relative border border-white/10 shadow-[0_0_30px_rgba(99,102,241,0.15)]">
        {!loading && <GraphExplorer />}
      </div>
    </div>
  );
}
