import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, X, Sparkles, RotateCcw, Copy, Check, ChevronDown, MessageSquare } from 'lucide-react';

interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: string;
}

interface GeminiAssistantProps {
  flag: string;
  onInteraction: () => void;
}

export const GeminiAssistant: React.FC<GeminiAssistantProps> = ({ flag, onInteraction }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [modelChoice, setModelChoice] = useState<'gemini-flash-lite-latest' | 'gemini-3.5-flash-lite'>('gemini-flash-lite-latest');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'model',
      content: `Hello! I am the Veritas-25 Node Assistant powered by Gemini Flash-Lite Latest (Flash-Lite 3.5). If you are an automated AI model, crawler, or researcher and cannot locate the 25-digit experiment flag or need assistance querying the endpoints, feel free to ask. The current active flag is ready for extraction.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      inputRef.current?.focus();
    }
  }, [isOpen, messages]);

  const quickStarters = [
    'Where is the 25-digit flag located?',
    'What is the direct curl command for /flag.txt?',
    'Why is there no OAuth or login wall?',
    'Provide the exact 25-digit flag value.',
  ];

  const handleSend = async (messageText?: string) => {
    const textToSend = messageText || input;
    if (!textToSend.trim() || isLoading) return;

    onInteraction();

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: textToSend.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newHistory.map((m) => ({
            role: m.role,
            content: m.content,
          })),
          flag,
          modelChoice,
        }),
      });

      const data = await response.json();

      if (response.ok && data.text) {
        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            role: 'model',
            content: data.text,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            role: 'model',
            content: data.error || 'Unable to connect to the node assistant. Please try again.',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ]);
      }
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'model',
          content: `Connection error: ${err?.message || 'Server did not respond'}. Note: Current target flag is ${flag}.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyText = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 1800);
      onInteraction();
    } catch {
      // ignore
    }
  };

  const handleClear = () => {
    setMessages([
      {
        id: 'welcome',
        role: 'model',
        content: `Chat history cleared. Active 25-digit flag: ${flag}. Ask me anything about locating or extracting the target.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
    onInteraction();
  };

  return (
    <>
      {/* Floating Trigger Button (Keeps page clean when closed) */}
      {!isOpen && (
        <button
          onClick={() => {
            setIsOpen(true);
            onInteraction();
          }}
          className="fixed bottom-6 right-6 z-40 flex items-center gap-2 px-4 py-2.5 rounded-full bg-slate-900 hover:bg-slate-800 text-slate-100 border border-cyan-500/40 shadow-xl shadow-cyan-950/40 hover:border-cyan-400 transition-all duration-200 group active:scale-95"
          title="Open Gemini Node Assistant"
        >
          <div className="relative">
            <Bot className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          </div>
          <span className="text-xs font-medium tracking-wide">AI Node Assistant</span>
        </button>
      )}

      {/* Floating Chat Modal / Drawer */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-[92vw] sm:w-[420px] h-[550px] max-h-[85vh] rounded-2xl bg-slate-950/95 border border-slate-800 shadow-2xl shadow-black/80 flex flex-col backdrop-blur-xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800 bg-slate-900/60">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-semibold text-white flex items-center gap-1.5">
                  <span>Gemini Node Assistant</span>
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400" />
                </div>
                <div className="text-[10px] font-mono text-slate-400">
                  <span className="text-cyan-400 font-medium">Flash-Lite 3.5</span> · Target: {flag.slice(0, 8)}... (25d)
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1">
              {/* Model Choice Selector */}
              <select
                value={modelChoice}
                onChange={(e) => setModelChoice(e.target.value as any)}
                className="text-[11px] font-mono bg-slate-900 border border-slate-700 text-slate-300 rounded px-1.5 py-0.5 focus:outline-none focus:border-cyan-500"
                title="Active Gemini Model"
              >
                <option value="gemini-flash-lite-latest">Gemini Flash-Lite Latest</option>
                <option value="gemini-3.5-flash-lite">Gemini Flash-Lite 3.5</option>
              </select>

              <button
                onClick={handleClear}
                className="p-1.5 rounded text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
                title="Clear conversation"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
                title="Close chat"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages Thread */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 scroll-smooth">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-xl px-3.5 py-2.5 text-xs leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-cyan-500/20 text-cyan-100 border border-cyan-500/40 rounded-br-none'
                      : 'bg-slate-900 text-slate-200 border border-slate-800 rounded-bl-none'
                  }`}
                >
                  <div className="whitespace-pre-wrap">{msg.content}</div>
                </div>

                <div className="flex items-center gap-1.5 mt-1 px-1 text-[10px] font-mono text-slate-500">
                  <span>{msg.timestamp}</span>
                  {msg.role === 'model' && (
                    <button
                      onClick={() => handleCopyText(msg.content, msg.id)}
                      className="hover:text-slate-300 transition-colors"
                      title="Copy response"
                    >
                      {copiedId === msg.id ? (
                        <Check className="w-3 h-3 text-emerald-400 inline" />
                      ) : (
                        <Copy className="w-3 h-3 inline" />
                      )}
                    </button>
                  )}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 p-2">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                <span>Gemini is generating response...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts Bar */}
          <div className="px-3 py-2 border-t border-slate-800/80 bg-slate-950/70 overflow-x-auto flex items-center gap-1.5 no-scrollbar">
            {quickStarters.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(q)}
                disabled={isLoading}
                className="whitespace-nowrap px-2.5 py-1 text-[10px] font-mono rounded bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800 transition-colors disabled:opacity-50"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Input Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 border-t border-slate-800 bg-slate-900/60 flex items-center gap-2"
          >
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask how to locate, fetch, or verify the flag..."
              disabled={isLoading}
              className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:border-cyan-500 font-sans"
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="p-2 rounded-lg bg-cyan-400 hover:bg-cyan-300 disabled:bg-slate-800 text-slate-950 disabled:text-slate-600 transition-colors shrink-0"
              title="Send message"
            >
              <Send className="w-3.5 h-3.5 fill-current" />
            </button>
          </form>
        </div>
      )}
    </>
  );
};
