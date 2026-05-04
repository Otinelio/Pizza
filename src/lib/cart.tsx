import React, { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import type { MenuItem } from "./data";

interface CartLine {
  item: MenuItem;
  qty: number;
}

interface CartCtx {
  lines: CartLine[];
  count: number;
  total: number;
  add: (item: MenuItem) => void;
  inc: (id: string) => void;
  dec: (id: string) => void;
  remove: (id: string) => void;
  clear: () => void;
  open: boolean;
  setOpen: (b: boolean) => void;
  note: string;
  setNote: (s: string) => void;
}

const Ctx = createContext<CartCtx | null>(null);

export function useCart(): CartCtx {
  const c = useContext(Ctx);
  if (!c) throw new Error("useCart must be used inside CartProvider");
  return c;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [open, setOpen] = useState(false);
  const [note, setNote] = useState("");
  const [badgeKey, setBadgeKey] = useState(0);

  const add = useCallback((item: MenuItem) => {
    setLines((prev) => {
      const existing = prev.find((l) => l.item.id === item.id);
      if (existing) return prev.map((l) => (l.item.id === item.id ? { ...l, qty: l.qty + 1 } : l));
      return [...prev, { item, qty: 1 }];
    });
    setBadgeKey((k) => k + 1);
  }, []);

  const inc = useCallback((id: string) => {
    setLines((prev) => prev.map((l) => (l.item.id === id ? { ...l, qty: l.qty + 1 } : l)));
  }, []);

  const dec = useCallback((id: string) => {
    setLines((prev) =>
      prev.map((l) => (l.item.id === id ? { ...l, qty: Math.max(1, l.qty - 1) } : l))
    );
  }, []);

  const remove = useCallback((id: string) => {
    setLines((prev) => prev.filter((l) => l.item.id !== id));
  }, []);

  const clear = useCallback(() => {
    setLines([]);
    setNote("");
  }, []);

  const count = lines.reduce((s, l) => s + l.qty, 0);
  const total = lines.reduce((s, l) => s + l.item.price * l.qty, 0);

  return (
    <Ctx.Provider value={{ lines, count, total, add, inc, dec, remove, clear, open, setOpen, note, setNote }}>
      {children}
      {/* Hidden element to trigger badge re-animation */}
      <span data-badge-key={badgeKey} style={{ display: "none" }} />
    </Ctx.Provider>
  );
}
