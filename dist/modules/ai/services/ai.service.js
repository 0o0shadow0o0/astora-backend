"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var AIService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AIService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const openai_1 = __importDefault(require("openai"));
const ai_conversation_entity_1 = require("../entities/ai-conversation.entity");
let AIService = AIService_1 = class AIService {
    constructor(conversationRepository, messageRepository, configService) {
        this.conversationRepository = conversationRepository;
        this.messageRepository = messageRepository;
        this.configService = configService;
        this.logger = new common_1.Logger(AIService_1.name);
        this.initializeProviders();
    }
    initializeProviders() {
        const openaiApiKey = this.configService.get('OPENAI_API_KEY');
        if (openaiApiKey) {
            this.openai = new openai_1.default({ apiKey: openaiApiKey });
        }
        this.currentProvider = this.configService.get('AI_PROVIDER', 'openai');
    }
    async createConversation(userId, title) {
        const conversation = this.conversationRepository.create({
            title: title || 'New Conversation',
            provider: this.currentProvider,
            userId,
        });
        return this.conversationRepository.save(conversation);
    }
    async getConversations(userId) {
        return this.conversationRepository.find({
            where: { userId },
            order: { createdAt: 'DESC' },
        });
    }
    async sendMessage(conversationId, userId, content, systemPrompt) {
        const conversation = await this.conversationRepository.findOne({
            where: { id: conversationId, userId },
        });
        if (!conversation) {
            throw new Error('Conversation not found');
        }
        const messages = await this.getConversationMessages(conversationId);
        const chatMessages = [];
        if (systemPrompt) {
            chatMessages.push({ role: 'system', content: systemPrompt });
        }
        messages.forEach(msg => {
            chatMessages.push({ role: msg.role, content: msg.content });
        });
        chatMessages.push({ role: 'user', content });
        const userMessage = this.messageRepository.create({
            content,
            role: 'user',
            conversationId,
        });
        await this.messageRepository.save(userMessage);
        let response;
        switch (this.currentProvider) {
            case ai_conversation_entity_1.AIProvider.OPENAI:
                response = await this.sendToOpenAI(chatMessages);
                break;
            case ai_conversation_entity_1.AIProvider.GEMINI:
                response = await this.sendToGemini(chatMessages);
                break;
            case ai_conversation_entity_1.AIProvider.CLAUDE:
                response = await this.sendToClaude(chatMessages);
                break;
            case ai_conversation_entity_1.AIProvider.DEEPSEEK:
                response = await this.sendToDeepSeek(chatMessages);
                break;
            case ai_conversation_entity_1.AIProvider.OLLAMA:
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
    async sendToOpenAI(messages) {
        const model = this.configService.get('OPENAI_MODEL', 'gpt-4-turbo-preview');
        const completion = await this.openai.chat.completions.create({
            model,
            messages: messages,
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
    async sendToGemini(messages) {
        const apiKey = this.configService.get('GEMINI_API_KEY');
        const model = this.configService.get('GEMINI_MODEL', 'gemini-pro');
        const contents = messages.map(m => ({
            role: m.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: m.content }],
        }));
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents }),
        });
        const data = await response.json();
        return {
            content: data.candidates?.[0]?.content?.parts?.[0]?.text || '',
            model,
        };
    }
    async sendToClaude(messages) {
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
    async sendToDeepSeek(messages) {
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
    async sendToOllama(messages) {
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
    async getConversationMessages(conversationId) {
        return this.messageRepository.find({
            where: { conversationId },
            order: { createdAt: 'ASC' },
        });
    }
    async deleteConversation(id, userId) {
        const conversation = await this.conversationRepository.findOne({
            where: { id, userId },
        });
        if (conversation) {
            await this.messageRepository.delete({ conversationId: id });
            await this.conversationRepository.remove(conversation);
        }
    }
    async generateProductRecommendation(conversationId, userId) {
        return this.sendMessage(conversationId, userId, 'Based on our conversation, suggest a product that would be suitable for me.', 'You are a helpful sales assistant. Recommend products based on customer needs.').then(res => res.content);
    }
    async analyzeCustomerIntent(conversationId, userId, message) {
        const response = await this.sendMessage(conversationId, userId, `Analyze this customer message: "${message}"
       Return JSON with: intent, sentiment (positive/neutral/negative), and entities found.`, 'You are a customer intent analyzer. Return only valid JSON.');
        try {
            return JSON.parse(response.content);
        }
        catch {
            return { intent: 'unknown', sentiment: 'neutral', entities: [] };
        }
    }
};
exports.AIService = AIService;
exports.AIService = AIService = AIService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(ai_conversation_entity_1.AIConversation)),
    __param(1, (0, typeorm_1.InjectRepository)(ai_conversation_entity_1.AIMessage)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        config_1.ConfigService])
], AIService);
//# sourceMappingURL=ai.service.js.map