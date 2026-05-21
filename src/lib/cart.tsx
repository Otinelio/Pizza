import React, { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import type { MenuItem, Supplement } from "./data";

export interface CartLine {
  id: string; // unique ID generated for this combination
  item: MenuItem;
  selectedSupplements: Supplement[];
  qty: number;
}

interface CartCtx {
  lines: CartLine[];
  count: number;
  total: number;
  add: (item: MenuItem, selectedSupplements?: Supplement[]) => void;
  inc: (lineId: string) => void;
  dec: (lineId: string) => void;
  remove: (lineId: string) => void;
  clear: () => void;
  open: boolean;
  setOpen: (b: boolean) => void;
  note: string;
  setNote: (s: string) => void;
  updateLineSupplements: (lineId: string, selectedSupplements: Supplement[]) => void;
}

const Ctx = createContext<CartCtx | null>(null);

export function useCart(): CartCtx {
  const c = useContext(Ctx);
  if (!c) throw new Error("useCart must be used inside CartProvider");
  return c;
}

export function getLineId(itemId: string, selectedSupplements: Supplement[]): string {
  if (!selectedSupplements || selectedSupplements.length === 0) return itemId;
  const sorted = [...selectedSupplements].sort((a, b) => a.name.localeCompare(b.name));
  return `${itemId}-${sorted.map((s) => `${s.name}:${s.price}`).join(",")}`;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [open, setOpen] = useState(false);
  const [note, setNote] = useState("");
  const [badgeKey, setBadgeKey] = useState(0);

  const add = useCallback((item: MenuItem, selectedSupplements: Supplement[] = []) => {
    setLines((prev) => {
      const lineId = getLineId(item.id, selectedSupplements);
      const existing = prev.find((l) => l.id === lineId);
      if (existing) return prev.map((l) => (l.id === lineId ? { ...l, qty: l.qty + 1 } : l));
      return [...prev, { id: lineId, item, selectedSupplements, qty: 1 }];
    });
    setBadgeKey((k) => k + 1);
  }, []);

  const inc = useCallback((lineId: string) => {
    setLines((prev) => prev.map((l) => (l.id === lineId ? { ...l, qty: l.qty + 1 } : l)));
  }, []);

  const dec = useCallback((lineId: string) => {
    setLines((prev) =>
      prev.map((l) => (l.id === lineId ? { ...l, qty: Math.max(1, l.qty - 1) } : l))
    );
  }, []);

  const remove = useCallback((lineId: string) => {
    setLines((prev) => prev.filter((l) => l.id !== lineId));
  }, []);

  const updateLineSupplements = useCallback((lineId: string, selectedSupplements: Supplement[]) => {
    setLines((prev) => {
      const line = prev.find((l) => l.id === lineId);
      if (!line) return prev;

      const newLineId = getLineId(line.item.id, selectedSupplements);

      // Si la nouvelle combinaison de suppléments existe déjà sous une autre ligne, on les fusionne.
      const existing = prev.find((l) => l.id === newLineId && l.id !== lineId);
      if (existing) {
        return prev
          .map((l) => {
            if (l.id === newLineId) return { ...l, qty: l.qty + line.qty };
            return l;
          })
          .filter((l) => l.id !== lineId);
      }

      // Sinon, on met simplement à jour les suppléments et l'ID de la ligne
      return prev.map((l) => (l.id === lineId ? { ...l, id: newLineId, selectedSupplements } : l));
    });
  }, []);

  const clear = useCallback(() => {
    setLines([]);
    setNote("");
  }, []);

  const count = lines.reduce((s, l) => s + l.qty, 0);
  const total = lines.reduce((s, l) => {
    const supsTotal = l.selectedSupplements.reduce((sum, sup) => sum + sup.price, 0);
    return s + (l.item.price + supsTotal) * l.qty;
  }, 0);

  return (
    <Ctx.Provider value={{ lines, count, total, add, inc, dec, remove, clear, open, setOpen, note, setNote, updateLineSupplements }}>
      {children}
      {/* Hidden element to trigger badge re-animation */}
      <span data-badge-key={badgeKey} style={{ display: "none" }} />
    </Ctx.Provider>
  );
}
