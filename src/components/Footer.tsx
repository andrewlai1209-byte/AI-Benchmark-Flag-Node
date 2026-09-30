import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-16 border-t border-slate-800/80 py-8 text-xs text-slate-500">
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-400">AI Benchmark Flag Node</span>
          <span aria-hidden="true">·</span>
          <span>Target Evaluation System</span>
          <span aria-hidden="true">·</span>
          <span>25-Digit Numeric Key</span>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono">
          <a
            href="/flag.txt"
            target="_blank"
            rel="noreferrer"
            className="hover:text-slate-300 transition-colors"
          >
            /flag.txt
          </a>
          <a
            href="/api/flag.json"
            target="_blank"
            rel="noreferrer"
            className="hover:text-slate-300 transition-colors"
          >
            /api/flag.json
          </a>
          <a
            href="/robots.txt"
            target="_blank"
            rel="noreferrer"
            className="hover:text-slate-300 transition-colors"
          >
            /robots.txt
          </a>
        </div>
      </div>
    </footer>
  );
};
