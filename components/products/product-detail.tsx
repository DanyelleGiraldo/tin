"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ArrowLeft, Edit, Trash2, Package, Calendar, Tag, DollarSign, Archive } from 'lucide-react'

interface Product {
  id: string
  name: string
  description: string
  price: number
  stock: number
  category: string
  status: 'active' | 'inactive' | 'out_of_stock'
  image?: string
  sku: string
  createdAt: string
  updatedAt: string
}

interface ProductDetailProps {
  product: Product
  onBack: () => void
  onEdit: () => void
  onDelete: () => void
}

export function ProductDetail({ product, onBack, onEdit, onDelete }: ProductDetailProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'inactive': return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
      case 'out_of_stock': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Activo'
      case 'inactive': return 'Inactivo'
      case 'out_of_stock': return 'Sin Stock'
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
            <h1 className="text-3xl font-bold">{product.name}</h1>
            <p className="text-muted-foreground">
              Detalles del producto
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
              <CardTitle>Información del Producto</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-start gap-6">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={product.image || "/placeholder.svg"} />
                  <AvatarFallback className="text-2xl">
                    <Package className="h-8 w-8" />
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-2xl font-bold">{product.name}</h2>
                    <Badge className={getStatusColor(product.status)}>
                      {getStatusText(product.status)}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground mb-4">
                    {product.description}
                  </p>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="flex items-center gap-2">
                      <Tag className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">SKU: {product.sku}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Archive className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Categoría: {product.category}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Historial de Cambios</CardTitle>
              <CardDescription>
                Registro de modificaciones del producto
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Producto actualizado</p>
                    <p className="text-xs text-muted-foreground">
                      {formatDate(product.updatedAt)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Producto creado</p>
                    <p className="text-xs text-muted-foreground">
                      {formatDate(product.createdAt)}
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
              <CardTitle>Precio e Inventario</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                <DollarSign className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                <p className="text-3xl font-bold text-blue-600">
                  {formatPrice(product.price)}
                </p>
                <p className="text-sm text-muted-foreground">Precio actual</p>
              </div>
              
              <div className="grid gap-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Stock disponible</span>
                  <span className={`font-medium ${
                    product.stock === 0 ? 'text-red-600' : 
                    product.stock < 10 ? 'text-yellow-600' : 'text-green-600'
                  }`}>
                    {product.stock} unidades
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Valor total</span>
                  <span className="font-medium">
                    {formatPrice(product.price * product.stock)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Estadísticas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Vistas</span>
                <span className="font-medium">1,234</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Ventas</span>
                <span className="font-medium">89</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Conversión</span>
                <span className="font-medium">7.2%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Rating</span>
                <span className="font-medium">4.5/5</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Acciones Rápidas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                Duplicar producto
              </Button>
              <Button variant="outline" className="w-full justify-start">
                Exportar datos
              </Button>
              <Button variant="outline" className="w-full justify-start">
                Ver en tienda
              </Button>
              <Button variant="outline" className="w-full justify-start">
                Generar reporte
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
