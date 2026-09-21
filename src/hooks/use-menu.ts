import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { resolveImage } from "@/lib/menu-images";
import type { Category, FoodItem } from "@/lib/menu-data";

export type CategoryRow = {
  id: string;
  slug: string;
  name: string;
  description: string;
  starting_price: number;
  image_key: string;
  sort_order: number;
  visible: boolean;
};

export type MenuItemRow = {
  id: string;
  name: string;
  category_slug: string;
  description: string;
  price: number;
  image_key: string;
  available: boolean;
  sort_order: number;
};

export type PromoBanner = {
  eyebrow: string;
  title: string;
  titleAccent: string;
  body: string;
  ctaLabel: string;
  imageKey: string;
  enabled: boolean;
};

export const defaultPromo: PromoBanner = {
  eyebrow: "Featured",
  title: "Bold Flavours.",
  titleAccent: "Timeless Classics.",
  body: "Try the Skhura's Signature Burger — double-stacked, house sauce, brioche bun. Fresh off the grill.",
  ctaLabel: "Order Now",
  imageKey: "hero",
  enabled: true,
};

async function fetchCategories(): Promise<CategoryRow[]> {
  const { data, error } = await supabase
    .from("menu_categories")
    .select("id, slug, name, description, starting_price, image_key, sort_order, visible")
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return (data ?? []).map((c) => ({ ...c, starting_price: Number(c.starting_price) }));
}

async function fetchItems(): Promise<MenuItemRow[]> {
  const { data, error } = await supabase
    .from("menu_items")
    .select("id, name, category_slug, description, price, image_key, available, sort_order")
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return (data ?? []).map((i) => ({ ...i, price: Number(i.price) }));
}

async function fetchPromo(): Promise<PromoBanner> {
  const { data, error } = await supabase
    .from("site_settings")
    .select("value")
    .eq("key", "promo_banner")
    .maybeSingle();
  if (error) throw error;
  return { ...defaultPromo, ...((data?.value as Partial<PromoBanner>) ?? {}) };
}

export const menuKeys = {
  categories: ["menu", "categories"] as const,
  items: ["menu", "items"] as const,
  promo: ["menu", "promo"] as const,
};

export function useMenu() {
  const categoriesQuery = useQuery({ queryKey: menuKeys.categories, queryFn: fetchCategories });
  const itemsQuery = useQuery({ queryKey: menuKeys.items, queryFn: fetchItems });
  const promoQuery = useQuery({ queryKey: menuKeys.promo, queryFn: fetchPromo });

  const categoryRows = categoriesQuery.data ?? [];
  const itemRows = itemsQuery.data ?? [];

  const categories: Category[] = categoryRows
    .filter((c) => c.visible)
    .map((c) => ({
      slug: c.slug,
      name: c.name,
      description: c.description,
      startingPrice: c.starting_price,
      image: resolveImage(c.image_key),
    }));

  const foods: FoodItem[] = itemRows.map((i) => ({
    id: i.id,
    name: i.name,
    category: i.category_slug,
    description: i.description,
    price: i.price,
    image: resolveImage(i.image_key),
    available: i.available,
  }));

  return {
    categories,
    foods,
    categoryRows,
    itemRows,
    promo: promoQuery.data ?? defaultPromo,
    loading: categoriesQuery.isLoading || itemsQuery.isLoading,
  };
}
