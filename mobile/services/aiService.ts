import api from './api';

export interface AIResponse {
  reply: string;
  source: 'GEMINI_AI' | 'FALLBACK';
}

export const aiService = {
  chat: async (message: string): Promise<AIResponse> => {
    const response = await api.post('/ai/chat', { message });
    return response.data;
  },
};
