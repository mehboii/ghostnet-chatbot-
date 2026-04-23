export class GhostSupportBot {
  private fallback: string;
  private db: Array<{ intent: string; keywords: string[]; response: string }>;

  constructor() {
    this.fallback =
      "Terminal Error: Unrecognized command. Please specify if your query relates to 'authentication', 'encryption', 'hardware', or 'source'.";

    this.db = [
      {
        intent: 'account_creation',
        keywords: ['account', 'create', 'signup', 'setup', 'create an account'],
        response: 'To create an account on GhostNet, simply generate a new seed phrase. No email or personal data is required.',
      },
      {
        intent: 'seed_loss',
        keywords: ['lose', 'lost', 'seed phrase', 'recovery'],
        response: 'If you lose your seed phrase, there is No recovery possible. Your account and data will be lost forever.',
      },
      {
        intent: 'node_id',
        keywords: ['node id', 'what is node id', 'identity', 'blake3', 'ed25519'],
        response: 'A Node ID is your unique identifier on the mesh, derived from your Ed25519 public key using BLAKE3 hashing.',
      },
      {
        intent: 'multi_device',
        keywords: ['multiple devices', 'same identity', 'sync', 'deterministically', 'devices'],
        response: 'You can use the same identity on multiple devices by importing your seed phrase; it derives keys deterministically.',
      },
      {
        intent: 'pin',
        keywords: ['pin', '6-digit', 'protection', 'argon2id'],
        response: 'The 6-digit PIN is used to encrypt your local database using Argon2id.',
      },
      {
        intent: 'encryption_algo',
        keywords: ['encryption', 'algorithm', 'standard', 'aes-256-gcm'],
        response: 'GhostNet uses AES-256-GCM for all end-to-end encrypted communications.',
      },
      {
        intent: 'read_messages',
        keywords: ['read my messages', 'privacy', 'intercept', 'cannot decrypt'],
        response: 'GhostNet is zero-trust; even we cannot decrypt your messages as keys never leave your device.',
      },
      {
        intent: 'interception',
        keywords: ['intercept', 'intercepts', 'man in the middle', 'mitm', 'encrypted blob'],
        response: 'If someone intercepts your message, they only see an encrypted blob that is impossible to read without your private key.',
      },
      {
        intent: 'metadata',
        keywords: ['metadata', 'tracking', 'hide', 'phantom'],
        response: 'Metadata is protected using our Phantom routing protocol, which masks sender and receiver identities.',
      },
      {
        intent: 'signal_comparison',
        keywords: ['signal', 'whatsapp', 'better than', 'peer-to-peer'],
        response: 'Unlike Signal, GhostNet is entirely peer-to-peer and does not rely on any central servers for message routing.',
      },
      {
        intent: 'ghost_shield',
        keywords: ['ghost shield', '3-tier'],
        response: 'Ghost Shield is our 3-tier privacy system that provides varying levels of network obfuscation.',
      },
      {
        intent: 'tiers',
        keywords: ['tier', 'stealth', 'phantom', 'each tier'],
        response: 'Ghost Shield tiers include Stealth (obfuscated traffic) and Phantom (fully anonymous mesh routing).',
      },
      {
        intent: 'full_ghost',
        keywords: ['full ghost', 'invisible', 'full ghost protocol'],
        response: 'Full Ghost Protocol makes your node virtually invisible to non-mesh participants.',
      },
      {
        intent: 'shield_price',
        keywords: ['shield free', 'cost of shield', 'stealth', 'ghost shield free'],
        response: 'Basic Stealth cloaking is included for all users, while higher tiers require network contribution.',
      },
      {
        intent: 'latency',
        keywords: ['slow', 'latency', 'speed', 'slow down'],
        response: 'Ghost Shield may introduce minor latency due to the multi-hop routing required for privacy.',
      },
      {
        intent: 'proximity',
        keywords: ['proximity connect', 'bluetooth low energy'],
        response: 'Proximity Connect allows devices to mesh via Bluetooth Low Energy (BLE) without internet.',
      },
      {
        intent: 'offline',
        keywords: ['offline', 'no internet', 'without internet', 'no relay server'],
        response: 'Yes, it works without internet by using local mesh peers; there is no relay server needed for local transfers.',
      },
      {
        intent: 'ble_privacy',
        keywords: ['detect', 'ble privacy', 'visibility', 'opt-in', 'detect me'],
        response: 'BLE discovery is opt-in and uses rotating identifiers to prevent tracking.',
      },
      {
        intent: 'ble_range',
        keywords: ['range', 'distance', 'ble distance', '10-30 meters'],
        response: 'The typical BLE range for Proximity Connect is 10-30 meters depending on environmental factors.',
      },
      {
        intent: 'pricing_free',
        keywords: ['is ghostnet free', 'free', 'price', 'free forever'],
        response: 'GhostNet is free forever, supported by the N11X community and open-source contributions.',
      },
      {
        intent: 'open_source',
        keywords: ['open source', 'license', 'github', 'mit license'],
        response: 'GhostNet is released under the MIT license and is fully open source on GitHub.',
      },
      {
        intent: 'platforms',
        keywords: ['platforms', 'android', 'ios', 'windows', 'mac', 'platform'],
        response: 'GhostNet currently supports Android and iOS, with desktop versions in development.',
      },
      {
        intent: 'builder',
        keywords: ['who built', 'creator', 'founder', 'n11x labs'],
        response: 'GhostNet was built by the N11X Labs collective.',
      },
      {
        intent: 'gov_data',
        keywords: ['government', 'governments', 'police', 'data request', 'subpoena', 'nothing to hand over'],
        response: 'Since we don\'t store your data, there is nothing to hand over even if requested by authorities.',
      },
      {
        intent: 'telegram_comparison',
        keywords: ['telegram', 'cloud chat', 'peer-to-peer'],
        response: 'Unlike Telegram\'s cloud-based model, GhostNet is purely peer-to-peer with no central database.',
      },
      {
        intent: 'contact_users',
        keywords: ['contact', 'friend', 'add', 'node id', 'ghost cards'],
        response: 'To contact another user, you need their Node ID or scan their Ghost Cards.',
      },
      {
        intent: 'ghost_pay',
        keywords: ['pay', 'crypto', 'wallet', 'usdc', 'polygon'],
        response: 'GhostNet Pay enables peer-to-peer USDC transfers on the Polygon network.',
      },
      {
        intent: 'hardware',
        keywords: ['raspberry', 'pi', 'android device', 'low-resource'],
        response: 'GhostNet nodes are optimized for low-resource hardware. A standard Raspberry Pi 4/5 or mid-tier Android device (e.g., Redmi 13C 5G) is sufficient to run the core relay firmware and local mesh modules.',
      },
      {
        intent: 'installation',
        keywords: ['npm', 'install', 'setup sdk'],
        response: 'To initialize the SDK, run `npm install ghostnet-sdk`. Instantiate the core network class with your configuration options to begin deriving your BLAKE3 node identity.',
      },
      {
        intent: 'troubleshooting',
        keywords: ['error', 'drop connection', 'vulnerabilities'],
        response: 'If your node drops connection, the SDK will attempt exponential backoff reconnection. Check local BLE permissions and ensure your AES-256-GCM keys are correctly formatted. For critical framework vulnerabilities, contact security@n11x.dev.',
      },
      {
        intent: 'architecture',
        keywords: ['server', 'central', 'topology', 'mesh'],
        response: 'GhostNet operates on a strict zero-trust, peer-to-peer mesh topology. There are no central servers. Data is routed directly between physical node identities.',
      },
      {
        intent: 'n11x_ethos',
        keywords: ['n11x', 'collective', 'labs'],
        response: 'The N11X Collective engineers sovereign, decentralized systems. We prioritize pure privacy, dark-tech precision, and zero-trust infrastructure over standard corporate software models.',
      },
      {
        intent: 'ghost_card',
        keywords: ['card', 'ghost card', 'visual identity'],
        response: 'The Ghost Card serves as your visual cryptographic identity. It displays your active network status flags alongside a truncated BLAKE3 hash representation of your public key.',
      },
      {
        intent: 'limits',
        keywords: ['payload', 'packets', 'chunking'],
        response: 'All payloads are AES-256-GCM encrypted. For optimal Proximity Connect routing over BLE, individual packets should remain lightweight. Larger data transfers are handled via our automated store-and-forward chunking protocol.',
      },
      {
        intent: 'dependencies',
        keywords: ['cost', 'external api', 'paid subscription'],
        response: 'GhostNet relies on zero external APIs or paid subscriptions. The network is entirely self-hosted and decentralized, ensuring operations remain free and sovereign indefinitely.',
      },
      {
        intent: 'joke_server',
        keywords: ['joke', 'centralized server'],
        response: "Why did the centralized server cross the road? It didn't. It crashed, took the whole API down with it, and billed you for the downtime. Skill issue.",
      },
      {
        intent: 'slang_based',
        keywords: ['based', 'rizz', 'sigma'],
        response: "No cap, centralized infrastructure is not based. GhostNet is strict sigma architecture. 100% decentralized rizz, zero API fees. We don't rely on third-party servers.",
      },
      {
        intent: 'slang_cook',
        keywords: ['cook', 'cooking', 'baked'],
        response: 'The N11X Collective is currently cooking. Our memory-hard Argon2id implementation is fully baked. Let the nodes cook in Phantom tier.',
      },
      {
        intent: 'slang_grass',
        keywords: ['grass', 'woods', 'touch grass'],
        response: "Go touch grass. GhostNet's Proximity Connect works offline via Bluetooth Low Energy (BLE), so your nodes will stay securely meshed even if you are out in the woods.",
      },
      {
        intent: 'joke_feds',
        keywords: ['sus', 'fed', 'telemetry', 'are you a fed?'],
        response: 'Nice try, fed. Ghost Shield is active. Your telemetry is cooked.',
      },
      {
        intent: "blake3",
        keywords: ["blake3", "hash", "hashing", "parallelizable", "integrity"],
        response: "GhostNet uses BLAKE3 for cryptographic hashing. Operating at 6.8 GB/s, it is highly parallelizable and used to guarantee content integrity across the mesh network."
      },
      {
        intent: "ed25519",
        keywords: ["ed25519", "elliptic", "curve", "signature", "signatures", "identity"],
        response: "We utilize Ed25519 for elliptic curve signatures. It provides high-speed 128-bit security and is strictly used for core node identity generation and message authentication."
      },
      {
        intent: "aes-256-gcm",
        keywords: ["aes-256-gcm", "aes", "gcm", "vault", "transport", "encryption", "encrypt"],
        response: "GhostNet relies on AES-256-GCM for authenticated encryption. It secures local vault storage and handles all end-to-end inter-node mesh transport."
      },
    ];
  }

  async ask(userInput: string): Promise<string> {
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
      return bestMatch.response;
    }

    // Task 3: Puter fallback with safe try/catch
    try {
      // @ts-expect-error puter is a browser global injected by puter.js
      if (typeof puter !== 'undefined') {
        // @ts-expect-error puter is a browser global injected by puter.js
        const aiResponse = await puter.ai.chat(userInput);
        return aiResponse.toString();
      }
    } catch (error) {
      console.error('Puter AI fallback failed:', error);
    }

    return this.fallback;
  }
}
