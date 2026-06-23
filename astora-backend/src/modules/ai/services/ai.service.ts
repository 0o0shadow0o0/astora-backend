import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import OpenAI from 'openai';
import { AIConversation, AIMessage, AIProvider } from '../entities/ai-conversation.entity';

export interface AIResponse {
  content: string;
  tokens?: number;
  model: string;
}

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

@Injectable()
export class AIService {
  private readonly logger = new Logger(AIService.name);
  private openai: OpenAI;
  private currentProvider: AIProvider;

  constructor(
    @InjectRepository(AIConversation)
    private conversationRepository: Repository<AIConversation>,
    @InjectRepository(AIMessage)
    private messageRepository: Repository<AIMessage>,
    private configService: ConfigService,
  ) {
    this.initializeProviders();
  }

  private initializeProviders() {
    const openaiApiKey = this.configService.get('OPENAI_API_KEY');
    if (openaiApiKey) {
      this.openai = new OpenAI({ apiKey: openaiApiKey });
    }
    this.currentProvider = this.configService.get('AI_PROVIDER', 'openai') as AIProvider;
  }

  async createConversation(userId: string, title?: string): Promise<AIConversation> {
    const conversation = this.conversationRepository.create({
      title: title || 'New Conversation',
      provider: this.currentProvider,
      userId,
    });
    return this.conversationRepository.save(conversation);
  }

  async getConversations(userId: string): Promise<AIConversation[]> {
    return this.conversationRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  async sendMessage(
    conversationId: string,
    userId: string,
    content: string,
    systemPrompt?: string,
  ): Promise<AIResponse> {
    const conversation = await this.conversationRepository.findOne({
      where: { id: conversationId, userId },
    });

    if (!conversation) {
      throw new Error('Conversation not found');
    }

    const messages = await this.getConversationMessages(conversationId);
    
    const chatMessages: ChatMessage[] = [];
    if (systemPrompt) {
      chatMessages.push({ role: 'system', content: systemPrompt });
    }
    messages.forEach(msg => {
      chatMessages.push({ role: msg.role as 'user' | 'assistant', content: msg.content });
    });
    chatMessages.push({ role: 'user', content });

    const userMessage = this.messageRepository.create({
      content,
      role: 'user',
      conversationId,
    });
    await this.messageRepository.save(userMessage);

    let response: AIResponse;
    
    switch (this.currentProvider) {
      case AIProvider.OPENAI:
        response = await this.sendToOpenAI(chatMessages);
        break;
      case AIProvider.GEMINI:
        response = await this.sendToGemini(chatMessages);
        break;
      case AIProvider.CLAUDE:
        response = await this.sendToClaude(chatMessages);
        break;
      case AIProvider.DEEPSEEK:
        response = await this.sendToDeepSeek(chatMessages);
        break;
      case AIProvider.OLLAMA:
        response = await this.sendToOllama(chatMessages);
        break;
      default:
        response = await this.sendToOpenAI(chatMessages);
    }

    const assistantMessage = this.messageRepository.create({
      content: response.content,
      role: 'assistant',
      conversationId,
      tokens: response.tokens,
    });
    await this.messageRepository.save(assistantMessage);

    await this.conversationRepository.update(conversationId, {
      messageCount: conversation.messageCount + 2,
    });

    return response;
  }

  private async sendToOpenAI(messages: ChatMessage[]): Promise<AIResponse> {
    const model = this.configService.get('OPENAI_MODEL', 'gpt-4-turbo-preview');
    const completion = await this.openai.chat.completions.create({
      model,
      messages: messages as any,
      max_tokens: 2000,
      temperature: 0.7,
    });

    const usage = completion.usage;
    return {
      content: completion.choices[0].message.content,
      tokens: usage?.total_tokens,
      model,
    };
  }

  private async sendToGemini(messages: ChatMessage[]): Promise<AIResponse> {
    const apiKey = this.configService.get('GEMINI_API_KEY');
    const model = this.configService.get('GEMINI_MODEL', 'gemini-pro');
    
    const contents = messages.map(m => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }));

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents }),
      }
    );

    const data = await response.json();
    return {
      content: data.candidates?.[0]?.content?.parts?.[0]?.text || '',
      model,
    };
  }

  private async sendToClaude(messages: ChatMessage[]): Promise<AIResponse> {
    const apiKey = this.configService.get('CLAUDE_API_KEY');
    const model = this.configService.get('CLAUDE_MODEL', 'claude-3-opus-20240229');
    
    const response = await fetch(`https://api.anthropic.com/v1/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model,
        max_tokens: 2000,
        messages: messages.filter(m => m.role !== 'system'),
        system: messages.find(m => m.role === 'system')?.content,
      }),
    });

    const data = await response.json();
    return {
      content: data.content?.[0]?.text || '',
      tokens: data.usage?.input_tokens + data.usage?.output_tokens,
      model,
    };
  }

  private async sendToDeepSeek(messages: ChatMessage[]): Promise<AIResponse> {
    const apiKey = this.configService.get('DEEPSEEK_API_KEY');
    const model = this.configService.get('DEEPSEEK_MODEL', 'deepseek-chat');
    
    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages,
        max_tokens: 2000,
      }),
    });

    const data = await response.json();
    return {
      content: data.choices?.[0]?.message?.content || '',
      tokens: data.usage?.total_tokens,
      model,
    };
  }

  private async sendToOllama(messages: ChatMessage[]): Promise<AIResponse> {
    const baseUrl = this.configService.get('OLLAMA_BASE_URL', 'http://localhost:11434');
    const model = this.configService.get('OLLAMA_MODEL', 'llama2');
    
    const response = await fetch(`${baseUrl}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model,
        messages,
        stream: false,
      }),
    });

    const data = await response.json();
    return {
      content: data.message?.content || '',
      model,
    };
  }

  private async getConversationMessages(conversationId: string): Promise<AIMessage[]> {
    return this.messageRepository.find({
      where: { conversationId },
      order: { createdAt: 'ASC' },
    });
  }

  async deleteConversation(id: string, userId: string): Promise<void> {
    const conversation = await this.conversationRepository.findOne({
      where: { id, userId },
    });
    if (conversation) {
      await this.messageRepository.delete({ conversationId: id });
      await this.conversationRepository.remove(conversation);
    }
  }

  async generateProductRecommendation(conversationId: string, userId: string): Promise<string> {
    return this.sendMessage(
      conversationId,
      userId,
      'Based on our conversation, suggest a product that would be suitable for me.',
      'You are a helpful sales assistant. Recommend products based on customer needs.'
    ).then(res => res.content);
  }

  async analyzeCustomerIntent(conversationId: string, userId: string, message: string): Promise<{
    intent: string;
    sentiment: 'positive' | 'neutral' | 'negative';
    entities: string[];
  }> {
    const response = await this.sendMessage(
      conversationId,
      userId,
      `Analyze this customer message: "${message}"
       Return JSON with: intent, sentiment (positive/neutral/negative), and entities found.`,
      'You are a customer intent analyzer. Return only valid JSON.'
    );

    try {
      return JSON.parse(response.content);
    } catch {
      return { intent: 'unknown', sentiment: 'neutral', entities: [] };
    }
  }
}
