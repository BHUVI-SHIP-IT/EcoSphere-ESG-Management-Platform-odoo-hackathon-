"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/shared/page-header";
import { Icon } from "@/components/icon";
import { copilotSample, copilotSuggestions } from "@/lib/mock";
import type { CopilotCitation, CopilotMessage } from "@/lib/types";
import { cn } from "@/lib/utils";

const citationIcon: Record<CopilotCitation["kind"], string> = {
  policy: "scroll-text",
  audit: "file-search",
  compliance: "shield-alert",
};

function CitationCard({ c }: { c: CopilotCitation }) {
  return (
    <div className="rounded-lg border bg-background p-2.5">
      <div className="flex items-center gap-1.5">
        <Icon name={citationIcon[c.kind]} className="h-3.5 w-3.5 text-primary" />
        <span className="text-xs font-semibold">{c.title}</span>
        <Badge variant="outline" className="ml-auto text-[9px] capitalize">{c.kind}</Badge>
      </div>
      <p className="mt-1 line-clamp-2 text-[11px] text-muted-foreground">&ldquo;{c.snippet}&rdquo;</p>
    </div>
  );
}

export default function CopilotPage() {
  const [messages, setMessages] = useState<CopilotMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  async function ask(q: string) {
    if (!q.trim() || loading) return;
    
    const userMsg: CopilotMessage = { id: `u-${messages.length}-${Date.now()}`, role: "user", content: q };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/copilot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: q }),
      });

      if (!res.ok) {
        throw new Error(await res.text());
      }

      const answer = await res.json();
      const assistantMsg: CopilotMessage = {
        id: `a-${messages.length}-${Date.now()}`,
        role: "assistant",
        content: answer.content,
        citations: answer.citations,
      };
      
      setMessages((m) => [...m, assistantMsg]);
    } catch (err: any) {
      console.error(err);
      const errorMsg: CopilotMessage = {
        id: `err-${messages.length}`,
        role: "assistant",
        content: "Sorry, I encountered an error while processing your request. Please check that your database is available and that the API key is configured.",
      };
      setMessages((m) => [...m, errorMsg]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <PageHeader
        title="ESG Compliance Copilot"
        description="Ask your ESG data in natural language. Answers are grounded in live policies, audits and compliance records — with citations."
      />

      <Card className="flex h-[calc(100vh-15rem)] flex-col">
        <CardContent className="flex flex-1 flex-col gap-4 overflow-y-auto p-5">
          {messages.length === 0 ? (
            <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/12 text-primary">
                <Icon name="sparkles" className="h-7 w-7" />
              </span>
              <div>
                <p className="font-medium">Ask anything about your ESG posture</p>
                <p className="text-sm text-muted-foreground">Grounded in your organisation&rsquo;s own records — not a generic chatbot.</p>
              </div>
              <div className="flex flex-wrap justify-center gap-2">
                {copilotSuggestions.map((s) => (
                  <button
                    key={s}
                    onClick={() => ask(s)}
                    disabled={loading}
                    className="rounded-full border bg-card px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground disabled:opacity-50"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((m) => (
                <div key={m.id} className={cn("flex gap-3", m.role === "user" && "justify-end")}>
                  {m.role === "assistant" && (
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/12 text-primary">
                      <Icon name="sparkles" className="h-4 w-4" />
                    </span>
                  )}
                  <div className={cn("max-w-[80%] space-y-2", m.role === "user" && "order-first")}>
                    <div
                      className={cn(
                        "rounded-2xl px-4 py-2.5 text-sm leading-relaxed",
                        m.role === "user"
                          ? "bg-[var(--accent)] text-[#0a0f0d] font-medium"
                          : "border border-[var(--border)] bg-[var(--bg-card)]",
                      )}
                    >
                      <p className="whitespace-pre-line">{m.content}</p>
                    </div>
                    {m.citations && m.citations.length > 0 && (
                      <div className="space-y-1.5">
                        <p className="text-[11px] font-medium text-muted-foreground">Sources</p>
                        <div className="grid gap-1.5 sm:grid-cols-2">
                          {m.citations.map((c, idx) => (
                            <CitationCard key={idx} c={c} />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex gap-3">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/12 text-primary animate-pulse">
                    <Icon name="sparkles" className="h-4 w-4" />
                  </span>
                  <div className="border border-[var(--border)] bg-[var(--bg-card)] rounded-2xl px-4 py-2.5 text-sm text-muted-foreground flex items-center gap-1">
                    <span className="h-2 w-2 rounded-full bg-[var(--accent)] animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="h-2 w-2 rounded-full bg-[var(--accent)] animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="h-2 w-2 rounded-full bg-[var(--accent)] animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>

        <div className="border-t border-[var(--border)] p-3">
          <form
            className="flex gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              ask(input);
            }}
          >
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about policies, audits, compliance issues…"
              disabled={loading}
              className="border-[var(--border)] bg-[var(--bg-card)] text-sm"
            />
            <Button type="submit" disabled={!input.trim() || loading}>
              <Icon name="sparkles" className="h-4 w-4" /> {loading ? "Thinking..." : "Ask"}
            </Button>
          </form>
          <p className="mt-1.5 px-1 text-[11px] text-muted-foreground">
            Compliance RAG grounded directly in live database policies, audits, and compliance records.
          </p>
        </div>
      </Card>
    </>
  );
}
