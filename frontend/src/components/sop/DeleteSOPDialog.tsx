import { X, Trash2, AlertTriangle } from "lucide-react";
import { SOP } from "@/services/sopService";

interface DeleteSOPDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (sop: SOP) => void;
  sop: SOP | null;
}

export function DeleteSOPDialog({ isOpen, onClose, onConfirm, sop }: DeleteSOPDialogProps) {
  if (!isOpen || !sop) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-5 border-b border-slate-800">
          <div className="flex items-center gap-2 text-red-400">
            <AlertTriangle size={20} />
            <h3 className="text-lg font-semibold">Delete SOP?</h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors p-1 rounded-md hover:bg-slate-800"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-5">
          <p className="text-slate-300 text-sm">
            Are you sure you want to delete <span className="font-semibold text-white">"{sop.name}"</span>?
          </p>
          <p className="text-slate-500 text-sm mt-2">
            This action cannot be undone.
          </p>
        </div>

        <div className="flex items-center justify-end gap-3 p-5 pt-0">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onConfirm(sop);
              onClose();
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-red-500/10 text-red-500 hover:bg-red-600 hover:text-white transition-colors"
          >
            <Trash2 size={16} />
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
