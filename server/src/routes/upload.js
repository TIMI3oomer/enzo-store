import { Router } from "express";
import multer from "multer";
import path from "path";
import fs from "fs/promises";
import { fileURLToPath } from "url";
import { supabaseAdmin } from "../lib/supabaseAdmin.js";
import { attachUser, requireAdmin } from "../middleware/auth.js";
import { validateImageUpload, MAX_FILE_SIZE_BYTES } from "../utils/fileSecurity.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const LOCAL_UPLOADS_DIR = path.resolve(__dirname, "../../public/uploads");

const router = Router();

// Configure multer memory storage — hold file in RAM during inspection, never stream raw to disk
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: MAX_FILE_SIZE_BYTES,
    files: 1,
  },
});

// Require authenticated admin user
router.use(attachUser, requireAdmin);

/**
 * POST /api/admin/upload
 * Multi-layer secure image upload pipeline
 */
router.post("/", upload.single("image"), async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No image file was provided in the 'image' field." });
    }

    // Step 1: Execute deep binary header inspection & anti-malware security validation
    const { safeFilename, safeMime, size } = validateImageUpload(req.file);

    let publicUrl = "";

    // Step 2: Attempt primary upload to Supabase Storage ('product-images' bucket)
    try {
      const storagePath = `products/${safeFilename}`;
      const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
        .from("product-images")
        .upload(storagePath, req.file.buffer, {
          contentType: safeMime,
          upsert: false,
        });

      if (!uploadError && uploadData) {
        const { data: urlData } = supabaseAdmin.storage
          .from("product-images")
          .getPublicUrl(storagePath);

        if (urlData?.publicUrl) {
          publicUrl = urlData.publicUrl;
        }
      }
    } catch (storageErr) {
      console.warn("[Upload] Supabase Storage upload error, using secure local fallback:", storageErr.message);
    }

    // Step 3: If Supabase Storage is not configured/offline, securely persist to local static directory
    if (!publicUrl) {
      await fs.mkdir(LOCAL_UPLOADS_DIR, { recursive: true });
      const localFilePath = path.join(LOCAL_UPLOADS_DIR, safeFilename);
      await fs.writeFile(localFilePath, req.file.buffer);

      const serverBase = `${req.protocol}://${req.get("host")}`;
      publicUrl = `${serverBase}/uploads/${safeFilename}`;
    }

    return res.status(201).json({
      success: true,
      url: publicUrl,
      filename: safeFilename,
      size,
      mimeType: safeMime,
    });
  } catch (err) {
    if (err instanceof multer.MulterError) {
      if (err.code === "LIMIT_FILE_SIZE") {
        return res.status(400).json({ error: "File exceeds 5MB maximum allowed size." });
      }
      return res.status(400).json({ error: `Upload error: ${err.message}` });
    }
    return res.status(400).json({ error: err.message || "Failed to validate image upload." });
  }
});

export default router;
