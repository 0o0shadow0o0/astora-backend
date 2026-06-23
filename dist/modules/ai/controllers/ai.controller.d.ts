import { AIService, AIResponse } from '../services/ai.service';
declare class SendMessageDto {
    content: string;
    systemPrompt?: string;
}
export declare class AIController {
    private readonly aiService;
    constructor(aiService: AIService);
    createConversation(req: any, title?: string): Promise<import("../entities/ai-conversation.entity").AIConversation>;
    getConversations(req: any): Promise<import("../entities/ai-conversation.entity").AIConversation[]>;
    getConversation(id: string, req: any): Promise<import("../entities/ai-conversation.entity").AIMessage[]>;
    sendMessage(id: string, req: any, dto: SendMessageDto): Promise<AIResponse>;
    deleteConversation(id: string, req: any): Promise<{
        message: string;
    }>;
    recommendProduct(id: string, req: any): Promise<{
        recommendation: string;
    }>;
    analyzeIntent(id: string, req: any, message: string): Promise<{
        intent: string;
        sentiment: "positive" | "neutral" | "negative";
        entities: string[];
    }>;
}
export {};
