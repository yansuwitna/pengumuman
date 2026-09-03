import crypto from "crypto";

// Fungsi Hash Password yang Aman dengan Salt
export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, "sha512").toString("hex");
  return `${salt}:${hash}`;
}

// Fungsi Verifikasi Password
export function verifyPassword(password: string, storedHash: string): boolean {
  try {
    if (!storedHash.includes(":")) {
      // Fallback jika plain text (misal saat inisialisasi darurat)
      return password === storedHash;
    }
    const [salt, originalHash] = storedHash.split(":");
    const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, "sha512").toString("hex");
    return hash === originalHash;
  } catch {
    return false;
  }
}
