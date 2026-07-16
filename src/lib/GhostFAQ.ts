export interface GhostSupportBotOptions {
  /** Full URL of the Supabase `chat` edge function. */
  chatUrl?: string;
  /** Supabase publishable (safe-to-expose) API key. */
  supabaseKey?: string;
}

export interface ChatTurn {
  role: 'user' | 'assistant';
  content: string;
}

const DEFAULT_CHAT_URL =
  'https://cypmjgbtcfowsqlwkzfu.supabase.co/functions/v1/chat';
const DEFAULT_SUPABASE_KEY = 'sb_publishable_3Ku966M5-NZw2X7vb_LiFA_lsfoZSmh';

const ERROR_MESSAGE = "I'm having trouble right now — please try again.";

/**
 * GhostNet Assistant client. All answering happens server-side in the
 * Supabase `chat` edge function (retrieval from the knowledge base plus a
 * grounded LLM call); this class only transports the question and renders
 * the answer. It never invents answers locally.
 */
export class GhostSupportBot {
  private chatUrl: string;
  private supabaseKey: string;
  private history: ChatTurn[] = [];

  constructor(options: GhostSupportBotOptions = {}) {
    this.chatUrl = options.chatUrl ?? DEFAULT_CHAT_URL;
    this.supabaseKey = options.supabaseKey ?? DEFAULT_SUPABASE_KEY;
  }

  async ask(userInput: string): Promise<string> {
    const question = userInput?.trim();
    if (!question) return ERROR_MESSAGE;

    try {
      const res = await fetch(this.chatUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          apikey: this.supabaseKey,
          Authorization: `Bearer ${this.supabaseKey}`,
        },
        body: JSON.stringify({ question, history: this.history.slice(-6) }),
      });
      if (!res.ok) return ERROR_MESSAGE;

      const data = (await res.json()) as { answer?: string };
      if (typeof data.answer !== 'string' || data.answer.length === 0) {
        return ERROR_MESSAGE;
      }

      this.history.push({ role: 'user', content: question });
      this.history.push({ role: 'assistant', content: data.answer });
      return data.answer;
    } catch {
      return ERROR_MESSAGE;
    }
  }
}
