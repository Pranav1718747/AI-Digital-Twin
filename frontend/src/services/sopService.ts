import { Edge, Node, Viewport } from "@xyflow/react";

export interface SOP {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  nodes: Node[];
  edges: Edge[];
  viewport: Viewport;
  version: number;
}

const STORAGE_KEY = "sentinel_saved_sops";

export const sopService = {
  getAllSOPs(): SOP[] {
    if (typeof window === "undefined") return [];
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) return [];
      return JSON.parse(data) as SOP[];
    } catch (error) {
      console.error("Failed to load SOPs from local storage", error);
      return [];
    }
  },

  getSOP(id: string): SOP | null {
    const sops = this.getAllSOPs();
    return sops.find((sop) => sop.id === id) || null;
  },

  saveSOP(sopData: Omit<SOP, "id" | "createdAt" | "updatedAt" | "version">): SOP {
    const sops = this.getAllSOPs();
    const newSOP: SOP = {
      ...sopData,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      version: 1,
    };
    sops.push(newSOP);
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sops));
    }
    return newSOP;
  },

  updateSOP(id: string, updates: Partial<Omit<SOP, "id" | "createdAt">>): SOP {
    const sops = this.getAllSOPs();
    const index = sops.findIndex((s) => s.id === id);
    if (index === -1) {
      throw new Error("SOP not found");
    }

    const updatedSOP = {
      ...sops[index],
      ...updates,
      updatedAt: new Date().toISOString(),
      version: sops[index].version + 1,
    };

    sops[index] = updatedSOP;
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sops));
    }
    return updatedSOP;
  },

  renameSOP(id: string, newName: string): SOP {
    return this.updateSOP(id, { name: newName });
  },

  deleteSOP(id: string): void {
    const sops = this.getAllSOPs();
    const filteredSOPs = sops.filter((sop) => sop.id !== id);
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredSOPs));
    }
  },
};
