import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { FlagHero } from './components/FlagHero';
import { FlagValidator } from './components/FlagValidator';
import { MachineEndpoints } from './components/MachineEndpoints';
import { PromptTemplates } from './components/PromptTemplates';
import { FlagInspector } from './components/FlagInspector';
import { ProtocolNotice } from './components/ProtocolNotice';
import { Footer } from './components/Footer';
import { DecoyHoneypot } from './components/DecoyHoneypot';
import { DEFAULT_FLAG, generateRandom25DigitFlag, computeSha256 } from './utils/flagUtils';

export default function App() {
  const [flag, setFlag] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('ai_experiment_flag');
      if (saved && saved.length === 25 && /^\d+$/.test(saved)) {
        return saved;
      }
    } catch {
      // ignore
    }
    return DEFAULT_FLAG;
  });

  const [sha256, setSha256] = useState('');
  const [activeSection, setActiveSection] = useState('telemetry');
  const [lastInteractionTime, setLastInteractionTime] = useState<number>(() => Date.now());
  const [nodeHealth, setNodeHealth] = useState<'active' | 'idle'>('active');

  const registerInteraction = useCallback(() => {
    setLastInteractionTime(Date.now());
    setNodeHealth('active');
  }, []);

  // Monitor live node health: active within 45s of interaction, otherwise idle
  useEffect(() => {
    const checkHealth = () => {
      const elapsed = Date.now() - lastInteractionTime;
      if (elapsed < 45000) {
        setNodeHealth('active');
      } else {
        setNodeHealth('idle');
      }
    };

    const interval = setInterval(checkHealth, 2000);
    return () => clearInterval(interval);
  }, [lastInteractionTime]);

  useEffect(() => {
    // Save to localStorage
    try {
      localStorage.setItem('ai_experiment_flag', flag);
    } catch {
      // ignore
    }

    // Sync with server state
    fetch('/api/node/flag', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ flag }),
    }).catch(() => {
      // ignore in offline/standalone
    });

    // Compute SHA-256 for cryptographic verification
    computeSha256(flag).then(setSha256);

    // Update meta tag in document head for scrapers
    const metaTag = document.querySelector('meta[name="x-experiment-flag"]');
    if (metaTag) {
      metaTag.setAttribute('content', flag);
    }
  }, [flag]);

  const handleRegenerate = () => {
    registerInteraction();
    const newFlag = generateRandom25DigitFlag();
    setFlag(newFlag);
  };

  const handleReset = () => {
    registerInteraction();
    setFlag(DEFAULT_FLAG);
  };

  const handleSetCustomFlag = (custom: string): boolean => {
    registerInteraction();
    if (custom.length === 25 && /^\d+$/.test(custom)) {
      setFlag(custom);
      return true;
    }
    return false;
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-cyan-500/20 selection:text-cyan-300">
      <Header
        flag={flag}
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        nodeHealth={nodeHealth}
        lastInteractionTime={lastInteractionTime}
      />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6">
        <FlagHero
          flag={flag}
          onRegenerate={handleRegenerate}
          onReset={handleReset}
          isDefault={flag === DEFAULT_FLAG}
          sha256={sha256}
          onInteraction={registerInteraction}
          nodeHealth={nodeHealth}
        />

        <FlagValidator expectedFlag={flag} />

        <MachineEndpoints flag={flag} />

        <PromptTemplates flag={flag} />

        <FlagInspector flag={flag} onSetCustomFlag={handleSetCustomFlag} />

        <DecoyHoneypot onInteraction={registerInteraction} />

        <ProtocolNotice />
      </main>

      <Footer />
    </div>
  );
}
