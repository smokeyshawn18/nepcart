import { apiFetch } from "./api.js";

const UPLOAD_URL = "https://upload.imagekit.io/api/v1/files/upload";

export async function uploadImageToImageKit(file, getToken, opts = {}) {
  const { folder = "products", fileName } = opts;
  const auth = await apiFetch("/api/admin/imagekit/auth", { getToken });

  // replace unsafe characters with _.
  // example: "my photo @ home.png" becomes "my_photo___home.png"
  const safeName =
    fileName ?? (file.name.replace(/[^\w.-]/g, "_").slice(0, 200) || `upload-${Date.now()}.jpg`);

  const form = new FormData();
  form.append("file", file);
  form.append("fileName", safeName);
  form.append("publicKey", auth.publicKey);
  form.append("signature", auth.signature);
  form.append("token", auth.token);
  form.append("expire", String(auth.expire));
  form.append("folder", folder);

  const res = await fetch(UPLOAD_URL, { method: "POST", body: form });
  const data = await res.json();

  if (!res.ok) {
    console.log("[ImageKit upload]", res.status, data);
    throw new Error("ImageKit upload failed");
  }

  if (!data.url) {
    console.log("[ImageKit upload] missing url in response", data);
    throw new Error("ImageKit upload failed");
  }

  return { url: data.url, fileId: data.fileId ?? null };
}
