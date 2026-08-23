/**
 * THREADLOOM DESIGN REMINDER — The vault is an honest ownership control, not security theater.
 */

import { useState, type ChangeEvent } from "react";
import { Download, FileKey, FolderUp, LockKeyhole, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { decryptWorkspace, encryptWorkspace, parseEncryptedBackup, type EncryptedBackup } from "../crypto";
import type { ResurfacingSettings, Thread } from "../domain";
import type { WorkspaceSnapshot } from "../storage";

type VaultDialogProps = {
  threads: Thread[];
  settings: ResurfacingSettings;
  onRestore: (snapshot: WorkspaceSnapshot) => void;
};

function downloadBackup(backup: EncryptedBackup): void {
  const blob = new Blob([JSON.stringify(backup, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `threadloom-backup-${backup.createdAt.slice(0, 10)}.json`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 0);
}

export function VaultDialog({ threads, settings, onRestore }: VaultDialogProps) {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<"backup" | "restore">("backup");
  const [passphrase, setPassphrase] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [backup, setBackup] = useState<EncryptedBackup>();
  const [fileName, setFileName] = useState("");
  const [status, setStatus] = useState("");
  const [isWorking, setIsWorking] = useState(false);

  function resetSensitiveState() {
    setPassphrase("");
    setConfirmation("");
    setBackup(undefined);
    setFileName("");
    setStatus("");
  }

  function updateOpen(nextOpen: boolean) {
    setOpen(nextOpen);
    if (!nextOpen) resetSensitiveState();
  }

  async function makeBackup() {
    setStatus("");
    if (passphrase !== confirmation) {
      setStatus("The two passphrases do not match.");
      return;
    }
    setIsWorking(true);
    try {
      const encrypted = await encryptWorkspace({ threads, settings }, passphrase);
      downloadBackup(encrypted);
      setStatus("Encrypted backup downloaded. Keep the passphrase separately; Threadloom cannot recover it.");
      setPassphrase("");
      setConfirmation("");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Threadloom could not create the encrypted backup.");
    } finally {
      setIsWorking(false);
    }
  }

  async function chooseFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    setStatus("");
    setBackup(undefined);
    setFileName("");
    if (!file) return;
    try {
      setBackup(parseEncryptedBackup(JSON.parse(await file.text())));
      setFileName(file.name);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Threadloom could not read that backup file.");
    }
  }

  async function restoreBackup() {
    if (!backup) return;
    setIsWorking(true);
    setStatus("");
    try {
      onRestore(await decryptWorkspace(backup, passphrase));
      setStatus("Workspace restored in this browser.");
      window.setTimeout(() => updateOpen(false), 600);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Threadloom could not restore this backup.");
    } finally {
      setIsWorking(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={updateOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="vault-trigger"><LockKeyhole size={15} /> Backup vault</Button>
      </DialogTrigger>
      <DialogContent className="vault-dialog">
        <DialogHeader>
          <span className="eyebrow">Local ownership</span>
          <DialogTitle>Encrypted backup vault</DialogTitle>
          <DialogDescription>Your passphrase stays in this browser and is never stored by Threadloom.</DialogDescription>
        </DialogHeader>
        <div className="vault-tabs" role="tablist" aria-label="Backup controls">
          <button type="button" role="tab" aria-selected={mode === "backup"} className={mode === "backup" ? "active" : ""} onClick={() => { setMode("backup"); resetSensitiveState(); }}><Download size={14} /> Create backup</button>
          <button type="button" role="tab" aria-selected={mode === "restore"} className={mode === "restore" ? "active" : ""} onClick={() => { setMode("restore"); resetSensitiveState(); }}><FolderUp size={14} /> Restore backup</button>
        </div>
        {mode === "backup" ? (
          <div className="vault-form">
            <div className="vault-note"><ShieldCheck size={17} /><p>Your workspace is encrypted with your passphrase before the file is downloaded. Do not forget it; there is no recovery route.</p></div>
            <label>New backup passphrase<Input type="password" value={passphrase} onChange={(event) => setPassphrase(event.target.value)} placeholder="At least 12 characters" autoComplete="new-password" /></label>
            <label>Confirm passphrase<Input type="password" value={confirmation} onChange={(event) => setConfirmation(event.target.value)} placeholder="Repeat the same passphrase" autoComplete="new-password" /></label>
          </div>
        ) : (
          <div className="vault-form">
            <div className="vault-note"><FileKey size={17} /><p>Restoring replaces the current threads and return settings in this browser with the content of the encrypted backup.</p></div>
            <label className="vault-file-label">Choose encrypted backup<input type="file" accept="application/json,.json" onChange={chooseFile} /></label>
            {fileName && <p className="vault-file-name">Ready to unlock: {fileName}</p>}
            <label>Backup passphrase<Input type="password" value={passphrase} onChange={(event) => setPassphrase(event.target.value)} placeholder="The passphrase used for this file" autoComplete="current-password" /></label>
          </div>
        )}
        {status && <p className="vault-status" role="status">{status}</p>}
        <DialogFooter>
          <Button variant="outline" type="button" onClick={() => updateOpen(false)}>Close</Button>
          {mode === "backup" ? <Button type="button" onClick={makeBackup} disabled={isWorking}>{isWorking ? "Encrypting…" : "Download encrypted backup"}</Button> : <Button type="button" onClick={restoreBackup} disabled={isWorking || !backup}>{isWorking ? "Unlocking…" : "Restore this workspace"}</Button>}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
