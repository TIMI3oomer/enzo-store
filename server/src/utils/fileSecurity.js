import crypto from "crypto";

// Maximum allowed image size: 5 MB
export const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;

// Whitelist of allowed extensions and MIME types
const ALLOWED_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

const ALLOWED_EXTENSIONS = new Set(["jpg", "jpeg", "png", "webp", "gif"]);

/**
 * Validates whether a given buffer matches genuine image magic numbers.
 * Returns the detected file extension or null if invalid.
 */
function detectImageFormatFromMagicBytes(buffer) {
  if (!buffer || buffer.length < 12) return null;

  // JPEG signature: FF D8 FF
  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    return "jpg";
  }

  // PNG signature: 89 50 4E 47 0D 0A 1A 0A
  if (
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47 &&
    buffer[4] === 0x0d &&
    buffer[5] === 0x0a &&
    buffer[6] === 0x1a &&
    buffer[7] === 0x0a
  ) {
    return "png";
  }

  // GIF signature: GIF87a or GIF89a (47 49 46 38 37/39 61)
  if (
    buffer[0] === 0x47 &&
    buffer[1] === 0x49 &&
    buffer[2] === 0x46 &&
    buffer[3] === 0x38 &&
    (buffer[4] === 0x37 || buffer[4] === 0x39) &&
    buffer[5] === 0x61
  ) {
    return "gif";
  }

  // WebP signature: "RIFF" .... "WEBP"
  if (
    buffer[0] === 0x52 &&
    buffer[1] === 0x49 &&
    buffer[2] === 0x46 &&
    buffer[3] === 0x46 &&
    buffer[8] === 0x57 &&
    buffer[9] === 0x45 &&
    buffer[10] === 0x42 &&
    buffer[11] === 0x50
  ) {
    return "webp";
  }

  return null;
}

/**
 * Scans the initial slice of the buffer for malicious script or HTML signatures.
 * Helps prevent SVG/HTML Stored XSS, PHP shell scripts, or executable uploads.
 */
function containsMaliciousPayload(buffer) {
  const sample = buffer.slice(0, 2048).toString("latin1").toLowerCase();

  const dangerousSignatures = [
    "<script",
    "<?php",
    "<?=",
    "<!doctype html",
    "<html",
    "<svg",
    "<iframe",
    "<embed",
    "<object",
    "javascript:",
    "onload=",
    "onerror=",
    "onclick=",
    "system(",
    "passthru(",
    "shell_exec(",
    "powershell",
    "/bin/sh",
    "/bin/bash",
  ];

  return dangerousSignatures.some((sig) => sample.includes(sig));
}

/**
 * Main security validator for uploaded files.
 * Throws a clean descriptive error if the file fails ANY security check.
 */
export function validateImageUpload(file) {
  if (!file) {
    throw new Error("No file was provided for upload.");
  }

  // 1. File Size Check
  if (file.size > MAX_FILE_SIZE_BYTES) {
    throw new Error(`File is too large (${(file.size / (1024 * 1024)).toFixed(1)}MB). Maximum allowed size is 5MB.`);
  }

  // 2. MIME Type Whitelist Check
  const clientMime = (file.mimetype || "").toLowerCase().trim();
  if (!ALLOWED_MIME_TYPES.has(clientMime)) {
    throw new Error(
      `Invalid MIME type "${clientMime}". Only standard images (JPEG, PNG, WebP, GIF) are allowed. SVG and executable files are strictly forbidden.`
    );
  }

  // 3. Extension Whitelist Check
  const rawExt = (file.originalname || "").split(".").pop().toLowerCase().trim();
  if (!ALLOWED_EXTENSIONS.has(rawExt)) {
    throw new Error(
      `Invalid file extension ".${rawExt}". Allowed extensions are: .jpg, .jpeg, .png, .webp, .gif.`
    );
  }

  // 4. Magic Bytes Binary Signature Verification
  const detectedExt = detectImageFormatFromMagicBytes(file.buffer);
  if (!detectedExt) {
    throw new Error(
      "File header verification failed. The uploaded file is not a genuine image or has corrupted headers."
    );
  }

  // 5. Anti-Malware / Script Scanning
  if (containsMaliciousPayload(file.buffer)) {
    throw new Error(
      "Security violation: The uploaded file contains forbidden script or HTML tags."
    );
  }

  // 6. Generate Cryptographically Safe Filename
  const safeExt = detectedExt === "jpg" ? "jpg" : detectedExt;
  const uniqueId = crypto.randomUUID();
  const safeFilename = `enzo_${Date.now()}_${uniqueId}.${safeExt}`;

  let safeMime = "image/jpeg";
  if (safeExt === "png") safeMime = "image/png";
  else if (safeExt === "webp") safeMime = "image/webp";
  else if (safeExt === "gif") safeMime = "image/gif";

  return {
    safeFilename,
    safeExt,
    safeMime,
    size: file.size,
  };
}
