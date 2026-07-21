import burgers from "@/assets/cat-burgers.jpg";
import amagwinya from "@/assets/cat-amagwinya.jpg";
import chips from "@/assets/cat-chips.jpg";
import combos from "@/assets/cat-combos.jpg";
import beef from "@/assets/cat-beef.jpg";
import pork from "@/assets/cat-pork.jpg";
import chicken from "@/assets/cat-chicken.jpg";
import russian from "@/assets/cat-russian.jpg";
import chiproll from "@/assets/cat-chiproll.jpg";
import sandwich from "@/assets/cat-sandwich.jpg";
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

export type Category = {
  slug: string;
  name: string;
  description: string;
  startingPrice: number;
  image: string;
};

export const categories: Category[] = [
  { slug: "burgers", name: "Burgers", description: "Juicy stacked classics grilled to order.", startingPrice: 49, image: burgers },
  { slug: "amagwinya", name: "Amagwinya", description: "Golden vetkoek, crisp outside, fluffy inside.", startingPrice: 12, image: amagwinya },
  { slug: "hot-chips", name: "Hot Chips", description: "Crispy fries seasoned to perfection.", startingPrice: 25, image: chips },
  { slug: "combos", name: "Combos", description: "Meal deals — burger, chips & drink.", startingPrice: 79, image: combos },
  { slug: "beef", name: "Beef", description: "Grilled beef cuts, tender and smoky.", startingPrice: 89, image: beef },
  { slug: "pork", name: "Pork", description: "Slow-grilled pork chops with herbs.", startingPrice: 85, image: pork },
  { slug: "chicken", name: "Chicken", description: "Crispy fried chicken, house spice.", startingPrice: 59, image: chicken },
  { slug: "russian-parcel", name: "Russian Parcel", description: "Russian sausage tucked with chips.", startingPrice: 45, image: russian },
  { slug: "chip-roll", name: "Chip Roll", description: "Warm roll loaded with hot chips.", startingPrice: 35, image: chiproll },
  { slug: "sandwich", name: "Sandwich", description: "Toasted classics stacked high.", startingPrice: 39, image: sandwich },
];

export type FoodItem = {
  id: string;
  name: string;
  category: string;
  description: string;
  price: number;
  image: string;
  available: boolean;
};

export const foods: FoodItem[] = [
  { id: "f1", name: "Skhura's Signature Burger", category: "burgers", description: "Double beef, cheddar, secret sauce.", price: 89, image: f1, available: true },
  { id: "f2", name: "Classic Cheeseburger", category: "burgers", description: "Grilled beef, melted cheese, brioche.", price: 65, image: f2, available: true },
  { id: "f3", name: "Amagwinya (3-pack)", category: "amagwinya", description: "Three warm vetkoek with syrup.", price: 25, image: f3, available: true },
  { id: "f4", name: "Loaded Amagwinya", category: "amagwinya", description: "Vetkoek stuffed with mince & cheese.", price: 45, image: f4, available: true },
  { id: "f5", name: "Large Hot Chips", category: "hot-chips", description: "Extra crispy, sea-salted.", price: 35, image: f5, available: true },
  { id: "f6", name: "Cheesy Chips", category: "hot-chips", description: "Chips smothered in cheese sauce.", price: 55, image: f6, available: true },
  { id: "f7", name: "Family Combo", category: "combos", description: "4 burgers, 2 chips, 2L drink.", price: 259, image: f7, available: true },
  { id: "f8", name: "Solo Combo", category: "combos", description: "Burger, chips & drink.", price: 89, image: f8, available: true },
  { id: "f9", name: "Beef Grill Plate", category: "beef", description: "Grilled beef with sides.", price: 129, image: f9, available: true },
  { id: "f10", name: "Beef Skewers", category: "beef", description: "Spiced beef skewers, 3 pcs.", price: 95, image: f10, available: false },
  { id: "f11", name: "Pork Chops", category: "pork", description: "Two grilled chops with chips.", price: 115, image: f11, available: true },
  { id: "f12", name: "Pork Belly Bites", category: "pork", description: "Crispy pork belly, sweet glaze.", price: 99, image: f12, available: true },
  { id: "f13", name: "Fried Chicken (6pc)", category: "chicken", description: "Crispy chicken bucket, house spice.", price: 129, image: f13, available: true },
  { id: "f14", name: "Chicken Wings", category: "chicken", description: "Sticky BBQ wings, 8 pcs.", price: 79, image: f14, available: true },
  { id: "f15", name: "Russian & Chips", category: "russian-parcel", description: "Grilled russian with hot chips.", price: 55, image: f15, available: true },
  { id: "f16", name: "Double Russian Parcel", category: "russian-parcel", description: "Two russians, chips, sauce.", price: 75, image: f16, available: true },
  { id: "f17", name: "Chip Roll Classic", category: "chip-roll", description: "Fresh roll with hot chips.", price: 35, image: f17, available: true },
  { id: "f18", name: "Loaded Chip Roll", category: "chip-roll", description: "Chips, mince, cheese & sauce.", price: 55, image: f18, available: true },
  { id: "f19", name: "Chicken Mayo Sandwich", category: "sandwich", description: "Toasted, creamy, herby.", price: 49, image: f19, available: true },
  { id: "f20", name: "Skhura's Club", category: "sandwich", description: "Triple stack club sandwich.", price: 75, image: f20, available: true },
];

export type OrderLineItem = {
  id: string;
  name: string;
  price: number;
  qty: number;
};

export type OrderStatusEvent = {
  status: Order["status"];
  at: number; // epoch ms
};

export type PaymentMethod = "cash" | "card" | "eft" | "snapscan";
export type PaymentStatus = "paid" | "unpaid" | "refunded";

export type Order = {
  id: string;
  customer: string;
  items: string[];
  total: number;
  status: "pending" | "preparing" | "ready" | "completed";
  time: string;
  // Extended fields (optional for backward-compatibility with seed data)
  lineItems?: OrderLineItem[];
  subtotal?: number;
  serviceFee?: number;
  placedAt?: number;
  history?: OrderStatusEvent[];
  paymentMethod?: PaymentMethod;
  paymentStatus?: PaymentStatus;
};

export const recentOrders: Order[] = [
  { id: "#4821", customer: "Thabo M.", items: ["Signature Burger", "Large Chips", "Coke"], total: 149, status: "completed", time: "2m ago" },
  { id: "#4820", customer: "Nolwazi K.", items: ["Family Combo"], total: 259, status: "preparing", time: "5m ago" },
  { id: "#4819", customer: "Sipho D.", items: ["Loaded Chip Roll", "Fanta"], total: 72, status: "ready", time: "8m ago" },
  { id: "#4818", customer: "Amanda P.", items: ["Fried Chicken 6pc", "Cheesy Chips"], total: 184, status: "pending", time: "12m ago" },
  { id: "#4817", customer: "Lerato V.", items: ["Pork Chops", "Sprite"], total: 132, status: "completed", time: "15m ago" },
  { id: "#4816", customer: "Kabelo N.", items: ["Double Russian Parcel"], total: 75, status: "preparing", time: "18m ago" },
  { id: "#4815", customer: "Zanele B.", items: ["Skhura's Club", "Chips"], total: 110, status: "ready", time: "22m ago" },
  { id: "#4814", customer: "Mpho L.", items: ["Amagwinya 3pk", "Loaded Amagwinya"], total: 70, status: "completed", time: "27m ago" },
];
