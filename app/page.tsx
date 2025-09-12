"use client"

import React from "react"

import { useState, useRef, useMemo, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  ChevronUp,
  ChevronDown,
  Download,
  Info,
  FileText,
  Globe,
  HelpCircle,
  Trash2,
  Plus,
  Edit3,
  MoreVertical,
  ExternalLink,
  Loader2,
  Play,
  Clock,
  BarChart3,
  Zap,
  Users,
  Rocket,
  Settings,
  Send,
} from "lucide-react"
import { FilePreviewModal } from "@/components/file-preview-modal"
import { FileItem } from "@/components/file-item"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Tipos TypeScript consistentes
interface FileItem {
  id: string
  name: string
  type: string
  size: string
  uploadDate: string
  lastUpdated: string
  content: string
}

interface TextSnippet {
  id: string
  title: string
  content: string
  createdDate: string
  lastUpdated: string
}

interface Website {
  id: string
  url: string
  title: string
  pages: number
  status: "completado" | "procesando"
  crawledDate: string
  lastUpdated: string
  includePaths: string[]
  excludePaths: string[]
  links: Array<{
    url: string
    title: string
    status: string
  }>
}

interface QAItem {
  id: string
  question: string
  answer: string
  createdDate: string
  lastUpdated: string
}

interface Message {
  id: string
  text: string
  isBot: boolean
  timestamp: Date
}

const mockFiles: FileItem[] = [
  {
    id: "1",
    name: "Requisitos del Producto.pdf",
    type: "pdf",
    size: "2.4 MB",
    uploadDate: "15 Dic, 2024",
    lastUpdated: "15 Dic, 2024",
    content:
      "Documento de Requisitos del Producto\n\n1. Resumen\nEste documento describe los requisitos para nuestra nueva plataforma de chatbot con IA...\n\n2. Características\n- Procesamiento de lenguaje natural\n- Soporte multiidioma\n- Capacidades de integración\n- Panel de análisis\n\n3. Especificaciones Técnicas\n- Frontend basado en React\n- Backend en Node.js\n- Base de datos PostgreSQL\n- Redis para caché",
  },
  {
    id: "2",
    name: "Guía del Usuario.docx",
    type: "docx",
    size: "1.8 MB",
    uploadDate: "14 Dic, 2024",
    lastUpdated: "14 Dic, 2024",
    content:
      "Guía del Usuario\n\nPrimeros Pasos\n\n1. Configuración de Cuenta\nPara comenzar a usar la plataforma, crea una cuenta visitando nuestra página de registro...\n\n2. Resumen del Panel\nEl panel principal proporciona acceso a todas las características clave:\n- Gestión de archivos\n- Configuración del agente\n- Análisis\n- Configuraciones\n\n3. Creando tu Primer Agente\nSigue estos pasos para crear tu primer agente de IA...",
  },
  {
    id: "3",
    name: "Preguntas Frecuentes.txt",
    type: "txt",
    size: "45 KB",
    uploadDate: "13 Dic, 2024",
    lastUpdated: "13 Dic, 2024",
    content:
      "Preguntas Frecuentes\n\nP: ¿Cómo subo archivos?\nR: Puedes subir archivos arrastrándolos y soltándolos en el área de carga o haciendo clic para seleccionar archivos.\n\nP: ¿Qué tipos de archivo son compatibles?\nR: Admitimos archivos PDF, DOC, DOCX y TXT.\n\nP: ¿Hay un límite de tamaño de archivo?\nR: Sí, los archivos individuales deben ser menores a 10MB y tu almacenamiento total está limitado según tu plan.",
  },
]

const mockTextSnippets: TextSnippet[] = [
  {
    id: "1",
    title: "Resumen de la Empresa",
    content:
      "# Acerca de Nuestra Empresa\n\nSomos una empresa líder en tecnología de IA enfocada en **soluciones innovadoras** para empresas.\n\n## Nuestra Misión\n- Democratizar la tecnología de IA\n- Empoderar a las empresas con herramientas inteligentes\n- Crear experiencias de usuario fluidas\n\n🚀 *Construyendo el futuro de las aplicaciones impulsadas por IA*",
    createdDate: "15 Dic, 2024",
    lastUpdated: "15 Dic, 2024",
  },
  {
    id: "2",
    title: "Características del Producto",
    content:
      "## Características Principales\n\n1. **Procesamiento de Lenguaje Natural**\n   - Comprensión avanzada de texto\n   - Soporte multiidioma\n   - Conciencia del contexto\n\n2. **Capacidades de Integración**\n   - Acceso a API REST\n   - Soporte de webhooks\n   - Conectores de terceros\n\n3. **Panel de Análisis**\n   - Métricas en tiempo real\n   - Información de rendimiento\n   - Análisis de uso\n\n💡 *Mejorando continuamente con comentarios de usuarios*",
    createdDate: "14 Dic, 2024",
    lastUpdated: "14 Dic, 2024",
  },
]

