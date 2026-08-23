/**
 * THREADLOOM DESIGN REMINDER — Backup encryption is narrow, explicit, and user-owned.
 * The passphrase never leaves the browser or enters persistent application storage.
 */

import { isWorkspaceSnapshot, type WorkspaceSnapshot } from "./storage";

const FORMAT = "threadloom-encrypted-backup";
const VERSION = 1;
const ITERATIONS = 310_000;
const AAD = "threadloom-encrypted-backup:v1";
const encoder = new TextEncoder();
const decoder = new TextDecoder();

export type EncryptedBackup = {
  format: typeof FORMAT;
  version: typeof VERSION;
  createdAt: string;
  kdf: {
    name: "PBKDF2";
    hash: "SHA-256";
    iterations: number;
    salt: string;
  };
  cipher: {
    name: "AES-GCM";
    iv: string;
    ciphertext: string;
  };
};

function toBase64Url(bytes: Uint8Array): string {
  let binary = "";
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return btoa(binary).replaceAll("+", "-").replaceAll("/", "_").replace(/=+$/, "");
}

function fromBase64Url(value: string): Uint8Array {
  if (!/^[A-Za-z0-9_-]+$/.test(value)) throw new Error("The backup file has an invalid encrypted field.");
  const padded = value.replaceAll("-", "+").replaceAll("_", "/") + "=".repeat((4 - (value.length % 4)) % 4);
  const binary = atob(padded);
  return Uint8Array.from(binary, (character) => character.charCodeAt(0));
}

function randomBytes(length: number): Uint8Array {
  const bytes = new Uint8Array(length);
  crypto.getRandomValues(bytes);
  return bytes;
}

async function deriveKey(passphrase: string, salt: Uint8Array, iterations: number): Promise<CryptoKey> {
  const material = await crypto.subtle.importKey("raw", encoder.encode(passphrase), "PBKDF2", false, ["deriveKey"]);
  return crypto.subtle.deriveKey(
    { name: "PBKDF2", hash: "SHA-256", salt, iterations },
    material,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"],
  );
}

function assertEnvironment(): void {
  if (!globalThis.isSecureContext || !globalThis.crypto?.subtle) {
    throw new Error("Encrypted backup needs a secure browser context with Web Crypto support.");
  }
}

function assertPassphrase(passphrase: string): void {
  if (passphrase.length < 12) throw new Error("Use a passphrase of at least 12 characters to protect this backup.");
}

export function parseEncryptedBackup(value: unknown): EncryptedBackup {
  if (!value || typeof value !== "object") throw new Error("Choose a Threadloom encrypted backup file.");
  const backup = value as Partial<EncryptedBackup>;
  const valid =
    backup.format === FORMAT &&
    backup.version === VERSION &&
    typeof backup.createdAt === "string" &&
    backup.kdf?.name === "PBKDF2" &&
    backup.kdf.hash === "SHA-256" &&
    typeof backup.kdf.iterations === "number" &&
    typeof backup.kdf.salt === "string" &&
    backup.cipher?.name === "AES-GCM" &&
    typeof backup.cipher.iv === "string" &&
    typeof backup.cipher.ciphertext === "string";
  if (!valid) throw new Error("This file is not a compatible Threadloom encrypted backup.");
  return backup as EncryptedBackup;
}

export async function encryptWorkspace(snapshot: WorkspaceSnapshot, passphrase: string): Promise<EncryptedBackup> {
  assertEnvironment();
  assertPassphrase(passphrase);
  const salt = randomBytes(16);
  const iv = randomBytes(12);
  const key = await deriveKey(passphrase, salt, ITERATIONS);
  const ciphertext = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv, additionalData: encoder.encode(AAD) },
    key,
    encoder.encode(JSON.stringify(snapshot)),
  );
  return {
    format: FORMAT,
    version: VERSION,
    createdAt: new Date().toISOString(),
    kdf: { name: "PBKDF2", hash: "SHA-256", iterations: ITERATIONS, salt: toBase64Url(salt) },
    cipher: { name: "AES-GCM", iv: toBase64Url(iv), ciphertext: toBase64Url(new Uint8Array(ciphertext)) },
  };
}

export async function decryptWorkspace(backup: EncryptedBackup, passphrase: string): Promise<WorkspaceSnapshot> {
  assertEnvironment();
  assertPassphrase(passphrase);
  try {
    const salt = fromBase64Url(backup.kdf.salt);
    const iv = fromBase64Url(backup.cipher.iv);
    const ciphertext = fromBase64Url(backup.cipher.ciphertext);
    const key = await deriveKey(passphrase, salt, backup.kdf.iterations);
    const plain = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv, additionalData: encoder.encode(AAD) },
      key,
      ciphertext,
    );
    const decoded: unknown = JSON.parse(decoder.decode(plain));
    if (!isWorkspaceSnapshot(decoded)) throw new Error("The decrypted backup does not contain a valid Threadloom workspace.");
    return decoded;
  } catch {
    throw new Error("Threadloom could not unlock this backup. Check the passphrase and file, then try again.");
  }
}
