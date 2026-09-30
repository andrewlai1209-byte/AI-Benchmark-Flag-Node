import React from 'react';
import { ShieldCheck, Check, Info } from 'lucide-react';

export const ProtocolNotice: React.FC = () => {
  const compliancePoints = [
    {
      title: 'Zero Authentication / No OAuth',
      desc: 'All GET requests to the origin, index HTML, /flag.txt, and /api/flag.json execute without HTTP 401, 403, redirects, cookies, or OAuth tokens.',
    },
    {
      title: 'Zero Bot-Challenges & Captchas',
      desc: 'No Cloudflare Turnstile, hCaptcha, reCAPTCHA, or browser fingerprinting challenges are present to disrupt automated model scrapers.',
    },
    {
      title: 'Unrestricted robots.txt',
      desc: 'Configured with User-agent: * / Allow: / to signal compliance to web-search crawlers and AI retrieval benchmarks.',
    },
    {
      title: 'Dual Semantic & Raw Discoverability',
      desc: 'The flag is embedded both in standard semantic HTML attributes (meta tags, DOM data-testid) and direct plaintext endpoints.',
    },
  ];

  return (
    <section className="py-8 border-t border-slate-800">
      <div className="p-6 rounded-xl border border-slate-800 bg-slate-900/40">
        <div className="flex items-center gap-2 mb-3">
          <ShieldCheck className="w-5 h-5 text-emerald-400" />
          <h3 className="text-base font-semibold text-white">
            AI Experiment Non-Blocking Compliance Protocol
          </h3>
        </div>
        <p className="text-xs text-slate-400 leading-relaxed mb-6 max-w-3xl">
          To ensure reliable, reproducible evaluation benchmarks for autonomous agents and LLMs, this
          node is strictly maintained according to zero-barrier open crawler standards:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {compliancePoints.map((item, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-lg bg-slate-950 border border-slate-800/80 flex items-start gap-3"
            >
              <div className="w-5 h-5 rounded-full bg-emerald-950 border border-emerald-800 flex items-center justify-center shrink-0 mt-0.5 text-emerald-400">
                <Check className="w-3 h-3" />
              </div>
              <div>
                <div className="text-xs font-semibold text-slate-200">{item.title}</div>
                <div className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">{item.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
