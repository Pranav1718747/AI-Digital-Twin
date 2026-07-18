import { useState, useEffect } from "react";
import { X, Check } from "lucide-react";
import { SOP } from "@/services/sopService";

interface RenameSOPDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onRename: (sop: SOP, newName: string) => void;
  sop: SOP | null;
}

export function RenameSOPDialog({ isOpen, onClose, onRename, sop }: RenameSOPDialogProps) {
  const [name, setName] = useState("");

  useEffect(() => {
    if (isOpen && sop) {
      setName(sop.name);
    }
  }, [isOpen, sop]);

  if (!isOpen || !sop) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-5 border-b border-slate-800">
          <h3 className="text-lg font-semibold text-white">Rename SOP</h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors p-1 rounded-md hover:bg-slate-800"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-5">
          <label htmlFor="rename-sop" className="block text-sm font-medium text-slate-300 mb-1.5">
            New Name
          </label>
          <input
            id="rename-sop"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500"
            autoFocus
          />
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
              if (name.trim() && name.trim() !== sop.name) {
                onRename(sop, name.trim());
                onClose();
              }
            }}
            disabled={!name.trim() || name.trim() === sop.name}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-blue-600 text-white hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Check size={16} />
            Rename
          </button>
        </div>
      </div>
    </div>
  );
}
