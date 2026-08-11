import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { ArrowRight, ShieldCheck, Sparkles, UtensilsCrossed } from "lucide-react";
import heroBurger from "@/assets/hero-burger.jpg";
import logo from "@/assets/logo.png";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Skhura's Eatery — Order Food & Manage Your Kitchen" },
      {
        name: "description",
        content:
          "Sign in to Skhura's Eatery to order burgers, amagwinya and combos, track orders live, and manage the kitchen with AI tools.",
      },
      { property: "og:title", content: "Skhura's Eatery — Order Food & Manage Your Kitchen" },
      {
        property: "og:description",
        content: "Customer ordering and admin kitchen management for Skhura's Eatery, powered by AI.",
      },
    ],
  }),
  component: Landing,
});

function Landing() {
  const navigate = useNavigate();

  useEffect(() => {
    void supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/dashboard", replace: true });
    });
  }, [navigate]);

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto grid max-w-[1200px] items-center gap-10 px-5 py-12 md:py-20 lg:grid-cols-2">
        <div>
          <div className="flex items-center gap-3">
            <img src={logo} alt="Skhura's Eatery logo" className="h-12 w-12 rounded-xl bg-white p-1 shadow-soft" />
            <div>
              <div className="text-lg font-black tracking-tight">Skhura's Eatery</div>
              <div className="text-[10px] font-semibold uppercase tracking-widest text-primary">
                Baking new classics
              </div>
            </div>
          </div>

          <h1 className="mt-8 text-4xl font-black leading-tight md:text-6xl">
            Great food, <span className="text-primary">handled properly.</span>
          </h1>
          <p className="mt-4 max-w-lg text-muted-foreground">
            Create a customer account to order and track your food, or sign in as an admin to run the kitchen,
            manage orders and use the AI tools.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg" className="rounded-full">
              <Link to="/auth" search={{ mode: "signup" }}>
                Create account <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="rounded-full">
              <Link to="/auth" search={{ mode: "login" }}>
                Sign in
              </Link>
            </Button>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {[
              { icon: UtensilsCrossed, title: "Order online", text: "Browse the full menu and check out in seconds." },
              { icon: ShieldCheck, title: "Two roles", text: "Customers order, admins manage the kitchen." },
              { icon: Sparkles, title: "AI tools", text: "Emails, research and a chatbot built in." },
            ].map((f) => (
              <div key={f.title} className="rounded-2xl border border-border bg-card p-4 shadow-soft">
                <f.icon className="h-5 w-5 text-primary" />
                <div className="mt-2 text-sm font-bold">{f.title}</div>
                <p className="mt-1 text-xs text-muted-foreground">{f.text}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative overflow-hidden rounded-3xl shadow-soft">
          <img src={heroBurger} alt="Signature burger from Skhura's Eatery" className="h-full w-full object-cover" />
        </div>
      </div>
    </main>
  );
}
