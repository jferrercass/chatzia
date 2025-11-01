export type FileUpload = {
  name: string;
  size: number;
  type: string;
  content?: string;
  uploadedAt: string;
};

export type FAQ = {
  question: string;
  answer: string;
  id?: string;
};

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
  status: 'active' | 'closed';
  createdAt: string | Date;
  channel: 'web' | 'whatsapp' | 'telegram';
};

export type Knowledge = {
  files: FileUpload[];
  urls: string[];
  faqs: FAQ[];
  text: string;
};

export type BotStatus = 'active' | 'inactive' | 'training';
export type BotLanguage = 'es' | 'en' | 'pt';
export type BotPersonality = 'profesional' | 'amigable' | 'formal' | 'casual';

export type Chatbot = {
  id?: string;
  name: string;
  description?: string;
  createdAt?: string;
  status: BotStatus;
  conversationsCount: number;
  integrations: {
    whatsapp: boolean;
    telegram: boolean;
  };
  language?: BotLanguage;
  personality?: BotPersonality;
  knowledge?: Knowledge;
};