import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Clock, User, ArrowRight, Receipt } from "lucide-react";
import { type Order } from "@/lib/menu-data";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useCart } from "@/lib/cart-store";
import { toast } from "sonner";

export const Route = createFileRoute("/orders/")({
  head: () => ({ meta: [{ title: "Orders — Skhura's Eatery" }] }),
  component: OrdersPage,
});

const statusStyles: Record<Order["status"], string> = {
  completed: "bg-success/15 text-success",
  preparing: "bg-primary/15 text-primary",
  ready: "bg-info/15 text-info",
  pending: "bg-muted text-muted-foreground",
};

const dotStyles: Record<Order["status"], string> = {
  completed: "bg-success",
  preparing: "bg-primary",
  ready: "bg-info",
  pending: "bg-muted-foreground",
};

const nextLabel: Record<Order["status"], string | null> = {
  pending: "Start preparing",
  preparing: "Mark ready",
  ready: "Complete",
  completed: null,
};

function OrdersPage() {
  const { orders, advanceStatus } = useCart();
  const [tab, setTab] = useState<"current" | Order["status"]>("current");

  const filtered = useMemo(() => {
    if (tab === "current") return orders.filter((o) => o.status !== "completed");
    return orders.filter((o) => o.status === tab);
  }, [tab, orders]);

  return (
    <div className="mx-auto max-w-[1400px] p-4 md:p-8">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black md:text-4xl">Orders</h1>
          <p className="text-sm text-muted-foreground">Live pipeline of your kitchen.</p>
        </div>
        <div className="flex gap-3">
          {(["preparing", "ready", "completed"] as const).map((s) => (
            <div key={s} className="rounded-2xl border border-border bg-card px-4 py-2 shadow-soft">
              <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{s}</div>
              <div className="text-lg font-black">
                {orders.filter((o) => o.status === s).length}
              </div>
            </div>
          ))}
        </div>
      </div>

      <Tabs value={tab} onValueChange={(v) => setTab(v as typeof tab)}>
        <TabsList className="mb-6 h-11 rounded-full bg-muted p-1">
          <TabsTrigger value="current" className="rounded-full px-5">Current</TabsTrigger>
          <TabsTrigger value="preparing" className="rounded-full px-5">Preparing</TabsTrigger>
          <TabsTrigger value="ready" className="rounded-full px-5">Ready</TabsTrigger>
          <TabsTrigger value="completed" className="rounded-full px-5">Completed</TabsTrigger>
        </TabsList>

        <TabsContent value={tab} className="m-0">
          {filtered.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
              No orders in this stage.
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {filtered.map((o) => {
                const action = nextLabel[o.status];
                return (
                  <article key={o.id} className="card-hover flex flex-col rounded-2xl border border-border bg-card p-5 shadow-soft">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="grid h-10 w-10 place-items-center rounded-full bg-primary/10 text-primary">
                          <User className="h-4 w-4" />
                        </div>
                        <div>
                          <div className="font-bold">{o.customer}</div>
                          <div className="text-xs text-muted-foreground">Order {o.id}</div>
                        </div>
                      </div>
                      <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase", statusStyles[o.status])}>
                        <span className={cn("h-1.5 w-1.5 rounded-full", dotStyles[o.status])} />
                        {o.status}
                      </span>
                    </div>

                    <ul className="mt-4 space-y-1.5 text-sm">
                      {o.items.map((it, i) => (
                        <li key={i} className="flex items-center gap-2 text-muted-foreground">
                          <span className="h-1 w-1 rounded-full bg-primary" /> {it}
                        </li>
                      ))}
                    </ul>

                    <div className="mt-auto flex items-center justify-between border-t border-border pt-4">
                      <div className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" /> {o.time}
                      </div>
                      <div className="text-xl font-black">R{o.total}</div>
                    </div>

                    <div className="mt-3 flex gap-2">
                      <Link
                        to="/orders/$orderId"
                        params={{ orderId: o.id.replace(/^#/, "") }}
                        className="flex-1"
                      >
                        <Button size="sm" variant="outline" className="w-full rounded-full">
                          <Receipt className="mr-1 h-3.5 w-3.5" /> Receipt
                        </Button>
                      </Link>
                      {action && (
                        <Button
                          size="sm"
                          className="flex-1 rounded-full"
                          onClick={() => {
                            advanceStatus(o.id);
                            toast.success(`${o.id} → ${action.toLowerCase()}`);
                          }}
                        >
                          {action} <ArrowRight className="ml-1 h-3.5 w-3.5" />
                        </Button>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
