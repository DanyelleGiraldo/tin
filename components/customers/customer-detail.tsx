"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ArrowLeft, Edit, Trash2, User, Mail, Phone, MapPin, Building, Calendar, ShoppingBag, DollarSign } from 'lucide-react'

interface Customer {
  id: string
  name: string
  email: string
  phone?: string
  company?: string
  status: 'active' | 'inactive' | 'blocked'
  totalOrders: number
  totalSpent: number
  lastOrderDate?: string
  createdAt: string
  avatar?: string
  address?: {
    street: string
    city: string
    country: string
    zipCode: string
  }
}

interface CustomerDetailProps {
  customer: Customer
  onBack: () => void
  onEdit: () => void
  onDelete: () => void
}

export function CustomerDetail({ customer, onBack, onEdit, onDelete }: CustomerDetailProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'inactive': return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
      case 'blocked': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Activo'
      case 'inactive': return 'Inactivo'
      case 'blocked': return 'Bloqueado'
      default: return status
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR'
    }).format(price)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{customer.name}</h1>
            <p className="text-muted-foreground">
              Perfil del cliente
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={onEdit}>
            <Edit className="h-4 w-4 mr-2" />
            Editar
          </Button>
          <Button variant="outline" onClick={onDelete} className="text-red-600 hover:text-red-700">
            <Trash2 className="h-4 w-4 mr-2" />
            Eliminar
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Información del Cliente</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-start gap-6">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={customer.avatar || "/placeholder.svg"} />
                  <AvatarFallback className="text-2xl">
                    {customer.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-2xl font-bold">{customer.name}</h2>
                    <Badge className={getStatusColor(customer.status)}>
                      {getStatusText(customer.status)}
                    </Badge>
                  </div>
                  
                  <div className="grid gap-3 md:grid-cols-2">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{customer.email}</span>
                    </div>
                    {customer.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{customer.phone}</span>
                      </div>
                    )}
                    {customer.company && (
                      <div className="flex items-center gap-2">
                        <Building className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{customer.company}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Cliente desde {formatDate(customer.createdAt)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {customer.address && (customer.address.street || customer.address.city) && (
                <div className="border-t pt-4">
                  <h3 className="font-medium mb-3 flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Dirección
                  </h3>
                  <div className="text-sm text-muted-foreground">
                    {customer.address.street && <p>{customer.address.street}</p>}
                    <p>
                      {customer.address.city && customer.address.city}
                      {customer.address.zipCode && `, ${customer.address.zipCode}`}
                    </p>
                    {customer.address.country && <p>{customer.address.country}</p>}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Historial de Actividad</CardTitle>
              <CardDescription>
                Últimas interacciones y cambios
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {customer.lastOrderDate && (
                  <div className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
                    <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Último pedido realizado</p>
                      <p className="text-xs text-muted-foreground">
                        {formatDateTime(customer.lastOrderDate)}
                      </p>
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-950 rounded-lg">
                  <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Cliente registrado</p>
                    <p className="text-xs text-muted-foreground">
                      {formatDateTime(customer.createdAt)}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Estadísticas de Compras</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center p-4 bg-green-50 dark:bg-green-950 rounded-lg">
                <DollarSign className="h-8 w-8 mx-auto mb-2 text-green-600" />
                <p className="text-3xl font-bold text-green-600">
                  {formatPrice(customer.totalSpent)}
                </p>
                <p className="text-sm text-muted-foreground">Total gastado</p>
              </div>
              
              <div className="text-center p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                <ShoppingBag className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                <p className="text-3xl font-bold text-blue-600">
                  {customer.totalOrders}
                </p>
                <p className="text-sm text-muted-foreground">Pedidos realizados</p>
              </div>
              
              <div className="grid gap-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Promedio por pedido</span>
                  <span className="font-medium">
                    {customer.totalOrders > 0 
                      ? formatPrice(customer.totalSpent / customer.totalOrders)
                      : formatPrice(0)
                    }
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Estado de cuenta</span>
                  <span className={`font-medium ${
                    customer.status === 'active' ? 'text-green-600' : 
                    customer.status === 'blocked' ? 'text-red-600' : 'text-gray-600'
                  }`}>
                    {getStatusText(customer.status)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Acciones Rápidas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                <Mail className="h-4 w-4 mr-2" />
                Enviar email
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <ShoppingBag className="h-4 w-4 mr-2" />
                Ver pedidos
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <User className="h-4 w-4 mr-2" />
                Crear pedido
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Calendar className="h-4 w-4 mr-2" />
                Programar seguimiento
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Preferencias</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">Notificaciones por email</span>
                <Badge variant="secondary">Activado</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Newsletter</span>
                <Badge variant="secondary">Suscrito</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Ofertas especiales</span>
                <Badge variant="outline">Desactivado</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
