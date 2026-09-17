// Image registry: the database stores a short image key, the app resolves it
// to a bundled asset here. Keeps admin editing simple (pick a picture).

import f1 from "@/assets/food-f1.jpg";
import f2 from "@/assets/food-f2.jpg";
import f3 from "@/assets/food-f3.jpg";
import f4 from "@/assets/food-f4.jpg";
import f5 from "@/assets/food-f5.jpg";
import f6 from "@/assets/food-f6.jpg";
import f7 from "@/assets/food-f7.jpg";
import f8 from "@/assets/food-f8.jpg";
import f9 from "@/assets/food-f9.jpg";
import f10 from "@/assets/food-f10.jpg";
import f11 from "@/assets/food-f11.jpg";
import f12 from "@/assets/food-f12.jpg";
import f13 from "@/assets/food-f13.jpg";
import f14 from "@/assets/food-f14.jpg";
import f15 from "@/assets/food-f15.jpg";
import f16 from "@/assets/food-f16.jpg";
import f17 from "@/assets/food-f17.jpg";
import f18 from "@/assets/food-f18.jpg";
import f19 from "@/assets/food-f19.jpg";
import f20 from "@/assets/food-f20.jpg";
import hero from "@/assets/hero-burger.jpg";

export const imageLibrary: { key: string; label: string; src: string }[] = [
  { key: "f1", label: "Signature Burger", src: f1 },
  { key: "f2", label: "Cheeseburger", src: f2 },
  { key: "f3", label: "Amagwinya", src: f3 },
  { key: "f4", label: "Loaded Amagwinya", src: f4 },
  { key: "f5", label: "Hot Chips", src: f5 },
  { key: "f6", label: "Cheesy Chips", src: f6 },
  { key: "f7", label: "Family Combo", src: f7 },
  { key: "f8", label: "Solo Combo", src: f8 },
  { key: "f9", label: "Beef Grill Plate", src: f9 },
  { key: "f10", label: "Beef Skewers", src: f10 },
  { key: "f11", label: "Pork Chops", src: f11 },
  { key: "f12", label: "Pork Belly Bites", src: f12 },
  { key: "f13", label: "Fried Chicken", src: f13 },
  { key: "f14", label: "Chicken Wings", src: f14 },
  { key: "f15", label: "Russian & Chips", src: f15 },
  { key: "f16", label: "Double Russian", src: f16 },
  { key: "f17", label: "Chip Roll", src: f17 },
  { key: "f18", label: "Loaded Chip Roll", src: f18 },
  { key: "f19", label: "Chicken Mayo Sandwich", src: f19 },
  { key: "f20", label: "Club Sandwich", src: f20 },
  { key: "hero", label: "Hero Burger", src: hero },
];

const byKey = new Map(imageLibrary.map((i) => [i.key, i.src]));

/** Resolves a stored image key (or a full http image URL) to a usable src. */
export function resolveImage(key: string | null | undefined): string {
  if (!key) return f1;
  if (key.startsWith("http") || key.startsWith("/")) return key;
  return byKey.get(key) ?? f1;
}
