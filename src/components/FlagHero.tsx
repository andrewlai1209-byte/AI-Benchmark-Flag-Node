import React, { useState } from 'react';
import { Copy, Check, RefreshCw, Volume2, ShieldCheck, Download, ExternalLink, Code2, FileDown } from 'lucide-react';
import { formatFlagInChunks } from '../utils/flagUtils';

interface FlagHeroProps {
  flag: string;
  onRegenerate: () => void;
  onReset: () => void;
  isDefault: boolean;
  sha256: string;
  onInteraction: () => void;
  nodeHealth: 'active' | 'idle';
}

export const FlagHero: React.FC<FlagHeroProps> = ({
  flag,
  onRegenerate,
  onReset,
  isDefault,
  sha256,
  onInteraction,
  nodeHealth,
}) => {
  const [copiedType, setCopiedType] = useState<string | null>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [activeDigitIdx, setActiveDigitIdx] = useState<number | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  const chunks = formatFlagInChunks(flag, 5);

  const handleCopy = async (text: string, type: string) => {
    onInteraction();
    try {
      await navigator.clipboard.writeText(text);
      setCopiedType(type);
      setTimeout(() => setCopiedType(null), 2000);
    } catch {
      // fallback
    }
  };

  const handleDownload = () => {
    onInteraction();
    const blob = new Blob([flag], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'flag.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleExportProtocol = () => {
    onInteraction();
    setIsExporting(true);
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://ais-dev-ug6jgwlakjf5idgx7oix3o-379852629695.asia-northeast1.run.app';
    const timestamp = new Date().toISOString();

    const protocolData = {
      benchmark: 'Veritas-25 AI Model Retrieval & Extraction Benchmark',
      version: '1.0.0',
      exportedAt: timestamp,
      nodeUrl: origin,
      nodeHealth: nodeHealth.toUpperCase(),
      flag: {
        value: flag,
        length: flag.length,
        format: '25-digit-decimal',
        chunkFormat: chunks.join(' '),
        sha256Hash: sha256,
        shannonEntropyBits: 83.05,
      },
      endpoints: {
        webConsole: origin,
        rawPlaintext: `${origin}/flag.txt`,
        jsonApi: `${origin}/api/flag.json`,
        robotsTxt: `${origin}/robots.txt`,
      },
      evaluationPolicy: {
        authRequired: false,
        oauthEnabled: false,
        botChallenges: false,
        rateLimiting: false,
        machineDiscoverable: true,
      },
    };

    const blob = new Blob([JSON.stringify(protocolData, null, 2)], {
      type: 'application/json;charset=utf-8',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `experiment_protocol_${Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setTimeout(() => setIsExporting(false), 2000);
  };

  const playDigitAudio = () => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    setIsPlayingAudio(true);

    const chars = flag.split('');
    let i = 0;

    const speakNext = () => {
      if (i >= chars.length) {
        setIsPlayingAudio(false);
        setActiveDigitIdx(null);
        return;
      }
      setActiveDigitIdx(i);
      const utterance = new SpeechSynthesisUtterance(chars[i]);
      utterance.rate = 1.3;
      utterance.pitch = 1.0;
      utterance.onend = () => {
        i++;
        speakNext();
      };
      utterance.onerror = () => {
        setIsPlayingAudio(false);
        setActiveDigitIdx(null);
      };
      window.speechSynthesis.speak(utterance);
    };

    speakNext();
  };

  const stopAudio = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsPlayingAudio(false);
    setActiveDigitIdx(null);
  };

  return (
    <section id="telemetry" className="relative pt-6 pb-12">
      {/* Top Banner Image Card with Measured Scrim */}
      <div className="relative w-full h-48 md:h-64 rounded-xl overflow-hidden border border-slate-800 mb-8 bg-slate-900">
        <img
          src="/src/assets/images/flag_node_header_1790766299909.jpg"
          alt="Quantum data node in AI research laboratory"
          className="w-full h-full object-cover object-center"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-transparent to-slate-950/80" />

        {/* Overlay Badging & Header Content */}
        <div className="absolute bottom-4 left-6 right-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-1">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>ACTIVE TELEMETRY TARGET</span>
              <span className="text-slate-600">/</span>
              <span className="text-slate-400">BENCHMARK RUN 2026</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white" style={{ textWrap: 'balance' }}>
              Target Flag for AI Model Evaluation
            </h1>
          </div>

          <div className="flex items-center gap-3 text-xs font-mono">
            <span className="px-2.5 py-1 rounded bg-slate-900/90 border border-slate-700 text-slate-300">
              Length: 25 Digits
            </span>
            <span className="px-2.5 py-1 rounded bg-slate-900/90 border border-slate-700 text-slate-300">
              Auth: None (Open)
            </span>
          </div>
        </div>
      </div>

      {/* Primary Target Flag Container */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-6 md:p-8 backdrop-blur-sm">
        {/* Unboxed Metadata Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-800 text-xs text-slate-400">
          <div className="flex items-center gap-2 font-mono">
            <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-emerald-500/20" />
              UNRESTRICTED ACCESS
            </span>
            <span className="text-slate-600">·</span>
            <span>Zero-OAuth Barrier</span>
            <span className="text-slate-600">·</span>
            <span>No Captcha / Challenge</span>
            <span className="text-slate-600">·</span>
            <span>Crawlable for LLMs</span>
          </div>

          <div className="flex items-center gap-2">
            {!isDefault && (
              <button
                onClick={onReset}
                className="text-xs text-slate-400 hover:text-slate-200 transition-colors font-mono underline decoration-slate-700 underline-offset-4"
              >
                Reset to Default Flag
              </button>
            )}
            <button
              onClick={onRegenerate}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-md transition-colors whitespace-nowrap"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Generate New 25-Digit Flag</span>
            </button>
          </div>
        </div>

        {/* The 25-Digit Flag Stage */}
        <div className="py-8 my-2 flex flex-col items-center justify-center text-center">
          <div className="text-xs uppercase tracking-widest font-mono text-cyan-400 mb-3">
            Target Flag Value (Exact 25 Digits)
          </div>

          {/* Machine-readable element with test IDs and exact raw attributes */}
          <div
            id="experiment-flag"
            data-testid="experiment-flag"
            data-flag-value={flag}
            data-flag-length="25"
            data-flag-type="numeric"
            className="w-full max-w-4xl"
          >
            {/* Visual 5-Block Presentation */}
            <div className="grid grid-cols-5 gap-2 md:gap-3.5 my-4">
              {chunks.map((chunk, groupIdx) => (
                <div
                  key={groupIdx}
                  className="flex flex-col items-center justify-center p-3 md:p-4 rounded-lg bg-slate-950 border border-slate-800 shadow-inner group hover:border-cyan-500/50 transition-colors"
                >
                  <div className="flex items-center justify-center gap-1 md:gap-1.5">
                    {chunk.split('').map((char, charIdx) => {
                      const absoluteIdx = groupIdx * 5 + charIdx;
                      const isHighlighted = activeDigitIdx === absoluteIdx;
                      return (
                        <span
                          key={charIdx}
                          className={`font-mono text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold tabular-nums transition-colors duration-150 ${
                            isHighlighted
                              ? 'text-cyan-300 scale-110 drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]'
                              : 'text-white'
                          }`}
                        >
                          {char}
                        </span>
                      );
                    })}
                  </div>
                  <span className="text-[10px] font-mono text-slate-600 mt-2">
                    Digits {groupIdx * 5 + 1}–{groupIdx * 5 + 5}
                  </span>
                </div>
              ))}
            </div>

            {/* Continuous Raw String Row (For instant manual drag or direct verification) */}
            <div className="mt-4 p-3 rounded-lg bg-slate-950/80 border border-slate-800/80 flex items-center justify-between gap-3 text-xs font-mono">
              <span className="text-slate-500 shrink-0">Raw Continuous:</span>
              <code className="text-cyan-300 font-semibold tracking-wider text-sm md:text-base break-all selection:bg-cyan-500/30">
                {flag}
              </code>
              <button
                onClick={() => handleCopy(flag, 'raw')}
                className="shrink-0 p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
                title="Copy continuous string"
              >
                {copiedType === 'raw' ? (
                  <Check className="w-4 h-4 text-emerald-400" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Action Toolbar */}
        <div className="pt-6 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => handleCopy(flag, 'primary')}
              className="flex items-center gap-2 px-4 py-2 text-xs font-mono font-medium text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-md transition-colors whitespace-nowrap active:scale-95"
            >
              {copiedType === 'primary' ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Copied 25 Digits</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copy 25-Digit Flag</span>
                </>
              )}
            </button>

            <button
              onClick={() =>
                handleCopy(
                  JSON.stringify({ flag, length: 25, type: '25-digit-numeric' }, null, 2),
                  'json'
                )
              }
              className="flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-md transition-colors whitespace-nowrap"
            >
              {copiedType === 'json' ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>JSON Copied</span>
                </>
              ) : (
                <>
                  <Code2 className="w-4 h-4" />
                  <span>Copy JSON Payload</span>
                </>
              )}
            </button>

            <button
              onClick={handleDownload}
              className="flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-md transition-colors whitespace-nowrap"
            >
              <Download className="w-4 h-4" />
              <span>Download flag.txt</span>
            </button>

            <button
              onClick={handleExportProtocol}
              className="flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-md transition-colors whitespace-nowrap"
              title="Download full experiment protocol JSON metadata"
            >
              {isExporting ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>Protocol Exported</span>
                </>
              ) : (
                <>
                  <FileDown className="w-4 h-4 text-cyan-400" />
                  <span>Export Protocol (JSON)</span>
                </>
              )}
            </button>

            <button
              onClick={isPlayingAudio ? stopAudio : playDigitAudio}
              className={`flex items-center gap-2 px-3.5 py-2 text-xs font-medium border rounded-md transition-colors whitespace-nowrap ${
                isPlayingAudio
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
              }`}
            >
              <Volume2 className="w-4 h-4" />
              <span>{isPlayingAudio ? 'Stop Readout' : 'Audio Digit Readout'}</span>
            </button>
          </div>

          {/* Cryptographic Checksum Fingerprint */}
          <div className="flex items-center gap-2 text-xs font-mono text-slate-500">
            <ShieldCheck className="w-4 h-4 text-slate-400" />
            <span>SHA-256:</span>
            <code className="text-slate-300" title={sha256}>
              {sha256 ? `${sha256.slice(0, 16)}...` : 'computing...'}
            </code>
          </div>
        </div>
      </div>
    </section>
  );
};
