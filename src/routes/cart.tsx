import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { useCart } from "@/lib/cart-store";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export const Route = createFileRoute("/cart")({
  head: () => ({ meta: [{ title: "Cart — Skhura's Eatery" }] }),
  component: CartPage,
});

function CartPage() {
  const { items, updateQty, remove, total, clear, placeOrder } = useCart();
  const [customer, setCustomer] = useState("");
  const navigate = useNavigate();

  const serviceFee = items.length > 0 ? 12 : 0;
  const grand = total + serviceFee;

  const checkout = () => {
    const order = placeOrder(customer);
    if (!order) {
      toast.error("Your cart is empty");
      return;
    }
    toast.success(`Order ${order.id} placed`);
    setCustomer("");
    navigate({ to: "/orders" });
  };

  return (
    <div className="mx-auto max-w-[1400px] p-4 md:p-8">
      <div className="mb-6 flex items-end justify-between gap-3">
        <div>
          <h1 className="text-3xl font-black md:text-4xl">Your Cart</h1>
          <p className="text-sm text-muted-foreground">
            Review items and place the order — it'll show up in the kitchen pipeline.
          </p>
        </div>
        {items.length > 0 && (
          <Button variant="ghost" size="sm" onClick={clear} className="text-muted-foreground">
            <Trash2 className="mr-1.5 h-4 w-4" /> Clear
          </Button>
        )}
      </div>

      {items.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-border bg-card p-14 text-center shadow-soft">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-primary/10 text-primary">
            <ShoppingBag className="h-7 w-7" />
          </div>
          <h2 className="mt-4 text-xl font-black">Your cart is empty</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Head to the menu and add some classics.
          </p>
          <Link to="/menu">
            <Button className="mt-6 rounded-full">
              Browse Menu <ArrowRight className="ml-1.5 h-4 w-4" />
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
          <div className="space-y-3">
            {items.map((i) => (
              <div
                key={i.id}
                className="flex items-center gap-4 rounded-2xl border border-border bg-card p-3 shadow-soft"
              >
                <img
                  src={i.image}
                  alt={i.name}
                  className="h-20 w-20 shrink-0 rounded-xl object-cover"
                />
                <div className="min-w-0 flex-1">
                  <div className="truncate font-bold">{i.name}</div>
                  <div className="text-xs text-muted-foreground">R{i.price} each</div>
                  <div className="mt-2 inline-flex items-center rounded-full border border-border">
                    <button
                      onClick={() => updateQty(i.id, i.qty - 1)}
                      className="grid h-8 w-8 place-items-center rounded-l-full hover:bg-muted"
                      aria-label="Decrease"
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <span className="w-8 text-center text-sm font-bold">{i.qty}</span>
                    <button
                      onClick={() => updateQty(i.id, i.qty + 1)}
                      className="grid h-8 w-8 place-items-center rounded-r-full hover:bg-muted"
                      aria-label="Increase"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <div className="text-lg font-black">R{i.price * i.qty}</div>
                  <button
                    onClick={() => remove(i.id)}
                    className="text-xs text-muted-foreground hover:text-destructive"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          <aside className="lg:sticky lg:top-20 lg:h-fit">
            <div className="rounded-2xl border border-border bg-card p-5 shadow-soft">
              <h3 className="text-lg font-black">Order summary</h3>

              <div className="mt-4">
                <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  Customer name
                </label>
                <input
                  value={customer}
                  onChange={(e) => setCustomer(e.target.value)}
                  placeholder="e.g. Thabo M."
                  className="mt-1.5 h-11 w-full rounded-xl border border-border bg-background px-3 text-sm outline-none focus:border-primary"
                />
              </div>

              <dl className="mt-5 space-y-2 border-t border-border pt-4 text-sm">
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Subtotal</dt>
                  <dd className="font-semibold">R{total}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Service fee</dt>
                  <dd className="font-semibold">R{serviceFee}</dd>
                </div>
                <div className="flex justify-between border-t border-border pt-3 text-base">
                  <dt className="font-bold">Total</dt>
                  <dd className="text-xl font-black">R{grand}</dd>
                </div>
              </dl>

              <Button onClick={checkout} className="mt-5 h-12 w-full rounded-full text-sm font-bold">
                Place order <ArrowRight className="ml-1.5 h-4 w-4" />
              </Button>
              <Link to="/menu" className="mt-3 block text-center text-xs text-muted-foreground hover:underline">
                Continue shopping
              </Link>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
