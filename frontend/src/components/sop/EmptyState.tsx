import { FileText } from "lucide-react";

export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center text-slate-400">
      <div className="w-16 h-16 rounded-full bg-slate-800/50 flex items-center justify-center mb-4">
        <FileText size={32} className="text-slate-500" />
      </div>
      <h3 className="text-lg font-medium text-slate-300 mb-2">No saved SOPs</h3>
      <p className="text-sm max-w-xs">
        You haven't saved any Standard Operating Procedures yet. Build one in the canvas and click "Save SOP".
      </p>
    </div>
  );
}
