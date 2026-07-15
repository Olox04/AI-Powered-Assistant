import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Clock, User } from "lucide-react";
import { recentOrders, type Order } from "@/lib/menu-data";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/orders")({
  head: () => ({ meta: [{ title: "Orders — Skhura's Eatery" }] }),
  component: OrdersPage,
});

const extendedOrders: Order[] = [
  ...recentOrders,
  { id: "#4813", customer: "Zinhle O.", items: ["Chicken Wings 8pc"], total: 79, status: "preparing", time: "32m ago" },
  { id: "#4812", customer: "Bongani S.", items: ["Beef Grill Plate"], total: 129, status: "ready", time: "35m ago" },
  { id: "#4811", customer: "Refilwe M.", items: ["Loaded Amagwinya x2"], total: 90, status: "completed", time: "40m ago" },
  { id: "#4810", customer: "Katlego P.", items: ["Chip Roll Classic"], total: 35, status: "pending", time: "45m ago" },
];

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

function OrdersPage() {
  const [tab, setTab] = useState<"current" | Order["status"]>("current");

  const filtered = useMemo(() => {
    if (tab === "current") return extendedOrders.filter((o) => o.status !== "completed");
    return extendedOrders.filter((o) => o.status === tab);
  }, [tab]);

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
                {extendedOrders.filter((o) => o.status === s).length}
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
              {filtered.map((o) => (
                <article key={o.id} className="card-hover rounded-2xl border border-border bg-card p-5 shadow-soft">
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

                  <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
                    <div className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" /> {o.time}
                    </div>
                    <div className="text-xl font-black">R{o.total}</div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
