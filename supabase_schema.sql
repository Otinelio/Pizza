-- Création de la table restaurant_config
CREATE TABLE IF NOT EXISTS restaurant_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  tagline TEXT,
  whatsapp TEXT,
  address TEXT,
  hours TEXT,
  instagram TEXT,
  facebook TEXT,
  hero_message TEXT,
  status TEXT DEFAULT 'open',
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Création de la table categories
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  position INTEGER DEFAULT 0
);

-- Création de la table menu_items
CREATE TABLE IF NOT EXISTS menu_items (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price INTEGER NOT NULL,
  category_name TEXT NOT NULL,
  image_url TEXT,
  available BOOLEAN DEFAULT true,
  position INTEGER DEFAULT 0
);

-- Création du bucket de stockage pour les images
INSERT INTO storage.buckets (id, name, public) VALUES ('menu-images', 'menu-images', true) ON CONFLICT (id) DO NOTHING;

-- Politiques de sécurité (Row Level Security)
-- Permettre la lecture à tout le monde
ALTER TABLE restaurant_config ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read-only access for restaurant_config" ON restaurant_config FOR SELECT USING (true);
CREATE POLICY "Allow public all access for restaurant_config" ON restaurant_config FOR ALL USING (true) WITH CHECK (true); -- Pour simplification, on permet tout car l'admin est géré par mot de passe côté client. En prod, il faudrait sécuriser.

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read-only access for categories" ON categories FOR SELECT USING (true);
CREATE POLICY "Allow public all access for categories" ON categories FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read-only access for menu_items" ON menu_items FOR SELECT USING (true);
CREATE POLICY "Allow public all access for menu_items" ON menu_items FOR ALL USING (true) WITH CHECK (true);

-- Politiques pour le Storage
CREATE POLICY "Allow public read access for menu-images" ON storage.objects FOR SELECT USING (bucket_id = 'menu-images');
CREATE POLICY "Allow public insert for menu-images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'menu-images');
CREATE POLICY "Allow public update for menu-images" ON storage.objects FOR UPDATE USING (bucket_id = 'menu-images');
CREATE POLICY "Allow public delete for menu-images" ON storage.objects FOR DELETE USING (bucket_id = 'menu-images');
