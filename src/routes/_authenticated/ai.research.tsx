import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { Copy, Download, RefreshCw, Sparkles, BookOpenText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { generateResearch } from "@/lib/ai.functions";
import { AiDisclaimer } from "@/components/ai-disclaimer";
import { toast } from "sonner";

export const Route = createFileRoute("/ai/research")({
  head: () => ({ meta: [{ title: "AI Research Assistant — Skhura's" }] }),
  component: ResearchPage,
});

function ResearchPage() {
  const gen = useServerFn(generateResearch);
  const [topic, setTopic] = useState("");
  const [output, setOutput] = useState("");
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  const run = async () => {
    if (!topic.trim()) {
      toast.error("Please enter a research topic");
      return;
    }
    setLoading(true);
    try {
      const { text } = await gen({ data: { topic } });
      setOutput(text);
    } catch (e) {
      toast.error("Failed to research topic");
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
    const blob = new Blob([output], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "skhura-research.md";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="mx-auto max-w-[1200px] p-4 md:p-8">
      <div className="mb-6 flex items-center gap-3">
        <div className="grid h-12 w-12 place-items-center rounded-2xl bg-primary text-primary-foreground shadow-glow">
          <BookOpenText className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-3xl font-black md:text-4xl">AI Research Assistant</h1>
          <p className="text-sm text-muted-foreground">Get instant summaries, insights and recommendations.</p>
        </div>
      </div>

      <section className="rounded-2xl border border-border bg-card p-6 shadow-soft">
        <label className="mb-1.5 block text-sm font-semibold">Research topic</label>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Input
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && run()}
            placeholder="e.g. Trends in South African fast food industry"
            className="h-12 flex-1 rounded-xl"
          />
          <Button onClick={run} disabled={loading} className="h-12 rounded-xl px-6 shadow-glow">
            {loading ? <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
            {loading ? "Researching…" : "Research"}
          </Button>
        </div>
      </section>

      <section className="mt-6 rounded-2xl border border-border bg-card p-6 shadow-soft">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Findings</h2>
          {output && (
            <div className="flex gap-1">
              <Button size="sm" variant="ghost" onClick={() => setEditing((v) => !v)}>
                {editing ? "Preview" : "Edit"}
              </Button>
              <Button size="sm" variant="ghost" onClick={copy}><Copy className="mr-1.5 h-3.5 w-3.5" />Copy</Button>
              <Button size="sm" variant="ghost" onClick={download}><Download className="mr-1.5 h-3.5 w-3.5" />Export</Button>
              <Button size="sm" variant="ghost" onClick={run} disabled={loading}><RefreshCw className="mr-1.5 h-3.5 w-3.5" />Regenerate</Button>
            </div>
          )}
        </div>

        {loading && !output ? (
          <div className="space-y-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-4 animate-pulse rounded bg-muted" style={{ width: `${60 + Math.random() * 40}%` }} />
            ))}
          </div>
        ) : output ? (
          editing ? (
            <Textarea value={output} onChange={(e) => setOutput(e.target.value)} rows={22} className="rounded-xl font-mono text-sm" />
          ) : (
            <div className="prose prose-sm max-w-none prose-headings:font-black prose-headings:tracking-tight prose-h2:text-primary prose-h2:mt-6 prose-h2:mb-2 prose-h2:text-lg prose-strong:text-foreground prose-ul:my-2">
              <ReactMarkdown>{output}</ReactMarkdown>
            </div>
          )
        ) : (
          <div className="grid min-h-[300px] place-items-center rounded-xl border border-dashed border-border">
            <div className="text-center text-muted-foreground">
              <BookOpenText className="mx-auto mb-2 h-8 w-8 opacity-30" />
              <p className="text-sm">Enter a topic to get a full research brief</p>
            </div>
          </div>
        )}
        <AiDisclaimer text="AI-generated summaries should be verified before making important decisions." />
      </section>
    </div>
  );
}
