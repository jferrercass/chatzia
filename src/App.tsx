import React, { useState, useEffect } from 'react';
import { MessageSquare, Plus, BarChart3, Settings, Zap, FileText, Link, MessageCircle, Upload, Send, TrendingUp, Clock, CheckCircle, Users, Phone } from 'lucide-react';
import { DatabaseService } from './services/database';
import type { Chatbot, Conversation, Message, Knowledge } from './types';
import { formatDate, ensureDate, debugLog } from './utils/date';

// Si la tipificación de los iconos falla en este entorno, alias simples a `any`.
const SettingsIcon: any = Settings;

// Declaración global mínima para la API `window.storage` usada en este archivo.
declare global {
  interface Window {
    storage?: {
      get: (key: string) => Promise<any>;
      set: (key: string, value: any) => Promise<void>;
    };
  }
}

const App = () => {
  const [currentView, setCurrentView] = useState('dashboard');
  const [chatbots, setChatbots] = useState<Chatbot[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedBot, setSelectedBot] = useState<Chatbot | null>(null);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);

  // Cargar datos al inicio
  useEffect(() => {
    loadData();
    // Limpiar conexión de base de datos al desmontar
    return () => {
      DatabaseService.disconnect();
    };
  }, []);

  const loadData = async () => {
    try {
      const [loadedBots, loadedConvs] = await Promise.all([
        DatabaseService.getAllChatbots(),
        DatabaseService.getConversations()
      ]);

      setChatbots(loadedBots);
      setConversations(loadedConvs);
    } catch (error) {
      console.error('Error cargando datos de la base de datos:', error);
    }
  };

  const saveData = async (bots: Chatbot[], convs?: Conversation[]) => {
    try {
      console.log('Guardando datos...', { bots, convs });
      
      // Guardar nuevos bots
      for (const bot of bots) {
        if (!bot.id) {
          console.log('Creando nuevo bot:', bot);
          const createdBot = await DatabaseService.createChatbot(bot);
          bot.id = createdBot.id; // Actualizar el ID en el estado local
        }
      }

      // Guardar nuevas conversaciones
      if (convs) {
        for (const conv of convs) {
          if (!conv.id) {
            console.log('Creando nueva conversación:', conv);
            const createdConv = await DatabaseService.createConversation(conv);
            conv.id = createdConv.id; // Actualizar el ID en el estado local
          }
        }
      }

      // Recargar datos para asegurar consistencia
      await loadData();
      console.log('Datos guardados y recargados exitosamente');
    } catch (error) {
      console.error('Error guardando datos en la base de datos:', error);
    }
  };

  const createBot = (botData: Partial<Chatbot> & { name: string; description?: string }) => {
    const newBot = {
      id: Date.now().toString(),
      ...botData,
      createdAt: new Date().toISOString(),
      status: 'active',
      conversationsCount: 0,
      integrations: { whatsapp: false, telegram: false }
    };
    const updatedBots = [...chatbots, newBot];
    setChatbots(updatedBots);
    saveData(updatedBots, conversations);
    setCurrentView('dashboard');
  };

  const updateBot = async (botId: string, updates: Partial<Chatbot>) => {
    try {
      const updatedBot = await DatabaseService.updateChatbot(botId, updates);
      const updatedBots = chatbots.map((bot: Chatbot) => 
        bot.id === botId ? updatedBot : bot
      );
      setChatbots(updatedBots);
    } catch (error) {
      console.error('Error actualizando chatbot:', error);
      alert('Error al actualizar el chatbot. Por favor, inténtalo de nuevo.');
    }
  };

  const addConversation = (botId: string, message: string) => {
    const newConv: Conversation = {
      id: Date.now().toString(),
      botId,
      messages: [{ role: 'user', content: message, timestamp: new Date().toISOString() }],
      status: 'active',
      createdAt: new Date().toISOString(),
      channel: 'web'
    };
    const updatedConvs = [...conversations, newConv];
    setConversations(updatedConvs);
    
    const updatedBots = chatbots.map((bot: Chatbot) => 
      bot.id === botId ? { ...bot, conversationsCount: bot.conversationsCount + 1 } : bot
    );
    setChatbots(updatedBots);
    saveData(updatedBots, updatedConvs);
  };

  // Sidebar
  const Sidebar = () => (
    <div className="w-64 bg-gray-900 text-white h-screen fixed left-0 top-0 flex flex-col">
      <div className="p-6 border-b border-gray-800">
        <h1 className="text-xl font-bold flex items-center gap-2">
          <Zap className="text-blue-400" size={24} />
          ChatBot Studio
        </h1>
      </div>
      
      <nav className="flex-1 p-4">
        <button
          onClick={() => setCurrentView('dashboard')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition ${
            currentView === 'dashboard' ? 'bg-blue-600' : 'hover:bg-gray-800'
          }`}
        >
          <BarChart3 size={20} />
          <span>Dashboard</span>
        </button>
        
        <button
          onClick={() => { setSelectedBot(null); setCurrentView('create'); }}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition ${
            currentView === 'create' ? 'bg-blue-600' : 'hover:bg-gray-800'
          }`}
        >
          <Plus size={20} />
          <span>Crear Chatbot</span>
        </button>
        
        <button
          onClick={() => setCurrentView('conversations')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition ${
            currentView === 'conversations' ? 'bg-blue-600' : 'hover:bg-gray-800'
          }`}
        >
          <MessageSquare size={20} />
          <span>Conversaciones</span>
        </button>
        
        <button
          onClick={() => setCurrentView('integrations')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition ${
            currentView === 'integrations' ? 'bg-blue-600' : 'hover:bg-gray-800'
          }`}
        >
          <Phone size={20} />
          <span>Integraciones</span>
        </button>
        
        <button
          onClick={() => setCurrentView('analytics')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition ${
            currentView === 'analytics' ? 'bg-blue-600' : 'hover:bg-gray-800'
          }`}
        >
          <TrendingUp size={20} />
          <span>Analíticas</span>
        </button>
        
        <button
          onClick={() => setCurrentView('settings')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
            currentView === 'settings' ? 'bg-blue-600' : 'hover:bg-gray-800'
          }`}
        >
          <SettingsIcon size={20} />
          <span>Configuración</span>
        </button>
      </nav>
      
      <div className="p-4 border-t border-gray-800">
        <div className="text-sm text-gray-400">Plan Profesional</div>
        <div className="text-xs text-gray-500 mt-1">2,500 / 5,000 mensajes</div>
      </div>
    </div>
  );

  // Dashboard View
  const Dashboard = () => {
    const totalConversations = conversations.length;
    const activeConversations = conversations.filter(c => c.status === 'active').length;
    const todayConversations = conversations.filter(c => {
      const convDate = new Date(c.createdAt);
      const today = new Date();
      return convDate.toDateString() === today.toDateString();
    }).length;

    return (
      <div className="p-8">
        <h2 className="text-3xl font-bold mb-8">Dashboard</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Chatbots Activos</p>
                <p className="text-3xl font-bold mt-2">{chatbots.length}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <MessageSquare className="text-blue-600" size={24} />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Conversaciones Hoy</p>
                <p className="text-3xl font-bold mt-2">{todayConversations}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <TrendingUp className="text-green-600" size={24} />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Conversaciones Activas</p>
                <p className="text-3xl font-bold mt-2">{activeConversations}</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-lg">
                <MessageCircle className="text-purple-600" size={24} />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Tasa de Resolución</p>
                <p className="text-3xl font-bold mt-2">94%</p>
              </div>
              <div className="bg-yellow-100 p-3 rounded-lg">
                <CheckCircle className="text-yellow-600" size={24} />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h3 className="text-xl font-bold mb-4">Tus Chatbots</h3>
          {chatbots.length === 0 ? (
            <div className="text-center py-12">
              <MessageSquare className="mx-auto text-gray-300 mb-4" size={48} />
              <p className="text-gray-500 mb-4">Aún no has creado ningún chatbot</p>
              <button
                onClick={() => setCurrentView('create')}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                Crear Primer Chatbot
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {chatbots.map(bot => (
                <div key={bot.id} className="border rounded-lg p-4 hover:shadow-lg transition">
                  <div className="flex items-start justify-between mb-3">
                    <h4 className="font-semibold text-lg">{bot.name}</h4>
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                      Activo
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm mb-4">{bot.description}</p>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">{bot.conversationsCount} conversaciones</span>
                    <button
                      onClick={() => { setSelectedBot(bot); setCurrentView('create'); }}
                      className="text-blue-600 hover:text-blue-700"
                    >
                      Editar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  // Create/Edit Bot View
  const CreateBot = () => {
    const [trainingTab, setTrainingTab] = useState('files');
    const emptyForm = {
      name: '',
      description: '',
      language: 'es',
      personality: 'profesional',
      knowledge: { files: [], urls: [], faqs: [], text: '' }
    };

    const [formData, setFormData] = useState<any>(selectedBot ?? emptyForm);

    // Sincronizar cuando se selecciona un bot para editar
    useEffect(() => {
      if (selectedBot) {
        setFormData(selectedBot);
      } else {
        setFormData(emptyForm);
      }
    }, [selectedBot]);

    const handleSubmit = async () => {
      if (!formData.name || !formData.description) {
        alert('Por favor completa todos los campos requeridos');
        return;
      }
      
      if (selectedBot && selectedBot.id) {
        await updateBot(selectedBot.id, formData);
        setCurrentView('dashboard');
        setSelectedBot(null);
      } else {
        createBot(formData);
      }
    };

    return (
      <div className="p-8">
        <h2 className="text-3xl font-bold mb-8">
          {selectedBot ? 'Editar Chatbot' : 'Crear Nuevo Chatbot'}
        </h2>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-4">Configuración Básica</h3>
            
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Nombre del Chatbot</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="ej. Asistente de Ventas"
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Descripción</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows={3}
                placeholder="Describe el propósito de tu chatbot"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Idioma</label>
                <select
                  value={formData.language}
                  onChange={(e) => setFormData({...formData, language: e.target.value})}
                  className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="es">Español</option>
                  <option value="en">Inglés</option>
                  <option value="pt">Portugués</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Personalidad</label>
                <select
                  value={formData.personality}
                  onChange={(e) => setFormData({...formData, personality: e.target.value})}
                  className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="profesional">Profesional</option>
                  <option value="amigable">Amigable</option>
                  <option value="formal">Formal</option>
                  <option value="casual">Casual</option>
                </select>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-4">Entrenamiento del Conocimiento</h3>
            
            <div className="flex border-b mb-4">
              <button
                type="button"
                onClick={() => setTrainingTab('files')}
                className={`px-4 py-2 ${trainingTab === 'files' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'}`}
              >
                <Upload size={16} className="inline mr-2" />
                Archivos
              </button>
              <button
                type="button"
                onClick={() => setTrainingTab('urls')}
                className={`px-4 py-2 ${trainingTab === 'urls' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'}`}
              >
                <Link size={16} className="inline mr-2" />
                URLs
              </button>
              <button
                type="button"
                onClick={() => setTrainingTab('faqs')}
                className={`px-4 py-2 ${trainingTab === 'faqs' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'}`}
              >
                <MessageCircle size={16} className="inline mr-2" />
                Preguntas y Respuestas
              </button>
              <button
                type="button"
                onClick={() => setTrainingTab('text')}
                className={`px-4 py-2 ${trainingTab === 'text' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'}`}
              >
                <FileText size={16} className="inline mr-2" />
                Texto
              </button>
            </div>

            {trainingTab === 'files' && (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <Upload className="mx-auto text-gray-400 mb-4" size={48} />
                <p className="text-gray-600 mb-2">Arrastra archivos aquí o haz clic para seleccionar</p>
                <p className="text-sm text-gray-500">Soporta PDF, DOCX, TXT, CSV (máx. 10MB)</p>
                <input type="file" className="hidden" />
              </div>
            )}

            {trainingTab === 'urls' && (
              <div>
                <input
                  type="url"
                  placeholder="https://ejemplo.com"
                  className="w-full border rounded-lg px-4 py-2 mb-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <button type="button" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
                  Agregar URL
                </button>
              </div>
            )}

            {trainingTab === 'faqs' && (
              <div>
                <input
                  type="text"
                  placeholder="Pregunta"
                  className="w-full border rounded-lg px-4 py-2 mb-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <textarea
                  placeholder="Respuesta"
                  className="w-full border rounded-lg px-4 py-2 mb-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows={3}
                />
                <button type="button" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
                  Agregar FAQ
                </button>
              </div>
            )}

            {trainingTab === 'text' && (
              <textarea
                value={formData.knowledge.text}
                onChange={(e) => setFormData({
                  ...formData,
                  knowledge: {...formData.knowledge, text: e.target.value}
                })}
                className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows={8}
                placeholder="Escribe información que el chatbot debe conocer..."
              />
            )}
          </div>

          <div className="flex justify-end gap-4">
            <button
              onClick={() => setCurrentView('dashboard')}
              className="px-6 py-2 border rounded-lg hover:bg-gray-50 transition"
            >
              Cancelar
            </button>
            <button
              onClick={handleSubmit}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              {selectedBot ? 'Guardar Cambios' : 'Crear Chatbot'}
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Conversations View
  const Conversations = () => {
    return (
      <div className="p-8">
        <h2 className="text-3xl font-bold mb-8">Conversaciones</h2>
        
        <div className="bg-white rounded-lg shadow">
          {conversations.length === 0 ? (
            <div className="text-center py-12">
              <MessageSquare className="mx-auto text-gray-300 mb-4" size={48} />
              <p className="text-gray-500">No hay conversaciones aún</p>
            </div>
          ) : (
            <div className="divide-y">
              {conversations.map(conv => {
                const bot = chatbots.find(b => b.id === conv.botId);
                return (
                  <div
                    key={conv.id}
                    onClick={() => setSelectedConversation(conv)}
                    className="p-4 hover:bg-gray-50 cursor-pointer transition"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold">{bot?.name || 'Bot Eliminado'}</span>
                      <span className="text-sm text-gray-500">
                        {formatDate(conv.createdAt)}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm truncate">
                      {conv.messages[0]?.content}
                    </p>
                    <div className="flex gap-2 mt-2">
                      <span className={`text-xs px-2 py-1 rounded ${
                        conv.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {conv.status === 'active' ? 'Activa' : 'Cerrada'}
                      </span>
                      <span className="text-xs px-2 py-1 rounded bg-blue-100 text-blue-800">
                        {conv.channel === 'web' ? 'Web' : conv.channel}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    );
  };

  // Integrations View
  const Integrations = () => {
    return (
      <div className="p-8">
        <h2 className="text-3xl font-bold mb-8">Integraciones</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-green-100 p-3 rounded-lg">
                <Phone className="text-green-600" size={32} />
              </div>
              <div>
                <h3 className="text-xl font-bold">WhatsApp Business</h3>
                <p className="text-sm text-gray-500">Conecta tu cuenta de WhatsApp</p>
              </div>
            </div>
            <p className="text-gray-600 mb-4">
              Permite que tus clientes hablen con tu chatbot directamente desde WhatsApp.
            </p>
            <button className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition">
              Conectar WhatsApp
            </button>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-blue-100 p-3 rounded-lg">
                <Send className="text-blue-600" size={32} />
              </div>
              <div>
                <h3 className="text-xl font-bold">Telegram</h3>
                <p className="text-sm text-gray-500">Conecta tu bot de Telegram</p>
              </div>
            </div>
            <p className="text-gray-600 mb-4">
              Integra tu chatbot con Telegram para llegar a más usuarios.
            </p>
            <button className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
              Conectar Telegram
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 mt-6">
          <h3 className="text-xl font-bold mb-4">Bots Conectados</h3>
          {chatbots.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No tienes chatbots configurados aún</p>
          ) : (
            <div className="space-y-4">
              {chatbots.map(bot => (
                <div key={bot.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">{bot.name}</span>
                    <div className="flex gap-2">
                      <button className="text-sm text-gray-600 hover:text-blue-600">
                        Configurar integraciones
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  // Analytics View
  const Analytics = () => {
    return (
      <div className="p-8">
        <h2 className="text-3xl font-bold mb-8">Analíticas</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Conversaciones por Día</h3>
            <div className="h-48 flex items-end justify-around gap-2">
              {[12, 18, 15, 22, 28, 25, 30].map((value, i) => (
                <div key={i} className="flex-1 flex flex-col items-center">
                  <div
                    className="w-full bg-blue-500 rounded-t"
                    style={{height: `${(value / 30) * 100}%`}}
                  />
                  <span className="text-xs text-gray-500 mt-2">
                    {['L', 'M', 'X', 'J', 'V', 'S', 'D'][i]}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Satisfacción del Cliente</h3>
            <div className="flex items-center justify-center h-48">
              <div className="text-center">
                <div className="text-6xl font-bold text-green-600 mb-2">94%</div>
                <p className="text-gray-600">Clientes satisfechos</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Temas Más Consultados</h3>
          <div className="space-y-3">
            {[
              { topic: 'Horarios de atención', count: 145 },
              { topic: 'Precios y tarifas', count: 128 },
              { topic: 'Política de devoluciones', count: 98 },
              { topic: 'Métodos de pago', count: 87 },
              { topic: 'Envíos y entregas', count: 76 }
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between">
                <span className="text-gray-700">{item.topic}</span>
                <div className="flex items-center gap-4">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{width: `${(item.count / 145) * 100}%`}}
                    />
                  </div>
                  <span className="text-gray-500 text-sm w-12 text-right">{item.count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // Settings View
  const Settings = () => {
    return (
      <div className="p-8">
        <h2 className="text-3xl font-bold mb-8">Configuración</h2>
        
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h3 className="text-xl font-semibold mb-4">Información de la Empresa</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Nombre de la Empresa</label>
              <input
                type="text"
                className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
                placeholder="Mi Empresa S.L."
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Correo Electrónico</label>
              <input
                type="email"
                className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
                placeholder="contacto@empresa.com"
              />
            </div>
            <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition">
              Guardar Cambios
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h3 className="text-xl font-semibold mb-4">Plan y Facturación</h3>
          <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg mb-4">
            <div>
              <p className="font-semibold">Plan Profesional</p>
              <p className="text-sm text-gray-600">5,000 mensajes/mes</p>
            </div>
            <span className="text-2xl font-bold text-blue-600">€49/mes</span>
          </div>
          <button className="text-blue-600 hover:text-blue-700">
            Ver otros planes
          </button>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-semibold mb-4">Gestión de Usuarios</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <Users size={20} className="text-blue-600" />
                </div>
                <div>
                  <p className="font-semibold">Admin Principal</p>
                  <p className="text-sm text-gray-500">admin@empresa.com</p>
                </div>
              </div>
              <span className="text-sm text-gray-500">Propietario</span>
            </div>
          </div>
          <button className="mt-4 text-blue-600 hover:text-blue-700">
            + Invitar Usuario
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <div className="ml-64">
        {currentView === 'dashboard' && <Dashboard />}
        {currentView === 'create' && <CreateBot />}
        {currentView === 'conversations' && <Conversations />}
        {currentView === 'integrations' && <Integrations />}
        {currentView === 'analytics' && <Analytics />}
        {currentView === 'settings' && <Settings />}
      </div>
    </div>
  );
};

export default App;