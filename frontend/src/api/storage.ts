import { supabase } from "../supabaseClient";

const BUCKET = "product-images";
const MAX_BYTES = 5 * 1024 * 1024;

/** Uploads one image and returns its public URL, ready to store in products.images. */
export async function uploadProductImage(file: File): Promise<string> {
  if (!file.type.startsWith("image/")) {
    throw new Error(`"${file.name}" is not an image.`);
  }
  if (file.size > MAX_BYTES) {
    throw new Error(`"${file.name}" is larger than 5 MB. Please upload a smaller image.`);
  }

  const match = /\.([a-z0-9]+)$/i.exec(file.name);
  const path = `${crypto.randomUUID()}.${match ? match[1].toLowerCase() : "jpg"}`;

  const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
    contentType: file.type,
    cacheControl: "31536000",
  });
  if (error) throw new Error(error.message);

  return supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;
}
