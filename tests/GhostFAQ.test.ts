import { describe, it, expect } from 'vitest';
import { GhostSupportBot } from '../src/index.js';

describe('GhostSupportBot', () => {
  const bot = new GhostSupportBot();

  describe('authentication', () => {
    it('explains account creation', () => {
      const reply = bot.ask('How do I create an account on GhostNet?');
      expect(reply).toContain('seed phrase');
      expect(reply).toContain('No email');
    });

    it('explains seed phrase loss', () => {
      const reply = bot.ask('What if I lose my seed phrase?');
      expect(reply).toContain('No recovery');
    });

    it('explains Node ID', () => {
      const reply = bot.ask("What's a Node ID?");
      expect(reply).toContain('BLAKE3');
      expect(reply).toContain('Ed25519');
    });

    it('explains multi-device identity', () => {
      const reply = bot.ask('Can I use the same identity on multiple devices?');
      expect(reply).toContain('deterministically');
    });

    it('explains PIN protection', () => {
      const reply = bot.ask("What's the PIN for?");
      expect(reply).toContain('Argon2id');
      expect(reply).toContain('6-digit');
    });

    it('matches Argon2id auth query', () => {
      const reply = bot.ask('How do I configure Argon2id?');
      expect(reply).toContain('Argon2id');
    });
  });

  describe('encryption', () => {
    it('explains encryption algorithms', () => {
      const reply = bot.ask('What encryption does GhostNet use?');
      expect(reply).toContain('AES-256-GCM');
    });

    it('confirms GhostNet cannot read messages', () => {
      const reply = bot.ask('Can GhostNet read my messages?');
      expect(reply).toContain('cannot decrypt');
    });

    it('explains interception protection', () => {
      const reply = bot.ask('What happens if someone intercepts my message?');
      expect(reply).toContain('encrypted blob');
    });

    it('explains metadata protection', () => {
      const reply = bot.ask('Is metadata protected too?');
      expect(reply).toContain('Phantom');
    });

    it('compares to Signal', () => {
      const reply = bot.ask("How is this different from Signal?");
      expect(reply).toContain('peer-to-peer');
      expect(reply).toContain('Signal');
    });
  });

  describe('ghost shield & cloaking', () => {
    it('explains Ghost Shield', () => {
      const reply = bot.ask('What is Ghost Shield?');
      expect(reply).toContain('3-tier');
    });

    it('explains tier differences', () => {
      const reply = bot.ask('What does each tier do?');
      expect(reply).toContain('Stealth');
      expect(reply).toContain('Phantom');
    });

    it('explains Full Ghost Protocol', () => {
      const reply = bot.ask('What is Full Ghost Protocol?');
      expect(reply).toContain('invisible');
    });

    it('explains cloaking pricing', () => {
      const reply = bot.ask('Is Ghost Shield free?');
      expect(reply).toContain('Stealth');
    });

    it('explains latency impact', () => {
      const reply = bot.ask('Does Ghost Shield slow down messaging?');
      expect(reply).toContain('latency');
    });
  });

  describe('proximity connect', () => {
    it('explains Proximity Connect', () => {
      const reply = bot.ask('What is Proximity Connect?');
      expect(reply).toContain('Bluetooth Low Energy');
    });

    it('confirms offline capability', () => {
      const reply = bot.ask('Does it work without internet?');
      expect(reply).toContain('no relay server');
    });

    it('explains detection privacy', () => {
      const reply = bot.ask('Can random people detect me via BLE?');
      expect(reply).toContain('opt-in');
    });

    it('explains BLE range', () => {
      const reply = bot.ask("What's the range?");
      expect(reply).toContain('10-30 meters');
    });
  });

  describe('general', () => {
    it('explains pricing tiers', () => {
      const reply = bot.ask('Is GhostNet free?');
      expect(reply).toContain('free forever');
    });

    it('explains open source status', () => {
      const reply = bot.ask('Is GhostNet open source?');
      expect(reply).toContain('MIT license');
    });

    it('lists supported platforms', () => {
      const reply = bot.ask('What platforms does GhostNet support?');
      expect(reply).toContain('Android');
      expect(reply).toContain('iOS');
    });

    it('credits the builder', () => {
      const reply = bot.ask('Who built GhostNet?');
      expect(reply).toContain('N11X Labs');
    });

    it('explains government data requests', () => {
      const reply = bot.ask('Can governments force GhostNet to hand over data?');
      expect(reply).toContain('nothing to hand over');
    });

    it('compares to Telegram', () => {
      const reply = bot.ask('How is GhostNet different from Telegram?');
      expect(reply).toContain('peer-to-peer');
    });

    it('explains how to contact users', () => {
      const reply = bot.ask('How do I contact another user?');
      expect(reply).toContain('Node ID');
      expect(reply).toContain('Ghost Cards');
    });

    it('explains GhostNet Pay', () => {
      const reply = bot.ask('What is GhostNet Pay?');
      expect(reply).toContain('Polygon');
      expect(reply).toContain('USDC');
    });

    it('matches hardware intent for raspberry queries', () => {
      const reply = bot.ask('raspberry');
      expect(reply).toBe(
        'GhostNet nodes are optimized for low-resource hardware. A standard Raspberry Pi 4/5 or mid-tier Android device (e.g., Redmi 13C 5G) is sufficient to run the core relay firmware and local mesh modules.'
      );
    });

    it('matches installation intent for npm queries', () => {
      const reply = bot.ask('npm');
      expect(reply).toBe(
        'To initialize the SDK, run `npm install ghostnet-sdk`. Instantiate the core network class with your configuration options to begin deriving your BLAKE3 node identity.'
      );
    });

    it('matches troubleshooting intent for error queries', () => {
      const reply = bot.ask('error');
      expect(reply).toBe(
        'If your node drops connection, the SDK will attempt exponential backoff reconnection. Check local BLE permissions and ensure your AES-256-GCM keys are correctly formatted. For critical framework vulnerabilities, contact security@n11x.dev.'
      );
    });

    it('matches architecture intent for server queries', () => {
      const reply = bot.ask('server');
      expect(reply).toBe(
        'GhostNet operates on a strict zero-trust, peer-to-peer mesh topology. There are no central servers. Data is routed directly between physical node identities.'
      );
    });

    it('matches n11x ethos intent for n11x queries', () => {
      const reply = bot.ask('n11x');
      expect(reply).toBe(
        'The N11X Collective engineers sovereign, decentralized systems. We prioritize pure privacy, dark-tech precision, and zero-trust infrastructure over standard corporate software models.'
      );
    });

    it('matches ghost card intent for card queries', () => {
      const reply = bot.ask('card');
      expect(reply).toBe(
        'The Ghost Card serves as your visual cryptographic identity. It displays your active network status flags alongside a truncated BLAKE3 hash representation of your public key.'
      );
    });

    it('matches limits intent for payload queries', () => {
      const reply = bot.ask('payload');
      expect(reply).toBe(
        'All payloads are AES-256-GCM encrypted. For optimal Proximity Connect routing over BLE, individual packets should remain lightweight. Larger data transfers are handled via our automated store-and-forward chunking protocol.'
      );
    });

    it('matches dependencies intent for cost queries', () => {
      const reply = bot.ask('cost');
      expect(reply).toBe(
        'GhostNet relies on zero external APIs or paid subscriptions. The network is entirely self-hosted and decentralized, ensuring operations remain free and sovereign indefinitely.'
      );
    });

    it('matches joke server intent for joke queries', () => {
      const reply = bot.ask('joke');
      expect(reply).toBe(
        "Why did the centralized server cross the road? It didn't. It crashed, took the whole API down with it, and billed you for the downtime. Skill issue."
      );
    });

    it('matches slang based intent for based queries', () => {
      const reply = bot.ask('based');
      expect(reply).toBe(
        "No cap, centralized infrastructure is not based. GhostNet is strict sigma architecture. 100% decentralized rizz, zero API fees. We don't rely on third-party servers."
      );
    });

    it('matches slang cook intent for cook queries', () => {
      const reply = bot.ask('cook');
      expect(reply).toBe(
        'The N11X Collective is currently cooking. Our memory-hard Argon2id implementation is fully baked. Let the nodes cook in Phantom tier.'
      );
    });

    it('matches slang touch grass intent for grass queries', () => {
      const reply = bot.ask('grass');
      expect(reply).toBe(
        "Go touch grass. GhostNet's Proximity Connect works offline via Bluetooth Low Energy (BLE), so your nodes will stay securely meshed even if you are out in the woods."
      );
    });

    it('matches joke feds intent for sus queries', () => {
      const reply = bot.ask('sus');
      expect(reply).toBe('Nice try, fed. Ghost Shield is active. Your telemetry is cooked.');
    });

    it('matches joke feds intent for natural fed phrasing', () => {
      const reply = bot.ask('are you a fed?');
      expect(reply).toBe('Nice try, fed. Ghost Shield is active. Your telemetry is cooked.');
    });
  });

  describe('fallback', () => {
    it('returns terminal error for unrelated input', () => {
      const reply = bot.ask('What is the weather today?');
      expect(reply).toContain('Terminal Error');
    });

    it('returns terminal error for empty input', () => {
      const reply = bot.ask('');
      expect(reply).toContain('Terminal Error');
    });
  });

  describe('regex engine behavior', () => {
    it('matches installation intent from multiline punctuated input', () => {
      const reply = bot.ask('Hey,\n I want to install the npm package.\n How do I do it?');
      expect(reply).toBe(
        'To initialize the SDK, run `npm install ghostnet-sdk`. Instantiate the core network class with your configuration options to begin deriving your BLAKE3 node identity.'
      );
    });

    it('does not match hardware intent when input only contains api', () => {
      const reply = bot.ask('I need an api reference for integration');
      expect(reply).not.toBe(
        'GhostNet nodes are optimized for low-resource hardware. A standard Raspberry Pi 4/5 or mid-tier Android device (e.g., Redmi 13C 5G) is sufficient to run the core relay firmware and local mesh modules.'
      );
    });
  });
});
