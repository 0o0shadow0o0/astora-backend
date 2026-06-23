export interface WhatsAppMessage {
  id: string;
  from: string;
  to: string;
  content: string;
  type: 'text' | 'image' | 'video' | 'audio' | 'document' | 'location' | 'contact';
  timestamp: Date;
  fromMe: boolean;
  ack?: 'pending' | 'server' | 'device' | 'read' | 'error';
}

export interface WhatsAppContact {
  id: string;
  name?: string;
  pushname?: string;
  profilePictureUrl?: string;
  isBusiness?: boolean;
  isEnterprise?: boolean;
  status?: string;
}

export interface WhatsAppSession {
  id: string;
  state: 'open' | 'closed' | 'connecting';
  qr?: string;
}

export interface WhatsAppProvider {
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  getConnectionState(): string;
  sendTextMessage(to: string, content: string): Promise<WhatsAppMessage>;
  sendMediaMessage(to: string, mediaUrl: string, type: string, caption?: string): Promise<WhatsAppMessage>;
  sendDocumentMessage(to: string, documentUrl: string, filename: string): Promise<WhatsAppMessage>;
  sendLocationMessage(to: string, latitude: number, longitude: number): Promise<WhatsAppMessage>;
  getContacts(): Promise<WhatsAppContact[]>;
  getChatById(chatId: string): Promise<any>;
  getMessages(chatId: string, limit?: number): Promise<WhatsAppMessage[]>;
  markAsRead(chatId: string): Promise<void>;
  archiveChat(chatId: string, archive: boolean): Promise<void>;
  pinChat(chatId: string, pin: boolean): Promise<void>;
  muteChat(chatId: string, mute: boolean, duration?: number): Promise<void>;
  deleteMessage(chatId: string, messageId: string): Promise<void>;
  downloadMedia(messageId: string): Promise<Buffer>;
  getQRCode(): Promise<string>;
  onQR(callback: (qr: string) => void): void;
  onMessage(callback: (message: WhatsAppMessage) => void): void;
  onConnectionChange(callback: (state: string) => void): void;
}
