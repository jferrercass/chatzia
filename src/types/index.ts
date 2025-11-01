export type Message = {
  id?: string;
  role: 'user' | 'bot';
  content: string;
  timestamp: string | Date;
  conversationId?: string;
};

export type Conversation = {
  id?: string;
  botId: string;
  messages: Message[];
  status: 'active' | 'closed' | string;
  createdAt: string | Date;
  channel: string;
};

export type Knowledge = {
  files: any[];
  urls: string[];
  faqs: any[];
  text: string;
};

export type Chatbot = {
  id?: string;
  name: string;
  description?: string;
  createdAt?: string;
  status: string;
  conversationsCount: number;
  integrations: {
    whatsapp: boolean;
    telegram: boolean;
  };
  language?: string;
  personality?: string;
  knowledge?: Knowledge;
};