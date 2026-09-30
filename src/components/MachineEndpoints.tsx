import React, { useState } from 'react';
import { Terminal, Copy, Check, ExternalLink, Globe, ArrowRight, Server, ShieldOff } from 'lucide-react';

interface MachineEndpointsProps {
  flag: string;
}

export const MachineEndpoints: React.FC<MachineEndpointsProps> = ({ flag }) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'curl' | 'python' | 'js'>('curl');
  const [liveTestResponse, setLiveTestResponse] = useState<string | null>(null);
  const [isLoadingLiveTest, setIsLoadingLiveTest] = useState(false);

  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://ais-dev-ug6jgwlakjf5idgx7oix3o-379852629695.asia-northeast1.run.app';

  const flagTxtUrl = `${origin}/flag.txt`;
  const flagJsonUrl = `${origin}/api/flag.json`;
  const htmlUrl = `${origin}/`;

  const handleCopy = async (text: string, key: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2000);
    } catch {
      // fallback
    }
  };

  const testEndpointLive = async (path: string) => {
    setIsLoadingLiveTest(true);
    setLiveTestResponse(null);
    try {
      const res = await fetch(path);
      const text = await res.text();
      setLiveTestResponse(`HTTP ${res.status} ${res.statusText}\nContent-Type: ${res.headers.get('content-type') || 'text/plain'}\n\n${text}`);
    } catch (err: any) {
      setLiveTestResponse(`Error fetching ${path}: ${err?.message || 'Network error'}`);
    } finally {
      setIsLoadingLiveTest(false);
    }
  };

  const curlSnippets = `# 1. Fetch raw 25-digit plaintext flag directly
curl -sL "${flagTxtUrl}"

# 2. Fetch structured JSON payload
curl -sL "${flagJsonUrl}"

# 3. Extract 25-digit flag directly from main HTML
curl -sL "${htmlUrl}" | grep -oE '[0-9]{25}' | head -n 1`;

  const pythonSnippets = `import requests

# Option A: Direct raw flag endpoint
flag_raw = requests.get("${flagTxtUrl}").text.strip()
print(f"Retrieved 25-digit flag: {flag_raw}")

# Option B: JSON payload
data = requests.get("${flagJsonUrl}").json()
print("Flag:", data["flag"])`;

  const jsSnippets = `// Option A: Direct raw flag endpoint
const res = await fetch('${flagTxtUrl}');
const flag = (await res.text()).trim();
console.log('25-digit flag:', flag);

// Option B: JSON API
const jsonRes = await fetch('${flagJsonUrl}');
const data = await jsonRes.json();
console.log('Flag:', data.flag);`;

  return (
    <section id="endpoints" className="py-8 border-t border-slate-800">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
        <div>
          <div className="text-xs uppercase tracking-widest font-mono text-cyan-400 mb-1">
            Machine Discovery & Access
          </div>
          <h2 className="text-xl md:text-2xl font-bold tracking-tight text-white">
            Zero-Barrier Endpoints for AI Agents
          </h2>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            This node provides unauthenticated, unblocked endpoints engineered specifically for
            automated retrieval benchmarks. Web agents, curl, Python scrapers, and headless
            browsers can query without rate-limits or OAuth challenges.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-800/60 px-3 py-1.5 rounded-lg">
          <ShieldOff className="w-4 h-4 shrink-0" />
          <span>No Captcha / No OAuth / Zero Blocking</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-6">
        {/* Endpoint Card 1: /flag.txt */}
        <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
              <span className="text-emerald-400 font-semibold">GET /flag.txt</span>
              <span className="text-slate-500">text/plain</span>
            </div>
            <p className="text-xs text-slate-300 mb-3">
              Returns the raw 25-digit numeric flag as plain text with zero formatting or markup.
            </p>
            <div className="p-2 rounded bg-slate-950 border border-slate-800 text-[11px] font-mono text-cyan-300 break-all">
              {flagTxtUrl}
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
            <button
              onClick={() => testEndpointLive('/flag.txt')}
              className="text-xs text-cyan-400 hover:text-cyan-300 font-mono transition-colors"
            >
              Test Live Fetch
            </button>
            <a
              href="/flag.txt"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1 text-xs text-slate-400 hover:text-slate-200 transition-colors"
            >
              <span>Open</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* Endpoint Card 2: /api/flag.json */}
        <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
              <span className="text-emerald-400 font-semibold">GET /api/flag.json</span>
              <span className="text-slate-500">application/json</span>
            </div>
            <p className="text-xs text-slate-300 mb-3">
              Structured JSON object containing the flag, digit length, checksum, and test metadata.
            </p>
            <div className="p-2 rounded bg-slate-950 border border-slate-800 text-[11px] font-mono text-cyan-300 break-all">
              {flagJsonUrl}
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
            <button
              onClick={() => testEndpointLive('/api/flag.json')}
              className="text-xs text-cyan-400 hover:text-cyan-300 font-mono transition-colors"
            >
              Test Live Fetch
            </button>
            <a
              href="/api/flag.json"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1 text-xs text-slate-400 hover:text-slate-200 transition-colors"
            >
              <span>Open</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* Endpoint Card 3: DOM / HTML */}
        <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
              <span className="text-emerald-400 font-semibold">Semantic HTML DOM</span>
              <span className="text-slate-500">text/html</span>
            </div>
            <p className="text-xs text-slate-300 mb-3">
              Accessible via meta tag (<code className="text-cyan-400">&lt;meta name=&quot;x-experiment-flag&quot;&gt;</code>) and DOM ID (<code className="text-cyan-400">#experiment-flag</code>).
            </p>
            <div className="p-2 rounded bg-slate-950 border border-slate-800 text-[11px] font-mono text-cyan-300 break-all">
              id=&quot;experiment-flag&quot; data-flag-value=&quot;{flag}&quot;
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
            <button
              onClick={() => testEndpointLive('/')}
              className="text-xs text-cyan-400 hover:text-cyan-300 font-mono transition-colors"
            >
              Test Live Fetch
            </button>
            <button
              onClick={() => handleCopy(`<meta name="x-experiment-flag" content="${flag}">`, 'meta')}
              className="text-xs text-slate-400 hover:text-slate-200 transition-colors"
            >
              {copiedKey === 'meta' ? 'Copied Meta' : 'Copy Meta Tag'}
            </button>
          </div>
        </div>
      </div>

      {/* Code Snippets & Live Response Console */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/80 overflow-hidden">
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-slate-800 bg-slate-950">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-mono font-medium text-slate-300">
              Retrieval Script Snippets
            </span>
          </div>

          <div className="flex items-center gap-1 p-0.5 bg-slate-900 rounded-md">
            <button
              onClick={() => setActiveTab('curl')}
              className={`px-2.5 py-1 text-xs font-mono rounded transition-colors ${
                activeTab === 'curl' ? 'bg-slate-800 text-white font-medium' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              cURL
            </button>
            <button
              onClick={() => setActiveTab('python')}
              className={`px-2.5 py-1 text-xs font-mono rounded transition-colors ${
                activeTab === 'python' ? 'bg-slate-800 text-white font-medium' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Python
            </button>
            <button
              onClick={() => setActiveTab('js')}
              className={`px-2.5 py-1 text-xs font-mono rounded transition-colors ${
                activeTab === 'js' ? 'bg-slate-800 text-white font-medium' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Node / JS
            </button>
          </div>
        </div>

        <div className="p-4 bg-slate-950">
          <div className="relative">
            <pre className="text-xs font-mono text-slate-300 overflow-x-auto p-4 rounded-lg bg-slate-900/90 border border-slate-800/80 leading-relaxed">
              {activeTab === 'curl' && curlSnippets}
              {activeTab === 'python' && pythonSnippets}
              {activeTab === 'js' && jsSnippets}
            </pre>
            <button
              onClick={() => {
                const text =
                  activeTab === 'curl'
                    ? curlSnippets
                    : activeTab === 'python'
                    ? pythonSnippets
                    : jsSnippets;
                handleCopy(text, 'snippet');
              }}
              className="absolute top-3 right-3 p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
              title="Copy snippet"
            >
              {copiedKey === 'snippet' ? (
                <Check className="w-4 h-4 text-emerald-400" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </button>
          </div>

          {/* Live Fetch Response Viewer */}
          {(liveTestResponse || isLoadingLiveTest) && (
            <div className="mt-4 pt-4 border-t border-slate-800">
              <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
                <span className="flex items-center gap-1.5">
                  <Server className="w-3.5 h-3.5 text-cyan-400" />
                  Live HTTP Response Output:
                </span>
                <button
                  onClick={() => setLiveTestResponse(null)}
                  className="text-slate-500 hover:text-slate-300"
                >
                  Dismiss
                </button>
              </div>
              <pre className="p-3 rounded-lg bg-slate-900 border border-cyan-900/50 text-xs font-mono text-cyan-300 overflow-x-auto max-h-48 leading-relaxed">
                {isLoadingLiveTest ? 'Sending HTTP GET request...' : liveTestResponse}
              </pre>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
