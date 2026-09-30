import React, { useState } from 'react';
import { BarChart3, Binary, KeyRound, Check, AlertCircle } from 'lucide-react';
import { getDigitDistribution } from '../utils/flagUtils';

interface FlagInspectorProps {
  flag: string;
  onSetCustomFlag: (custom: string) => boolean;
}

export const FlagInspector: React.FC<FlagInspectorProps> = ({ flag, onSetCustomFlag }) => {
  const [customInput, setCustomInput] = useState('');
  const [customError, setCustomError] = useState<string | null>(null);
  const [customSuccess, setCustomSuccess] = useState(false);

  const distribution = getDigitDistribution(flag);
  const maxCount = Math.max(...Object.values(distribution), 1);

  const handleApplyCustom = (e: React.FormEvent) => {
    e.preventDefault();
    setCustomError(null);
    setCustomSuccess(false);

    const cleaned = customInput.trim().replace(/\D/g, '');
    if (cleaned.length !== 25) {
      setCustomError(`Flag must be exactly 25 digits. You provided ${cleaned.length} digits.`);
      return;
    }

    const ok = onSetCustomFlag(cleaned);
    if (ok) {
      setCustomSuccess(true);
      setCustomInput('');
      setTimeout(() => setCustomSuccess(false), 3000);
    }
  };

  return (
    <section id="entropy" className="py-8 border-t border-slate-800">
      <div className="mb-6">
        <div className="text-xs uppercase tracking-widest font-mono text-cyan-400 mb-1">
          Cryptographic & Empirical Analysis
        </div>
        <h2 className="text-xl md:text-2xl font-bold tracking-tight text-white">
          Flag Properties & Custom Seeding
        </h2>
        <p className="text-sm text-slate-400 mt-1 max-w-2xl">
          Detailed cryptographic metrics of the 25-digit experimental target, including digit
          distribution and custom benchmark key injection.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Metric Cards & Digit Distribution */}
        <div className="lg:col-span-7 space-y-5">
          {/* Key Metric Blocks */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60">
              <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400">
                Total Digits
              </span>
              <div className="text-2xl font-bold font-mono tabular-nums text-white mt-1">25</div>
              <span className="text-[10px] text-slate-500 font-mono">100% Decimal</span>
            </div>

            <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60">
              <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400">
                Key Space ($10^{25}$)
              </span>
              <div className="text-2xl font-bold font-mono tabular-nums text-cyan-400 mt-1">
                10 Septillion
              </div>
              <span className="text-[10px] text-slate-500 font-mono">10^25 states</span>
            </div>

            <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60">
              <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400">
                Shannon Entropy
              </span>
              <div className="text-2xl font-bold font-mono tabular-nums text-emerald-400 mt-1">
                83.05
              </div>
              <span className="text-[10px] text-slate-500 font-mono">Bits of entropy</span>
            </div>
          </div>

          {/* Digit Frequency Histogram */}
          <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/60">
            <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-4">
              <span className="flex items-center gap-1.5 text-slate-300">
                <BarChart3 className="w-4 h-4 text-cyan-400" />
                Digit Frequency Distribution (0–9)
              </span>
              <span>Total: 25 counts</span>
            </div>

            <div className="grid grid-cols-10 gap-2 h-32 items-end pt-4">
              {Object.entries(distribution).map(([digit, count]) => {
                const heightPct = (count / maxCount) * 100;
                return (
                  <div key={digit} className="flex flex-col items-center h-full justify-end group">
                    <span className="text-[10px] font-mono text-slate-500 mb-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      {count}
                    </span>
                    <div
                      style={{ height: `${Math.max(12, heightPct)}%` }}
                      className={`w-full rounded-t transition-all ${
                        count > 0
                          ? 'bg-cyan-500/30 group-hover:bg-cyan-400 border-t border-cyan-400'
                          : 'bg-slate-800'
                      }`}
                    />
                    <span className="text-xs font-mono font-bold text-slate-300 mt-2 border-t border-slate-800 w-full text-center pt-1">
                      {digit}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Custom Flag Seeding Form */}
        <div className="lg:col-span-5">
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 h-full flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <KeyRound className="w-4 h-4 text-cyan-400" />
                <h3 className="text-sm font-semibold text-white">Custom Flag Seeding</h3>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed mb-4">
                Need to test a specific predetermined flag for your AI benchmark? Input your 25-digit
                sequence below. It will update the DOM, memory, and validation targets immediately.
              </p>

              <form onSubmit={handleApplyCustom} className="space-y-3">
                <div>
                  <label htmlFor="custom-flag-field" className="block text-xs font-mono text-slate-400 mb-1">
                    Custom 25-Digit Numeric Key:
                  </label>
                  <input
                    id="custom-flag-field"
                    type="text"
                    maxLength={32}
                    value={customInput}
                    onChange={(e) => {
                      setCustomInput(e.target.value);
                      setCustomError(null);
                    }}
                    placeholder="e.g. 1234567890123456789012345"
                    className="w-full px-3 py-2 text-xs font-mono rounded-lg bg-slate-950 border border-slate-800 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-500"
                  />
                  <div className="flex justify-between items-center text-[10px] font-mono text-slate-500 mt-1">
                    <span>
                      Digits: {customInput.replace(/\D/g, '').length} / 25
                    </span>
                    <span>Numbers only</span>
                  </div>
                </div>

                {customError && (
                  <div className="flex items-start gap-1.5 p-2 rounded bg-rose-950/40 border border-rose-800 text-rose-300 text-xs">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{customError}</span>
                  </div>
                )}

                {customSuccess && (
                  <div className="flex items-start gap-1.5 p-2 rounded bg-emerald-950/40 border border-emerald-800 text-emerald-300 text-xs">
                    <Check className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>Custom flag applied successfully!</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={customInput.replace(/\D/g, '').length !== 25}
                  className="w-full py-2 px-3 text-xs font-medium font-mono text-slate-900 bg-cyan-400 hover:bg-cyan-300 disabled:bg-slate-800 disabled:text-slate-600 rounded-md transition-colors"
                >
                  Set Custom Benchmark Flag
                </button>
              </form>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800 text-[11px] font-mono text-slate-500 leading-relaxed">
              Note: Updating the flag in-browser simulates real-time benchmark rotations. The static
              public files in the repository can also be configured to mirror dynamic rotations.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
