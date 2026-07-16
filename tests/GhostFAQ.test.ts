import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { GhostSupportBot } from '../src/lib/GhostFAQ.js';

const ERROR_MESSAGE = "I'm having trouble right now — please try again.";

function mockFetchOnce(body: unknown, ok = true, status = 200) {
  return vi.spyOn(globalThis, 'fetch').mockResolvedValue({
    ok,
    status,
    json: async () => body,
  } as Response);
}

describe('GhostSupportBot', () => {
  beforeEach(() => vi.restoreAllMocks());
  afterEach(() => vi.restoreAllMocks());

  it('returns the answer from the chat edge function', async () => {
    mockFetchOnce({ answer: 'GhostNet uses AES-256-GCM.' });
    const bot = new GhostSupportBot();
    expect(await bot.ask('what encryption?')).toBe('GhostNet uses AES-256-GCM.');
  });

  it('sends question and publishable key headers to the chat endpoint', async () => {
    const spy = mockFetchOnce({ answer: 'ok' });
    const bot = new GhostSupportBot({
      chatUrl: 'https://example.test/functions/v1/chat',
      supabaseKey: 'sb_publishable_test',
    });
    await bot.ask('hello');

    const [url, init] = spy.mock.calls[0] as [string, RequestInit];
    expect(url).toBe('https://example.test/functions/v1/chat');
    const headers = init.headers as Record<string, string>;
    expect(headers.apikey).toBe('sb_publishable_test');
    expect(headers.Authorization).toBe('Bearer sb_publishable_test');
    expect(JSON.parse(init.body as string).question).toBe('hello');
  });

  it('includes prior turns as history (capped at 6)', async () => {
    const spy = vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ answer: 'a' }),
    } as Response);
    const bot = new GhostSupportBot();
    for (let i = 0; i < 5; i++) await bot.ask(`q${i}`);

    const lastBody = JSON.parse(
      spy.mock.calls.at(-1)![1]!.body as string,
    ) as { history: Array<{ role: string; content: string }> };
    expect(lastBody.history.length).toBe(6);
    expect(lastBody.history.at(-1)).toEqual({ role: 'assistant', content: 'a' });
  });

  it('returns graceful error on non-200 response', async () => {
    mockFetchOnce({ error: 'LLM provider error' }, false, 502);
    const bot = new GhostSupportBot();
    expect(await bot.ask('anything')).toBe(ERROR_MESSAGE);
  });

  it('returns graceful error on network failure', async () => {
    vi.spyOn(globalThis, 'fetch').mockRejectedValue(new Error('offline'));
    const bot = new GhostSupportBot();
    expect(await bot.ask('anything')).toBe(ERROR_MESSAGE);
  });

  it('returns graceful error when response has no answer', async () => {
    mockFetchOnce({});
    const bot = new GhostSupportBot();
    expect(await bot.ask('anything')).toBe(ERROR_MESSAGE);
  });

  it('returns graceful error for empty input without calling the network', async () => {
    const spy = vi.spyOn(globalThis, 'fetch');
    const bot = new GhostSupportBot();
    expect(await bot.ask('')).toBe(ERROR_MESSAGE);
    expect(await bot.ask('   ')).toBe(ERROR_MESSAGE);
    expect(spy).not.toHaveBeenCalled();
  });

  it('never invents answers: failed turns are not added to history', async () => {
    vi.spyOn(globalThis, 'fetch').mockRejectedValue(new Error('offline'));
    const bot = new GhostSupportBot();
    await bot.ask('q1');

    const spy = mockFetchOnce({ answer: 'ok' });
    await bot.ask('q2');
    const body = JSON.parse(spy.mock.calls[0][1]!.body as string);
    expect(body.history).toEqual([]);
  });
});
