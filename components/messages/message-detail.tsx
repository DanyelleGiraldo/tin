"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Send, Bot, User, Clock, Phone, Mail, MapPin, MoreHorizontal } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

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

interface ChatMessage {
  id: string
  sender: 'customer' | 'agent' | 'bot'
  content: string
  timestamp: string
}

interface MessageDetailProps {
  message: Message
}

export function MessageDetail({ message }: MessageDetailProps) {
  const [reply, setReply] = useState("")
  const [chatMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      sender: "customer",
      content: message.lastMessage,
      timestamp: message.timestamp
    },
    {
      id: "2",
      sender: "bot",
      content: "Hola! Gracias por contactarnos. Un agente te atenderá en breve.",
      timestamp: "2024-01-20T10:31:00Z"
    },
    {
      id: "3",
      sender: "agent",
      content: "Hola Ana, gracias por tu consulta. Sí, tenemos disponibilidad del producto en color azul. ¿Te gustaría que te envíe más información?",
      timestamp: "2024-01-20T10:35:00Z"
    }
  ])

  const handleSendReply = () => {
    if (reply.trim()) {
      // Aquí enviarías la respuesta
      console.log("Enviando respuesta:", reply)
      setReply("")
    }
  }

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('es-ES', { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  }

  const getSenderIcon = (sender: string) => {
    switch (sender) {
      case 'customer': return <User className="h-4 w-4" />
      case 'bot': return <Bot className="h-4 w-4" />
      case 'agent': return <User className="h-4 w-4" />
      default: return <User className="h-4 w-4" />
    }
  }

  const getSenderColor = (sender: string) => {
    switch (sender) {
      case 'customer': return 'bg-blue-600 text-white'
      case 'bot': return 'bg-purple-600 text-white'
      case 'agent': return 'bg-green-600 text-white'
      default: return 'bg-gray-600 text-white'
    }
  }

  return (
    <div className="space-y-4">
      {/* Header del cliente */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="h-12 w-12">
                <AvatarImage src={message.customerAvatar || "/placeholder.svg"} />
                <AvatarFallback>
                  {message.customerName.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold text-lg">{message.customerName}</h3>
                <p className="text-sm text-muted-foreground">{message.subject}</p>
                <div className="flex items-center gap-4 mt-1">
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Mail className="h-3 w-3" />
                    {message.customerEmail}
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {formatTime(message.timestamp)}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={message.status === 'unread' ? 'destructive' : 'secondary'}>
                {message.status === 'unread' ? 'No leído' :
                 message.status === 'read' ? 'Leído' :
                 message.status === 'replied' ? 'Respondido' : 'Cerrado'}
              </Badge>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>Marcar como leído</DropdownMenuItem>
                  <DropdownMenuItem>Asignar agente</DropdownMenuItem>
                  <DropdownMenuItem>Cerrar conversación</DropdownMenuItem>
                  <DropdownMenuItem>Ver perfil completo</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Chat */}
      <Card className="h-[500px] flex flex-col">
        <CardHeader>
          <CardTitle className="text-lg">Conversación</CardTitle>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col">
          <ScrollArea className="flex-1 pr-4">
            <div className="space-y-4">
              {chatMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-3 ${
                    msg.sender === 'customer' ? 'justify-start' : 'justify-end'
                  }`}
                >
                  <div
                    className={`flex gap-3 max-w-[80%] ${
                      msg.sender === 'customer' ? 'flex-row' : 'flex-row-reverse'
                    }`}
                  >
                    <div className={`h-8 w-8 rounded-full flex items-center justify-center ${getSenderColor(msg.sender)}`}>
                      {getSenderIcon(msg.sender)}
                    </div>
                    <div
                      className={`rounded-lg px-4 py-2 ${
                        msg.sender === 'customer'
                          ? 'bg-gray-100 dark:bg-gray-800'
                          : msg.sender === 'bot'
                          ? 'bg-purple-100 dark:bg-purple-900'
                          : 'bg-green-100 dark:bg-green-900'
                      }`}
                    >
                      <p className="text-sm">{msg.content}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {formatTime(msg.timestamp)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
          
          <div className="mt-4 space-y-2">
            <Textarea
              value={reply}
              onChange={(e) => setReply(e.target.value)}
              placeholder="Escribe tu respuesta..."
              rows={3}
            />
            <div className="flex justify-between items-center">
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Bot className="h-4 w-4 mr-2" />
                  Respuesta IA
                </Button>
                <Button variant="outline" size="sm">
                  Plantilla
                </Button>
              </div>
              <Button onClick={handleSendReply} disabled={!reply.trim()}>
                <Send className="h-4 w-4 mr-2" />
                Enviar
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
