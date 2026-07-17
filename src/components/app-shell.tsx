import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  UtensilsCrossed,
  Receipt,
  Sparkles,
  Mail,
  BookOpenText,
  MessagesSquare,
  Menu as MenuIcon,
  Bell,
  Search,
  ShoppingCart,
} from "lucide-react";
import type { ReactNode } from "react";
import { useState } from "react";
import logo from "@/assets/logo.png";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useCart } from "@/lib/cart-store";

const mainNav = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/menu", label: "Menu", icon: UtensilsCrossed },
  { to: "/cart", label: "Cart", icon: ShoppingCart },
  { to: "/orders", label: "Orders", icon: Receipt },
];

const aiNav = [
  { to: "/ai/email", label: "Smart Email", icon: Mail },
  { to: "/ai/research", label: "Research Assistant", icon: BookOpenText },
  { to: "/ai/chatbot", label: "AI Chatbot", icon: MessagesSquare },
];

function NavContent({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isActive = (to: string) => (to === "/" ? pathname === "/" : pathname.startsWith(to));

  return (
    <div className="flex h-full flex-col gap-6 p-5">
      <Link to="/" onClick={onNavigate} className="flex items-center gap-3">
        <img src={logo} alt="Skhura's Eatery" className="h-11 w-11 rounded-xl bg-white p-1 shadow-soft" />
        <div className="min-w-0">
          <div className="truncate text-base font-black tracking-tight text-sidebar-foreground">Skhura's Eatery</div>
          <div className="truncate text-[10px] font-semibold uppercase tracking-widest text-primary">Baking new classics</div>
        </div>
      </Link>

      <nav className="flex flex-col gap-1">
        <div className="mb-2 px-3 text-[10px] font-bold uppercase tracking-widest text-sidebar-foreground/40">
          Overview
        </div>
        {mainNav.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.to);
          return (
            <Link
              key={item.to}
              to={item.to}
              onClick={onNavigate}
              className={cn(
                "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all",
                active
                  ? "bg-primary text-primary-foreground shadow-glow"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground",
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span className="truncate">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <nav className="flex flex-col gap-1">
        <div className="mb-2 flex items-center gap-2 px-3 text-[10px] font-bold uppercase tracking-widest text-sidebar-foreground/40">
          <Sparkles className="h-3 w-3 text-primary" /> AI Tools
        </div>
        {aiNav.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.to);
          return (
            <Link
              key={item.to}
              to={item.to}
              onClick={onNavigate}
              className={cn(
                "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all",
                active
                  ? "bg-primary text-primary-foreground shadow-glow"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground",
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span className="truncate">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto rounded-2xl border border-sidebar-border/60 bg-sidebar-accent/40 p-4">
        <div className="flex items-center gap-2 text-xs font-semibold text-primary">
          <Sparkles className="h-3.5 w-3.5" /> Pro tip
        </div>
        <p className="mt-1.5 text-xs leading-relaxed text-sidebar-foreground/70">
          Ask the AI chatbot to draft your weekly specials in seconds.
        </p>
      </div>
    </div>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const { count } = useCart();

  return (
    <div className="flex min-h-screen w-full bg-background">
      {/* Desktop sidebar */}
      <aside data-app-shell-chrome className="hidden w-72 shrink-0 bg-sidebar text-sidebar-foreground lg:block">
        <NavContent />
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Top bar */}
        <header data-app-shell-chrome className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border/60 bg-background/80 px-4 backdrop-blur-xl md:px-8">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden">
                <MenuIcon className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72 border-0 bg-sidebar p-0 text-sidebar-foreground">
              <NavContent onNavigate={() => setOpen(false)} />
            </SheetContent>
          </Sheet>

          <div className="relative hidden max-w-md flex-1 md:block">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              placeholder="Search food, orders, customers…"
              className="h-10 w-full rounded-full border border-border bg-muted/40 pl-10 pr-4 text-sm outline-none transition focus:border-primary focus:bg-background"
            />
          </div>

          <div className="ml-auto flex items-center gap-2">
            <Link
              to="/cart"
              className="relative grid h-10 w-10 place-items-center rounded-full hover:bg-muted"
              aria-label="Cart"
            >
              <ShoppingCart className="h-5 w-5" />
              {count > 0 && (
                <span className="absolute -right-0.5 -top-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-primary px-1 text-[10px] font-black text-primary-foreground">
                  {count}
                </span>
              )}
            </Link>
            <Button variant="ghost" size="icon" className="relative rounded-full">
              <Bell className="h-5 w-5" />
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-primary" />
            </Button>
            <div className="flex items-center gap-2 rounded-full border border-border bg-card px-1.5 py-1.5 pr-3">
              <div className="grid h-7 w-7 place-items-center rounded-full bg-primary text-xs font-black text-primary-foreground">
                SE
              </div>
              <div className="hidden text-xs sm:block">
                <div className="font-semibold leading-none">Skhura Admin</div>
                <div className="text-muted-foreground">Owner</div>
              </div>
            </div>
          </div>
        </header>

        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
}
