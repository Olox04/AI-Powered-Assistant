import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search, Heart, Plus, SlidersHorizontal } from "lucide-react";
import { categories, foods } from "@/lib/menu-data";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useCart } from "@/lib/cart-store";

export const Route = createFileRoute("/menu")({
  head: () => ({ meta: [{ title: "Menu — Skhura's Eatery" }] }),
  component: MenuPage,
});

function MenuPage() {
  const [active, setActive] = useState<string>("all");
  const [query, setQuery] = useState("");
  const [favs, setFavs] = useState<Set<string>>(new Set());
  const [onlyAvailable, setOnlyAvailable] = useState(false);
  const { add } = useCart();

  const filtered = useMemo(() => {
    return foods.filter((f) => {
      if (active !== "all" && f.category !== active) return false;
      if (onlyAvailable && !f.available) return false;
      if (query && !f.name.toLowerCase().includes(query.toLowerCase())) return false;
      return true;
    });
  }, [active, query, onlyAvailable]);

  const toggleFav = (id: string) => {
    setFavs((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="mx-auto max-w-[1400px] p-4 md:p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-black md:text-4xl">Menu</h1>
        <p className="text-sm text-muted-foreground">Explore our full lineup of handcrafted dishes.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
        {/* Category nav */}
        <aside className="lg:sticky lg:top-20 lg:h-fit">
          <div className="rounded-2xl border border-border bg-card p-3 shadow-soft">
            <div className="mb-2 px-3 pt-1 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              Categories
            </div>
            <div className="flex gap-2 overflow-x-auto lg:flex-col lg:gap-1">
              <button
                onClick={() => setActive("all")}
                className={cn(
                  "shrink-0 rounded-xl px-3 py-2 text-left text-sm font-medium transition",
                  active === "all" ? "bg-primary text-primary-foreground" : "hover:bg-muted",
                )}
              >
                All Items
              </button>
              {categories.map((c) => (
                <button
                  key={c.slug}
                  onClick={() => setActive(c.slug)}
                  className={cn(
                    "shrink-0 whitespace-nowrap rounded-xl px-3 py-2 text-left text-sm font-medium transition",
                    active === c.slug ? "bg-primary text-primary-foreground" : "hover:bg-muted",
                  )}
                >
                  {c.name}
                </button>
              ))}
            </div>
          </div>
        </aside>

        <div>
          {/* Search + filter */}
          <div className="mb-5 flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search dishes…"
                className="h-12 w-full rounded-2xl border border-border bg-card pl-11 pr-4 text-sm outline-none focus:border-primary"
              />
            </div>
            <Button
              variant={onlyAvailable ? "default" : "outline"}
              className="h-12 rounded-2xl"
              onClick={() => setOnlyAvailable((v) => !v)}
            >
              <SlidersHorizontal className="mr-2 h-4 w-4" />
              {onlyAvailable ? "Available only" : "All items"}
            </Button>
          </div>

          {/* Grid */}
          {filtered.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
              No dishes match your filters.
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {filtered.map((f) => (
                <article
                  key={f.id}
                  className="card-hover group overflow-hidden rounded-2xl border border-border bg-card shadow-soft"
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                    <img
                      src={f.image}
                      alt={f.name}
                      loading="lazy"
                      width={800}
                      height={600}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <button
                      onClick={() => toggleFav(f.id)}
                      className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-white/90 backdrop-blur transition hover:scale-110"
                      aria-label="Favourite"
                    >
                      <Heart className={cn("h-4 w-4", favs.has(f.id) ? "fill-primary text-primary" : "text-secondary")} />
                    </button>
                    <Badge
                      className={cn(
                        "absolute left-3 top-3 rounded-full border-0 font-semibold",
                        f.available ? "bg-success text-success-foreground" : "bg-muted text-muted-foreground",
                      )}
                    >
                      {f.available ? "Available" : "Sold out"}
                    </Badge>
                  </div>
                  <div className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h3 className="truncate font-bold">{f.name}</h3>
                        <p className="line-clamp-2 text-xs text-muted-foreground">{f.description}</p>
                      </div>
                      <div className="shrink-0 text-lg font-black">R{f.price}</div>
                    </div>
                    <Button
                      className="mt-4 w-full rounded-xl"
                      disabled={!f.available}
                      onClick={() => {
                        add(f);
                        toast.success(`${f.name} added to cart`);
                      }}
                    >
                      <Plus className="mr-1.5 h-4 w-4" /> Add to Cart
                    </Button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
