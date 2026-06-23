import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';
import { AIConversation, AIMessage } from '../entities/ai-conversation.entity';
export interface AIResponse {
    content: string;
    tokens?: number;
    model: string;
}
export interface ChatMessage {
    role: 'system' | 'user' | 'assistant';
    content: string;
}
export declare class AIService {
    private conversationRepository;
    private messageRepository;
    private configService;
    private readonly logger;
    private openai;
    private currentProvider;
    constructor(conversationRepository: Repository<AIConversation>, messageRepository: Repository<AIMessage>, configService: ConfigService);
    private initializeProviders;
    createConversation(userId: string, title?: string): Promise<AIConversation>;
    getConversations(userId: string): Promise<AIConversation[]>;
    sendMessage(conversationId: string, userId: string, content: string, systemPrompt?: string): Promise<AIResponse>;
    private sendToOpenAI;
    private sendToGemini;
    private sendToClaude;
    private sendToDeepSeek;
    private sendToOllama;
    private getConversationMessages;
    deleteConversation(id: string, userId: string): Promise<void>;
    generateProductRecommendation(conversationId: string, userId: string): Promise<string>;
    analyzeCustomerIntent(conversationId: string, userId: string, message: string): Promise<{
        intent: string;
        sentiment: 'positive' | 'neutral' | 'negative';
        entities: string[];
    }>;
}
