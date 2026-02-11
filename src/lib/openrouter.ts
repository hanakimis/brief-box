import OpenAI from 'openai';

let _client: OpenAI | undefined;

export function getOpenRouterClient(): OpenAI {
  if (!_client) {
    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      throw new Error('OPENROUTER_API_KEY is not set');
    }
    _client = new OpenAI({
      baseURL: 'https://openrouter.ai/api/v1',
      apiKey,
    });
  }
  return _client;
}

export const MODEL = process.env.OPENROUTER_MODEL ?? 'openai/gpt-4o-mini';
