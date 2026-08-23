/**
 * THREADLOOM DESIGN REMINDER — Return logic must be editable, legible, and never pretend to know the user.
 */

import { CircleHelp, Eye, Settings2 } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import type { ResurfacingSettings, ThreadState } from "../domain";

type ResurfacingControlsProps = {
  settings: ResurfacingSettings;
  onChange: (next: ResurfacingSettings) => void;
};

const stateLabels: Record<ThreadState, string> = { open: "Open", resting: "Resting", resolved: "Woven in" };

function RuleHelp({ label, children }: { label: string; children: string }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button type="button" className="rule-help" aria-label={`Help: ${label}`}><CircleHelp size={13} /></button>
      </TooltipTrigger>
      <TooltipContent side="top" sideOffset={7} className="rule-help-content">{children}</TooltipContent>
    </Tooltip>
  );
}

export function ResurfacingControls({ settings, onChange }: ResurfacingControlsProps) {
  function toggleState(state: ThreadState) {
    const eligibleStates = settings.eligibleStates.includes(state)
      ? settings.eligibleStates.filter((current) => current !== state)
      : [...settings.eligibleStates, state];
    onChange({ ...settings, eligibleStates });
  }

  return (
    <details className="resurfacing-controls" open>
      <summary><Settings2 size={15} /> Transparent return rules <span>{settings.setSize} strands</span></summary>
      <div className="resurfacing-body">
        <p><Eye size={14} /> Threadloom only uses the rules below. It does not infer mood, relationships, or intent.</p>
        <fieldset>
          <legend>Eligible strands <RuleHelp label="eligible strands">Only checked strand states can appear in the return rail. Resolved strands stay out until you explicitly include them.</RuleHelp></legend>
          <div className="rule-checks">
            {(Object.keys(stateLabels) as ThreadState[]).map((state) => (
              <label key={state}><input type="checkbox" checked={settings.eligibleStates.includes(state)} onChange={() => toggleState(state)} /> {stateLabels[state]}</label>
            ))}
          </div>
        </fieldset>
        <div className="rule-selects">
          <label><span>Quiet interval <RuleHelp label="quiet interval">A strand must remain unvisited for this many days before Threadloom can offer it again.</RuleHelp></span>
            <select value={settings.minimumDaysSinceVisit} onChange={(event) => onChange({ ...settings, minimumDaysSinceVisit: Number(event.target.value) as ResurfacingSettings["minimumDaysSinceVisit"] })}>
              <option value="3">3 days</option><option value="7">7 days</option><option value="14">14 days</option><option value="30">30 days</option>
            </select>
          </label>
          <label><span>Return set <RuleHelp label="return set">This is the maximum number of suggestions shown at one time. It does not create reminders or notifications.</RuleHelp></span>
            <select value={settings.setSize} onChange={(event) => onChange({ ...settings, setSize: Number(event.target.value) as ResurfacingSettings["setSize"] })}>
              <option value="1">1 strand</option><option value="2">2 strands</option><option value="3">3 strands</option><option value="4">4 strands</option><option value="5">5 strands</option>
            </select>
          </label>
        </div>
        <label className="cue-rule"><input type="checkbox" checked={settings.includeCueBonus} onChange={() => onChange({ ...settings, includeCueBonus: !settings.includeCueBonus })} /> <span>Prefer strands with a return cue</span><RuleHelp label="return cue preference">When enabled, a strand with your own “return when…” note receives a small transparent priority boost.</RuleHelp></label>
      </div>
    </details>
  );
}
