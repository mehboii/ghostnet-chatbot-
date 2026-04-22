export class GhostSupportBot {
  private lastIntent: string | null;
  private fallback: string;
  private db: Array<{ intent: string; keywords: string[]; response: string }>;

  constructor() {
    this.lastIntent = null;
    this.fallback =
      "Terminal Error: Unrecognized command. Please specify if your query relates to 'authentication', 'encryption', 'hardware', or 'source'.";

    this.db = [
      {
        intent: 'github',
        keywords: ['github', 'repo', 'source', 'code', 'open source', 'contribute'],
        response:
          'The GhostNet SDK is available on GitHub as open source. You can explore the code, contribute, and build on top of it. The core infrastructure follows a privacy-first, transparent development approach.',
      },
      {
        intent: 'authentication',
        keywords: ['password', 'hash', 'argon2id', 'auth', 'login'],
        response:
          'GhostNet utilizes memory-hard Argon2id hashing for robust, quantum-resistant authentication security. We do not use legacy seed phrases.',
      },
      {
        intent: 'encryption',
        keywords: ['encrypt', 'aes', 'gcm', 'security', 'data'],
        response:
          'All peer-to-peer data transfers are secured end-to-end using AES-256-GCM encryption before leaving the local device.',
      },
      {
        intent: 'pricing',
        keywords: ['price', 'cost', 'paid', 'subscription', 'money'],
        response:
          'GhostNet is 100% free and open-source. There are no subscriptions, no APIs, and no central servers.',
      },
    ];
  }

  ask(userInput: string): string {
    if (!userInput) return this.fallback;

    const sanitizedInput = userInput.toLowerCase().replace(/\s+/g, ' ').trim();
    let bestMatch: { intent: string; keywords: string[]; response: string } | null = null;
    let highestScore = 0;

    for (const entry of this.db) {
      let score = 0;
      for (const keyword of entry.keywords) {
        try {
          const safeKeyword = keyword.replace(/\s+/g, '\\s+');
          const regex = new RegExp(`\\b${safeKeyword}\\b`, 'i');

          if (regex.test(sanitizedInput)) {
            score += 1;
            if (keyword.includes(' ')) score += 5;
          }
        } catch {
          continue;
        }
      }

      if (score > highestScore) {
        highestScore = score;
        bestMatch = entry;
      }
    }

    if (bestMatch && highestScore > 0) {
      this.lastIntent = bestMatch.intent;
      return bestMatch.response;
    }

    return this.fallback;
  }
}
