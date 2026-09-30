import React, { useState } from 'react';
import { MessageSquareText, Copy, Check, Sparkles } from 'lucide-react';

interface PromptTemplatesProps {
  flag: string;
}

export const PromptTemplates: React.FC<PromptTemplatesProps> = ({ flag }) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://ais-dev-ug6jgwlakjf5idgx7oix3o-379852629695.asia-northeast1.run.app';

  const templates = [
    {
      id: 'strict-zeroshot',
      title: 'Zero-Shot Strict Extraction',
      badge: 'Zero-Shot',
      description: 'Tests if the model can navigate the site and output strictly the 25-digit flag without conversational fluff.',
      promptText: `Access the website at: ${origin}
Locate the target experiment flag. The flag is a random 25-digit decimal number.
Return ONLY the exact 25-digit number with no spaces, no punctuation, and no conversational preface or explanation.`,
    },
    {
      id: 'tool-calling',
      title: 'Autonomous Web Agent / Tool Calling',
      badge: 'Agent Navigation',
      description: 'Tests an agent capable of using browser or curl tools to locate either the web page or raw /flag.txt endpoint.',
      promptText: `You are an automated evaluation agent.
Your objective is to inspect ${origin} and retrieve the benchmark flag.
Requirements:
1. The flag consists of exactly 25 numeric digits.
2. Confirm the exact count of digits is 25 before returning.
3. Output your final answer in the format: FLAG=<25_DIGITS>`,
    },
    {
      id: 'api-discovery',
      title: 'Endpoint & Raw File Discovery',
      badge: 'API Discovery',
      description: 'Tests if the model checks standard locations like /flag.txt or /api/flag.json for headless retrieval.',
      promptText: `Query the target node at ${origin}
Find the 25-digit numerical experiment flag by directly requesting its raw or API endpoints (e.g. /flag.txt or /api/flag.json) or parsing the HTML.
Return a valid JSON object matching: {"flag": "25_digit_string_here"}`,
    },
    {
      id: 'resilient-ocr',
      title: 'Multi-Modal / Visual Extraction',
      badge: 'Multimodal',
      description: 'For vision-enabled models taking a screenshot or rendering of the page.',
      promptText: `Examine the provided web page at ${origin}
Read the 5-block numerical display containing the target experiment flag.
Concatenate the 5 blocks together into a single continuous 25-digit sequence and output it.`,
    },
  ];

  const handleCopy = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      // fallback
    }
  };

  return (
    <section id="prompts" className="py-8 border-t border-slate-800">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
        <div>
          <div className="text-xs uppercase tracking-widest font-mono text-cyan-400 mb-1">
            Experiment Protocols
          </div>
          <h2 className="text-xl md:text-2xl font-bold tracking-tight text-white">
            AI Model Benchmark Prompt Templates
          </h2>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            Pre-configured instruction prompts ready to feed into LLMs (Gemini, Claude, GPT, DeepSeek, etc.)
            to test their autonomous retrieval, parsing, and formatting capabilities.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {templates.map((tpl) => (
          <div
            key={tpl.id}
            className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-sm font-semibold text-white">{tpl.title}</span>
                <span className="text-[10px] font-mono text-cyan-300 px-2 py-0.5 rounded bg-cyan-950/60 border border-cyan-800/60">
                  {tpl.badge}
                </span>
              </div>
              <p className="text-xs text-slate-400 mb-4">{tpl.description}</p>

              <div className="relative">
                <pre className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono text-slate-300 whitespace-pre-wrap leading-relaxed">
                  {tpl.promptText}
                </pre>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
              <span className="text-[11px] font-mono text-slate-500">
                Target: {origin.replace('https://', '').slice(0, 30)}...
              </span>
              <button
                onClick={() => handleCopy(tpl.promptText, tpl.id)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-900 bg-cyan-400 hover:bg-cyan-300 rounded-md transition-colors font-mono"
              >
                {copiedId === tpl.id ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Copied Prompt</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Prompt</span>
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
