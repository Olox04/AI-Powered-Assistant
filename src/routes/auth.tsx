import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { z } from "zod";
import { Loader2, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import logo from "@/assets/logo.png";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { claimAdminRole } from "@/lib/auth.functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const searchSchema = z.object({
  mode: z.enum(["login", "signup"]).catch("login"),
});

export const Route = createFileRoute("/auth")({
  validateSearch: searchSchema,
  head: () => ({
    meta: [
      { title: "Sign in or sign up — Skhura's Eatery" },
      {
        name: "description",
        content: "Log in or create your Skhura's Eatery account as a customer, or use an admin code for kitchen access.",
      },
      { property: "og:title", content: "Sign in or sign up — Skhura's Eatery" },
      { property: "og:description", content: "Customer and admin accounts for Skhura's Eatery." },
    ],
  }),
  component: AuthPage,
});

const signupSchema = z.object({
  fullName: z.string().trim().min(2, "Please enter your full name").max(100),
  phone: z.string().trim().min(6, "Please enter a valid phone number").max(20),
  email: z.string().trim().email("Enter a valid email").max(255),
  password: z.string().min(8, "Password must be at least 8 characters").max(72),
  adminCode: z.string().trim().max(100).optional(),
});

const loginSchema = z.object({
  email: z.string().trim().email("Enter a valid email").max(255),
  password: z.string().min(1, "Enter your password").max(72),
});

function AuthPage() {
  const { mode } = Route.useSearch();
  const navigate = useNavigate();
  const claimAdmin = useServerFn(claimAdminRole);

  const [isSignup, setIsSignup] = useState(mode === "signup");
  const [wantsAdmin, setWantsAdmin] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ fullName: "", phone: "", email: "", password: "", adminCode: "" });

  useEffect(() => setIsSignup(mode === "signup"), [mode]);

  useEffect(() => {
    void supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/dashboard", replace: true });
    });
  }, [navigate]);

  const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      if (isSignup) {
        const parsed = signupSchema.safeParse({ ...form, adminCode: wantsAdmin ? form.adminCode : undefined });
        if (!parsed.success) {
          toast.error(parsed.error.issues[0]?.message ?? "Please check your details");
          return;
        }
        if (wantsAdmin && !parsed.data.adminCode) {
          toast.error("Enter the admin code or continue as a customer");
          return;
        }

        const { data, error } = await supabase.auth.signUp({
          email: parsed.data.email,
          password: parsed.data.password,
          options: {
            emailRedirectTo: window.location.origin,
            data: { full_name: parsed.data.fullName, phone: parsed.data.phone },
          },
        });
        if (error) {
          toast.error(error.message);
          return;
        }
        if (!data.session) {
          toast.success("Check your email to confirm your account, then sign in.");
          setIsSignup(false);
          return;
        }
        if (wantsAdmin && parsed.data.adminCode) {
          const result = await claimAdmin({ data: { code: parsed.data.adminCode } });
          if (!result.ok) toast.error(result.error);
          else toast.success("Admin access granted");
        }
        toast.success("Welcome to Skhura's Eatery!");
        navigate({ to: "/dashboard", replace: true });
      } else {
        const parsed = loginSchema.safeParse(form);
        if (!parsed.success) {
          toast.error(parsed.error.issues[0]?.message ?? "Please check your details");
          return;
        }
        const { error } = await supabase.auth.signInWithPassword({
          email: parsed.data.email,
          password: parsed.data.password,
        });
        if (error) {
          toast.error(error.message);
          return;
        }
        toast.success("Signed in");
        navigate({ to: "/dashboard", replace: true });
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogle() {
    setLoading(true);
    const result = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin });
    if (result.error) {
      setLoading(false);
      toast.error("Google sign-in failed. Please try again.");
      return;
    }
    if (result.redirected) return;
    navigate({ to: "/dashboard", replace: true });
  }

  return (
    <main className="grid min-h-screen place-items-center bg-background px-5 py-10">
      <div className="w-full max-w-md">
        <Link to="/" className="flex items-center justify-center gap-3">
          <img src={logo} alt="Skhura's Eatery logo" className="h-11 w-11 rounded-xl bg-white p-1 shadow-soft" />
          <div className="text-lg font-black tracking-tight">Skhura's Eatery</div>
        </Link>

        <div className="mt-6 rounded-3xl border border-border bg-card p-6 shadow-soft">
          <h1 className="text-2xl font-black">{isSignup ? "Create your account" : "Welcome back"}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {isSignup ? "Sign up as a customer, or use an admin code for kitchen access." : "Sign in to order or manage the kitchen."}
          </p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            {isSignup && (
              <>
                <div className="space-y-1.5">
                  <Label htmlFor="fullName">Full name</Label>
                  <Input id="fullName" value={form.fullName} onChange={set("fullName")} placeholder="Olwethu Tshingo" maxLength={100} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="phone">Phone number</Label>
                  <Input id="phone" value={form.phone} onChange={set("phone")} placeholder="071 234 5678" maxLength={20} />
                </div>
              </>
            )}

            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" autoComplete="email" value={form.email} onChange={set("email")} placeholder="you@example.com" maxLength={255} />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                autoComplete={isSignup ? "new-password" : "current-password"}
                value={form.password}
                onChange={set("password")}
                placeholder="••••••••"
                maxLength={72}
              />
            </div>

            {isSignup && (
              <div className="rounded-2xl border border-border bg-muted/30 p-3">
                <label className="flex cursor-pointer items-center gap-2 text-sm font-semibold">
                  <input
                    type="checkbox"
                    checked={wantsAdmin}
                    onChange={(e) => setWantsAdmin(e.target.checked)}
                    className="h-4 w-4 accent-[var(--color-primary)]"
                  />
                  <ShieldCheck className="h-4 w-4 text-primary" /> I'm an admin
                </label>
                {wantsAdmin && (
                  <div className="mt-3 space-y-1.5">
                    <Label htmlFor="adminCode">Admin code</Label>
                    <Input id="adminCode" value={form.adminCode} onChange={set("adminCode")} placeholder="Enter admin code" maxLength={100} />
                  </div>
                )}
              </div>
            )}

            <Button type="submit" className="w-full rounded-full" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isSignup ? "Create account" : "Sign in"}
            </Button>
          </form>

          <div className="my-4 flex items-center gap-3 text-xs text-muted-foreground">
            <span className="h-px flex-1 bg-border" /> or <span className="h-px flex-1 bg-border" />
          </div>

          <Button variant="outline" className="w-full rounded-full" onClick={handleGoogle} disabled={loading}>
            Continue with Google
          </Button>

          <p className="mt-5 text-center text-sm text-muted-foreground">
            {isSignup ? "Already have an account?" : "New here?"}{" "}
            <button
              type="button"
              className="font-semibold text-primary hover:underline"
              onClick={() => navigate({ to: "/auth", search: { mode: isSignup ? "login" : "signup" } })}
            >
              {isSignup ? "Sign in" : "Create one"}
            </button>
          </p>
        </div>
      </div>
    </main>
  );
}
