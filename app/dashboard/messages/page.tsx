"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, MessageSquare, Clock, User, Bot, Filter, MoreHorizontal } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MessageDetail } from "@/components/messages/message-detail"

interface Message {
  id: string
  customerName: string
  customerEmail: string
  customerAvatar?: string
  subject: string
  lastMessage: string
  timestamp: string
  status: 'unread' | 'read' | 'replied' | 'closed'
  priority: 'low' | 'medium' | 'high'
  channel: 'chat' | 'email' | 'whatsapp' | 'telegram'
  messageCount: number
}

export default function MessagesPage() {
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("all")

  const [messages] = useState<Message[]>([
    {
      id: "1",
      customerName: "Ana García",
      customerEmail: "ana@email.com",
      subject: "Consulta sobre producto XYZ",
      lastMessage: "¿Tienen disponibilidad del producto en color azul?",
      timestamp: "2024-01-20T10:30:00Z",
      status: "unread",
      priority: "high",
      channel: "chat",
      messageCount: 3
    },
    {
      id: "2",
      customerName: "Carlos López",
      customerEmail: "carlos@email.com",
      subject: "Problema con mi pedido",
      lastMessage: "Mi pedido llegó dañado, necesito una solución",
      timestamp: "2024-01-20T09:15:00Z",
      status: "replied",
      priority: "high",
      channel: "whatsapp",
      messageCount: 5
    },
    {
      id: "3",
      customerName: "María Rodríguez",
      customerEmail: "maria@email.com",
      subject: "Información de envío",
      lastMessage: "¿Cuánto tiempo tarda el envío a mi ciudad?",
      timestamp: "2024-01-19T16:45:00Z",
      status: "read",
      priority: "medium",
      channel: "email",
      messageCount: 2
    },
    {
      id: "4",
      customerName: "Juan Pérez",
      customerEmail: "juan@email.com",
      subject: "Devolución de producto",
      lastMessage: "Quiero devolver un producto que compré la semana pasada",
      timestamp: "2024-01-19T14:20:00Z",
      status: "closed",
      priority: "low",
      channel: "telegram",
      messageCount: 8
    }
  ])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'unread': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      case 'read': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      case 'replied': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'closed': return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500'
      case 'medium': return 'bg-yellow-500'
      case 'low': return 'bg-green-500'
      default: return 'bg-gray-500'
    }
  }

  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case 'chat': return <MessageSquare className="h-4 w-4" />
      case 'email': return <span className="text-xs font-bold">@</span>
      case 'whatsapp': return <span className="text-xs font-bold">W</span>
      case 'telegram': return <span className="text-xs font-bold">T</span>
      default: return <MessageSquare className="h-4 w-4" />
    }
  }

  const filteredMessages = messages.filter(message => {
    const matchesSearch = message.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         message.subject.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesTab = activeTab === 'all' || message.status === activeTab
    return matchesSearch && matchesTab
  })

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    
    if (diffInHours < 24) {
      return date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
    } else {
      return date.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit' })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Mensajes</h1>
          <p className="text-muted-foreground">
            Gestiona todas las conversaciones con tus clientes
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filtros
          </Button>
          <Button>
            <MessageSquare className="h-4 w-4 mr-2" />
            Nuevo Mensaje
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <CardTitle>Conversaciones</CardTitle>
                <Badge variant="secondary">{filteredMessages.length}</Badge>
              </div>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar mensajes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-4 mx-4 mb-4">
                  <TabsTrigger value="all" className="text-xs">Todos</TabsTrigger>
                  <TabsTrigger value="unread" className="text-xs">No leídos</TabsTrigger>
                  <TabsTrigger value="replied" className="text-xs">Respondidos</TabsTrigger>
                  <TabsTrigger value="closed" className="text-xs">Cerrados</TabsTrigger>
                </TabsList>
                
                <TabsContent value={activeTab} className="mt-0">
                  <div className="space-y-1">
                    {filteredMessages.map((message) => (
                      <div
                        key={message.id}
                        className={`p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 border-l-4 ${
                          selectedMessage?.id === message.id ? 'bg-blue-50 dark:bg-blue-950' : ''
                        }`}
                        style={{ borderLeftColor: message.status === 'unread' ? '#ef4444' : 'transparent' }}
                        onClick={() => setSelectedMessage(message)}
                      >
                        <div className="flex items-start gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={message.customerAvatar || "/placeholder.svg"} />
                            <AvatarFallback>
                              {message.customerName.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <h4 className="font-medium text-sm truncate">
                                {message.customerName}
                              </h4>
                              <div className="flex items-center gap-1">
                                <div className={`h-2 w-2 rounded-full ${getPriorityColor(message.priority)}`}></div>
                                <span className="text-xs text-muted-foreground">
                                  {formatTime(message.timestamp)}
                                </span>
                              </div>
                            </div>
                            
                            <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate mb-1">
                              {message.subject}
                            </p>
                            
                            <p className="text-xs text-muted-foreground truncate mb-2">
                              {message.lastMessage}
                            </p>
                            
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Badge className={`text-xs ${getStatusColor(message.status)}`}>
                                  {message.status === 'unread' ? 'No leído' :
                                   message.status === 'read' ? 'Leído' :
                                   message.status === 'replied' ? 'Respondido' : 'Cerrado'}
                                </Badge>
                                <div className="flex items-center gap-1 text-muted-foreground">
                                  {getChannelIcon(message.channel)}
                                  <span className="text-xs">{message.messageCount}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          {selectedMessage ? (
            <MessageDetail message={selectedMessage} />
          ) : (
            <Card className="h-[600px] flex items-center justify-center">
              <div className="text-center">
                <MessageSquare className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="font-medium mb-2">Selecciona una conversación</h3>
                <p className="text-sm text-muted-foreground">
                  Elige una conversación de la lista para ver los detalles
                </p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
