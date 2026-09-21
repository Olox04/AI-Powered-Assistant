import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2, ShieldAlert, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { useMenu, menuKeys, defaultPromo, type CategoryRow, type MenuItemRow, type PromoBanner } from "@/hooks/use-menu";
import { imageLibrary, resolveImage } from "@/lib/menu-images";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({
    meta: [
      { title: "Admin Panel — Skhura's Eatery" },
      { name: "description", content: "Edit menu items, prices, categories and the promotion banner." },
    ],
  }),
  component: AdminPage,
});

function ImagePicker({ value, onChange }: { value: string; onChange: (key: string) => void }) {
  return (
    <div>
      <Label className="mb-2 block">Picture</Label>
      <div className="grid max-h-44 grid-cols-5 gap-2 overflow-y-auto rounded-xl border border-border p-2">
        {imageLibrary.map((img) => (
          <button
            type="button"
            key={img.key}
            title={img.label}
            onClick={() => onChange(img.key)}
            className={cn(
              "aspect-square overflow-hidden rounded-lg border-2 transition",
              value === img.key ? "border-primary" : "border-transparent hover:border-border",
            )}
          >
            <img src={img.src} alt={img.label} className="h-full w-full object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
}

function AdminPage() {
  const { isAdmin, loading } = useAuth();

  if (loading) {
    return <div className="p-8 text-sm text-muted-foreground">Checking your access…</div>;
  }

  if (!isAdmin) {
    return (
      <div className="mx-auto max-w-lg p-8">
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border bg-card p-12 text-center">
          <ShieldAlert className="h-8 w-8 text-primary" />
          <div className="text-lg font-bold">Admins only</div>
          <p className="text-sm text-muted-foreground">
            This area is for staff accounts. Sign up with the admin code to manage the menu.
          </p>
        </div>
      </div>
    );
  }

  return <AdminPanel />;
}

function AdminPanel() {
  const { categoryRows, itemRows, promo } = useMenu();
  const qc = useQueryClient();

  const refreshItems = () => qc.invalidateQueries({ queryKey: menuKeys.items });
  const refreshCategories = () => {
    void qc.invalidateQueries({ queryKey: menuKeys.categories });
    void qc.invalidateQueries({ queryKey: menuKeys.items });
  };

  const [editItem, setEditItem] = useState<Partial<MenuItemRow> | null>(null);
  const [editCategory, setEditCategory] = useState<Partial<CategoryRow> | null>(null);

  return (
    <div className="mx-auto max-w-[1200px] space-y-6 p-4 md:p-8">
      <div>
        <h1 className="text-3xl font-black md:text-4xl">Admin Panel</h1>
        <p className="text-sm text-muted-foreground">
          Edit dishes, prices, categories and the promotion banner. Changes go live instantly.
        </p>
      </div>

      <Tabs defaultValue="items">
        <TabsList>
          <TabsTrigger value="items">Menu Items</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="banner">Promo Banner</TabsTrigger>
        </TabsList>

        {/* ITEMS */}
        <TabsContent value="items" className="mt-5 space-y-3">
          <div className="flex justify-end">
            <Button
              className="rounded-xl"
              onClick={() =>
                setEditItem({
                  name: "",
                  category_slug: categoryRows[0]?.slug ?? "",
                  description: "",
                  price: 0,
                  image_key: "f1",
                  available: true,
                  sort_order: itemRows.length + 1,
                })
              }
            >
              <Plus className="mr-1.5 h-4 w-4" /> New dish
            </Button>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            {itemRows.map((item) => (
              <div key={item.id} className="flex items-center gap-3 rounded-2xl border border-border bg-card p-3 shadow-soft">
                <img src={resolveImage(item.image_key)} alt={item.name} className="h-16 w-16 shrink-0 rounded-xl object-cover" />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="truncate font-bold">{item.name}</span>
                    {!item.available && <Badge variant="secondary">Sold out</Badge>}
                  </div>
                  <div className="truncate text-xs text-muted-foreground">{item.category_slug}</div>
                  <div className="text-sm font-black">R{item.price}</div>
                </div>
                <div className="flex shrink-0 gap-1">
                  <Button size="icon" variant="ghost" onClick={() => setEditItem(item)} aria-label="Edit dish">
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    aria-label="Delete dish"
                    onClick={async () => {
                      if (!confirm(`Delete ${item.name}?`)) return;
                      const { error } = await supabase.from("menu_items").delete().eq("id", item.id);
                      if (error) return toast.error(error.message);
                      toast.success("Dish removed");
                      void refreshItems();
                    }}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
            ))}
            {itemRows.length === 0 && (
              <div className="rounded-2xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground md:col-span-2">
                No dishes yet — add your first one.
              </div>
            )}
          </div>
        </TabsContent>

        {/* CATEGORIES */}
        <TabsContent value="categories" className="mt-5 space-y-3">
          <div className="flex justify-end">
            <Button
              className="rounded-xl"
              onClick={() =>
                setEditCategory({
                  slug: "",
                  name: "",
                  description: "",
                  starting_price: 0,
                  image_key: "f1",
                  sort_order: categoryRows.length + 1,
                  visible: true,
                })
              }
            >
              <Plus className="mr-1.5 h-4 w-4" /> New category
            </Button>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            {categoryRows.map((c) => (
              <div key={c.id} className="flex items-center gap-3 rounded-2xl border border-border bg-card p-3 shadow-soft">
                <img src={resolveImage(c.image_key)} alt={c.name} className="h-16 w-16 shrink-0 rounded-xl object-cover" />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="truncate font-bold">{c.name}</span>
                    {!c.visible && <Badge variant="secondary">Hidden</Badge>}
                  </div>
                  <div className="truncate text-xs text-muted-foreground">{c.description}</div>
                  <div className="text-xs">from <span className="font-black">R{c.starting_price}</span></div>
                </div>
                <div className="flex shrink-0 gap-1">
                  <Button size="icon" variant="ghost" onClick={() => setEditCategory(c)} aria-label="Edit category">
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    aria-label="Delete category"
                    onClick={async () => {
                      if (!confirm(`Delete ${c.name}? Its dishes will be removed too.`)) return;
                      const { error } = await supabase.from("menu_categories").delete().eq("id", c.id);
                      if (error) return toast.error(error.message);
                      toast.success("Category removed");
                      refreshCategories();
                    }}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        {/* BANNER */}
        <TabsContent value="banner" className="mt-5">
          <BannerEditor promo={promo} />
        </TabsContent>
      </Tabs>

      {/* Item dialog */}
      <Dialog open={!!editItem} onOpenChange={(o) => !o && setEditItem(null)}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editItem?.id ? "Edit dish" : "New dish"}</DialogTitle>
          </DialogHeader>
          {editItem && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="item-name">Name</Label>
                <Input id="item-name" value={editItem.name ?? ""} onChange={(e) => setEditItem({ ...editItem, name: e.target.value })} />
              </div>
              <div>
                <Label htmlFor="item-desc">Description</Label>
                <Textarea id="item-desc" value={editItem.description ?? ""} onChange={(e) => setEditItem({ ...editItem, description: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="item-price">Price (R)</Label>
                  <Input id="item-price" type="number" min={0} value={editItem.price ?? 0} onChange={(e) => setEditItem({ ...editItem, price: Number(e.target.value) })} />
                </div>
                <div>
                  <Label htmlFor="item-cat">Category</Label>
                  <select
                    id="item-cat"
                    value={editItem.category_slug ?? ""}
                    onChange={(e) => setEditItem({ ...editItem, category_slug: e.target.value })}
                    className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                  >
                    {categoryRows.map((c) => (
                      <option key={c.slug} value={c.slug}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex items-center justify-between rounded-xl border border-border p-3">
                <Label htmlFor="item-avail">Available to order</Label>
                <Switch id="item-avail" checked={editItem.available ?? true} onCheckedChange={(v) => setEditItem({ ...editItem, available: v })} />
              </div>
              <ImagePicker value={editItem.image_key ?? "f1"} onChange={(key) => setEditItem({ ...editItem, image_key: key })} />
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditItem(null)}>Cancel</Button>
            <Button
              onClick={async () => {
                if (!editItem) return;
                if (!editItem.name?.trim()) return toast.error("Give the dish a name");
                if (!editItem.category_slug) return toast.error("Pick a category");
                const payload = {
                  name: editItem.name.trim(),
                  category_slug: editItem.category_slug,
                  description: editItem.description ?? "",
                  price: Number(editItem.price ?? 0),
                  image_key: editItem.image_key ?? "f1",
                  available: editItem.available ?? true,
                  sort_order: editItem.sort_order ?? 0,
                };
                const { error } = editItem.id
                  ? await supabase.from("menu_items").update(payload).eq("id", editItem.id)
                  : await supabase.from("menu_items").insert(payload);
                if (error) return toast.error(error.message);
                toast.success("Menu updated");
                setEditItem(null);
                void refreshItems();
              }}
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Category dialog */}
      <Dialog open={!!editCategory} onOpenChange={(o) => !o && setEditCategory(null)}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editCategory?.id ? "Edit category" : "New category"}</DialogTitle>
          </DialogHeader>
          {editCategory && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="cat-name">Name</Label>
                <Input
                  id="cat-name"
                  value={editCategory.name ?? ""}
                  onChange={(e) =>
                    setEditCategory({
                      ...editCategory,
                      name: e.target.value,
                      slug: editCategory.id
                        ? editCategory.slug
                        : e.target.value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
                    })
                  }
                />
              </div>
              <div>
                <Label htmlFor="cat-desc">Description</Label>
                <Textarea id="cat-desc" value={editCategory.description ?? ""} onChange={(e) => setEditCategory({ ...editCategory, description: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="cat-price">Starting price (R)</Label>
                  <Input id="cat-price" type="number" min={0} value={editCategory.starting_price ?? 0} onChange={(e) => setEditCategory({ ...editCategory, starting_price: Number(e.target.value) })} />
                </div>
                <div>
                  <Label htmlFor="cat-order">Order</Label>
                  <Input id="cat-order" type="number" value={editCategory.sort_order ?? 0} onChange={(e) => setEditCategory({ ...editCategory, sort_order: Number(e.target.value) })} />
                </div>
              </div>
              <div className="flex items-center justify-between rounded-xl border border-border p-3">
                <Label htmlFor="cat-visible">Show on the menu</Label>
                <Switch id="cat-visible" checked={editCategory.visible ?? true} onCheckedChange={(v) => setEditCategory({ ...editCategory, visible: v })} />
              </div>
              <ImagePicker value={editCategory.image_key ?? "f1"} onChange={(key) => setEditCategory({ ...editCategory, image_key: key })} />
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditCategory(null)}>Cancel</Button>
            <Button
              onClick={async () => {
                if (!editCategory) return;
                if (!editCategory.name?.trim() || !editCategory.slug) return toast.error("Give the category a name");
                const payload = {
                  slug: editCategory.slug,
                  name: editCategory.name.trim(),
                  description: editCategory.description ?? "",
                  starting_price: Number(editCategory.starting_price ?? 0),
                  image_key: editCategory.image_key ?? "f1",
                  sort_order: editCategory.sort_order ?? 0,
                  visible: editCategory.visible ?? true,
                };
                const { error } = editCategory.id
                  ? await supabase.from("menu_categories").update(payload).eq("id", editCategory.id)
                  : await supabase.from("menu_categories").insert(payload);
                if (error) return toast.error(error.message);
                toast.success("Categories updated");
                setEditCategory(null);
                refreshCategories();
              }}
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function BannerEditor({ promo }: { promo: PromoBanner }) {
  const qc = useQueryClient();
  const [form, setForm] = useState<PromoBanner>(promo ?? defaultPromo);
  const [saving, setSaving] = useState(false);

  useEffect(() => setForm(promo), [promo]);

  async function save() {
    setSaving(true);
    const { error } = await supabase
      .from("site_settings")
      .upsert({ key: "promo_banner", value: form }, { onConflict: "key" });
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success("Promotion banner updated");
    void qc.invalidateQueries({ queryKey: menuKeys.promo });
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="space-y-4 rounded-2xl border border-border bg-card p-5 shadow-soft">
        <div className="flex items-center justify-between rounded-xl border border-border p-3">
          <Label htmlFor="promo-enabled">Show banner on dashboard</Label>
          <Switch id="promo-enabled" checked={form.enabled} onCheckedChange={(v) => setForm({ ...form, enabled: v })} />
        </div>
        <div>
          <Label htmlFor="promo-eyebrow">Small label</Label>
          <Input id="promo-eyebrow" value={form.eyebrow} onChange={(e) => setForm({ ...form, eyebrow: e.target.value })} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor="promo-title">Headline</Label>
            <Input id="promo-title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          </div>
          <div>
            <Label htmlFor="promo-accent">Highlighted line</Label>
            <Input id="promo-accent" value={form.titleAccent} onChange={(e) => setForm({ ...form, titleAccent: e.target.value })} />
          </div>
        </div>
        <div>
          <Label htmlFor="promo-body">Description</Label>
          <Textarea id="promo-body" value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} />
        </div>
        <div>
          <Label htmlFor="promo-cta">Button text</Label>
          <Input id="promo-cta" value={form.ctaLabel} onChange={(e) => setForm({ ...form, ctaLabel: e.target.value })} />
        </div>
        <ImagePicker value={form.imageKey} onChange={(key) => setForm({ ...form, imageKey: key })} />
        <Button className="w-full rounded-xl" onClick={save} disabled={saving}>
          {saving ? "Saving…" : "Save banner"}
        </Button>
      </div>

      <div>
        <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground">
          <ImageIcon className="h-3.5 w-3.5" /> Live preview
        </div>
        <div className="overflow-hidden rounded-3xl bg-secondary text-white shadow-soft">
          <div className="space-y-3 p-6">
            <span className="inline-flex w-fit rounded-full bg-primary/20 px-3 py-1 text-xs font-bold uppercase tracking-widest text-primary">
              {form.eyebrow}
            </span>
            <h2 className="text-3xl font-black leading-[1.05]">
              {form.title} <br />
              <span className="text-primary">{form.titleAccent}</span>
            </h2>
            <p className="text-sm text-white/70">{form.body}</p>
            <Button size="lg" className="rounded-full">{form.ctaLabel}</Button>
          </div>
          <img src={resolveImage(form.imageKey)} alt="Banner" className="h-48 w-full object-cover" />
        </div>
      </div>
    </div>
  );
}
