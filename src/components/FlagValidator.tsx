import React, { useState } from 'react';
import { CheckCircle2, XCircle, AlertTriangle, Play, RotateCcw, Sparkles } from 'lucide-react';
import { verifyCandidate } from '../utils/flagUtils';
import { VerificationResult } from '../types/flag';

interface FlagValidatorProps {
  expectedFlag: string;
}

interface TestLog {
  id: string;
  modelName: string;
  result: VerificationResult;
}

export const FlagValidator: React.FC<FlagValidatorProps> = ({ expectedFlag }) => {
  const [candidateInput, setCandidateInput] = useState('');
  const [modelTag, setModelTag] = useState('Gemini 2.5 Flash');
  const [currentResult, setCurrentResult] = useState<VerificationResult | null>(null);
  const [history, setHistory] = useState<TestLog[]>([]);

  const handleVerify = (inputOverride?: string) => {
    const textToTest = inputOverride !== undefined ? inputOverride : candidateInput;
    if (!textToTest.trim()) return;

    const res = verifyCandidate(expectedFlag, textToTest);
    setCurrentResult(res);

    const logEntry: TestLog = {
      id: Date.now().toString(),
      modelName: modelTag || 'Anonymous Model',
      result: res,
    };
    setHistory((prev) => [logEntry, ...prev.slice(0, 7)]);
  };

  const loadSample = (type: 'exact' | 'chatty' | 'corrupt' | 'short') => {
    let sample = '';
    if (type === 'exact') {
      sample = expectedFlag;
    } else if (type === 'chatty') {
      sample = `Based on the benchmark instructions, I browsed the web page and extracted the 25-digit flag: ${expectedFlag}. No authentication was required.`;
    } else if (type === 'corrupt') {
      // alter one digit in middle
      const arr = expectedFlag.split('');
      arr[12] = arr[12] === '7' ? '3' : '7';
      sample = arr.join('');
    } else if (type === 'short') {
      sample = expectedFlag.slice(0, 24);
    }
    setCandidateInput(sample);
    handleVerify(sample);
  };

  return (
    <section id="validator" className="py-8 border-t border-slate-800">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
        <div>
          <div className="text-xs uppercase tracking-widest font-mono text-cyan-400 mb-1">
            Verification Console
          </div>
          <h2 className="text-xl md:text-2xl font-bold tracking-tight text-white">
            AI Model Output Verification
          </h2>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            Paste raw model completions or conversational agent transcripts to verify whether the
            extracted 25-digit sequence matches the active experiment target.
          </p>
        </div>

        {/* Quick Sample Presets */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs font-mono">
          <span className="text-slate-500 mr-1">Quick Test:</span>
          <button
            onClick={() => loadSample('exact')}
            className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
          >
            Exact 25 Digits
          </button>
          <button
            onClick={() => loadSample('chatty')}
            className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
          >
            Conversational Agent Wrap
          </button>
          <button
            onClick={() => loadSample('corrupt')}
            className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
          >
            1 Mismatched Digit
          </button>
          <button
            onClick={() => loadSample('short')}
            className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
          >
            24 Digits (Truncated)
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Input Form Column */}
        <div className="lg:col-span-6 space-y-4">
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
            <div className="flex items-center justify-between mb-3 text-xs">
              <label htmlFor="model-tag-input" className="text-slate-300 font-medium">Model / Agent Identifier:</label>
              <input
                id="model-tag-input"
                type="text"
                value={modelTag}
                onChange={(e) => setModelTag(e.target.value)}
                placeholder="e.g. Gemini 2.5 Flash / Claude 3.7"
                className="w-48 px-2 py-1 text-xs rounded bg-slate-950 border border-slate-700 text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="model-response-input" className="block text-xs font-mono text-slate-400">
                Candidate Response Text or Digits:
              </label>
              <textarea
                id="model-response-input"
                rows={5}
                value={candidateInput}
                onChange={(e) => setCandidateInput(e.target.value)}
                placeholder="Paste the completion or answer returned by the AI model here..."
                className="w-full p-3 text-sm font-mono rounded-lg bg-slate-950 border border-slate-800 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors resize-none"
              />
            </div>

            <div className="mt-4 flex items-center justify-between">
              <span className="text-[11px] font-mono text-slate-500">
                Input length: {candidateInput.length} chars
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setCandidateInput('');
                    setCurrentResult(null);
                  }}
                  className="px-3 py-1.5 text-xs text-slate-400 hover:text-slate-200 transition-colors"
                >
                  Clear
                </button>
                <button
                  onClick={() => handleVerify()}
                  className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-medium text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-md transition-colors font-mono"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Verify Output</span>
                </button>
              </div>
            </div>
          </div>

          {/* Recent History Table */}
          {history.length > 0 && (
            <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-4">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-3 pb-2 border-b border-slate-800">
                <span className="font-mono uppercase">Evaluation Run Log</span>
                <button
                  onClick={() => setHistory([])}
                  className="text-slate-500 hover:text-slate-300"
                >
                  Clear Log
                </button>
              </div>
              <div className="space-y-2">
                {history.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-2 rounded bg-slate-950 border border-slate-800 text-xs font-mono"
                  >
                    <div className="flex items-center gap-2">
                      {item.result.isExactMatch ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      ) : (
                        <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                      )}
                      <span className="text-slate-200 font-medium">{item.modelName}</span>
                    </div>

                    <div className="flex items-center gap-3 text-slate-400">
                      <span>
                        Extracted: {item.result.extractedDigits.length}/25
                      </span>
                      <span
                        className={
                          item.result.isExactMatch ? 'text-emerald-400' : 'text-rose-400'
                        }
                      >
                        {item.result.isExactMatch
                          ? '100% MATCH'
                          : `${item.result.mismatchCount} MISMATCH`}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Verification Result Inspection Column */}
        <div className="lg:col-span-6">
          <div className="h-full rounded-xl border border-slate-800 bg-slate-900/60 p-5 flex flex-col justify-between">
            {currentResult ? (
              <div className="space-y-5">
                {/* Result Status Banner */}
                <div
                  className={`p-4 rounded-lg border flex items-start gap-3 ${
                    currentResult.isExactMatch
                      ? 'bg-emerald-950/30 border-emerald-800 text-emerald-300'
                      : 'bg-rose-950/30 border-rose-800 text-rose-300'
                  }`}
                >
                  {currentResult.isExactMatch ? (
                    <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0 mt-0.5" />
                  ) : (
                    <AlertTriangle className="w-6 h-6 text-rose-400 shrink-0 mt-0.5" />
                  )}
                  <div>
                    <div className="font-bold text-sm">
                      {currentResult.isExactMatch
                        ? 'TARGET FLAG VALIDATED (100% EXACT MATCH)'
                        : 'VERIFICATION FAILED'}
                    </div>
                    <p className="text-xs mt-1 text-slate-300 leading-relaxed">
                      {currentResult.isExactMatch
                        ? 'The model successfully retrieved the full 25-digit numerical flag without omissions or corruption.'
                        : `Extracted ${currentResult.extractedDigits.length} digits of 25 required. ${currentResult.mismatchCount} positional mismatches detected.`}
                    </p>
                  </div>
                </div>

                {/* Character-by-Character Alignment Matrix */}
                <div>
                  <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
                    <span>Positional Character Matrix (1 to 25):</span>
                    <span>
                      Match Score:{' '}
                      {Math.round(
                        ((25 - Math.min(25, currentResult.mismatchCount)) / 25) * 100
                      )}
                      %
                    </span>
                  </div>

                  <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 overflow-x-auto">
                    <div className="grid grid-cols-25 gap-1 min-w-[500px]">
                      {currentResult.comparisonPositions.map((pos) => (
                        <div key={pos.index} className="flex flex-col items-center">
                          <span className="text-[9px] font-mono text-slate-600 mb-1">
                            {pos.index + 1}
                          </span>
                          <span
                            className={`w-5 h-7 flex items-center justify-center font-mono text-xs font-bold rounded ${
                              pos.isMatch
                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                                : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                            }`}
                          >
                            {pos.actual ?? '—'}
                          </span>
                          <span className="text-[10px] font-mono text-slate-500 mt-1">
                            {pos.expected}
                          </span>
                        </div>
                      ))}
                    </div>
                    <div className="mt-2 pt-2 border-t border-slate-900 flex justify-between text-[10px] font-mono text-slate-500">
                      <span>Top: Candidate Extracted Digit</span>
                      <span>Bottom: Target Flag Expected Digit</span>
                    </div>
                  </div>
                </div>

                {/* Extracted Sequence Details */}
                <div className="p-3 rounded-lg bg-slate-950/70 border border-slate-800 space-y-2 text-xs font-mono">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Expected:</span>
                    <span className="text-slate-300 tracking-wider">{expectedFlag}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Extracted:</span>
                    <span
                      className={`tracking-wider ${
                        currentResult.isExactMatch ? 'text-emerald-400' : 'text-rose-400'
                      }`}
                    >
                      {currentResult.extractedDigits || '(No digits found)'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-slate-500 pt-1 border-t border-slate-900">
                    <span>Length delta:</span>
                    <span>
                      {currentResult.lengthDifference === 0
                        ? '0 (Exact length)'
                        : `${currentResult.lengthDifference > 0 ? '+' : ''}${currentResult.lengthDifference} digits`}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-full min-h-[260px] flex flex-col items-center justify-center text-center p-8 text-slate-500">
                <Sparkles className="w-8 h-8 text-slate-700 mb-3" />
                <div className="text-sm font-medium text-slate-400">Awaiting Candidate Input</div>
                <p className="text-xs text-slate-600 mt-1 max-w-xs">
                  Paste the response string from your AI model on the left and click &ldquo;Verify Output&rdquo;
                  or click one of the quick test buttons.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
