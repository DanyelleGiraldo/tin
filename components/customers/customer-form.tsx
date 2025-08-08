"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Save, User } from 'lucide-react'
import { useToast } from "@/hooks/use-toast"

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

interface CustomerFormProps {
  customer?: Customer
  onSubmit: (customer: Omit<Customer, 'id' | 'createdAt'>) => void
  onCancel: () => void
  isEditing?: boolean
}

export function CustomerForm({ customer, onSubmit, onCancel, isEditing = false }: CustomerFormProps) {
  const [formData, setFormData] = useState({
    name: customer?.name || "",
    email: customer?.email || "",
    phone: customer?.phone || "",
    company: customer?.company || "",
    status: customer?.status || "active" as const,
    totalOrders: customer?.totalOrders || 0,
    totalSpent: customer?.totalSpent || 0,
    lastOrderDate: customer?.lastOrderDate || "",
    avatar: customer?.avatar || "",
    address: {
      street: customer?.address?.street || "",
      city: customer?.address?.city || "",
      country: customer?.address?.country || "",
      zipCode: customer?.address?.zipCode || ""
    }
  })
  const { toast } = useToast()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name.trim() || !formData.email.trim()) {
      toast({
        title: "Error",
        description: "El nombre y email son requeridos",
        variant: "destructive",
      })
      return
    }

    onSubmit(formData)
    toast({
      title: isEditing ? "Cliente actualizado" : "Cliente creado",
      description: `El cliente "${formData.name}" ha sido ${isEditing ? 'actualizado' : 'creado'} exitosamente`,
    })
  }

  const handleInputChange = (field: string, value: any) => {
    if (field.startsWith('address.')) {
      const addressField = field.split('.')[1]
      setFormData(prev => ({
        ...prev,
        address: { ...prev.address, [addressField]: value }
      }))
    } else {
      setFormData(prev => ({ ...prev, [field]: value }))
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" onClick={onCancel}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver
        </Button>
        <div>
          <h1 className="text-3xl font-bold">
            {isEditing ? 'Editar Cliente' : 'Nuevo Cliente'}
          </h1>
          <p className="text-muted-foreground">
            {isEditing ? 'Modifica los detalles del cliente' : 'Añade un nuevo cliente a tu base de datos'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Información Personal</CardTitle>
                <CardDescription>
                  Datos básicos del cliente
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nombre Completo *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="Nombre del cliente"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="cliente@email.com"
                      required
                    />
                  </div>
                </div>
                
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Teléfono</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      placeholder="+34 666 123 456"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="company">Empresa</Label>
                    <Input
                      id="company"
                      value={formData.company}
                      onChange={(e) => handleInputChange('company', e.target.value)}
                      placeholder="Nombre de la empresa"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="avatar">URL del Avatar</Label>
                  <Input
                    id="avatar"
                    value={formData.avatar}
                    onChange={(e) => handleInputChange('avatar', e.target.value)}
                    placeholder="https://ejemplo.com/avatar.jpg"
                    type="url"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Dirección</CardTitle>
                <CardDescription>
                  Información de contacto y envío
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="street">Dirección</Label>
                  <Input
                    id="street"
                    value={formData.address.street}
                    onChange={(e) => handleInputChange('address.street', e.target.value)}
                    placeholder="Calle, número, piso..."
                  />
                </div>
                
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="city">Ciudad</Label>
                    <Input
                      id="city"
                      value={formData.address.city}
                      onChange={(e) => handleInputChange('address.city', e.target.value)}
                      placeholder="Ciudad"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="zipCode">Código Postal</Label>
                    <Input
                      id="zipCode"
                      value={formData.address.zipCode}
                      onChange={(e) => handleInputChange('address.zipCode', e.target.value)}
                      placeholder="28001"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="country">País</Label>
                    <Input
                      id="country"
                      value={formData.address.country}
                      onChange={(e) => handleInputChange('address.country', e.target.value)}
                      placeholder="España"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Estado y Configuración</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="status">Estado</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) => handleInputChange('status', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Activo</SelectItem>
                      <SelectItem value="inactive">Inactivo</SelectItem>
                      <SelectItem value="blocked">Bloqueado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {isEditing && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="totalOrders">Total de Pedidos</Label>
                      <Input
                        id="totalOrders"
                        type="number"
                        min="0"
                        value={formData.totalOrders}
                        onChange={(e) => handleInputChange('totalOrders', parseInt(e.target.value) || 0)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="totalSpent">Total Gastado (€)</Label>
                      <Input
                        id="totalSpent"
                        type="number"
                        step="0.01"
                        min="0"
                        value={formData.totalSpent}
                        onChange={(e) => handleInputChange('totalSpent', parseFloat(e.target.value) || 0)}
                      />
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Vista Previa</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                      {formData.avatar ? (
                        <img 
                          src={formData.avatar || "/placeholder.svg"} 
                          alt={formData.name}
                          className="w-full h-full object-cover rounded-full"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none'
                          }}
                        />
                      ) : (
                        <User className="h-6 w-6 text-muted-foreground" />
                      )}
                    </div>
                    <div>
                      <h4 className="font-medium">{formData.name || "Nombre del cliente"}</h4>
                      <p className="text-sm text-muted-foreground">{formData.email || "email@ejemplo.com"}</p>
                    </div>
                  </div>
                  
                  {formData.company && (
                    <p className="text-sm"><strong>Empresa:</strong> {formData.company}</p>
                  )}
                  
                  {formData.phone && (
                    <p className="text-sm"><strong>Teléfono:</strong> {formData.phone}</p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Acciones</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button type="submit" className="w-full">
                  <Save className="h-4 w-4 mr-2" />
                  {isEditing ? 'Actualizar Cliente' : 'Crear Cliente'}
                </Button>
                <Button type="button" variant="outline" className="w-full" onClick={onCancel}>
                  Cancelar
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  )
}
