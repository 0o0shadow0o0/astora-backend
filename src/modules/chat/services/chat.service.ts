import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, FindOptionsWhere } from 'typeorm';
import { ChatThread, ChatStatus } from '../entities/chat-thread.entity';
import { Message } from '../entities/message.entity';
import { PaginatedResponseDto } from '../../../common/dto/common.dto';
import {
  CreateChatThreadDto,
  UpdateChatThreadDto,
  ChatQueryDto,
  MessageQueryDto,
} from '../dto/chat.dto';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(ChatThread)
    private chatThreadRepository: Repository<ChatThread>,
    @InjectRepository(Message)
    private messageRepository: Repository<Message>,
  ) {}

  async createChatThread(
    userId: string,
    dto: CreateChatThreadDto,
  ): Promise<ChatThread> {
    const chatThread = this.chatThreadRepository.create({
      ...dto,
      userId,
    });
    return this.chatThreadRepository.save(chatThread);
  }

  async findAllChats(
    userId: string,
    query: ChatQueryDto,
  ): Promise<PaginatedResponseDto<ChatThread>> {
    const { page = 1, limit = 20, type, status, isPinned, isArchived, contactId, whatsappAccountId } = query;

    const where: FindOptionsWhere<ChatThread> = { userId };

    if (type) where.type = type;
    if (status) where.status = status;
    if (isPinned !== undefined) where.isPinned = isPinned;
    if (isArchived !== undefined) where.isArchived = isArchived;
    if (contactId) where.contactId = contactId;
    if (whatsappAccountId) where.whatsappAccountId = whatsappAccountId;

    const [data, total] = await this.chatThreadRepository.findAndCount({
      where,
      relations: ['contact'],
      order: { lastMessageAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findChatById(id: string, userId: string): Promise<ChatThread> {
    const chat = await this.chatThreadRepository.findOne({
      where: { id, userId },
      relations: ['contact', 'messages'],
    });

    if (!chat) {
      throw new NotFoundException('Chat not found');
    }

    return chat;
  }

  async updateChatThread(
    id: string,
    userId: string,
    dto: UpdateChatThreadDto,
  ): Promise<ChatThread> {
    const chat = await this.findChatById(id, userId);
    Object.assign(chat, dto);
    return this.chatThreadRepository.save(chat);
  }

  async deleteChatThread(id: string, userId: string): Promise<void> {
    const chat = await this.findChatById(id, userId);
    await this.chatThreadRepository.remove(chat);
  }

  async getMessages(
    chatThreadId: string,
    userId: string,
    query: MessageQueryDto,
  ): Promise<PaginatedResponseDto<Message>> {
    const chat = await this.findChatById(chatThreadId, userId);
    
    const { page = 1, limit = 20, type, direction, status, search } = query;

    const where: FindOptionsWhere<Message> = { chatThreadId: chat.id };

    if (type) where.type = type;
    if (direction) where.direction = direction;
    if (status) where.status = status as any;
    if (search) where.content = Like(`%${search}%`);

    const [data, total] = await this.messageRepository.findAndCount({
      where,
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async createMessage(
    chatThreadId: string,
    userId: string,
    dto: any,
  ): Promise<Message> {
    const chat = await this.findChatById(chatThreadId, userId);

    const message = this.messageRepository.create({
      ...dto,
      chatThreadId: chat.id,
      userId,
    });

    const savedMessage = await this.messageRepository.save(message);

    await this.chatThreadRepository.update(chat.id, {
      lastMessage: dto.content,
      lastMessageAt: new Date(),
      messageCount: chat.messageCount + 1,
    });

    return savedMessage;
  }

  async markAsRead(id: string, userId: string): Promise<void> {
    const chat = await this.findChatById(id, userId);
    await this.chatThreadRepository.update(chat.id, { unreadCount: 0 });
  }

  async archiveChat(id: string, userId: string, archive: boolean): Promise<void> {
    const chat = await this.findChatById(id, userId);
    await this.chatThreadRepository.update(chat.id, {
      isArchived: archive,
      status: archive ? ChatStatus.ARCHIVED : ChatStatus.ACTIVE,
    });
  }

  async pinChat(id: string, userId: string, pin: boolean): Promise<void> {
    const chat = await this.findChatById(id, userId);
    await this.chatThreadRepository.update(chat.id, {
      isPinned: pin,
      status: pin ? ChatStatus.PINNED : ChatStatus.ACTIVE,
    });
  }
}
