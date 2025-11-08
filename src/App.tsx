import React, { useState, useEffect } from 'react';
import {
  Rss,
  Plus,
  BarChart3,
  Settings,
  Radio,
  Code,
  Layers,
  TrendingUp,
  Filter,
  Globe,
  Youtube,
  Twitter,
  Instagram,
  Facebook,
  Linkedin,
  MessageCircle,
  ExternalLink,
  Copy,
  Check,
  Play,
  Pause,
  Eye,
  EyeOff,
  Pin,
  Trash2,
  RefreshCw,
  Download,
  Calendar,
  Hash,
  Tag,
  Search
} from 'lucide-react';
import type { RSSFeed, FeedItem, Bundle, Widget, SourceType, FilterRule } from './types';

// Type aliases for icons if needed
const SettingsIcon: any = Settings;

// Global storage interface
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
  const [feeds, setFeeds] = useState<RSSFeed[]>([]);
  const [feedItems, setFeedItems] = useState<FeedItem[]>([]);
  const [bundles, setBundles] = useState<Bundle[]>([]);
  const [widgets, setWidgets] = useState<Widget[]>([]);
  const [selectedFeed, setSelectedFeed] = useState<RSSFeed | null>(null);
  const [selectedBundle, setSelectedBundle] = useState<Bundle | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Load data on mount
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      if (window.storage) {
        const [loadedFeeds, loadedItems, loadedBundles, loadedWidgets] = await Promise.all([
          window.storage.get('rssFeeds'),
          window.storage.get('feedItems'),
          window.storage.get('bundles'),
          window.storage.get('widgets')
        ]);

        setFeeds(loadedFeeds ? JSON.parse(loadedFeeds) : []);
        setFeedItems(loadedItems ? JSON.parse(loadedItems) : []);
        setBundles(loadedBundles ? JSON.parse(loadedBundles) : []);
        setWidgets(loadedWidgets ? JSON.parse(loadedWidgets) : []);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const saveData = async (
    newFeeds?: RSSFeed[],
    newItems?: FeedItem[],
    newBundles?: Bundle[],
    newWidgets?: Widget[]
  ) => {
    try {
      if (window.storage) {
        if (newFeeds) await window.storage.set('rssFeeds', JSON.stringify(newFeeds));
        if (newItems) await window.storage.set('feedItems', JSON.stringify(newItems));
        if (newBundles) await window.storage.set('bundles', JSON.stringify(newBundles));
        if (newWidgets) await window.storage.set('widgets', JSON.stringify(newWidgets));
      }
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };

  const createFeed = (feedData: Partial<RSSFeed> & { name: string; sourceUrl: string; sourceType: SourceType }) => {
    const newFeed: RSSFeed = {
      id: Date.now().toString(),
      ...feedData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: 'active',
      itemCount: 0,
      filters: feedData.filters || [],
      autoRefresh: feedData.autoRefresh ?? true,
      refreshInterval: feedData.refreshInterval || 60
    };
    const updatedFeeds = [...feeds, newFeed];
    setFeeds(updatedFeeds);
    saveData(updatedFeeds);
    setCurrentView('dashboard');
  };

  const updateFeed = (feedId: string, updates: Partial<RSSFeed>) => {
    const updatedFeeds = feeds.map(feed =>
      feed.id === feedId ? { ...feed, ...updates, updatedAt: new Date().toISOString() } : feed
    );
    setFeeds(updatedFeeds);
    saveData(updatedFeeds);
  };

  const deleteFeed = (feedId: string) => {
    if (confirm('¿Estás seguro de eliminar este feed?')) {
      const updatedFeeds = feeds.filter(f => f.id !== feedId);
      setFeeds(updatedFeeds);
      saveData(updatedFeeds);
    }
  };

  const getSourceIcon = (sourceType: SourceType, size = 20) => {
    const icons: Record<SourceType, any> = {
      website: Globe,
      youtube: Youtube,
      twitter: Twitter,
      instagram: Instagram,
      facebook: Facebook,
      reddit: MessageCircle,
      linkedin: Linkedin,
      tiktok: Radio,
      telegram: MessageCircle,
      medium: Globe,
      blog: Globe
    };
    const Icon = icons[sourceType] || Globe;
    return <Icon size={size} />;
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  // Sidebar Component
  const Sidebar = () => (
    <div className="w-64 bg-gray-900 text-white h-screen fixed left-0 top-0 flex flex-col">
      <div className="p-6 border-b border-gray-800">
        <h1 className="text-xl font-bold flex items-center gap-2">
          <Rss className="text-orange-400" size={24} />
          FeedFlow
        </h1>
        <p className="text-xs text-gray-400 mt-1">RSS Feed Management</p>
      </div>

      <nav className="flex-1 p-4">
        <button
          onClick={() => setCurrentView('dashboard')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition ${
            currentView === 'dashboard' ? 'bg-orange-600' : 'hover:bg-gray-800'
          }`}
        >
          <BarChart3 size={20} />
          <span>Dashboard</span>
        </button>

        <button
          onClick={() => {
            setSelectedFeed(null);
            setCurrentView('create');
          }}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition ${
            currentView === 'create' ? 'bg-orange-600' : 'hover:bg-gray-800'
          }`}
        >
          <Plus size={20} />
          <span>Crear Feed</span>
        </button>

        <button
          onClick={() => setCurrentView('reader')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition ${
            currentView === 'reader' ? 'bg-orange-600' : 'hover:bg-gray-800'
          }`}
        >
          <Rss size={20} />
          <span>Lector de Feeds</span>
        </button>

        <button
          onClick={() => setCurrentView('bundles')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition ${
            currentView === 'bundles' ? 'bg-orange-600' : 'hover:bg-gray-800'
          }`}
        >
          <Layers size={20} />
          <span>Bundles</span>
        </button>

        <button
          onClick={() => setCurrentView('widgets')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition ${
            currentView === 'widgets' ? 'bg-orange-600' : 'hover:bg-gray-800'
          }`}
        >
          <Code size={20} />
          <span>Widgets</span>
        </button>

        <button
          onClick={() => setCurrentView('analytics')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition ${
            currentView === 'analytics' ? 'bg-orange-600' : 'hover:bg-gray-800'
          }`}
        >
          <TrendingUp size={20} />
          <span>Analíticas</span>
        </button>

        <button
          onClick={() => setCurrentView('settings')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
            currentView === 'settings' ? 'bg-orange-600' : 'hover:bg-gray-800'
          }`}
        >
          <SettingsIcon size={20} />
          <span>Configuración</span>
        </button>
      </nav>

      <div className="p-4 border-t border-gray-800">
        <div className="text-sm text-gray-400">Plan Professional</div>
        <div className="text-xs text-gray-500 mt-1">{feeds.length} / 50 feeds</div>
      </div>
    </div>
  );

  // Dashboard View
  const Dashboard = () => {
    const activeFeeds = feeds.filter(f => f.status === 'active').length;
    const totalItems = feedItems.length;
    const todayItems = feedItems.filter(item => {
      const itemDate = new Date(item.pubDate);
      const today = new Date();
      return itemDate.toDateString() === today.toDateString();
    }).length;

    return (
      <div className="p-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold">Dashboard</h2>
          <button
            onClick={() => {
              setSelectedFeed(null);
              setCurrentView('create');
            }}
            className="bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-700 transition flex items-center gap-2"
          >
            <Plus size={20} />
            Nuevo Feed
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Feeds Activos</p>
                <p className="text-3xl font-bold mt-2">{activeFeeds}</p>
              </div>
              <div className="bg-orange-100 p-3 rounded-lg">
                <Rss className="text-orange-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Items Hoy</p>
                <p className="text-3xl font-bold mt-2">{todayItems}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <TrendingUp className="text-green-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Total Items</p>
                <p className="text-3xl font-bold mt-2">{totalItems}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <Hash className="text-blue-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Bundles</p>
                <p className="text-3xl font-bold mt-2">{bundles.length}</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-lg">
                <Layers className="text-purple-600" size={24} />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-bold mb-4">Tus RSS Feeds</h3>
          {feeds.length === 0 ? (
            <div className="text-center py-12">
              <Rss className="mx-auto text-gray-300 mb-4" size={48} />
              <p className="text-gray-500 mb-4">Aún no has creado ningún feed</p>
              <button
                onClick={() => setCurrentView('create')}
                className="bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-700 transition"
              >
                Crear Primer Feed
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {feeds.map(feed => (
                <div key={feed.id} className="border rounded-lg p-4 hover:shadow-lg transition">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="bg-orange-100 p-2 rounded">
                        {getSourceIcon(feed.sourceType, 18)}
                      </div>
                      <h4 className="font-semibold">{feed.name}</h4>
                    </div>
                    <span
                      className={`text-xs px-2 py-1 rounded ${
                        feed.status === 'active'
                          ? 'bg-green-100 text-green-800'
                          : feed.status === 'paused'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {feed.status === 'active' ? 'Activo' : feed.status === 'paused' ? 'Pausado' : 'Error'}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">{feed.description}</p>
                  <div className="flex items-center justify-between text-sm mb-3">
                    <span className="text-gray-500 flex items-center gap-1">
                      <Hash size={14} />
                      {feed.itemCount} items
                    </span>
                    <span className="text-gray-400 text-xs">
                      {feed.sourceType.charAt(0).toUpperCase() + feed.sourceType.slice(1)}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setSelectedFeed(feed);
                        setCurrentView('create');
                      }}
                      className="flex-1 text-sm text-orange-600 hover:bg-orange-50 py-1 rounded transition"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => updateFeed(feed.id!, { status: feed.status === 'active' ? 'paused' : 'active' })}
                      className="flex-1 text-sm text-blue-600 hover:bg-blue-50 py-1 rounded transition flex items-center justify-center gap-1"
                    >
                      {feed.status === 'active' ? <Pause size={14} /> : <Play size={14} />}
                      {feed.status === 'active' ? 'Pausar' : 'Activar'}
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

  // Create/Edit Feed View
  const CreateFeed = () => {
    const emptyForm: Partial<RSSFeed> & { name: string; sourceUrl: string; sourceType: SourceType } = {
      name: '',
      description: '',
      sourceUrl: '',
      sourceType: 'website',
      filters: [],
      autoRefresh: true,
      refreshInterval: 60
    };

    const [formData, setFormData] = useState(selectedFeed || emptyForm);
    const [newFilter, setNewFilter] = useState<Partial<FilterRule>>({ type: 'keyword', action: 'include', value: '' });

    useEffect(() => {
      if (selectedFeed) {
        setFormData(selectedFeed);
      } else {
        setFormData(emptyForm);
      }
    }, [selectedFeed]);

    const handleSubmit = () => {
      if (!formData.name || !formData.sourceUrl) {
        alert('Por favor completa todos los campos requeridos');
        return;
      }

      if (selectedFeed && selectedFeed.id) {
        updateFeed(selectedFeed.id, formData);
        setCurrentView('dashboard');
        setSelectedFeed(null);
      } else {
        createFeed(formData);
      }
    };

    const addFilter = () => {
      if (newFilter.value) {
        const filter: FilterRule = {
          id: Date.now().toString(),
          type: newFilter.type as 'keyword' | 'domain' | 'date',
          action: newFilter.action as 'include' | 'exclude',
          value: newFilter.value
        };
        setFormData({ ...formData, filters: [...(formData.filters || []), filter] });
        setNewFilter({ type: 'keyword', action: 'include', value: '' });
      }
    };

    const removeFilter = (filterId: string) => {
      setFormData({
        ...formData,
        filters: (formData.filters || []).filter(f => f.id !== filterId)
      });
    };

    return (
      <div className="p-8">
        <h2 className="text-3xl font-bold mb-8">{selectedFeed ? 'Editar Feed' : 'Crear Nuevo Feed'}</h2>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h3 className="text-xl font-semibold mb-4">Configuración Básica</h3>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Nombre del Feed *</label>
            <input
              type="text"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              placeholder="ej. Noticias de Tecnología"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Descripción</label>
            <textarea
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              rows={3}
              placeholder="Describe tu feed RSS"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-2">Tipo de Fuente *</label>
              <select
                value={formData.sourceType}
                onChange={e => setFormData({ ...formData, sourceType: e.target.value as SourceType })}
                className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              >
                <option value="website">Sitio Web</option>
                <option value="youtube">YouTube</option>
                <option value="twitter">Twitter / X</option>
                <option value="instagram">Instagram</option>
                <option value="facebook">Facebook</option>
                <option value="reddit">Reddit</option>
                <option value="linkedin">LinkedIn</option>
                <option value="tiktok">TikTok</option>
                <option value="telegram">Telegram</option>
                <option value="medium">Medium</option>
                <option value="blog">Blog</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">URL de la Fuente *</label>
              <input
                type="url"
                value={formData.sourceUrl}
                onChange={e => setFormData({ ...formData, sourceUrl: e.target.value })}
                className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                placeholder="https://ejemplo.com"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-3 border rounded-lg">
              <input
                type="checkbox"
                checked={formData.autoRefresh}
                onChange={e => setFormData({ ...formData, autoRefresh: e.target.checked })}
                className="w-4 h-4 text-orange-600"
              />
              <div className="flex-1">
                <label className="text-sm font-medium">Actualización Automática</label>
                <p className="text-xs text-gray-500">Refrescar el feed automáticamente</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Intervalo de Actualización (minutos)</label>
              <input
                type="number"
                value={formData.refreshInterval}
                onChange={e => setFormData({ ...formData, refreshInterval: parseInt(e.target.value) })}
                className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                min="5"
                max="1440"
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h3 className="text-xl font-semibold mb-4">Filtros</h3>
          <p className="text-sm text-gray-600 mb-4">
            Añade filtros para incluir o excluir contenido basado en palabras clave, dominios o fechas.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-4">
            <select
              value={newFilter.type}
              onChange={e => setNewFilter({ ...newFilter, type: e.target.value as 'keyword' | 'domain' | 'date' })}
              className="border rounded-lg px-3 py-2"
            >
              <option value="keyword">Palabra Clave</option>
              <option value="domain">Dominio</option>
              <option value="date">Fecha</option>
            </select>

            <select
              value={newFilter.action}
              onChange={e => setNewFilter({ ...newFilter, action: e.target.value as 'include' | 'exclude' })}
              className="border rounded-lg px-3 py-2"
            >
              <option value="include">Incluir</option>
              <option value="exclude">Excluir</option>
            </select>

            <input
              type="text"
              value={newFilter.value}
              onChange={e => setNewFilter({ ...newFilter, value: e.target.value })}
              placeholder="Valor del filtro"
              className="border rounded-lg px-3 py-2"
            />

            <button
              onClick={addFilter}
              className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition"
            >
              Añadir Filtro
            </button>
          </div>

          {formData.filters && formData.filters.length > 0 && (
            <div className="space-y-2">
              {formData.filters.map(filter => (
                <div key={filter.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Filter size={16} className="text-gray-400" />
                    <span className="text-sm">
                      <span className="font-medium">{filter.type}</span>:{' '}
                      <span className={filter.action === 'include' ? 'text-green-600' : 'text-red-600'}>
                        {filter.action === 'include' ? 'Incluir' : 'Excluir'}
                      </span>{' '}
                      "{filter.value}"
                    </span>
                  </div>
                  <button onClick={() => removeFilter(filter.id)} className="text-red-600 hover:text-red-700">
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-end gap-4">
          <button
            onClick={() => {
              setCurrentView('dashboard');
              setSelectedFeed(null);
            }}
            className="px-6 py-2 border rounded-lg hover:bg-gray-50 transition"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            className="bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-700 transition"
          >
            {selectedFeed ? 'Guardar Cambios' : 'Crear Feed'}
          </button>
        </div>
      </div>
    );
  };

  // Feed Reader View
  const FeedReader = () => {
    const [selectedFeedId, setSelectedFeedId] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    const displayedItems = selectedFeedId
      ? feedItems.filter(item => item.feedId === selectedFeedId)
      : feedItems;

    const filteredItems = displayedItems.filter(
      item =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Generate sample items if none exist
    const sampleItems: FeedItem[] = feeds.length > 0 && feedItems.length === 0 ? [
      {
        id: '1',
        feedId: feeds[0].id || '1',
        title: 'Ejemplo de Artículo RSS',
        description: 'Esta es una descripción de ejemplo de un artículo RSS. Aquí aparecerían los artículos reales cuando el feed esté activo.',
        link: 'https://ejemplo.com/articulo1',
        pubDate: new Date().toISOString(),
        author: 'Autor Ejemplo',
        categories: ['Tecnología', 'Noticias']
      }
    ] : [];

    const itemsToDisplay = filteredItems.length > 0 ? filteredItems : sampleItems;

    return (
      <div className="p-8">
        <h2 className="text-3xl font-bold mb-8">Lector de Feeds</h2>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex gap-4 mb-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  placeholder="Buscar artículos..."
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </div>
            <select
              value={selectedFeedId || ''}
              onChange={e => setSelectedFeedId(e.target.value || null)}
              className="border rounded-lg px-4 py-2"
            >
              <option value="">Todos los feeds</option>
              {feeds.map(feed => (
                <option key={feed.id} value={feed.id}>
                  {feed.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {itemsToDisplay.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <Rss className="mx-auto text-gray-300 mb-4" size={48} />
            <p className="text-gray-500 mb-4">No hay artículos para mostrar</p>
            <p className="text-sm text-gray-400">Crea un feed para comenzar a ver artículos</p>
          </div>
        ) : (
          <div className="space-y-4">
            {itemsToDisplay.map(item => {
              const feed = feeds.find(f => f.id === item.feedId);
              return (
                <div key={item.id} className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {feed && (
                          <span className="text-xs px-2 py-1 bg-orange-100 text-orange-800 rounded flex items-center gap-1">
                            {getSourceIcon(feed.sourceType, 12)}
                            {feed.name}
                          </span>
                        )}
                        {item.categories?.map((cat, i) => (
                          <span key={i} className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded">
                            {cat}
                          </span>
                        ))}
                      </div>
                      <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                      <p className="text-gray-600 mb-3">{item.description}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        {item.author && <span>Por {item.author}</span>}
                        <span className="flex items-center gap-1">
                          <Calendar size={14} />
                          {new Date(item.pubDate).toLocaleDateString('es-ES')}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 ml-4">
                      <a
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-orange-600 hover:text-orange-700"
                      >
                        <ExternalLink size={20} />
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  // Bundles View
  const Bundles = () => {
    const [showCreateBundle, setShowCreateBundle] = useState(false);
    const [bundleName, setBundleName] = useState('');
    const [bundleDescription, setBundleDescription] = useState('');
    const [selectedFeeds, setSelectedFeeds] = useState<string[]>([]);

    const createBundle = () => {
      if (!bundleName || selectedFeeds.length === 0) {
        alert('Por favor ingresa un nombre y selecciona al menos un feed');
        return;
      }

      const newBundle: Bundle = {
        id: Date.now().toString(),
        name: bundleName,
        description: bundleDescription,
        feedIds: selectedFeeds,
        createdAt: new Date().toISOString(),
        status: 'active',
        sortBy: 'date',
        sortOrder: 'desc'
      };

      const updatedBundles = [...bundles, newBundle];
      setBundles(updatedBundles);
      saveData(undefined, undefined, updatedBundles);

      // Reset form
      setBundleName('');
      setBundleDescription('');
      setSelectedFeeds([]);
      setShowCreateBundle(false);
    };

    const toggleFeedSelection = (feedId: string) => {
      setSelectedFeeds(prev =>
        prev.includes(feedId) ? prev.filter(id => id !== feedId) : [...prev, feedId]
      );
    };

    return (
      <div className="p-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold">Feed Bundles</h2>
          <button
            onClick={() => setShowCreateBundle(!showCreateBundle)}
            className="bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-700 transition flex items-center gap-2"
          >
            <Plus size={20} />
            Crear Bundle
          </button>
        </div>

        {showCreateBundle && (
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h3 className="text-xl font-semibold mb-4">Crear Nuevo Bundle</h3>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Nombre del Bundle</label>
              <input
                type="text"
                value={bundleName}
                onChange={e => setBundleName(e.target.value)}
                className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-500"
                placeholder="ej. Noticias Diarias"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Descripción</label>
              <textarea
                value={bundleDescription}
                onChange={e => setBundleDescription(e.target.value)}
                className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-500"
                rows={2}
                placeholder="Describe tu bundle"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Seleccionar Feeds</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {feeds.map(feed => (
                  <div key={feed.id} className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50">
                    <input
                      type="checkbox"
                      checked={selectedFeeds.includes(feed.id!)}
                      onChange={() => toggleFeedSelection(feed.id!)}
                      className="w-4 h-4 text-orange-600"
                    />
                    <div className="flex items-center gap-2">
                      {getSourceIcon(feed.sourceType, 16)}
                      <span className="text-sm font-medium">{feed.name}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={createBundle}
                className="bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-700 transition"
              >
                Crear Bundle
              </button>
              <button
                onClick={() => setShowCreateBundle(false)}
                className="px-6 py-2 border rounded-lg hover:bg-gray-50 transition"
              >
                Cancelar
              </button>
            </div>
          </div>
        )}

        {bundles.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <Layers className="mx-auto text-gray-300 mb-4" size={48} />
            <p className="text-gray-500 mb-4">No has creado ningún bundle</p>
            <p className="text-sm text-gray-400">
              Los bundles te permiten combinar múltiples feeds en uno solo
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {bundles.map(bundle => (
              <div key={bundle.id} className="bg-white rounded-lg shadow p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold mb-2">{bundle.name}</h3>
                    <p className="text-gray-600 text-sm">{bundle.description}</p>
                  </div>
                  <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                    {bundle.status}
                  </span>
                </div>
                <div className="mb-4">
                  <p className="text-sm text-gray-500 mb-2">Feeds incluidos:</p>
                  <div className="space-y-2">
                    {bundle.feedIds.map(feedId => {
                      const feed = feeds.find(f => f.id === feedId);
                      return feed ? (
                        <div key={feedId} className="flex items-center gap-2 text-sm">
                          {getSourceIcon(feed.sourceType, 14)}
                          <span>{feed.name}</span>
                        </div>
                      ) : null;
                    })}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="flex-1 text-sm text-orange-600 hover:bg-orange-50 py-2 rounded transition">
                    Editar
                  </button>
                  <button className="flex-1 text-sm text-blue-600 hover:bg-blue-50 py-2 rounded transition">
                    Ver Items
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  // Widgets View
  const Widgets = () => {
    const [showCreate, setShowCreate] = useState(false);
    const [widgetName, setWidgetName] = useState('');
    const [selectedFeedIds, setSelectedFeedIds] = useState<string[]>([]);
    const [widgetTheme, setWidgetTheme] = useState<'light' | 'dark'>('light');

    const generateWidget = () => {
      if (!widgetName || selectedFeedIds.length === 0) {
        alert('Por favor completa los campos requeridos');
        return;
      }

      const widgetId = Date.now().toString();
      const embedCode = `<iframe src="https://feedflow.app/widget/${widgetId}" width="100%" height="600" frameborder="0"></iframe>`;

      const newWidget: Widget = {
        id: widgetId,
        name: widgetName,
        feedIds: selectedFeedIds,
        style: {
          theme: widgetTheme,
          showImages: true,
          showDescriptions: true,
          itemsPerPage: 10
        },
        embedCode,
        createdAt: new Date().toISOString(),
        views: 0
      };

      const updatedWidgets = [...widgets, newWidget];
      setWidgets(updatedWidgets);
      saveData(undefined, undefined, undefined, updatedWidgets);

      setWidgetName('');
      setSelectedFeedIds([]);
      setShowCreate(false);
    };

    return (
      <div className="p-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold">Widgets</h2>
          <button
            onClick={() => setShowCreate(!showCreate)}
            className="bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-700 transition flex items-center gap-2"
          >
            <Plus size={20} />
            Crear Widget
          </button>
        </div>

        {showCreate && (
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h3 className="text-xl font-semibold mb-4">Crear Nuevo Widget</h3>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Nombre del Widget</label>
              <input
                type="text"
                value={widgetName}
                onChange={e => setWidgetName(e.target.value)}
                className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-500"
                placeholder="ej. Widget Blog Principal"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Tema</label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    value="light"
                    checked={widgetTheme === 'light'}
                    onChange={() => setWidgetTheme('light')}
                    className="text-orange-600"
                  />
                  <span>Claro</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    value="dark"
                    checked={widgetTheme === 'dark'}
                    onChange={() => setWidgetTheme('dark')}
                    className="text-orange-600"
                  />
                  <span>Oscuro</span>
                </label>
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Seleccionar Feeds</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {feeds.map(feed => (
                  <div key={feed.id} className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50">
                    <input
                      type="checkbox"
                      checked={selectedFeedIds.includes(feed.id!)}
                      onChange={() =>
                        setSelectedFeedIds(prev =>
                          prev.includes(feed.id!) ? prev.filter(id => id !== feed.id) : [...prev, feed.id!]
                        )
                      }
                      className="w-4 h-4 text-orange-600"
                    />
                    <div className="flex items-center gap-2">
                      {getSourceIcon(feed.sourceType, 16)}
                      <span className="text-sm font-medium">{feed.name}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={generateWidget}
                className="bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-700 transition"
              >
                Generar Widget
              </button>
              <button
                onClick={() => setShowCreate(false)}
                className="px-6 py-2 border rounded-lg hover:bg-gray-50 transition"
              >
                Cancelar
              </button>
            </div>
          </div>
        )}

        {widgets.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <Code className="mx-auto text-gray-300 mb-4" size={48} />
            <p className="text-gray-500 mb-4">No has creado ningún widget</p>
            <p className="text-sm text-gray-400">
              Los widgets te permiten insertar feeds en tu sitio web
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {widgets.map(widget => (
              <div key={widget.id} className="bg-white rounded-lg shadow p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold mb-2">{widget.name}</h3>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Eye size={14} />
                        {widget.views} vistas
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar size={14} />
                        {new Date(widget.createdAt).toLocaleDateString('es-ES')}
                      </span>
                    </div>
                  </div>
                  <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                    {widget.style.theme}
                  </span>
                </div>

                <div className="mb-4">
                  <p className="text-sm font-medium mb-2">Feeds incluidos:</p>
                  <div className="flex flex-wrap gap-2">
                    {widget.feedIds.map(feedId => {
                      const feed = feeds.find(f => f.id === feedId);
                      return feed ? (
                        <span key={feedId} className="text-xs px-2 py-1 bg-gray-100 rounded flex items-center gap-1">
                          {getSourceIcon(feed.sourceType, 12)}
                          {feed.name}
                        </span>
                      ) : null;
                    })}
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium">Código de Inserción</label>
                    <button
                      onClick={() => copyToClipboard(widget.embedCode, widget.id)}
                      className="text-orange-600 hover:text-orange-700 flex items-center gap-1 text-sm"
                    >
                      {copiedCode === widget.id ? (
                        <>
                          <Check size={16} />
                          Copiado
                        </>
                      ) : (
                        <>
                          <Copy size={16} />
                          Copiar
                        </>
                      )}
                    </button>
                  </div>
                  <code className="text-xs bg-gray-900 text-green-400 p-3 rounded block overflow-x-auto">
                    {widget.embedCode}
                  </code>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  // Analytics View
  const Analytics = () => {
    const totalViews = widgets.reduce((acc, w) => acc + w.views, 0);
    const avgItemsPerFeed = feeds.length > 0 ? Math.round(feedItems.length / feeds.length) : 0;

    return (
      <div className="p-8">
        <h2 className="text-3xl font-bold mb-8">Analíticas</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Feeds Más Activos</h3>
            <div className="space-y-3">
              {feeds.slice(0, 5).map(feed => (
                <div key={feed.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {getSourceIcon(feed.sourceType, 16)}
                    <span className="text-sm">{feed.name}</span>
                  </div>
                  <span className="text-sm font-semibold">{feed.itemCount}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Vistas de Widgets</h3>
            <div className="flex items-center justify-center h-32">
              <div className="text-center">
                <div className="text-5xl font-bold text-orange-600 mb-2">{totalViews}</div>
                <p className="text-gray-600 text-sm">Total de vistas</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Promedio de Items</h3>
            <div className="flex items-center justify-center h-32">
              <div className="text-center">
                <div className="text-5xl font-bold text-blue-600 mb-2">{avgItemsPerFeed}</div>
                <p className="text-gray-600 text-sm">Items por feed</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">Actividad Semanal</h3>
          <div className="h-48 flex items-end justify-around gap-2">
            {[42, 38, 45, 52, 48, 55, 60].map((value, i) => (
              <div key={i} className="flex-1 flex flex-col items-center">
                <div className="w-full bg-orange-500 rounded-t" style={{ height: `${(value / 60) * 100}%` }} />
                <span className="text-xs text-gray-500 mt-2">{['L', 'M', 'X', 'J', 'V', 'S', 'D'][i]}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Distribución por Fuente</h3>
          <div className="space-y-3">
            {['website', 'youtube', 'twitter', 'reddit', 'blog'].map(sourceType => {
              const count = feeds.filter(f => f.sourceType === sourceType).length;
              const percentage = feeds.length > 0 ? (count / feeds.length) * 100 : 0;
              return (
                <div key={sourceType} className="flex items-center gap-4">
                  <div className="w-24 text-sm capitalize flex items-center gap-2">
                    {getSourceIcon(sourceType as SourceType, 16)}
                    {sourceType}
                  </div>
                  <div className="flex-1">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-orange-600 h-2 rounded-full"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                  <div className="w-12 text-right text-sm font-semibold">{count}</div>
                </div>
              );
            })}
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
          <h3 className="text-xl font-semibold mb-4">Información de la Cuenta</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Nombre</label>
              <input
                type="text"
                className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-500"
                placeholder="Tu nombre"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Correo Electrónico</label>
              <input
                type="email"
                className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-500"
                placeholder="tu@email.com"
              />
            </div>
            <button className="bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-700 transition">
              Guardar Cambios
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h3 className="text-xl font-semibold mb-4">Plan y Facturación</h3>
          <div className="flex items-center justify-between p-4 bg-orange-50 rounded-lg mb-4">
            <div>
              <p className="font-semibold">Plan Professional</p>
              <p className="text-sm text-gray-600">50 feeds, widgets ilimitados</p>
            </div>
            <span className="text-2xl font-bold text-orange-600">€29/mes</span>
          </div>
          <div className="space-y-2 mb-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Feeds utilizados</span>
              <span className="font-semibold">{feeds.length} / 50</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-orange-600 h-2 rounded-full"
                style={{ width: `${(feeds.length / 50) * 100}%` }}
              />
            </div>
          </div>
          <button className="text-orange-600 hover:text-orange-700">Actualizar plan</button>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-semibold mb-4">Preferencias</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="font-medium">Notificaciones por Email</p>
                <p className="text-sm text-gray-500">Recibir alertas de nuevos items</p>
              </div>
              <input type="checkbox" className="w-4 h-4 text-orange-600" />
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="font-medium">Auto-actualización</p>
                <p className="text-sm text-gray-500">Actualizar feeds automáticamente</p>
              </div>
              <input type="checkbox" defaultChecked className="w-4 h-4 text-orange-600" />
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <div className="ml-64">
        {currentView === 'dashboard' && <Dashboard />}
        {currentView === 'create' && <CreateFeed />}
        {currentView === 'reader' && <FeedReader />}
        {currentView === 'bundles' && <Bundles />}
        {currentView === 'widgets' && <Widgets />}
        {currentView === 'analytics' && <Analytics />}
        {currentView === 'settings' && <Settings />}
      </div>
    </div>
  );
};

export default App;
