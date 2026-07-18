import { Play, Edit2, Trash2, Calendar, LayoutTemplate } from "lucide-react";
import { SOP } from "@/services/sopService";

interface SOPCardProps {
  sop: SOP;
  onLoad: (sop: SOP) => void;
  onRename: (sop: SOP) => void;
  onDelete: (sop: SOP) => void;
}

export function SOPCard({ sop, onLoad, onRename, onDelete }: SOPCardProps) {
  const formattedDate = new Date(sop.updatedAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-4 transition-all hover:border-blue-500/50 hover:bg-slate-800 group">
      <div className="flex justify-between items-start mb-2">
        <h4 className="text-white font-medium text-base line-clamp-1 flex-1 pr-2" title={sop.name}>
          {sop.name}
        </h4>
      </div>
      
      {sop.description && (
        <p className="text-sm text-slate-400 mb-4 line-clamp-2" title={sop.description}>
          {sop.description}
        </p>
      )}

      <div className="flex items-center gap-4 text-xs text-slate-500 mb-4">
        <div className="flex items-center gap-1.5">
          <Calendar size={14} />
          <span>{formattedDate}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <LayoutTemplate size={14} />
          <span>{sop.nodes.length} nodes, {sop.edges.length} edges</span>
        </div>
      </div>

      <div className="flex items-center gap-2 pt-3 border-t border-slate-700/50 mt-auto">
        <button
          onClick={() => onLoad(sop)}
          className="flex-1 flex items-center justify-center gap-2 bg-blue-600/20 text-blue-400 hover:bg-blue-600 hover:text-white px-3 py-2 rounded-lg text-sm transition-colors"
        >
          <Play size={16} />
          Load
        </button>
        <button
          onClick={() => onRename(sop)}
          className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
          title="Rename SOP"
        >
          <Edit2 size={16} />
        </button>
        <button
          onClick={() => onDelete(sop)}
          className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
          title="Delete SOP"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
}
