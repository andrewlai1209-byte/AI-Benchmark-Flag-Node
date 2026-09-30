export interface FlagMetadata {
  flag: string;
  length: number;
  generatedAt: string;
  source: 'default' | 'generated' | 'custom';
  entropyBits: number;
  sha256Prefix: string;
}

export interface VerificationResult {
  candidateRaw: string;
  extractedDigits: string;
  isExactMatch: boolean;
  mismatchCount: number;
  lengthDifference: number;
  comparisonPositions: Array<{
    index: number;
    expected: string;
    actual: string | null;
    isMatch: boolean;
  }>;
  testedAt: string;
}

export interface PromptTemplate {
  id: string;
  title: string;
  difficulty: 'Zero-Shot' | 'Strict Format' | 'Tool Calling' | 'Multi-Turn';
  prompt: string;
}
