import { createFileRoute } from "@tanstack/react-router";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { Send, Sparkles, Trash2, MessagesSquare, User } from "lucide-react";
import logo from "@/assets/logo.png";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { AiDisclaimer } from "@/components/ai-disclaimer";

export const Route = createFileRoute("/ai/chatbot")({
  head: () => ({ meta: [{ title: "AI Chatbot — Skhura's" }] }),
  component: ChatbotPage,
});

const suggestions = [
  "How can I improve customer service?",
  "Create a weekly menu.",
  "Recommend promotions for this weekend.",
  "How do I increase restaurant sales?",
  "Generate a social media campaign.",
  "Write an announcement for today's specials.",
];

function messageText(m: UIMessage) {
  return m.parts
    .map((p) => (p.type === "text" ? p.text : ""))
    .join("");
}

function ChatbotPage() {
  const [transport] = useState(() => new DefaultChatTransport({ api: "/api/chat" }));
  const { messages, sendMessage, status, setMessages } = useChat({ transport });
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const isLoading = status === "submitted" || status === "streaming";

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = (text: string) => {
    const value = text.trim();
    if (!value) return;
    setInput("");
    void sendMessage({ text: value });
  };

  return (
    <div className="mx-auto flex h-[calc(100vh-4rem)] max-w-[1000px] flex-col p-4 md:p-8">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-primary text-primary-foreground shadow-glow">
            <MessagesSquare className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-2xl font-black md:text-3xl">AI Chatbot</h1>
            <p className="text-xs text-muted-foreground">Your restaurant co-pilot</p>
          </div>
        </div>
        {messages.length > 0 && (
          <Button variant="outline" size="sm" onClick={() => setMessages([])} className="rounded-full">
            <Trash2 className="mr-1.5 h-3.5 w-3.5" /> Clear Chat
          </Button>
        )}
      </div>

      <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-soft">
        <div className="flex-1 overflow-y-auto p-4 md:p-6">
          {messages.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <img src={logo} alt="" className="mb-4 h-16 w-16 rounded-2xl bg-white p-2 shadow-soft" />
              <h2 className="text-2xl font-black">How can I help today?</h2>
              <p className="mt-1 text-sm text-muted-foreground">Try one of these prompts to get started</p>
              <div className="mt-6 grid w-full max-w-2xl gap-2 sm:grid-cols-2">
                {suggestions.map((s) => (
                  <button
                    key={s}
                    onClick={() => send(s)}
                    className="card-hover group rounded-2xl border border-border bg-background p-4 text-left text-sm transition"
                  >
                    <Sparkles className="mb-2 h-4 w-4 text-primary" />
                    <span className="font-medium">{s}</span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {messages.map((m) => {
                const text = messageText(m);
                return (
                  <div key={m.id} className={cn("flex gap-3", m.role === "user" ? "flex-row-reverse" : "")}>
                    <div className={cn(
                      "grid h-8 w-8 shrink-0 place-items-center rounded-full",
                      m.role === "user" ? "bg-secondary text-white" : "bg-primary text-primary-foreground",
                    )}>
                      {m.role === "user" ? <User className="h-4 w-4" /> : <Sparkles className="h-4 w-4" />}
                    </div>
                    <div className={cn(
                      "max-w-[80%] rounded-2xl px-4 py-3 text-sm",
                      m.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-foreground",
                    )}>
                      {m.role === "user" ? (
                        <p className="whitespace-pre-wrap">{text}</p>
                      ) : (
                        <div className="prose prose-sm max-w-none prose-p:my-1 prose-ul:my-2 prose-headings:mt-3 prose-headings:mb-1 prose-strong:text-foreground">
                          <ReactMarkdown>{text}</ReactMarkdown>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
              {isLoading && messages[messages.length - 1]?.role === "user" && (
                <div className="flex gap-3">
                  <div className="grid h-8 w-8 place-items-center rounded-full bg-primary text-primary-foreground">
                    <Sparkles className="h-4 w-4" />
                  </div>
                  <div className="rounded-2xl bg-muted px-4 py-3">
                    <div className="flex gap-1">
                      <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground" style={{ animationDelay: "0ms" }} />
                      <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground" style={{ animationDelay: "150ms" }} />
                      <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground" style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>
          )}
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            send(input);
          }}
          className="border-t border-border bg-background/50 p-3 backdrop-blur"
        >
          <div className="flex items-end gap-2 rounded-2xl border border-border bg-card p-2 focus-within:border-primary">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything about your restaurant…"
              className="flex-1 bg-transparent px-3 py-2 text-sm outline-none"
              autoFocus
            />
            <Button type="submit" disabled={isLoading || !input.trim()} size="icon" className="h-9 w-9 shrink-0 rounded-xl shadow-glow">
              <Send className="h-4 w-4" />
            </Button>
          </div>
          <AiDisclaimer text="AI-generated responses may be inaccurate. Verify important information before acting on it." />
        </form>
      </div>
    </div>
  );
}
