/**
 * Browser entry point for @n11x/ghostnet-sdk.
 *
 * Built by tsup into an IIFE bundle (`dist/ghostnet-sdk.global.js`) that
 * exposes `window.GhostNetSDK`. This is what no-build static sites (e.g. the
 * GhostNet marketing website) load via a plain <script> tag to get the
 * RAG-backed `GhostSupportBot` without a bundler.
 *
 * Only browser-safe, dependency-free exports belong here.
 */
export { GhostSupportBot } from './lib/GhostFAQ.js';
export type {
  GhostSupportBotOptions,
  ChatTurn,
} from './lib/GhostFAQ.js';