const mockWebsites: Website[] = [
  {
    id: "1",
    url: "https://www.genbeta.com/",
    title: "Sitio Web 3",
    pages: 9,
    status: "completado" as const,
    crawledDate: "4 sept 2025",
    lastUpdated: "4 sept 2025",
    includePaths: [],
    excludePaths: [],
    links: [
      { url: "https://www.genbeta.com/", title: "Página Principal", status: "incluido" },
      { url: "https://www.genbeta.com/tecnologia", title: "Tecnología", status: "incluido" },
      { url: "https://www.genbeta.com/actualidad", title: "Actualidad", status: "incluido" },
      { url: "https://www.genbeta.com/desarrollo", title: "Desarrollo", status: "incluido" },
      { url: "https://www.genbeta.com/herramientas", title: "Herramientas", status: "incluido" },
      { url: "https://www.genbeta.com/movil", title: "Móvil", status: "incluido" },
      { url: "https://www.genbeta.com/web", title: "Web", status: "incluido" },
      { url: "https://www.genbeta.com/seguridad", title: "Seguridad", status: "incluido" },
      { url: "https://www.genbeta.com/redes-sociales", title: "Redes Sociales", status: "incluido" },
    ],
  },
  {
    id: "2",
    url: "https://docs.ejemplo.com",
    title: "Documentación",
    pages: 8,
    status: "procesando" as const,
    crawledDate: "14 Dic, 2024",
    lastUpdated: "14 Dic, 2024",
    includePaths: ["/guias"],
    excludePaths: [],
    links: [
      { url: "https://docs.ejemplo.com/", title: "Inicio de Documentación", status: "incluido" },
      { url: "https://docs.ejemplo.com/guias", title: "Guías", status: "incluido" },
    ],
  },
]

const mockQAItems: QAItem[] = [
  {
    id: "1",
    question: "¿Cómo subo archivos?",
    answer:
      "Puedes subir archivos arrastrándolos y soltándolos en el área de carga o haciendo clic para seleccionar archivos.",
    createdDate: "15 Dic, 2024",
    lastUpdated: "15 Dic, 2024",
  },
  {
    id: "2",
    question: "¿Qué tipos de archivo son compatibles?",
    answer: "Admitimos archivos PDF, DOC, DOCX y TXT.",
    createdDate: "14 Dic, 2024",
    lastUpdated: "14 Dic, 2024",
  },
]

