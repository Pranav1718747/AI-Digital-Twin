import { useState, useEffect } from "react";
import { X, Save } from "lucide-react";

interface SaveSOPModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (name: string, description: string) => void;
  initialName?: string;
}

export function SaveSOPModal({ isOpen, onClose, onSave, initialName = "" }: SaveSOPModalProps) {
  const [name, setName] = useState(initialName);
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (isOpen) {
      setName(initialName);
      setDescription("");
    }
  }, [isOpen, initialName]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-6 border-b border-slate-800">
          <h3 className="text-xl font-semibold text-white">Save SOP</h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors p-1 rounded-md hover:bg-slate-800"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label htmlFor="sop-name" className="block text-sm font-medium text-slate-300 mb-1.5">
              SOP Name <span className="text-red-400">*</span>
            </label>
            <input
              id="sop-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500"
              placeholder="e.g. Employee Onboarding v2"
              autoFocus
            />
          </div>

          <div>
            <label htmlFor="sop-desc" className="block text-sm font-medium text-slate-300 mb-1.5">
              Description (Optional)
            </label>
            <textarea
              id="sop-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 resize-none"
              placeholder="Describe what this standard operating procedure is for..."
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 p-6 pt-2 border-t border-slate-800 bg-slate-900/50">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              if (name.trim()) {
                onSave(name.trim(), description.trim());
                onClose();
              }
            }}
            disabled={!name.trim()}
            className="flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium bg-blue-600 text-white hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg shadow-blue-500/20"
          >
            <Save size={16} />
            Save SOP
          </button>
        </div>
      </div>
    </div>
  );
}
