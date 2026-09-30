import React, { useState } from 'react';
import { Copy, Check, Terminal } from 'lucide-react';

interface HeaderProps {
  flag: string;
  activeSection: string;
  setActiveSection: (section: string) => void;
  nodeHealth: 'active' | 'idle';
  lastInteractionTime: number;
}

export const Header: React.FC<HeaderProps> = ({
  flag,
  activeSection,
  setActiveSection,
  nodeHealth,
  lastInteractionTime,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(flag);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  const navLinks = [
    { id: 'telemetry', label: 'Flag Telemetry' },
    { id: 'validator', label: 'Response Validator' },
    { id: 'endpoints', label: 'API & Direct Access' },
    { id: 'prompts', label: 'Benchmark Prompts' },
    { id: 'entropy', label: 'Entropy & Spec' },
  ];

  const isActive = nodeHealth === 'active';

  return (
    <header className="sticky top-0 z-50 flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/90 backdrop-blur-md">
      {/* Zone 1: Single text element brand wordmark */}
      <div className="flex items-center gap-2.5">
        <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 ring-4 ring-cyan-500/20" />
        <a
          href="#telemetry"
          onClick={(e) => {
            e.preventDefault();
            setActiveSection('telemetry');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="text-base font-semibold tracking-tight text-white hover:text-cyan-400 transition-colors"
        >
          AI Benchmark Flag Node
        </a>
      </div>

      {/* Zone 2: 4-6 clean text navigation links with subtle hover */}
      <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-400">
        {navLinks.map((link) => {
          const isSectionActive = activeSection === link.id;
          return (
            <button
              key={link.id}
              onClick={() => {
                setActiveSection(link.id);
                const el = document.getElementById(link.id);
                if (el) {
                  el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
              }}
              className={`transition-colors text-xs uppercase tracking-wider ${
                isSectionActive ? 'text-cyan-400 font-semibold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {link.label}
            </button>
          );
        })}
      </nav>

      {/* Zone 3: 1-2 primary actions and Node Health Status */}
      <div className="flex items-center gap-3">
        {/* Node Health Status Indicator */}
        <div
          className="flex items-center gap-2 px-2.5 py-1 text-xs font-mono rounded bg-slate-900 border border-slate-800"
          title={`Node interaction health: ${isActive ? 'Active (recent interaction)' : 'Idle (standby)'}`}
        >
          <span
            className={`w-2 h-2 rounded-full transition-colors ${
              isActive
                ? 'bg-emerald-400 ring-2 ring-emerald-500/30 animate-pulse'
                : 'bg-slate-600'
            }`}
          />
          <span className="text-slate-400 text-[11px] whitespace-nowrap">
            Node Health:
            <strong
              className={`ml-1 uppercase ${
                isActive ? 'text-emerald-400 font-semibold' : 'text-slate-400 font-normal'
              }`}
            >
              {isActive ? 'ACTIVE' : 'IDLE'}
            </strong>
          </span>
        </div>

        <button
          onClick={handleCopy}
          className="flex items-center gap-2 px-3.5 py-1.5 text-xs font-mono font-medium text-slate-900 bg-cyan-400 rounded-md hover:bg-cyan-300 transition-colors whitespace-nowrap active:scale-95"
          title="Copy the 25-digit flag to clipboard"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-slate-950" />
              <span>Copied 25 Digits</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copy Flag (25)</span>
            </>
          )}
        </button>
      </div>
    </header>
  );
};
