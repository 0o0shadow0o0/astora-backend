import { BaseEntity } from '../../../common/entities/base.entity';
import { User } from '../../users/entities/user.entity';
export declare enum AIProvider {
    OPENAI = "openai",
    GEMINI = "gemini",
    CLAUDE = "claude",
    DEEPSEEK = "deepseek",
    OLLAMA = "ollama"
}
export declare enum ConversationStatus {
    ACTIVE = "active",
    ENDED = "ended",
    ARCHIVED = "archived"
}
export declare class AIConversation extends BaseEntity {
    title: string;
    provider: AIProvider;
    status: ConversationStatus;
    context?: Record<string, any>;
    messageCount: number;
    contactPhone?: string;
    chatThreadId?: string;
    user: User;
    userId: string;
}
export declare class AIMessage extends BaseEntity {
    content: string;
    role: string;
    tokens?: number;
    metadata?: Record<string, any>;
    conversation: AIConversation;
    conversationId: string;
}
