"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Search, Plus, Package, Edit, Trash2, MoreHorizontal, Eye, Filter } from 'lucide-react'
import { ProductForm } from "@/components/products/product-form"
import { ProductDetail } from "@/components/products/product-detail"

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

export default function ProductsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [showForm, setShowForm] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)

  const [products, setProducts] = useState<Product[]>([
    {
      id: "1",
      name: "Laptop Gaming Pro",
      description: "Laptop de alto rendimiento para gaming y trabajo profesional",
      price: 1299.99,
      stock: 15,
      category: "Electrónicos",
      status: "active",
      sku: "LGP-001",
      createdAt: "2024-01-15T10:00:00Z",
      updatedAt: "2024-01-20T14:30:00Z"
    },
    {
      id: "2",
      name: "Auriculares Bluetooth",
      description: "Auriculares inalámbricos con cancelación de ruido",
      price: 199.99,
      stock: 0,
      category: "Audio",
      status: "out_of_stock",
      sku: "ABT-002",
      createdAt: "2024-01-10T09:00:00Z",
      updatedAt: "2024-01-18T11:15:00Z"
    },
    {
      id: "3",
      name: "Smartphone Ultra",
      description: "Teléfono inteligente con cámara de 108MP",
      price: 899.99,
      stock: 32,
      category: "Móviles",
      status: "active",
      sku: "SMU-003",
      createdAt: "2024-01-12T15:30:00Z",
      updatedAt: "2024-01-19T16:45:00Z"
    },
    {
      id: "4",
      name: "Tablet Pro 12",
      description: "Tablet profesional con stylus incluido",
      price: 649.99,
      stock: 8,
      category: "Tablets",
      status: "inactive",
      sku: "TPR-004",
      createdAt: "2024-01-08T12:00:00Z",
      updatedAt: "2024-01-17T10:20:00Z"
    }
  ])

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

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleAddProduct = (productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newProduct: Product = {
      ...productData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    setProducts([...products, newProduct])
    setShowForm(false)
  }

  const handleEditProduct = (productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (editingProduct) {
      const updatedProduct: Product = {
        ...productData,
        id: editingProduct.id,
        createdAt: editingProduct.createdAt,
        updatedAt: new Date().toISOString()
      }
      setProducts(products.map(p => p.id === editingProduct.id ? updatedProduct : p))
      setEditingProduct(null)
    }
  }

  const handleDeleteProduct = (id: string) => {
    setProducts(products.filter(p => p.id !== id))
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR'
    }).format(price)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES')
  }

  if (showForm) {
    return (
      <ProductForm
        onSubmit={handleAddProduct}
        onCancel={() => setShowForm(false)}
      />
    )
  }

  if (editingProduct) {
    return (
      <ProductForm
        product={editingProduct}
        onSubmit={handleEditProduct}
        onCancel={() => setEditingProduct(null)}
        isEditing
      />
    )
  }

  if (selectedProduct) {
    return (
      <ProductDetail
        product={selectedProduct}
        onBack={() => setSelectedProduct(null)}
        onEdit={() => {
          setEditingProduct(selectedProduct)
          setSelectedProduct(null)
        }}
        onDelete={() => {
          handleDeleteProduct(selectedProduct.id)
          setSelectedProduct(null)
        }}
      />
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Productos</h1>
          <p className="text-muted-foreground">
            Gestiona tu catálogo de productos
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filtros
          </Button>
          <Button onClick={() => setShowForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Producto
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Lista de Productos</CardTitle>
              <CardDescription>
                {filteredProducts.length} productos encontrados
              </CardDescription>
            </div>
            <div className="relative w-72">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar productos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Producto</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Categoría</TableHead>
                <TableHead>Precio</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Actualizado</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={product.image || "/placeholder.svg"} />
                        <AvatarFallback>
                          <Package className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{product.name}</p>
                        <p className="text-sm text-muted-foreground truncate max-w-[200px]">
                          {product.description}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="font-mono text-sm">{product.sku}</TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell className="font-medium">{formatPrice(product.price)}</TableCell>
                  <TableCell>
                    <span className={product.stock === 0 ? 'text-red-600' : product.stock < 10 ? 'text-yellow-600' : ''}>
                      {product.stock}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(product.status)}>
                      {getStatusText(product.status)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {formatDate(product.updatedAt)}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setSelectedProduct(product)}>
                          <Eye className="h-4 w-4 mr-2" />
                          Ver detalles
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setEditingProduct(product)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleDeleteProduct(product.id)}
                          className="text-red-600"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Eliminar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
