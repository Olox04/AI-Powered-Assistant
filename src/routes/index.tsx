import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Receipt,
  DollarSign,
  Users,
  TrendingUp,
  Search,
  ArrowUpRight,
  Flame,
} from "lucide-react";
import heroBurger from "@/assets/hero-burger.jpg";
import { categories, recentOrders } from "@/lib/menu-data";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  component: Dashboard,
});

const stats = [
  { label: "Today's Orders", value: "128", trend: "+12.5%", icon: Receipt, color: "text-primary" },
  { label: "Revenue", value: "R 24,860", trend: "+8.2%", icon: DollarSign, color: "text-success" },
  { label: "Customers", value: "412", trend: "+4.1%", icon: Users, color: "text-info" },
  { label: "Top Seller", value: "Signature Burger", trend: "37 sold", icon: Flame, color: "text-primary" },
];

const statusStyles: Record<string, string> = {
  completed: "bg-success/15 text-success",
  preparing: "bg-primary/15 text-primary",
  ready: "bg-info/15 text-info",
  pending: "bg-muted text-muted-foreground",
};

function Dashboard() {
  return (
    <div className="mx-auto max-w-[1400px] space-y-8 p-4 md:p-8">
      {/* Welcome banner */}
      <section className="relative overflow-hidden rounded-3xl bg-secondary p-6 text-white shadow-soft md:p-10">
        <div className="absolute inset-0 opacity-30 [background:radial-gradient(circle_at_20%_20%,var(--color-primary),transparent_50%),radial-gradient(circle_at_80%_60%,var(--color-primary-glow),transparent_45%)]" />
        <div className="relative">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-semibold text-white/80 backdrop-blur">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            Live · Kitchen open
          </div>
          <h1 className="mt-4 text-3xl font-black leading-tight md:text-5xl">
            Welcome to Skhura's Eatery <span className="inline-block animate-bounce">👋</span>
          </h1>
          <p className="mt-2 text-sm font-bold uppercase tracking-[0.25em] text-primary">
            Baking the world new classics
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="card-hover rounded-2xl border border-border bg-card p-5 shadow-soft">
              <div className="flex items-center justify-between">
                <div className={cn("grid h-10 w-10 place-items-center rounded-xl bg-muted", s.color)}>
                  <Icon className="h-5 w-5" />
                </div>
                <span className="inline-flex items-center gap-1 rounded-full bg-success/10 px-2 py-0.5 text-[10px] font-semibold text-success">
                  <TrendingUp className="h-3 w-3" /> {s.trend}
                </span>
              </div>
              <div className="mt-4 truncate text-2xl font-black">{s.value}</div>
              <div className="text-xs text-muted-foreground">{s.label}</div>
            </div>
          );
        })}
      </section>

      {/* Search */}
      <section className="relative">
        <Search className="pointer-events-none absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
        <input
          placeholder="Search food, categories or dishes…"
          className="h-14 w-full rounded-2xl border border-border bg-card pl-14 pr-6 text-sm shadow-soft outline-none transition focus:border-primary"
        />
      </section>

      {/* Categories */}
      <section>
        <div className="mb-4 flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-black">Popular Categories</h2>
            <p className="text-sm text-muted-foreground">Handcrafted classics, made fresh daily.</p>
          </div>
          <Link to="/menu" className="hidden text-sm font-semibold text-primary hover:underline md:inline-flex">
            View full menu →
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
          {categories.map((c) => (
            <div
              key={c.slug}
              className="card-hover group overflow-hidden rounded-2xl border border-border bg-card shadow-soft"
            >
              <div className="aspect-square overflow-hidden bg-muted">
                <img
                  src={c.image}
                  alt={c.name}
                  loading="lazy"
                  width={800}
                  height={800}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="truncate font-bold">{c.name}</div>
                    <div className="line-clamp-1 text-xs text-muted-foreground">{c.description}</div>
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <div className="text-xs text-muted-foreground">
                    from <span className="text-sm font-black text-foreground">R{c.startingPrice}</span>
                  </div>
                  <Button size="sm" className="h-8 rounded-full px-3 text-xs">Order</Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured promo */}
      <section className="relative overflow-hidden rounded-3xl bg-secondary text-white shadow-soft">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="flex flex-col justify-center gap-4 p-8 md:p-12">
            <span className="inline-flex w-fit items-center gap-2 rounded-full bg-primary/20 px-3 py-1 text-xs font-bold uppercase tracking-widest text-primary">
              <Flame className="h-3 w-3" /> Featured
            </span>
            <h2 className="text-4xl font-black leading-[1.05] md:text-5xl">
              Bold Flavours. <br />
              <span className="text-primary">Timeless Classics.</span>
            </h2>
            <p className="max-w-md text-sm text-white/70">
              Try the Skhura's Signature Burger — double-stacked, house sauce, brioche bun. Fresh off the grill.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button size="lg" className="rounded-full shadow-glow">
                Order Now <ArrowUpRight className="ml-1 h-4 w-4" />
              </Button>
              <Link to="/menu" className="inline-flex items-center rounded-full border border-white/20 bg-white/5 px-5 py-2.5 text-sm font-semibold text-white backdrop-blur hover:bg-white/10">
                Browse Menu
              </Link>
            </div>
          </div>
          <div className="relative min-h-[280px] md:min-h-[400px]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent,var(--color-secondary))]" />
            <img
              src={heroBurger}
              alt="Signature burger"
              width={1600}
              height={900}
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Recent orders */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-2xl font-black">Recent Orders</h2>
          <Link to="/orders" className="text-sm font-semibold text-primary hover:underline">
            View all →
          </Link>
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          {recentOrders.slice(0, 6).map((o) => (
            <div key={o.id} className="card-hover flex items-center justify-between gap-4 rounded-2xl border border-border bg-card p-4 shadow-soft">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-bold">{o.customer}</span>
                  <span className="text-xs text-muted-foreground">{o.id}</span>
                </div>
                <div className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">
                  {o.items.join(" · ")}
                </div>
                <div className="mt-1 text-xs text-muted-foreground">{o.time}</div>
              </div>
              <div className="flex shrink-0 flex-col items-end gap-2">
                <span className="text-base font-black">R{o.total}</span>
                <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-bold uppercase", statusStyles[o.status])}>
                  {o.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
