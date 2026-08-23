/**
 * THREADLOOM DESIGN REMINDER — Security tests assert strict boundaries before expensive cryptographic work begins.
 */

import { describe, expect, it } from "vitest";
import { parseEncryptedBackup } from "./crypto";

describe("encrypted backup envelope", () => {
  it("accepts a complete version-one Threadloom encrypted envelope", () => {
    expect(parseEncryptedBackup({
      format: "threadloom-encrypted-backup",
      version: 1,
      createdAt: "2026-08-23T00:00:00.000Z",
      kdf: { name: "PBKDF2", hash: "SHA-256", iterations: 310000, salt: "c2FsdA" },
      cipher: { name: "AES-GCM", iv: "aXY", ciphertext: "Y2lwaGVy" },
    }).version).toBe(1);
  });

  it("rejects a plain-text or incompatible backup before attempting decryption", () => {
    expect(() => parseEncryptedBackup({ threads: [] })).toThrow("not a compatible Threadloom encrypted backup");
  });
});
