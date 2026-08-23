# Threadloom Security and Resurfacing Design

> **Scope:** This increment protects exported backup files with a user-supplied passphrase, moves the active workspace to IndexedDB, and makes return recommendations explicit, inspectable, and user-controlled. It does **not** claim to encrypt the unlocked active browser workspace at rest.

## Security boundary

Threadloom’s active workspace will move from small synchronous web storage to IndexedDB, which is designed for persistent structured browser data and transactional updates.[1] Its same-origin boundary means data is scoped to the Threadloom site, but it is not a substitute for device encryption, a browser profile password, or application-level encryption.[1] The browser workspace is deliberately left readable while the application is unlocked so normal local search and rendering remain simple and reliable.

Encrypted backup files use the browser’s Web Crypto API in a secure context. MDN emphasizes that Web Crypto is low-level and easy to misuse, so the format is intentionally narrow: one password-derived key, one authenticated encryption envelope, versioned metadata, no home-grown cipher, and no persistence of the passphrase.[2]

| Concern | Design response | Important limit |
|---|---|---|
| Backup file is copied, emailed, or placed on cloud storage | The payload is encrypted before download with AES-GCM. | A weak or reused passphrase weakens the backup. |
| Backup is modified or the wrong passphrase is entered | AES-GCM authentication fails during restore. | The user sees a generic recovery error rather than cryptographic detail. |
| An old backup format is imported | The envelope is versioned and validated before decryption. | Future migrations must retain a compatible reader. |
| Browser storage grows beyond local storage’s practical use | The active workspace is held in IndexedDB. | Browser quotas and eviction rules vary; export remains essential. |
| User loses the passphrase | No recovery path exists by design. | Threadloom cannot restore the file without it. |

## Encrypted backup envelope

```json
{
  "format": "threadloom-encrypted-backup",
  "version": 1,
  "createdAt": "2026-08-23T00:00:00.000Z",
  "kdf": {
    "name": "PBKDF2",
    "hash": "SHA-256",
    "iterations": 310000,
    "salt": "base64url-random-16-byte-value"
  },
  "cipher": {
    "name": "AES-GCM",
    "iv": "base64url-random-12-byte-value",
    "ciphertext": "base64url-authenticated-ciphertext"
  }
}
```

The passphrase is converted to a key with PBKDF2-SHA-256 and a fresh random salt. The resulting non-extractable AES-256-GCM key encrypts a validated workspace payload with a fresh 96-bit initialization vector. Salt and IV are metadata, not secrets; they are stored in the envelope so the user can later derive the same key. The passphrase is never written to IndexedDB, local storage, the backup, or telemetry. AES-GCM provides confidentiality and integrity for the downloaded file when used with a unique IV per encryption operation.[2]

## Transparent resurfacing model

Threadloom should not claim to “know” what a person needs. A return is a transparent score based on settings the person can read and modify. The product always reveals the specific contributing reasons.

| Rule | Default | User control | Explanation shown in the UI |
|---|---:|---|---|
| Eligible states | `open`, `resting` | Select which strand states may return. | “It is still an open thread.” |
| Time since last visit | 7 days | Choose a minimum quiet interval: 3, 7, 14, or 30 days. | “You have not visited it for 12 days.” |
| Return cue weight | Enabled | Include or exclude user-authored `return when…` cues. | “You left a return cue for this strand.” |
| Return set size | 3 | Choose 1–5 candidates. | “One of your chosen three returns.” |
| Resolved strands | Excluded | May be included only if the user explicitly chooses. | “You chose to include woven-in strands.” |

The ranker uses deterministic state and recency weight; it does not infer mood, relationships, health, or intent. Search and filters always take precedence over the return set, so people can browse their archive directly.

## References

[1] [MDN, *IndexedDB API*](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API)

[2] [MDN, *Web Crypto API*](https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API)
