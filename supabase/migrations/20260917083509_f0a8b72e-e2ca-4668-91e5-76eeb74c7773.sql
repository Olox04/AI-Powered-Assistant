CREATE TABLE public.menu_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  description text NOT NULL DEFAULT '',
  starting_price numeric(10,2) NOT NULL DEFAULT 0,
  image_key text NOT NULL DEFAULT 'f1',
  sort_order integer NOT NULL DEFAULT 0,
  visible boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.menu_categories TO authenticated;
GRANT ALL ON public.menu_categories TO service_role;
ALTER TABLE public.menu_categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Signed-in users can view categories" ON public.menu_categories FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can insert categories" ON public.menu_categories FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update categories" ON public.menu_categories FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete categories" ON public.menu_categories FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE TABLE public.menu_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  category_slug text NOT NULL REFERENCES public.menu_categories(slug) ON UPDATE CASCADE ON DELETE CASCADE,
  description text NOT NULL DEFAULT '',
  price numeric(10,2) NOT NULL DEFAULT 0,
  image_key text NOT NULL DEFAULT 'f1',
  available boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.menu_items TO authenticated;
GRANT ALL ON public.menu_items TO service_role;
ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Signed-in users can view menu items" ON public.menu_items FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can insert menu items" ON public.menu_items FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update menu items" ON public.menu_items FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete menu items" ON public.menu_items FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE TABLE public.site_settings (
  key text PRIMARY KEY,
  value jsonb NOT NULL DEFAULT '{}'::jsonb,
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.site_settings TO authenticated;
GRANT ALL ON public.site_settings TO service_role;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Signed-in users can view settings" ON public.site_settings FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can insert settings" ON public.site_settings FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update settings" ON public.site_settings FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER menu_categories_set_updated_at BEFORE UPDATE ON public.menu_categories FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER menu_items_set_updated_at BEFORE UPDATE ON public.menu_items FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER site_settings_set_updated_at BEFORE UPDATE ON public.site_settings FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

INSERT INTO public.menu_categories (slug, name, description, starting_price, image_key, sort_order) VALUES
('burgers','Burgers','Juicy stacked classics grilled to order.',65,'f1',1),
('amagwinya','Amagwinya','Golden vetkoek, crisp outside, fluffy inside.',25,'f3',2),
('hot-chips','Hot Chips','Crispy fries seasoned to perfection.',35,'f5',3),
('combos','Combos','Meal deals — burger, chips & drink.',89,'f7',4),
('beef','Beef','Grilled beef cuts, tender and smoky.',95,'f9',5),
('pork','Pork','Slow-grilled pork chops with herbs.',99,'f11',6),
('chicken','Chicken','Crispy fried chicken, house spice.',79,'f13',7),
('russian-parcel','Russian Parcel','Russian sausage tucked with chips.',55,'f15',8),
('chip-roll','Chip Roll','Warm roll loaded with hot chips.',35,'f17',9),
('sandwich','Sandwich','Toasted classics stacked high.',49,'f19',10);

INSERT INTO public.menu_items (name, category_slug, description, price, image_key, available, sort_order) VALUES
('Skhura''s Signature Burger','burgers','Double beef, cheddar, secret sauce.',89,'f1',true,1),
('Classic Cheeseburger','burgers','Grilled beef, melted cheese, brioche.',65,'f2',true,2),
('Amagwinya (3-pack)','amagwinya','Three warm vetkoek with syrup.',25,'f3',true,3),
('Loaded Amagwinya','amagwinya','Vetkoek stuffed with mince & cheese.',45,'f4',true,4),
('Large Hot Chips','hot-chips','Extra crispy, sea-salted.',35,'f5',true,5),
('Cheesy Chips','hot-chips','Chips smothered in cheese sauce.',55,'f6',true,6),
('Family Combo','combos','4 burgers, 2 chips, 2L drink.',259,'f7',true,7),
('Solo Combo','combos','Burger, chips & drink.',89,'f8',true,8),
('Beef Grill Plate','beef','Grilled beef with sides.',129,'f9',true,9),
('Beef Skewers','beef','Spiced beef skewers, 3 pcs.',95,'f10',false,10),
('Pork Chops','pork','Two grilled chops with chips.',115,'f11',true,11),
('Pork Belly Bites','pork','Crispy pork belly, sweet glaze.',99,'f12',true,12),
('Fried Chicken (6pc)','chicken','Crispy chicken bucket, house spice.',129,'f13',true,13),
('Chicken Wings','chicken','Sticky BBQ wings, 8 pcs.',79,'f14',true,14),
('Russian & Chips','russian-parcel','Grilled russian with hot chips.',55,'f15',true,15),
('Double Russian Parcel','russian-parcel','Two russians, chips, sauce.',75,'f16',true,16),
('Chip Roll Classic','chip-roll','Fresh roll with hot chips.',35,'f17',true,17),
('Loaded Chip Roll','chip-roll','Chips, mince, cheese & sauce.',55,'f18',true,18),
('Chicken Mayo Sandwich','sandwich','Toasted, creamy, herby.',49,'f19',true,19),
('Skhura''s Club','sandwich','Triple stack club sandwich.',75,'f20',true,20);

INSERT INTO public.site_settings (key, value) VALUES
('promo_banner', '{"eyebrow":"Featured","title":"Bold Flavours.","titleAccent":"Timeless Classics.","body":"Try the Skhura''s Signature Burger — double-stacked, house sauce, brioche bun. Fresh off the grill.","ctaLabel":"Order Now","imageKey":"hero","enabled":true}'::jsonb);