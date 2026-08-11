import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { Copy, Download, RefreshCw, Sparkles, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { generateEmail } from "@/lib/ai.functions";
import { AiDisclaimer } from "@/components/ai-disclaimer";
import { toast } from "sonner";

export const Route = createFileRoute("/ai/email")({
  head: () => ({ meta: [{ title: "Smart Email Generator — Skhura's" }] }),
  component: EmailPage,
});

type Tone = "Formal" | "Friendly" | "Persuasive" | "Professional";

function EmailPage() {
  const gen = useServerFn(generateEmail);
  const [topic, setTopic] = useState("");
  const [tone, setTone] = useState<Tone>("Professional");
  const [context, setContext] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const run = async () => {
    if (!topic.trim()) {
      toast.error("Please describe what your email is about");
      return;
    }
    setLoading(true);
    try {
      const { text } = await gen({ data: { topic, tone, context } });
      setOutput(text);
    } catch (e) {
      toast.error("Failed to generate email");
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const copy = () => {
    navigator.clipboard.writeText(output);
    toast.success("Copied to clipboard");
  };
  const download = () => {
    const blob = new Blob([output], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "skhura-email.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="mx-auto max-w-[1200px] p-4 md:p-8">
      <div className="mb-6 flex items-center gap-3">
        <div className="grid h-12 w-12 place-items-center rounded-2xl bg-primary text-primary-foreground shadow-glow">
          <Mail className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-3xl font-black md:text-4xl">Smart Email Generator</h1>
          <p className="text-sm text-muted-foreground">Draft professional emails in seconds.</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-border bg-card p-6 shadow-soft">
          <h2 className="mb-4 text-sm font-bold uppercase tracking-widest text-muted-foreground">Input</h2>
          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-semibold">What is your email about?</label>
              <Input value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="e.g. Announce new Signature Burger" className="h-11 rounded-xl" />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-semibold">Tone</label>
              <Select value={tone} onValueChange={(v) => setTone(v as Tone)}>
                <SelectTrigger className="h-11 rounded-xl"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Formal">Formal</SelectItem>
                  <SelectItem value="Friendly">Friendly</SelectItem>
                  <SelectItem value="Persuasive">Persuasive</SelectItem>
                  <SelectItem value="Professional">Professional</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-semibold">Additional context</label>
              <Textarea value={context} onChange={(e) => setContext(e.target.value)} rows={5} placeholder="Audience, key points, deadline…" className="rounded-xl" />
            </div>
            <Button onClick={run} disabled={loading} className="h-12 w-full rounded-xl text-base shadow-glow">
              {loading ? <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
              {loading ? "Generating…" : "Generate Email"}
            </Button>
          </div>
        </section>

        <section className="rounded-2xl border border-border bg-card p-6 shadow-soft">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Output</h2>
            {output && (
              <div className="flex gap-1">
                <Button size="sm" variant="ghost" onClick={copy}><Copy className="mr-1.5 h-3.5 w-3.5" />Copy</Button>
                <Button size="sm" variant="ghost" onClick={download}><Download className="mr-1.5 h-3.5 w-3.5" />Download</Button>
                <Button size="sm" variant="ghost" onClick={run} disabled={loading}><RefreshCw className="mr-1.5 h-3.5 w-3.5" />Regenerate</Button>
              </div>
            )}
          </div>
          {output ? (
            <Textarea value={output} onChange={(e) => setOutput(e.target.value)} rows={18} className="rounded-xl font-mono text-sm leading-relaxed" />
          ) : (
            <div className="grid min-h-[400px] place-items-center rounded-xl border border-dashed border-border">
              <div className="text-center text-muted-foreground">
                <Sparkles className="mx-auto mb-2 h-8 w-8 opacity-30" />
                <p className="text-sm">Your generated email will appear here</p>
              </div>
            </div>
          )}
          <AiDisclaimer text="AI-generated content may contain mistakes. Please review before sending." />
        </section>
      </div>
    </div>
  );
}
