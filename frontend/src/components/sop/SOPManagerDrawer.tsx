import { useState } from "react";
import { X, Search } from "lucide-react";
import { SOP } from "@/services/sopService";
import { SOPCard } from "./SOPCard";
import { EmptyState } from "./EmptyState";

interface SOPManagerDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  sops: SOP[];
  onLoad: (sop: SOP) => void;
  onRename: (sop: SOP) => void;
  onDelete: (sop: SOP) => void;
}

export function SOPManagerDrawer({
  isOpen,
  onClose,
  sops,
  onLoad,
  onRename,
  onDelete,
}: SOPManagerDrawerProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredSOPs = sops.filter((sop) =>
    sop.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    sop.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity" 
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-slate-900 border-l border-slate-800 z-50 transform transition-transform duration-300 ease-in-out shadow-2xl flex flex-col ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-6 border-b border-slate-800">
          <h2 className="text-xl font-semibold text-white">My SOPs</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors p-1.5 rounded-md hover:bg-slate-800"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 border-b border-slate-800 bg-slate-900/50">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input
              type="text"
              placeholder="Search SOPs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
          {sops.length === 0 ? (
            <EmptyState />
          ) : filteredSOPs.length === 0 ? (
            <div className="text-center py-8 text-slate-400 text-sm">
              No SOPs match your search.
            </div>
          ) : (
            filteredSOPs.map((sop) => (
              <SOPCard
                key={sop.id}
                sop={sop}
                onLoad={(s) => {
                  onLoad(s);
                  onClose();
                }}
                onRename={onRename}
                onDelete={onDelete}
              />
            ))
          )}
        </div>
      </div>
    </>
  );
}