export default function ChatbaseInterface() {
  const [activeTab, setActiveTab] = useState("files")
  const [files, setFiles] = useState<FileItem[]>(mockFiles)

  const [showPlayground, setShowPlayground] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "¡Hola! ¿En qué puedo ayudarte?",
      isBot: true,
      timestamp: new Date(),
    },
  ])
  const [inputMessage, setInputMessage] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [textSnippets, setTextSnippets] = useState(mockTextSnippets)
  const [websites, setWebsites] = useState(mockWebsites)
  const [qaItems, setQaItems] = useState(mockQAItems)
  const [selectedFiles, setSelectedFiles] = useState<string[]>([])
  const [selectedSnippets, setSelectedSnippets] = useState<string[]>([])
  const [selectedWebsites, setSelectedWebsites] = useState<string[]>([])
  const [selectedQAs, setSelectedQAs] = useState<string[]>([])
  const [previewFile, setPreviewFile] = useState<FileItem | null>(null)
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const [isDragOver, setIsDragOver] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [isCreatingSnippet, setIsCreatingSnippet] = useState(false)
  const [isCreatingQA, setIsCreatingQA] = useState(false)
  const [isCrawling, setIsCrawling] = useState(false)
  const [isCreatingAgent, setIsCreatingAgent] = useState(false)
  const [agentCreated, setAgentCreated] = useState(false)
  const [crawlType, setCrawlType] = useState<"website" | "sitemap" | "links">("website")
  const [crawlUrl, setCrawlUrl] = useState("")
  const [includePaths, setIncludePaths] = useState("")
  const [excludePaths, setExcludePaths] = useState("")
  const [individualLinks, setIndividualLinks] = useState("")
  const [newSnippetTitle, setNewSnippetTitle] = useState("")
  const [newSnippetContent, setNewSnippetContent] = useState("")
  const [newQAQuestion, setNewQAQuestion] = useState("")
  const [newQAAnswer, setNewQAAnswer] = useState("")
  const [expandedWebsites, setExpandedWebsites] = useState<string[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)


  const toggleWebsiteExpansion = (websiteId: string) => {
    setExpandedWebsites((prev) =>
      prev.includes(websiteId) ? prev.filter((id) => id !== websiteId) : [...prev, websiteId],
    )
  }

  // Optimización con useMemo para cálculos costosos
  const totalSize = useMemo(() => {
    return files.reduce((acc, file) => {
      const sizeInBytes = parseFloat(file.size) * (file.size.includes('MB') ? 1024 * 1024 : 1024)
      return acc + sizeInBytes
    }, 0)
  }, [files])

  const totalSources = useMemo(() => {
    return files.length + textSnippets.length + websites.length + qaItems.length
  }, [files, textSnippets, websites, qaItems])

  const handleFileSelect = useCallback((fileId: string, selected: boolean) => {
    setSelectedFiles((prev) => (selected ? [...prev, fileId] : prev.filter((id) => id !== fileId)))
  }, [])

  const handleSelectAll = useCallback((selected: boolean) => {
    setSelectedFiles(selected ? files.map((f) => f.id) : [])
  }, [files])

  const handlePreview = useCallback((file: FileItem) => {
    setPreviewFile(file)
    setIsPreviewOpen(true)
  }, [])

  const handleDeleteFile = useCallback((fileId: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== fileId))
    setSelectedFiles((prev) => prev.filter((id) => id !== fileId))
  }, [])

  const handleBulkDelete = useCallback(() => {
    setFiles((prev) => prev.filter((f) => !selectedFiles.includes(f.id)))
    setSelectedFiles([])
  }, [selectedFiles])

  const handleFileUpload = async (uploadedFiles: FileList) => {
    setIsUploading(true)

    const validFiles = Array.from(uploadedFiles).filter((file) => {
      const validTypes = [
        "application/pdf",
        "text/plain",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ]
      return (
        validTypes.includes(file.type) ||
        file.name.endsWith(".txt") ||
        file.name.endsWith(".pdf") ||
        file.name.endsWith(".doc") ||
        file.name.endsWith(".docx")
      )
    })

    for (const file of validFiles) {
      // Simulate file processing
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const newFile = {
        id: Date.now().toString() + Math.random().toString(36).substring(2, 11),
        name: file.name,
        type: file.name.split(".").pop() || "txt",
        size:
          file.size > 1024 * 1024
            ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
            : `${Math.round(file.size / 1024)} KB`,
        uploadDate: new Date().toLocaleDateString("es-ES", { day: "numeric", month: "short", year: "numeric" }),
        lastUpdated: new Date().toLocaleDateString("es-ES", { day: "numeric", month: "short", year: "numeric" }),
        content: `Contenido extraído de ${file.name}\n\nEste es un marcador de posición para el contenido real extraído del archivo subido. En una implementación real, esto contendría el texto procesado del archivo PDF, DOCX o TXT.`,
      }

      setFiles((prev) => [...prev, newFile])
    }

    setIsUploading(false)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    const droppedFiles = e.dataTransfer.files
    if (droppedFiles.length > 0) {
      handleFileUpload(droppedFiles)
    }
  }

  const handleCreateSnippet = () => {
    if (newSnippetTitle.trim() && newSnippetContent.trim()) {
      const newSnippet = {
        id: Date.now().toString(),
        title: newSnippetTitle,
        content: newSnippetContent,
        createdDate: new Date().toLocaleDateString("es-ES", { day: "numeric", month: "short", year: "numeric" }),
        lastUpdated: new Date().toLocaleDateString("es-ES", { day: "numeric", month: "short", year: "numeric" }),
      }
      setTextSnippets((prev) => [newSnippet, ...prev])
      setNewSnippetTitle("")
      setNewSnippetContent("")
      setIsCreatingSnippet(false)
    }
  }

  const handleDeleteSnippet = (snippetId: string) => {
    setTextSnippets((prev) => prev.filter((s) => s.id !== snippetId))
    setSelectedSnippets((prev) => prev.filter((id) => id !== snippetId))
  }

  const handleSnippetSelect = (snippetId: string, selected: boolean) => {
    setSelectedSnippets((prev) => (selected ? [...prev, snippetId] : prev.filter((id) => id !== snippetId)))
  }

  const handleSelectAllSnippets = (selected: boolean) => {
    setSelectedSnippets(selected ? textSnippets.map((s) => s.id) : [])
  }

  const handleBulkDeleteSnippets = () => {
    setTextSnippets((prev) => prev.filter((s) => !selectedSnippets.includes(s.id)))
    setSelectedSnippets([])
  }

  const handleWebsiteCrawl = async () => {
    if (!crawlUrl.trim()) return

    setIsCrawling(true)

    // Simulate crawling process
    await new Promise((resolve) => setTimeout(resolve, 2000))

    const newWebsite = {
      id: Date.now().toString(),
      url: crawlUrl,
      title: `Sitio Web ${websites.length + 1}`,
      pages: Math.floor(Math.random() * 20) + 5,
      status: "completado" as const,
      crawledDate: new Date().toLocaleDateString("es-ES", { day: "numeric", month: "short", year: "numeric" }),
      lastUpdated: new Date().toLocaleDateString("es-ES", { day: "numeric", month: "short", year: "numeric" }),
      includePaths: includePaths.split(" ").filter((p) => p.trim()),
      excludePaths: excludePaths.split(" ").filter((p) => p.trim()),
      links: [
        { url: crawlUrl, title: "Página Principal", status: "incluido" },
        { url: `${crawlUrl}/about`, title: "Acerca de", status: "incluido" },
        { url: `${crawlUrl}/contact`, title: "Contacto", status: "incluido" },
      ],
    }

    setWebsites((prev) => [newWebsite, ...prev])
    setCrawlUrl("")
    setIncludePaths("")
    setExcludePaths("")
    setIndividualLinks("")
    setIsCrawling(false)
  }

  const handleDeleteWebsite = (websiteId: string) => {
    setWebsites((prev) => prev.filter((w) => w.id !== websiteId))
    setSelectedWebsites((prev) => prev.filter((id) => id !== websiteId))
  }

  const handleWebsiteSelect = (websiteId: string, selected: boolean) => {
    setSelectedWebsites((prev) => (selected ? [...prev, websiteId] : prev.filter((id) => id !== websiteId)))
  }

  const handleSelectAllWebsites = (selected: boolean) => {
    setSelectedWebsites(selected ? websites.map((w) => w.id) : [])
  }

  const handleBulkDeleteWebsites = () => {
    setWebsites((prev) => prev.filter((w) => !selectedWebsites.includes(w.id)))
    setSelectedWebsites([])
  }

  const handleCreateQA = () => {
    if (newQAQuestion.trim() && newQAAnswer.trim()) {
      const newQA = {
        id: Date.now().toString(),
        question: newQAQuestion,
        answer: newQAAnswer,
        createdDate: new Date().toLocaleDateString("es-ES", { day: "numeric", month: "short", year: "numeric" }),
        lastUpdated: new Date().toLocaleDateString("es-ES", { day: "numeric", month: "short", year: "numeric" }),
      }
      setQaItems((prev) => [newQA, ...prev])
      setNewQAQuestion("")
      setNewQAAnswer("")
      setIsCreatingQA(false)
    }
  }

  const handleDeleteQA = (qaId: string) => {
    setQaItems((prev) => prev.filter((q) => q.id !== qaId))
    setSelectedQAs((prev) => prev.filter((id) => id !== qaId))
  }

  const handleQASelect = (qaId: string, selected: boolean) => {
    setSelectedQAs((prev) => (selected ? [...prev, qaId] : prev.filter((id) => id !== qaId)))
  }

  const handleSelectAllQAs = (selected: boolean) => {
    setSelectedQAs(selected ? qaItems.map((q) => q.id) : [])
  }

  const handleBulkDeleteQAs = () => {
    setQaItems((prev) => prev.filter((q) => !selectedQAs.includes(q.id)))
    setSelectedQAs([])
  }

  const handleCreateAgent = async () => {
    setIsCreatingAgent(true)

    // Simulate processing of all sources
    const totalSources = files.length + textSnippets.length + websites.length + qaItems.length

    if (totalSources === 0) {
      alert("Debes agregar al menos una fuente (archivo, texto, sitio web o Q&A) antes de crear el agente.")
      setIsCreatingAgent(false)
      return
    }

    // Simulate processing time based on the amount of content
    const processingTime = Math.max(2000, totalSources * 500)

    await new Promise((resolve) => setTimeout(resolve, processingTime))

    setIsCreatingAgent(false)
    setAgentCreated(true)

    // Show success message for 3 seconds then redirect to playground
    setTimeout(() => {
      setAgentCreated(false)
      setShowPlayground(true)
    }, 3000)
  }

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return

    const userMessage = {
      id: Date.now().toString(),
      text: inputMessage,
      isBot: false,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputMessage("")
    setIsTyping(true)

    // Simulate bot response based on sources
    setTimeout(() => {
      const botResponse = {
        id: (Date.now() + 1).toString(),
        text: `Basándome en los documentos que has subido, puedo ayudarte con información sobre ${files.length > 0 ? "los manuales y políticas" : "el contenido"} que has proporcionado. ¿Hay algo específico que te gustaría saber?`,
        isBot: true,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, botResponse])
      setIsTyping(false)
    }, 1500)
  }

  if (showPlayground) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">C</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-gray-600">El espacio de trabajo</span>
                <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">Gratis</span>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-gray-900 font-medium">250723 Propuesta ...</span>
                <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs">Agente</span>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-600">Registro de cambios</span>
              <span className="text-gray-600">Docs</span>
              <span className="text-gray-600">Ayuda</span>
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full"></div>
            </div>
          </div>
        </header>

        <div className="flex h-[calc(100vh-73px)]">
          {/* Left Sidebar */}
          <div className="w-64 bg-white border-r border-gray-200">
            <div className="p-4">
              <div className="space-y-2">
                <div className="flex items-center space-x-3 text-gray-900 bg-gray-100 px-3 py-2 rounded-lg">
                  <Play className="w-4 h-4" />
                  <span className="font-medium">Patio de recreo</span>
                </div>
                <div className="flex items-center space-x-3 text-gray-600 px-3 py-2 rounded-lg hover:bg-gray-50">
                  <Clock className="w-4 h-4" />
                  <span>Actividad</span>
                  <ChevronDown className="w-4 h-4 ml-auto" />
                </div>
                <div className="flex items-center space-x-3 text-gray-600 px-3 py-2 rounded-lg hover:bg-gray-50">
                  <BarChart3 className="w-4 h-4" />
                  <span>Analítica</span>
                  <ChevronDown className="w-4 h-4 ml-auto" />
                </div>
                <div
                  className="flex items-center space-x-3 text-gray-600 px-3 py-2 rounded-lg hover:bg-gray-50 cursor-pointer"
                  onClick={() => setShowPlayground(false)}
                >
                  <FileText className="w-4 h-4" />
                  <span>Fuentes</span>
                  <ChevronDown className="w-4 h-4 ml-auto" />
                </div>
                <div className="flex items-center space-x-3 text-gray-600 px-3 py-2 rounded-lg hover:bg-gray-50">
                  <Zap className="w-4 h-4" />
                  <span>Acciones</span>
                  <ChevronDown className="w-4 h-4 ml-auto" />
                </div>
                <div className="flex items-center space-x-3 text-gray-600 px-3 py-2 rounded-lg hover:bg-gray-50">
                  <Users className="w-4 h-4" />
                  <span>Contactos</span>
                </div>
                <div className="flex items-center space-x-3 text-gray-600 px-3 py-2 rounded-lg hover:bg-gray-50">
                  <Rocket className="w-4 h-4" />
                  <span>Desplegar</span>
                  <ChevronDown className="w-4 h-4 ml-auto" />
                </div>
                <div className="flex items-center space-x-3 text-gray-600 px-3 py-2 rounded-lg hover:bg-gray-50">
                  <Settings className="w-4 h-4" />
                  <span>Configuración</span>
                  <ChevronDown className="w-4 h-4 ml-auto" />
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex flex-1">
            {/* Configuration Panel */}
            <div className="w-96 bg-white border-r border-gray-200 p-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-6">Patio de recreo</h1>

              <div className="space-y-6">
                <div>
                  <div className="flex items-center space-x-2 mb-4">
                    <span className="text-sm text-gray-600">Estado del agente:</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm font-medium text-green-600">Entrenado</span>
                    </div>
                  </div>

                  <Button className="w-full bg-gray-600 hover:bg-gray-700 text-white mb-4">Guardar en agente</Button>

                  <div className="flex space-x-2 mb-6">
                    <Button variant="outline" className="flex-1 text-sm bg-transparent">
                      <Settings className="w-4 h-4 mr-2" />
                      Configurar y probar agentes
                    </Button>
                    <Button variant="outline" className="text-sm bg-transparent">
                      Comparar
                    </Button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Modelo</label>
                  <div className="flex items-center space-x-2 p-3 border border-gray-200 rounded-lg">
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">G</span>
                    </div>
                    <span className="text-sm">GPT-4o Mini</span>
                    <ChevronDown className="w-4 h-4 ml-auto text-gray-400" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Temperatura</label>
                  <div className="space-y-2">
                    <div className="flex justify-center">
                      <span className="text-2xl font-bold">0</span>
                    </div>
                    <div className="relative">
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.1"
                        defaultValue="0"
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                      />
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>Reservado</span>
                        <span>Creativo</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Acciones de IA</label>
                  <div className="text-center py-8 text-gray-500 text-sm">No se han encontrado acciones</div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Aviso del sistema</label>
                  <div className="flex items-center space-x-2 p-3 border border-gray-200 rounded-lg mb-2">
                    <span className="text-sm">Agente de IA</span>
                    <ChevronDown className="w-4 h-4 ml-auto text-gray-400" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Instrucciones</label>
                    <div className="border border-gray-200 rounded-lg p-3 bg-gray-50">
                      <div className="text-sm text-gray-600 mb-2">### Role</div>
                      <div className="text-sm text-gray-800">Primary Function: You are an AI chatbot</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Chat Panel */}
            <div className="flex-1 flex flex-col">
              {/* Chat Header */}
              <div className="bg-white border-b border-gray-200 p-4">
                <div className="flex items-center space-x-2">
                  <FileText className="w-5 h-5 text-gray-400" />
                  <span className="text-sm text-gray-600">250723 Propuesta IA para Despacho Legal_ff.docx</span>
                  <ExternalLink className="w-4 h-4 text-gray-400" />
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                  <div key={message.id} className={`flex ${message.isBot ? "justify-start" : "justify-end"}`}>
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        message.isBot ? "bg-gray-100 text-gray-800" : "bg-blue-500 text-white"
                      }`}
                    >
                      <p className="text-sm">{message.text}</p>
                    </div>
                  </div>
                ))}

                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 px-4 py-2 rounded-lg">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div
                          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0.1s" }}
                        ></div>
                        <div
                          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0.2s" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Message Input */}
              <div className="bg-white border-t border-gray-200 p-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                    placeholder="Mensaje..."
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={!inputMessage.trim()}
                    className="bg-blue-500 hover:bg-blue-600 text-white p-2"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">C</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium text-gray-900">Espacio de trabajo de Jose Ferrer</span>
              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">Gratuito</span>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <nav className="flex items-center gap-6 text-sm text-gray-600">
              <a href="#" className="hover:text-gray-900">
                Registro de cambios
              </a>
              <a href="#" className="hover:text-gray-900">
                Documentación
              </a>
              <a href="#" className="hover:text-gray-900">
                Ayuda
              </a>
            </nav>
            <Avatar className="w-8 h-8">
              <AvatarImage src="/diverse-user-avatars.png" />
              <AvatarFallback>JF</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-56 bg-white border-r border-gray-200 min-h-screen">
          <nav className="p-4">
            <ul className="space-y-1">
              <li>
                <button
                  onClick={() => setActiveTab("files")}
                  className={`flex items-center gap-3 px-3 py-2 text-sm font-medium w-full text-left rounded-md ${
                    activeTab === "files"
                      ? "text-gray-900 bg-gray-100"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  }`}
                >
                  <FileText className="w-4 h-4" />
                  Archivos
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab("text")}
                  className={`flex items-center gap-3 px-3 py-2 text-sm font-medium w-full text-left rounded-md ${
                    activeTab === "text"
                      ? "text-gray-900 bg-gray-100"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  }`}
                >
                  <Edit3 className="w-4 h-4" />
                  Texto
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab("website")}
                  className={`flex items-center gap-3 px-3 py-2 text-sm font-medium w-full text-left rounded-md ${
                    activeTab === "website"
                      ? "text-gray-900 bg-gray-100"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  }`}
                >
                  <Globe className="w-4 h-4" />
                  Sitio web
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab("qa")}
                  className={`flex items-center gap-3 px-3 py-2 text-sm font-medium w-full text-left rounded-md ${
                    activeTab === "qa"
                      ? "text-gray-900 bg-gray-100"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  }`}
                >
                  <HelpCircle className="w-4 h-4" />
                  Preguntas y respuestas
                </button>
              </li>
            </ul>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          <div className="max-w-4xl">
            {activeTab === "files" ? (
              <>
                {/* Files Header */}
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h1 className="text-2xl font-semibold text-gray-900 mb-2">Archivos</h1>
                    <p className="text-gray-600">
                      Sube documentos para entrenar tu IA. Extrae texto de archivos PDF, DOCX y TXT.
                    </p>
                  </div>
                  <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900">
                    <Info className="w-4 h-4 mr-2" />
                    Saber más
                  </Button>
                </div>

                {/* Add files section */}
                <Card className="p-6 mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-medium text-gray-900">Agregar archivos</h2>
                    <ChevronUp className="w-5 h-5 text-gray-400" />
                  </div>

                  {/* Warning Message */}
                  <div className="bg-orange-50 border border-orange-200 rounded-md p-3 mb-6">
                    <div className="flex items-start gap-2">
                      <div className="w-4 h-4 rounded-full bg-orange-400 flex-shrink-0 mt-0.5">
                        <span className="text-white text-xs font-bold flex items-center justify-center w-full h-full">
                          !
                        </span>
                      </div>
                      <p className="text-sm text-orange-800">
                        Si estás subiendo un PDF, asegúrate de que puedas seleccionar/resaltar el texto.
                      </p>
                    </div>
                  </div>

                  {/* File Upload Area */}
                  <div
                    className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors ${
                      isDragOver
                        ? "border-blue-400 bg-blue-50"
                        : isUploading
                          ? "border-gray-400 bg-gray-50"
                          : "border-gray-300 hover:border-gray-400"
                    }`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Download className={`w-8 h-8 mx-auto mb-4 ${isDragOver ? "text-blue-500" : "text-gray-400"}`} />
                    <p className={`mb-2 ${isDragOver ? "text-blue-700" : "text-gray-600"}`}>
                      {isUploading
                        ? "Procesando archivos..."
                        : isDragOver
                          ? "Suelta los archivos aquí"
                          : "Arrastra y suelta archivos aquí, o haz clic para seleccionar archivos"}
                    </p>
                    <p className="text-sm text-gray-500">Tipos de archivo compatibles: pdf, doc, docx, txt</p>

                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      accept=".pdf,.doc,.docx,.txt,application/pdf,text/plain,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                      onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
                      className="hidden"
                    />
                  </div>
                </Card>

                {files.length > 0 && (
                  <Card className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <Checkbox checked={selectedFiles.length === files.length} onCheckedChange={handleSelectAll} />
                        <span className="text-sm font-medium">Fuentes de archivos ({files.length})</span>
                      </div>
                      {selectedFiles.length > 0 && (
                        <Button variant="destructive" size="sm" onClick={handleBulkDelete}>
                          <Trash2 className="w-4 h-4 mr-2" />
                          Eliminar ({selectedFiles.length})
                        </Button>
                      )}
                    </div>

                    <div className="space-y-2">
                      {files.map((file) => (
                        <FileItem
                          key={file.id}
                          file={file}
                          isSelected={selectedFiles.includes(file.id)}
                          onSelect={handleFileSelect}
                          onPreview={handlePreview}
                          onDelete={handleDeleteFile}
                        />
                      ))}
                    </div>
                  </Card>
                )}
              </>
            ) : activeTab === "text" ? (
              <>
                {/* Text Snippets Header */}
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h1 className="text-2xl font-semibold text-gray-900 mb-2">Fragmentos de Texto</h1>
                    <p className="text-gray-600">
                      Crea y gestiona contenido de texto personalizado con formato enriquecido para el entrenamiento de
                      tu agente de IA.
                    </p>
                  </div>
                  <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900">
                    <Info className="w-4 h-4 mr-2" />
                    Saber más
                  </Button>
                </div>

                {/* Create New Snippet */}
                <Card className="p-6 mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-medium text-gray-900">Crear fragmento de texto</h2>
                    <Button onClick={() => setIsCreatingSnippet(!isCreatingSnippet)} variant="outline" size="sm">
                      <Plus className="w-4 h-4 mr-2" />
                      Nuevo fragmento
                    </Button>
                  </div>

                  {isCreatingSnippet && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Título</label>
                        <Input
                          placeholder="Ingresa el título del fragmento..."
                          value={newSnippetTitle}
                          onChange={(e) => setNewSnippetTitle(e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Contenido</label>
                        <Textarea
                          placeholder="Ingresa tu contenido de texto aquí. Puedes usar formato markdown como **negrita**, *cursiva*, # encabezados, y - listas..."
                          value={newSnippetContent}
                          onChange={(e) => setNewSnippetContent(e.target.value)}
                          rows={8}
                          className="resize-none"
                        />
                        <p className="text-xs text-gray-500 mt-2">
                          Admite formato markdown: **negrita**, *cursiva*, # encabezados, listas y enlaces
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          onClick={handleCreateSnippet}
                          disabled={!newSnippetTitle.trim() || !newSnippetContent.trim()}
                        >
                          Crear fragmento
                        </Button>
                        <Button variant="outline" onClick={() => setIsCreatingSnippet(false)}>
                          Cancelar
                        </Button>
                      </div>
                    </div>
                  )}
                </Card>

                {/* Text Snippets List */}
                {textSnippets.length > 0 && (
                  <Card className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <Checkbox
                          checked={selectedSnippets.length === textSnippets.length}
                          onCheckedChange={handleSelectAllSnippets}
                        />
                        <span className="text-sm font-medium">Fragmentos de texto ({textSnippets.length})</span>
                      </div>
                      {selectedSnippets.length > 0 && (
                        <Button variant="destructive" size="sm" onClick={handleBulkDeleteSnippets}>
                          <Trash2 className="w-4 h-4 mr-2" />
                          Eliminar ({selectedSnippets.length})
                        </Button>
                      )}
                    </div>

                    <div className="space-y-3">
                      {textSnippets.map((snippet) => (
                        <div
                          key={snippet.id}
                          className="flex items-start gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                        >
                          <Checkbox
                            checked={selectedSnippets.includes(snippet.id)}
                            onCheckedChange={(checked) => handleSnippetSelect(snippet.id, checked as boolean)}
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-2">
                              <h3 className="font-medium text-gray-900 truncate">{snippet.title}</h3>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm">
                                    <MoreVertical className="w-4 h-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem>Editar</DropdownMenuItem>
                                  <DropdownMenuItem>Duplicar</DropdownMenuItem>
                                  <DropdownMenuItem
                                    className="text-red-600"
                                    onClick={() => handleDeleteSnippet(snippet.id)}
                                  >
                                    Eliminar
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                            <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                              {snippet.content.replace(/[#*-]/g, "").substring(0, 150)}...
                            </p>
                            <div className="flex items-center gap-4 text-xs text-gray-500">
                              <span>Creado: {snippet.createdDate}</span>
                              <span>Actualizado: {snippet.lastUpdated}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>
                )}
              </>
            ) : activeTab === "website" ? (
              <>
                {/* Website Header */}
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h1 className="text-2xl font-semibold text-gray-900 mb-2">Rastreo de Sitios Web</h1>
                    <p className="text-gray-600">
                      Entrena tu agente de IA usando contenido directamente de sitios web. Rastrea sitios completos,
                      sitemaps o enlaces individuales.
                    </p>
                  </div>
                  <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900">
                    <Info className="w-4 h-4 mr-2" />
                    Saber más
                  </Button>
                </div>

                {/* Crawl Website Section */}
                <Card className="p-6 mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-medium text-gray-900">Rastrear contenido web</h2>
                    <ChevronUp className="w-5 h-5 text-gray-400" />
                  </div>

                  <Tabs value={crawlType} onValueChange={(value) => setCrawlType(value as any)} className="mb-6">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="website">Sitio web completo</TabsTrigger>
                      <TabsTrigger value="sitemap">Sitemap</TabsTrigger>
                      <TabsTrigger value="links">Enlaces individuales</TabsTrigger>
                    </TabsList>

                    <TabsContent value="website" className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">URL del sitio web</label>
                        <Input
                          placeholder="https://ejemplo.com"
                          value={crawlUrl}
                          onChange={(e) => setCrawlUrl(e.target.value)}
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Proporciona la URL de la página principal y Chatbase descubrirá todas las páginas públicas.
                        </p>
                      </div>
                    </TabsContent>

                    <TabsContent value="sitemap" className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">URL del sitemap</label>
                        <Input
                          placeholder="https://ejemplo.com/sitemap.xml"
                          value={crawlUrl}
                          onChange={(e) => setCrawlUrl(e.target.value)}
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Apunta a un sitemap XML para obtener una lista estructurada de URLs.
                        </p>
                      </div>
                    </TabsContent>

                    <TabsContent value="links" className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Enlaces individuales</label>
                        <Textarea
                          placeholder="https://ejemplo.com/pagina1&#10;https://ejemplo.com/pagina2&#10;https://ejemplo.com/pagina3"
                          value={individualLinks}
                          onChange={(e) => setIndividualLinks(e.target.value)}
                          rows={4}
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Ingresa URLs específicas que quieres incluir, una por línea.
                        </p>
                      </div>
                    </TabsContent>
                  </Tabs>

                  {(crawlType === "website" || crawlType === "sitemap") && (
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Rutas a incluir</label>
                        <Input
                          placeholder="/productos /servicios"
                          value={includePaths}
                          onChange={(e) => setIncludePaths(e.target.value)}
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Solo URLs que coincidan con estas rutas serán rastreadas. Separa con espacios.
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Rutas a excluir</label>
                        <Input
                          placeholder="/admin /privado"
                          value={excludePaths}
                          onChange={(e) => setExcludePaths(e.target.value)}
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          URLs que coincidan con estas rutas serán omitidas. Separa con espacios.
                        </p>
                      </div>
                    </div>
                  )}

                  <Button onClick={handleWebsiteCrawl} disabled={isCrawling || !crawlUrl.trim()} className="w-full">
                    {isCrawling ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Rastreando...
                      </>
                    ) : (
                      <>
                        <Globe className="w-4 h-4 mr-2" />
                        Iniciar rastreo
                      </>
                    )}
                  </Button>
                </Card>

                {/* Crawled Websites List */}
                {websites.length > 0 && (
                  <Card className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <Checkbox
                          checked={selectedWebsites.length === websites.length}
                          onCheckedChange={handleSelectAllWebsites}
                        />
                        <span className="text-sm font-medium">Fuentes de enlaces ({websites.length})</span>
                      </div>
                      {selectedWebsites.length > 0 && (
                        <Button variant="destructive" size="sm" onClick={handleBulkDeleteWebsites}>
                          <Trash2 className="w-4 h-4 mr-2" />
                          Eliminar ({selectedWebsites.length})
                        </Button>
                      )}
                    </div>

                    <div className="space-y-3">
                      {websites.map((website) => (
                        <div key={website.id} className="border border-gray-200 rounded-lg hover:bg-gray-50">
                          <div className="flex items-start gap-3 p-4">
                            <Checkbox
                              checked={selectedWebsites.includes(website.id)}
                              onCheckedChange={(checked) => handleWebsiteSelect(website.id, checked as boolean)}
                            />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                  <h3 className="font-medium text-gray-900">{website.title}</h3>
                                  <span
                                    className={`text-xs px-2 py-1 rounded-full ${
                                      website.status === "completado"
                                        ? "bg-green-100 text-green-700"
                                        : "bg-yellow-100 text-yellow-700"
                                    }`}
                                  >
                                    {website.status}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Button variant="ghost" size="sm" onClick={() => toggleWebsiteExpansion(website.id)}>
                                    {expandedWebsites.includes(website.id) ? (
                                      <ChevronUp className="w-4 h-4" />
                                    ) : (
                                      <ChevronDown className="w-4 h-4" />
                                    )}
                                  </Button>
                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <Button variant="ghost" size="sm">
                                        <MoreVertical className="w-4 h-4" />
                                      </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                      <DropdownMenuItem>
                                        <ExternalLink className="w-4 h-4 mr-2" />
                                        Ver enlaces
                                      </DropdownMenuItem>
                                      <DropdownMenuItem>Volver a rastrear</DropdownMenuItem>
                                      <DropdownMenuItem>Editar rutas</DropdownMenuItem>
                                      <DropdownMenuItem
                                        className="text-red-600"
                                        onClick={() => handleDeleteWebsite(website.id)}
                                      >
                                        Eliminar
                                      </DropdownMenuItem>
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                </div>
                              </div>
                              <div className="flex items-center gap-2 mb-2">
                                <a
                                  href={website.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
                                >
                                  {website.url}
                                  <ExternalLink className="w-3 h-3" />
                                </a>
                              </div>
                              <p className="text-sm text-gray-600 mb-2">{website.pages} páginas rastreadas</p>
                              <div className="flex items-center gap-4 text-xs text-gray-500">
                                <span>Rastreado: {website.crawledDate}</span>
                                <span>Actualizado: {website.lastUpdated}</span>
                              </div>
                              {(website.includePaths.length > 0 || website.excludePaths.length > 0) && (
                                <div className="mt-2 text-xs text-gray-500">
                                  {website.includePaths.length > 0 && (
                                    <span>Incluye: {website.includePaths.join(", ")} </span>
                                  )}
                                  {website.excludePaths.length > 0 && (
                                    <span>Excluye: {website.excludePaths.join(", ")}</span>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>

                          {expandedWebsites.includes(website.id) && (
                            <div className="border-t border-gray-200 bg-gray-50">
                              <div className="p-4">
                                <h4 className="text-sm font-medium text-gray-900 mb-3">
                                  Páginas rastreadas ({website.links.length})
                                </h4>
                                <div className="space-y-2">
                                  {website.links.map((link, index) => (
                                    <div
                                      key={index}
                                      className="flex items-center justify-between py-2 px-3 bg-white rounded border border-gray-200"
                                    >
                                      <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-gray-900 truncate">{link.title}</p>
                                        <a
                                          href={link.url}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1 truncate"
                                        >
                                          {link.url}
                                          <ExternalLink className="w-3 h-3 flex-shrink-0" />
                                        </a>
                                      </div>
                                      <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full ml-2">
                                        {link.status}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </Card>
                )}
              </>
            ) : (
              <>
                {/* QA Header */}
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h1 className="text-2xl font-semibold text-gray-900 mb-2">Preguntas y Respuestas</h1>
                    <p className="text-gray-600">
                      Crea y gestiona una base de preguntas y respuestas personalizada para el entrenamiento de tu
                      agente de IA.
                    </p>
                  </div>
                  <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900">
                    <Info className="w-4 h-4 mr-2" />
                    Saber más
                  </Button>
                </div>

                {/* Create New QA */}
                <Card className="p-6 mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-medium text-gray-900">Crear pregunta y respuesta</h2>
                    <Button onClick={() => setIsCreatingQA(!isCreatingQA)} variant="outline" size="sm">
                      <Plus className="w-4 h-4 mr-2" />
                      Nueva pregunta y respuesta
                    </Button>
                  </div>

                  {isCreatingQA && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Pregunta</label>
                        <Input
                          placeholder="Ingresa la pregunta..."
                          value={newQAQuestion}
                          onChange={(e) => setNewQAQuestion(e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Respuesta</label>
                        <Textarea
                          placeholder="Ingresa tu respuesta aquí..."
                          value={newQAAnswer}
                          onChange={(e) => setNewQAAnswer(e.target.value)}
                          rows={8}
                          className="resize-none"
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button onClick={handleCreateQA} disabled={!newQAQuestion.trim() || !newQAAnswer.trim()}>
                          Crear pregunta y respuesta
                        </Button>
                        <Button variant="outline" onClick={() => setIsCreatingQA(false)}>
                          Cancelar
                        </Button>
                      </div>
                    </div>
                  )}
                </Card>

                {/* QA List */}
                {qaItems.length > 0 && (
                  <Card className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <Checkbox
                          checked={selectedQAs.length === qaItems.length}
                          onCheckedChange={handleSelectAllQAs}
                        />
                        <span className="text-sm font-medium">Preguntas y respuestas ({qaItems.length})</span>
                      </div>
                      {selectedQAs.length > 0 && (
                        <Button variant="destructive" size="sm" onClick={handleBulkDeleteQAs}>
                          <Trash2 className="w-4 h-4 mr-2" />
                          Eliminar ({selectedQAs.length})
                        </Button>
                      )}
                    </div>

                    <div className="space-y-3">
                      {qaItems.map((qa) => (
                        <div
                          key={qa.id}
                          className="flex items-start gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                        >
                          <Checkbox
                            checked={selectedQAs.includes(qa.id)}
                            onCheckedChange={(checked) => handleQASelect(qa.id, checked as boolean)}
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-2">
                              <h3 className="font-medium text-gray-900 truncate">{qa.question}</h3>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm">
                                    <MoreVertical className="w-4 h-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem>Editar</DropdownMenuItem>
                                  <DropdownMenuItem>Duplicar</DropdownMenuItem>
                                  <DropdownMenuItem className="text-red-600" onClick={() => handleDeleteQA(qa.id)}>
                                    Eliminar
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                            <p className="text-sm text-gray-600 line-clamp-2 mb-2">{qa.answer.substring(0, 150)}...</p>
                            <div className="flex items-center gap-4 text-xs text-gray-500">
                              <span>Creado: {qa.createdDate}</span>
                              <span>Actualizado: {qa.lastUpdated}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>
                )}
              </>
            )}
          </div>
        </main>

        {/* Right Sidebar */}
        <aside className="w-80 bg-white border-l border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Fuentes</h2>

          <div className="mb-6">
            <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
              <span>Tamaño total</span>
              <span>{Math.round(totalSize)} / 400 KB</span>
            </div>

            {/* Resumen de fuentes */}
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-center justify-between">
                <span>Archivos</span>
                <span>{files.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Fragmentos de texto</span>
                <span>{textSnippets.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Sitios web</span>
                <span>{websites.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Preguntas y respuestas</span>
                <span>{qaItems.length}</span>
              </div>
              <hr className="my-2" />
              <div className="flex items-center justify-between font-medium text-gray-900">
                <span>Total de fuentes</span>
                <span>{totalSources}</span>
              </div>
            </div>
          </div>

          <Button
            className="w-full bg-black hover:bg-gray-800 text-white disabled:bg-gray-400"
            onClick={handleCreateAgent}
            disabled={isCreatingAgent || totalSources === 0}
          >
            {isCreatingAgent ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Creando agente...
              </>
            ) : agentCreated ? (
              <>
                <span className="text-green-400 mr-2">✓</span>
                Agente creado
              </>
            ) : (
              "Crear agente"
            )}
          </Button>

          {totalSources === 0 && (
            <p className="text-xs text-gray-500 mt-2 text-center">Agrega al menos una fuente para crear tu agente</p>
          )}

          {agentCreated && (
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md">
              <p className="text-sm text-green-800 text-center">
                ¡Agente creado exitosamente! Tu IA ha sido entrenada con {totalSources} fuente
                {totalSources !== 1 ? "s" : ""}.
              </p>
            </div>
          )}
        </aside>
      </div>

      <FilePreviewModal isOpen={isPreviewOpen} onClose={() => setIsPreviewOpen(false)} file={previewFile} />
    </div>
  )
}
