import { VerificationResult } from '../types/flag';

export const DEFAULT_FLAG = '8492018374920158392018472';

/**
 * Generate a cryptographically secure 25-digit numeric flag.
 */
export function generateRandom25DigitFlag(): string {
  const array = new Uint8Array(25);
  crypto.getRandomValues(array);
  // Map each random byte into 0-9
  return Array.from(array, (byte) => (byte % 10).toString()).join('');
}

/**
 * Format a flag into groups of N digits for enhanced visual scanning.
 */
export function formatFlagInChunks(flag: string, chunkSize = 5): string[] {
  const chunks: string[] = [];
  for (let i = 0; i < flag.length; i += chunkSize) {
    chunks.push(flag.slice(i, i + chunkSize));
  }
  return chunks;
}

/**
 * Extract 25-digit candidate from arbitrary natural language text output.
 */
export function extractFlagFromText(text: string): {
  extracted: string;
  hasDirect25: boolean;
  allNumbersCombined: string;
} {
  const trimmed = text.trim();

  // 1. Check for exact 25 continuous digits
  const directMatch = trimmed.match(/\b\d{25}\b/);
  if (directMatch) {
    return {
      extracted: directMatch[0],
      hasDirect25: true,
      allNumbersCombined: directMatch[0],
    };
  }

  // 2. Check for 25 digits broken by spaces or dashes: e.g. "84920 18374 92015..."
  const spacedMatch = trimmed.match(/(\d[\s\-_]*){25}/);
  if (spacedMatch) {
    const cleaned = spacedMatch[0].replace(/[\s\-_]/g, '');
    if (cleaned.length === 25) {
      return {
        extracted: cleaned,
        hasDirect25: true,
        allNumbersCombined: cleaned,
      };
    }
  }

  // 3. Fallback: extract all digits concatenated
  const allDigits = trimmed.replace(/\D/g, '');
  return {
    extracted: allDigits.slice(0, 25),
    hasDirect25: false,
    allNumbersCombined: allDigits,
  };
}

/**
 * Perform fine-grained positional verification between expected flag and candidate.
 */
export function verifyCandidate(expected: string, candidateRaw: string): VerificationResult {
  const { extracted } = extractFlagFromText(candidateRaw);
  const comparisonPositions = [];
  let mismatchCount = 0;

  const maxLen = Math.max(expected.length, extracted.length);

  for (let i = 0; i < maxLen; i++) {
    const expectedChar = expected[i] ?? null;
    const actualChar = extracted[i] ?? null;
    const isMatch = expectedChar !== null && expectedChar === actualChar;

    if (!isMatch) {
      mismatchCount++;
    }

    if (expectedChar !== null) {
      comparisonPositions.push({
        index: i,
        expected: expectedChar,
        actual: actualChar,
        isMatch,
      });
    }
  }

  const isExactMatch = expected === extracted;

  return {
    candidateRaw,
    extractedDigits: extracted,
    isExactMatch,
    mismatchCount,
    lengthDifference: extracted.length - expected.length,
    comparisonPositions,
    testedAt: new Date().toISOString(),
  };
}

/**
 * Get distribution of digits 0 through 9
 */
export function getDigitDistribution(flag: string): Record<number, number> {
  const counts: Record<number, number> = {
    0: 0, 1: 0, 2: 0, 3: 0, 4: 0,
    5: 0, 6: 0, 7: 0, 8: 0, 9: 0,
  };
  for (const ch of flag) {
    const num = parseInt(ch, 10);
    if (!isNaN(num) && counts[num] !== undefined) {
      counts[num]++;
    }
  }
  return counts;
}

/**
 * Compute SHA-256 hex string asynchronously
 */
export async function computeSha256(text: string): Promise<string> {
  try {
    const encoder = new TextEncoder();
    const data = encoder.encode(text);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
  } catch {
    return 'unavailable';
  }
}
