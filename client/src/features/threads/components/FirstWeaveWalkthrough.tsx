/**
 * THREADLOOM DESIGN REMINDER — Onboarding is a quiet invitation to a practice,
 * not a gamified tour. It remains optional, local-only, and replayable.
 */

import { useState } from "react";
import { ArrowLeft, ArrowRight, Check, LockKeyhole } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const moments = [
  {
    eyebrow: "First weave · 01",
    title: "Keep the why beside the thing.",
    copy: "Start with one thought, person, place, question, or object that you do not want to lose the reason for. The title names it; the why preserves its original pull.",
    mark: "strand",
  },
  {
    eyebrow: "First weave · 02",
    title: "Choose the kind of return you want.",
    copy: "Threadloom does not guess. You decide which strands may return, how long they should be quiet, and whether your own return cues should matter.",
    mark: "return",
  },
  {
    eyebrow: "First weave · 03",
    title: "Make the weave portable.",
    copy: "When a thread begins to matter, make an encrypted backup. Your passphrase stays out of Threadloom and cannot be recovered, so keep it in a place you trust.",
    mark: "vault",
  },
];

type FirstWeaveWalkthroughProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onComplete: () => void;
};

export function FirstWeaveWalkthrough({ open, onOpenChange, onComplete }: FirstWeaveWalkthroughProps) {
  const [step, setStep] = useState(0);
  const moment = moments[step];
  const isLast = step === moments.length - 1;

  function closeAndRemember() {
    setStep(0);
    onComplete();
  }

  function updateOpen(nextOpen: boolean) {
    if (!nextOpen) closeAndRemember();
    onOpenChange(nextOpen);
  }

  function moveForward() {
    if (isLast) {
      closeAndRemember();
      onOpenChange(false);
      return;
    }
    setStep((current) => current + 1);
  }

  return (
    <Dialog open={open} onOpenChange={updateOpen}>
      <DialogContent className="first-weave-dialog">
        <DialogHeader>
          <span className="eyebrow">A small field guide</span>
          <DialogTitle>{moment.title}</DialogTitle>
          <DialogDescription>{moment.copy}</DialogDescription>
        </DialogHeader>
        <div className={`first-weave-illustration ${moment.mark}`} aria-hidden="true">
          <i /><i /><i />
          {moment.mark === "vault" && <LockKeyhole size={19} />}
        </div>
        <div className="first-weave-progress" aria-label={`Step ${step + 1} of ${moments.length}`}>
          {moments.map((item, index) => <span key={item.eyebrow} className={index <= step ? "active" : ""} />)}
          <small>{moment.eyebrow}</small>
        </div>
        <DialogFooter>
          {step > 0 ? <Button type="button" variant="ghost" onClick={() => setStep((current) => current - 1)}><ArrowLeft size={14} /> Back</Button> : <Button type="button" variant="ghost" onClick={closeAndRemember}>Skip for now</Button>}
          <Button type="button" onClick={moveForward}>{isLast ? <><Check size={14} /> Begin the weave</> : <>Next thread <ArrowRight size={14} /></>}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
