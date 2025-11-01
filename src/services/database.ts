import { PrismaClient } from '@prisma/client';
import type { Chatbot, Conversation, Message, Knowledge } from '../types';

// Singleton para mantener una única instancia de PrismaClient
class PrismaInstance {
  private static instance: PrismaClient;

  public static getInstance(): PrismaClient {
    if (!PrismaInstance.instance) {
      PrismaInstance.instance = new PrismaClient({
        log: ['query', 'error', 'warn'],
      });
    }
    return PrismaInstance.instance;
  }
}

const prisma = PrismaInstance.getInstance();

export const DatabaseService = {
  // Chatbots
  async getAllChatbots(): Promise<Chatbot[]> {
    const bots = await prisma.chatbot.findMany({
      include: {
        knowledge: true,
      },
    });
    return bots.map(bot => ({
      ...bot,
      description: bot.description ?? undefined,
      language: bot.language ?? undefined,
      personality: bot.personality ?? undefined,
      createdAt: bot.createdAt.toISOString(),
      integrations: {
        whatsapp: bot.whatsappEnabled,
        telegram: bot.telegramEnabled,
      },
      knowledge: bot.knowledge ? {
        files: (() => {
          try {
            return JSON.parse(bot.knowledge.files);
          } catch {
            return [];
          }
        })(),
        urls: (() => {
          try {
            return JSON.parse(bot.knowledge.urls);
          } catch {
            return [];
          }
        })(),
        faqs: (() => {
          try {
            return JSON.parse(bot.knowledge.faqs);
          } catch {
            return [];
          }
        })(),
        text: bot.knowledge.text,
      } : undefined,
    }));
  },

  async createChatbot(bot: Omit<Chatbot, 'id' | 'createdAt'>): Promise<Chatbot> {
    const newBot = await prisma.chatbot.create({
      data: {
        name: bot.name,
        description: bot.description,
        status: bot.status,
        conversationsCount: 0,
        whatsappEnabled: bot.integrations.whatsapp,
        telegramEnabled: bot.integrations.telegram,
        language: bot.language,
        personality: bot.personality,
        knowledge: bot.knowledge ? {
          create: {
            files: JSON.stringify(bot.knowledge.files),
            urls: JSON.stringify(bot.knowledge.urls),
            faqs: JSON.stringify(bot.knowledge.faqs),
            text: bot.knowledge.text,
          },
        } : undefined,
      },
      include: {
        knowledge: true,
      },
    });

    return {
      ...newBot,
      description: newBot.description ?? undefined,
      language: newBot.language ?? undefined,
      personality: newBot.personality ?? undefined,
      createdAt: newBot.createdAt.toISOString(),
      integrations: {
        whatsapp: newBot.whatsappEnabled,
        telegram: newBot.telegramEnabled,
      },
      knowledge: newBot.knowledge ? {
        files: JSON.parse(newBot.knowledge.files),
        urls: JSON.parse(newBot.knowledge.urls),
        faqs: JSON.parse(newBot.knowledge.faqs),
        text: newBot.knowledge.text,
      } : undefined,
    };
  },

  // Conversations
  async getConversations(): Promise<Conversation[]> {
    const conversations = await prisma.conversation.findMany({
      include: {
        messages: true,
      },
    });
    return conversations.map(conv => ({
      ...conv,
      createdAt: conv.createdAt.toISOString(),
      messages: conv.messages.map(msg => ({
        ...msg,
        role: msg.role as 'user' | 'bot',
        timestamp: msg.timestamp.toISOString(),
      })),
    }));
  },

  async createConversation(conv: Omit<Conversation, 'id' | 'createdAt'>): Promise<Conversation> {
    const newConv = await prisma.conversation.create({
      data: {
        botId: conv.botId,
        status: conv.status,
        channel: conv.channel,
        messages: {
          create: conv.messages.map(msg => ({
            role: msg.role,
            content: msg.content,
            timestamp: new Date(msg.timestamp),
          })),
        },
      },
      include: {
        messages: true,
      },
    });
    return {
      ...newConv,
      createdAt: newConv.createdAt.toISOString(),
      messages: newConv.messages.map(msg => ({
        ...msg,
        role: msg.role as 'user' | 'bot',
        timestamp: msg.timestamp.toISOString(),
      })),
    };
  },

  async addMessage(conversationId: string, message: Omit<Message, 'id' | 'conversationId'>): Promise<Message> {
    const newMessage = await prisma.message.create({
      data: {
        conversationId,
        role: message.role,
        content: message.content,
        timestamp: new Date(message.timestamp),
      },
    });
    return {
      ...newMessage,
      role: newMessage.role as 'user' | 'bot',
      timestamp: newMessage.timestamp.toISOString(),
    };
  },

  // Update operations
  async updateChatbot(botId: string, updates: Partial<Chatbot>): Promise<Chatbot> {
    const updatedBot = await prisma.chatbot.update({
      where: { id: botId },
      data: {
        name: updates.name,
        description: updates.description,
        status: updates.status,
        conversationsCount: updates.conversationsCount,
        whatsappEnabled: updates.integrations?.whatsapp,
        telegramEnabled: updates.integrations?.telegram,
        language: updates.language,
        personality: updates.personality,
        knowledge: updates.knowledge ? {
          upsert: {
            create: {
              files: JSON.stringify(updates.knowledge.files),
              urls: JSON.stringify(updates.knowledge.urls),
              faqs: JSON.stringify(updates.knowledge.faqs),
              text: updates.knowledge.text,
            },
            update: {
              files: JSON.stringify(updates.knowledge.files),
              urls: JSON.stringify(updates.knowledge.urls),
              faqs: JSON.stringify(updates.knowledge.faqs),
              text: updates.knowledge.text,
            },
          },
        } : undefined,
      },
      include: {
        knowledge: true,
      },
    });

    return {
      ...updatedBot,
      description: updatedBot.description ?? undefined,
      language: updatedBot.language ?? undefined,
      personality: updatedBot.personality ?? undefined,
      createdAt: updatedBot.createdAt.toISOString(),
      integrations: {
        whatsapp: updatedBot.whatsappEnabled,
        telegram: updatedBot.telegramEnabled,
      },
      knowledge: updatedBot.knowledge ? {
        files: JSON.parse(updatedBot.knowledge.files),
        urls: JSON.parse(updatedBot.knowledge.urls),
        faqs: JSON.parse(updatedBot.knowledge.faqs),
        text: updatedBot.knowledge.text,
      } : undefined,
    };
  },

  async updateConversation(conversationId: string, updates: Partial<Conversation>): Promise<Conversation> {
    const updatedConv = await prisma.conversation.update({
      where: { id: conversationId },
      data: {
        status: updates.status,
        channel: updates.channel,
      },
      include: {
        messages: true,
      },
    });

    return {
      ...updatedConv,
      createdAt: updatedConv.createdAt.toISOString(),
      messages: updatedConv.messages.map(msg => ({
        ...msg,
        role: msg.role as 'user' | 'bot',
        timestamp: msg.timestamp.toISOString(),
      })),
    };
  },

  // Inicialización y limpieza
  async disconnect() {
    await prisma.$disconnect();
  },
};