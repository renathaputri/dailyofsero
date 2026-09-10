import crypto from "crypto";

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 12; // Recommended length for GCM
const AUTH_TAG_LENGTH = 16;

function getKey(): Buffer {
  const secret = process.env.JOURNAL_ENCRYPTION_KEY || "sero_growth_journal_aes256_key_32bytes!!";
  // Always derive a 32-byte key using sha256 to ensure exact length
  return crypto.createHash("sha256").update(String(secret)).digest();
}

/**
 * Encrypts journal text content using AES-256-GCM.
 * Output format: <iv_hex>:<auth_tag_hex>:<ciphertext_hex>
 */
export function encryptJournal(plainText: string): string {
  const iv = crypto.randomBytes(IV_LENGTH);
  const key = getKey();
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);

  let encrypted = cipher.update(plainText, "utf8", "hex");
  encrypted += cipher.final("hex");

  const authTag = cipher.getAuthTag();

  return `${iv.toString("hex")}:${authTag.toString("hex")}:${encrypted}`;
}

/**
 * Decrypts AES-256-GCM encrypted journal text.
 */
export function decryptJournal(cipherPayload: string): string {
  try {
    const parts = cipherPayload.split(":");
    if (parts.length !== 3) {
      throw new Error("Invalid cipher payload format");
    }

    const [ivHex, authTagHex, encryptedHex] = parts;
    const iv = Buffer.from(ivHex, "hex");
    const authTag = Buffer.from(authTagHex, "hex");
    const key = getKey();

    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
    decipher.setAuthTag(authTag);

    let decrypted = decipher.update(encryptedHex, "hex", "utf8");
    decrypted += decipher.final("utf8");

    return decrypted;
  } catch (error) {
    console.error("Failed to decrypt journal entry:", error);
    return "[Konten tidak dapat didekripsi / kunci tidak cocok]";
  }
}
