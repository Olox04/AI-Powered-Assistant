import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { recentOrders, type FoodItem, type Order } from "./menu-data";

export type CartItem = {
  id: string;
  name: string;
  price: number;
  image: string;
  qty: number;
};

type CartContextValue = {
  items: CartItem[];
  count: number;
  total: number;
  add: (food: FoodItem, qty?: number) => void;
  remove: (id: string) => void;
  updateQty: (id: string, qty: number) => void;
  clear: () => void;
  orders: Order[];
  placeOrder: (customer: string) => Order | null;
  advanceStatus: (id: string) => void;
  setStatus: (id: string, status: Order["status"]) => void;
};

const CartContext = createContext<CartContextValue | null>(null);

const CART_KEY = "skhura.cart.v1";
const ORDERS_KEY = "skhura.orders.v1";

const nextStatus: Record<Order["status"], Order["status"]> = {
  pending: "preparing",
  preparing: "ready",
  ready: "completed",
  completed: "completed",
};

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>(recentOrders);
  const [hydrated, setHydrated] = useState(false);

  // Hydrate from localStorage after mount (SSR safe)
  useEffect(() => {
    try {
      const c = localStorage.getItem(CART_KEY);
      if (c) setItems(JSON.parse(c));
      const o = localStorage.getItem(ORDERS_KEY);
      if (o) setOrders(JSON.parse(o));
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(items));
    } catch {
      /* ignore */
    }
  }, [items, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
    } catch {
      /* ignore */
    }
  }, [orders, hydrated]);

  const add = useCallback((food: FoodItem, qty = 1) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === food.id);
      if (existing) {
        return prev.map((i) =>
          i.id === food.id ? { ...i, qty: i.qty + qty } : i,
        );
      }
      return [
        ...prev,
        { id: food.id, name: food.name, price: food.price, image: food.image, qty },
      ];
    });
  }, []);

  const remove = useCallback((id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const updateQty = useCallback((id: string, qty: number) => {
    setItems((prev) =>
      qty <= 0
        ? prev.filter((i) => i.id !== id)
        : prev.map((i) => (i.id === id ? { ...i, qty } : i)),
    );
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const placeOrder = useCallback<CartContextValue["placeOrder"]>(
    (customer) => {
      let created: Order | null = null;
      setItems((currentItems) => {
        if (currentItems.length === 0) return currentItems;
        const total = currentItems.reduce((s, i) => s + i.price * i.qty, 0);
        const order: Order = {
          id: `#${Math.floor(4900 + Math.random() * 1000)}`,
          customer: customer.trim() || "Walk-in",
          items: currentItems.map((i) => (i.qty > 1 ? `${i.name} x${i.qty}` : i.name)),
          total,
          status: "pending",
          time: "just now",
        };
        created = order;
        setOrders((prev) => [order, ...prev]);
        return [];
      });
      return created;
    },
    [],
  );

  const advanceStatus = useCallback((id: string) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status: nextStatus[o.status] } : o)),
    );
  }, []);

  const setStatus = useCallback((id: string, status: Order["status"]) => {
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
  }, []);

  const value = useMemo<CartContextValue>(() => {
    const count = items.reduce((s, i) => s + i.qty, 0);
    const total = items.reduce((s, i) => s + i.price * i.qty, 0);
    return {
      items,
      count,
      total,
      add,
      remove,
      updateQty,
      clear,
      orders,
      placeOrder,
      advanceStatus,
      setStatus,
    };
  }, [items, orders, add, remove, updateQty, clear, placeOrder, advanceStatus, setStatus]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
