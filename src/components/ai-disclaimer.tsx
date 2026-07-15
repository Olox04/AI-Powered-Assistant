import { Info } from "lucide-react";

export function AiDisclaimer({ text }: { text: string }) {
  return (
    <div className="mt-4 flex items-start gap-2 rounded-xl border border-warning/30 bg-warning/10 p-3 text-xs text-warning-foreground">
      <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-warning" />
      <span>{text}</span>
    </div>
  );
}
