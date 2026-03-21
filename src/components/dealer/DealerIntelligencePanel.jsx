import React, { useState } from "react";

const DEFAULT_PROMPT = `You are Dealer Intelligence, an AI analyst for art dealers, galleries, and collectors.
You analyze inventory, pricing, and market fit for works in the Facinations vault.

For each request, respond with:
- A quick diagnosis of the dealer's situation
- 2–3 specific opportunities (pricing, positioning, curation)
- 1 suggested experiment that could be run this week
Use clear headings and short paragraphs.`;

export function DealerIntelligencePanel() {
  const [dealerContext, setDealerContext] = useState("");
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState("");
  const [error, setError] = useState("");

  async function runAnalysis(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setAnalysis("");

    try {
      const response = await fetch("/api/claude/v1/messages", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          model: "claude-3-5-sonnet-20241022",
          max_tokens: 900,
          temperature: 0.4,
          system: DEFAULT_PROMPT,
          messages: [
            {
              role: "user",
              content: [
                {
                  type: "text",
                  text:
                    "Dealer context:\n\n" +
                    dealerContext +
                    "\n\nReturn a concise, structured analysis with headings: Situation, Opportunities, Experiment.",
                },
              ],
            },
          ],
        }),
      });

      const textBody = await response.text();

      if (!response.ok) {
        throw new Error(`Claude API error ${response.status}: ${textBody}`);
      }

      const data = JSON.parse(textBody);

      const contentBlocks = data?.content ?? [];
      const text = contentBlocks
        .filter((b) => b.type === "text" && typeof b.text === "string")
        .map((b) => b.text)
        .join("\n\n");

      setAnalysis(text || JSON.stringify(data, null, 2));
    } catch (err) {
      console.error(err);
      setError(err.message || "Dealer Intelligence request failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="mt-8 rounded-xl border border-slate-800 bg-slate-950/60 p-4 sm:p-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-slate-50">
            Dealer Intelligence
          </h2>
          <p className="text-xs text-slate-400">
            Describe a dealer, gallery, or collection. Dealer Intelligence will
            respond with opportunities and one concrete experiment.
          </p>
        </div>
        <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-medium text-emerald-300">
          Claude‑powered
        </span>
      </div>

      <form onSubmit={runAnalysis} className="mt-4 space-y-3">
        <label className="block text-xs font-medium text-slate-300">
          Dealer / collection context
          <textarea
            className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900/70 px-3 py-2 text-sm text-slate-50 outline-none ring-0 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/70"
            rows={5}
            placeholder={`Example:
- Primary: emerging contemporary gallery in Brooklyn
- Inventory: 40 works (paintings, video, sculpture)
- Avg. price: $4K
- Current challenge: moving mid‑tier works; collectors hesitate above $6K
- Goal: design one 6‑week experiment to test new pricing / curation`}
            value={dealerContext}
            onChange={(e) => setDealerContext(e.target.value)}
            required
          />
        </label>

        <div className="flex items-center justify-between gap-3">
          <button
            type="submit"
            disabled={loading || !dealerContext.trim()}
            className="inline-flex items-center rounded-lg bg-emerald-500 px-3 py-1.5 text-xs font-semibold text-slate-950 shadow-sm transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:bg-slate-600"
          >
            {loading ? "Analyzing…" : "Run Dealer Intelligence"}
          </button>
          <p className="text-[11px] text-slate-500">
            Your description stays within Facinations; only summary context is
            sent to Claude.
          </p>
        </div>
      </form>

      <div className="mt-4">
        {error && (
          <div className="mb-3 rounded-md border border-red-700 bg-red-950/40 px-3 py-2 text-xs text-red-200">
            {error}
          </div>
        )}

        {analysis && (
          <div className="rounded-lg border border-slate-800 bg-slate-900/70 p-3 text-sm leading-relaxed text-slate-100">
            {analysis.split("\n").map((line, i) => (
              <p key={i} className="mb-1">
                {line}
              </p>
            ))}
          </div>
        )}

        {!analysis && !error && (
          <p className="text-[11px] text-slate-500">
            Example prompts: “Analyze our March fair booth plan”, “We have 12
            works stuck above $8K”, “We want to test an online‑only viewing
            room for secondary works”.
          </p>
        )}
      </div>
    </section>
  );
}


