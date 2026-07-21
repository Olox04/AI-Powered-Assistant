import { createFileRoute, Link, notFound, useRouter } from "@tanstack/react-router";
import { ArrowLeft, Printer, CheckCircle2, Clock, ChefHat, Bell, Package, ArrowRight } from "lucide-react";
import { useMemo } from "react";
import { useCart } from "@/lib/cart-store";
import { type Order } from "@/lib/menu-data";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export const Route = createFileRoute("/orders/$orderId")({
  head: ({ params }) => ({
    meta: [
      { title: `Receipt #${params.orderId} — Skhura's Eatery` },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ReceiptPage,
  errorComponent: ReceiptError,
  notFoundComponent: ReceiptNotFound,
});

const STAGES: Order["status"][] = ["pending", "preparing", "ready", "completed"];

const stageMeta: Record<
  Order["status"],
  { label: string; icon: typeof Clock; tone: string; dot: string }
> = {
  pending: { label: "Order received", icon: Clock, tone: "text-muted-foreground", dot: "bg-muted-foreground" },
  preparing: { label: "In the kitchen", icon: ChefHat, tone: "text-primary", dot: "bg-primary" },
  ready: { label: "Ready for pickup", icon: Bell, tone: "text-info", dot: "bg-info" },
  completed: { label: "Completed", icon: CheckCircle2, tone: "text-success", dot: "bg-success" },
};

const nextLabel: Record<Order["status"], string | null> = {
  pending: "Start preparing",
  preparing: "Mark ready",
  ready: "Complete",
  completed: null,
};

function ReceiptPage() {
  const { orderId } = Route.useParams();
  const { orders, advanceStatus } = useCart();
  const router = useRouter();

  const order = useMemo(
    () => orders.find((o) => o.id === `#${orderId}` || o.id === orderId),
    [orders, orderId],
  );

  if (!order) throw notFound();

  const currentStageIndex = STAGES.indexOf(order.status);
  const subtotal =
    order.subtotal ??
    (order.lineItems?.reduce((s, i) => s + i.price * i.qty, 0) ?? order.total);
  const serviceFee = order.serviceFee ?? Math.max(order.total - subtotal, 0);
  const placedAt = order.placedAt ? new Date(order.placedAt) : null;

  const history =
    order.history && order.history.length > 0
      ? order.history
      : [{ status: order.status, at: order.placedAt ?? Date.now() }];

  const action = nextLabel[order.status];

  return (
    <div className="mx-auto max-w-[1100px] p-4 md:p-8">
      {/* Screen-only header */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 print:hidden">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.history.back()}
          className="text-muted-foreground"
        >
          <ArrowLeft className="mr-1.5 h-4 w-4" /> Back
        </Button>
        <div className="flex gap-2">
          {action && (
            <Button
              variant="outline"
              size="sm"
              className="rounded-full"
              onClick={() => {
                advanceStatus(order.id);
                toast.success(`${order.id} → ${action.toLowerCase()}`);
              }}
            >
              {action} <ArrowRight className="ml-1 h-3.5 w-3.5" />
            </Button>
          )}
          <Button
            size="sm"
            className="rounded-full"
            onClick={() => window.print()}
          >
            <Printer className="mr-1.5 h-4 w-4" /> Print receipt
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_360px] print:block">
        {/* Receipt */}
        <section
          id="printable-receipt"
          className="rounded-3xl border border-border bg-card p-8 shadow-soft print:border-0 print:shadow-none print:p-0"
        >
          <header className="flex items-start justify-between gap-4 border-b border-dashed border-border pb-6">
            <div>
              <div className="text-[11px] font-bold uppercase tracking-[0.25em] text-primary">
                Skhura's Eatery
              </div>
              <h1 className="mt-1 text-2xl font-black md:text-3xl">Order Receipt</h1>
              <p className="mt-1 text-xs text-muted-foreground">
                Baking the world new classics
              </p>
            </div>
            <div className="text-right">
              <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                Order
              </div>
              <div className="text-2xl font-black">{order.id}</div>
              <div className="mt-1 flex flex-wrap justify-end gap-1.5">
                <span
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider",
                    order.status === "completed" && "bg-success/15 text-success",
                    order.status === "preparing" && "bg-primary/15 text-primary",
                    order.status === "ready" && "bg-info/15 text-info",
                    order.status === "pending" && "bg-muted text-muted-foreground",
                  )}
                >
                  <span className={cn("h-1.5 w-1.5 rounded-full", stageMeta[order.status].dot)} />
                  {order.status}
                </span>
                <span
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider",
                    order.paymentStatus === "paid" && "bg-success/15 text-success",
                    order.paymentStatus === "refunded" && "bg-info/15 text-info",
                    (!order.paymentStatus || order.paymentStatus === "unpaid") && "bg-destructive/10 text-destructive",
                  )}
                >
                  <span
                    className={cn(
                      "h-1.5 w-1.5 rounded-full",
                      order.paymentStatus === "paid" && "bg-success",
                      order.paymentStatus === "refunded" && "bg-info",
                      (!order.paymentStatus || order.paymentStatus === "unpaid") && "bg-destructive",
                    )}
                  />
                  {order.paymentStatus ?? "unpaid"}
                </span>
              </div>
            </div>
          </header>

          <dl className="mt-6 grid grid-cols-2 gap-4 text-sm sm:grid-cols-3">
            <div>
              <dt className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                Customer
              </dt>
              <dd className="mt-0.5 font-semibold">{order.customer}</dd>
            </div>
            <div>
              <dt className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                Placed
              </dt>
              <dd className="mt-0.5 font-semibold">
                {placedAt
                  ? placedAt.toLocaleString(undefined, {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })
                  : order.time}
              </dd>
            </div>
            <div>
              <dt className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                Items
              </dt>
              <dd className="mt-0.5 font-semibold">
                {order.lineItems?.reduce((s, i) => s + i.qty, 0) ?? order.items.length}
              </dd>
            </div>
          </dl>

          {/* Line items */}
          <div className="mt-6 overflow-hidden rounded-2xl border border-border">
            <table className="w-full text-sm">
              <thead className="bg-muted/60 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 text-left">Item</th>
                  <th className="px-4 py-3 text-right">Qty</th>
                  <th className="px-4 py-3 text-right">Price</th>
                  <th className="px-4 py-3 text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                {order.lineItems && order.lineItems.length > 0 ? (
                  order.lineItems.map((i) => (
                    <tr key={i.id} className="border-t border-border">
                      <td className="px-4 py-3 font-semibold">{i.name}</td>
                      <td className="px-4 py-3 text-right">{i.qty}</td>
                      <td className="px-4 py-3 text-right text-muted-foreground">R{i.price}</td>
                      <td className="px-4 py-3 text-right font-bold">R{i.price * i.qty}</td>
                    </tr>
                  ))
                ) : (
                  order.items.map((label, idx) => (
                    <tr key={idx} className="border-t border-border">
                      <td className="px-4 py-3 font-semibold" colSpan={3}>
                        {label}
                      </td>
                      <td className="px-4 py-3 text-right text-muted-foreground">—</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div className="mt-6 ml-auto max-w-xs space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="font-semibold">R{subtotal}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Service fee</span>
              <span className="font-semibold">R{serviceFee}</span>
            </div>
            <div className="flex justify-between border-t border-border pt-2 text-base">
              <span className="font-bold">Total</span>
              <span className="text-xl font-black">R{order.total}</span>
            </div>
          </div>

          <footer className="mt-8 border-t border-dashed border-border pt-4 text-center text-[11px] text-muted-foreground">
            Thank you for eating with Skhura's — see you soon. · This receipt was generated for order {order.id}.
          </footer>
        </section>

        {/* Status history — screen only */}
        <aside className="lg:sticky lg:top-20 lg:h-fit print:hidden">
          <div className="rounded-3xl border border-border bg-card p-6 shadow-soft">
            <div className="flex items-center gap-2">
              <Package className="h-4 w-4 text-primary" />
              <h2 className="text-lg font-black">Status history</h2>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              Live progress of this order from kitchen to counter.
            </p>

            <ol className="mt-5 space-y-4">
              {STAGES.map((stage, idx) => {
                const event = history.find((h) => h.status === stage);
                const reached = idx <= currentStageIndex;
                const isCurrent = idx === currentStageIndex;
                const meta = stageMeta[stage];
                const Icon = meta.icon;
                return (
                  <li key={stage} className="relative flex gap-3">
                    {idx < STAGES.length - 1 && (
                      <span
                        className={cn(
                          "absolute left-4 top-8 h-full w-px",
                          reached ? "bg-primary/40" : "bg-border",
                        )}
                        aria-hidden
                      />
                    )}
                    <div
                      className={cn(
                        "grid h-8 w-8 shrink-0 place-items-center rounded-full border-2",
                        reached
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border bg-background text-muted-foreground",
                        isCurrent && "ring-4 ring-primary/20",
                      )}
                    >
                      <Icon className="h-3.5 w-3.5" />
                    </div>
                    <div className="min-w-0 flex-1 pb-1">
                      <div className={cn("text-sm font-bold", reached ? meta.tone : "text-muted-foreground")}>
                        {meta.label}
                      </div>
                      <div className="text-[11px] text-muted-foreground">
                        {event
                          ? new Date(event.at).toLocaleString(undefined, {
                              dateStyle: "medium",
                              timeStyle: "short",
                            })
                          : "Pending"}
                      </div>
                    </div>
                  </li>
                );
              })}
            </ol>

            <div className="mt-6 flex flex-col gap-2">
              <Link to="/orders" className="text-center text-xs text-muted-foreground hover:underline">
                View all orders
              </Link>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

function ReceiptNotFound() {
  const { orderId } = Route.useParams();
  return (
    <div className="mx-auto max-w-lg p-10 text-center">
      <h1 className="text-2xl font-black">Order not found</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        We couldn't find order #{orderId}. It may have been cleared from local history.
      </p>
      <Link to="/orders">
        <Button className="mt-6 rounded-full">Back to orders</Button>
      </Link>
    </div>
  );
}

function ReceiptError({ error, reset }: { error: Error; reset: () => void }) {
  const router = useRouter();
  return (
    <div className="mx-auto max-w-lg p-10 text-center">
      <h1 className="text-2xl font-black">Something went wrong</h1>
      <p className="mt-2 text-sm text-muted-foreground">{error.message}</p>
      <Button
        className="mt-6 rounded-full"
        onClick={() => {
          reset();
          router.invalidate();
        }}
      >
        Try again
      </Button>
    </div>
  );
}
