import { createClient } from "@supabase/supabase-js";

// ── Supabase Configuration ─────────────────
// Remplacez ces valeurs par celles de votre dashboard Supabase
// Settings > API > Project URL & anon/public key
const SUPABASE_URL = "https://xbgwhhrsycldwcsctbyd.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_MX8lUl--nxkC8rIc0Z0bvw_E6VdVQIG";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ── Vérifier si Supabase est configuré ─────
export function isSupabaseConfigured(): boolean {
  return !!(
    SUPABASE_URL &&
    SUPABASE_ANON_KEY
  );
}

// ── Storage Helpers ────────────────────────
const MENU_IMAGES_BUCKET = "menu-images";

/**
 * Upload une image vers Supabase Storage
 * @returns l'URL publique de l'image uploadée
 */
export async function uploadMenuImage(file: File, itemId: string): Promise<string> {
  // Compresser l'image côté client avant upload
  const compressed = await compressImage(file, 800, 0.8);

  const ext = file.name.split(".").pop() || "jpg";
  const path = `items/${itemId}.${ext}`;

  // Supprimer l'ancienne image si elle existe
  await supabase.storage.from(MENU_IMAGES_BUCKET).remove([path]);

  const { error } = await supabase.storage
    .from(MENU_IMAGES_BUCKET)
    .upload(path, compressed, {
      cacheControl: "3600",
      upsert: true,
      contentType: compressed.type,
    });

  if (error) throw new Error(`Upload failed: ${error.message}`);

  const { data: urlData } = supabase.storage
    .from(MENU_IMAGES_BUCKET)
    .getPublicUrl(path);

  // Ajouter un timestamp pour contourner le cache
  return `${urlData.publicUrl}?t=${Date.now()}`;
}

/**
 * Supprimer une image du storage
 */
export async function deleteMenuImage(imageUrl: string): Promise<void> {
  try {
    // Extraire le path du bucket depuis l'URL
    const url = new URL(imageUrl.split("?")[0]);
    const pathParts = url.pathname.split(`/${MENU_IMAGES_BUCKET}/`);
    if (pathParts.length > 1) {
      await supabase.storage.from(MENU_IMAGES_BUCKET).remove([pathParts[1]]);
    }
  } catch {
    // Silently fail — l'image n'est peut-être pas dans le storage
  }
}

// ── Image Compression ──────────────────────
function compressImage(file: File, maxWidth: number, quality: number): Promise<Blob> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let { width, height } = img;
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d")!;
        ctx.drawImage(img, 0, 0, width, height);
        canvas.toBlob(
          (blob) => resolve(blob || file),
          "image/jpeg",
          quality,
        );
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  });
}
