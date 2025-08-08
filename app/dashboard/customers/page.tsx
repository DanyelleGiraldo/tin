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
import { Search, Plus, Users, Edit, Trash2, MoreHorizontal, Eye, Filter, Mail, Phone } from 'lucide-react'
import { CustomerForm } from "@/components/customers/customer-form"
import { CustomerDetail } from "@/components/customers/customer-detail"

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

export default function CustomersPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [showForm, setShowForm] = useState(false)
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null)

  const [customers, setCustomers] = useState<Customer[]>([
    {
      id: "1",
      name: "Ana García",
      email: "ana.garcia@email.com",
      phone: "+34 666 123 456",
      company: "Tech Solutions SL",
      status: "active",
      totalOrders: 15,
      totalSpent: 2450.75,
      lastOrderDate: "2024-01-18T10:30:00Z",
      createdAt: "2023-06-15T09:00:00Z",
      address: {
        street: "Calle Mayor 123",
        city: "Madrid",
        country: "España",
        zipCode: "28001"
      }
    },
    {
      id: "2",
      name: "Carlos López",
      email: "carlos.lopez@email.com",
      phone: "+34 677 987 654",
      status: "active",
      totalOrders: 8,
      totalSpent: 1200.50,
      lastOrderDate: "2024-01-15T14:20:00Z",
      createdAt: "2023-09-22T11:30:00Z",
      address: {
        street: "Avenida Libertad 45",
        city: "Barcelona",
        country: "España",
        zipCode: "08001"
      }
    },
    {
      id: "3",
      name: "María Rodríguez",
      email: "maria.rodriguez@email.com",
      phone: "+34 688 555 777",
      company: "Diseño Creativo",
      status: "inactive",
      totalOrders: 3,
      totalSpent: 450.25,
      lastOrderDate: "2023-12-10T16:45:00Z",
      createdAt: "2023-11-05T13:15:00Z",
      address: {
        street: "Plaza España 8",
        city: "Valencia",
        country: "España",
        zipCode: "46001"
      }
    },
    {
      id: "4",
      name: "Juan Pérez",
      email: "juan.perez@email.com",
      status: "blocked",
      totalOrders: 0,
      totalSpent: 0,
      createdAt: "2024-01-10T08:00:00Z"
    }
  ])

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

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (customer.company && customer.company.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  const handleAddCustomer = (customerData: Omit<Customer, 'id' | 'createdAt'>) => {
    const newCustomer: Customer = {
      ...customerData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    }
    setCustomers([...customers, newCustomer])
    setShowForm(false)
  }

  const handleEditCustomer = (customerData: Omit<Customer, 'id' | 'createdAt'>) => {
    if (editingCustomer) {
      const updatedCustomer: Customer = {
        ...customerData,
        id: editingCustomer.id,
        createdAt: editingCustomer.createdAt
      }
      setCustomers(customers.map(c => c.id === editingCustomer.id ? updatedCustomer : c))
      setEditingCustomer(null)
    }
  }

  const handleDeleteCustomer = (id: string) => {
    setCustomers(customers.filter(c => c.id !== id))
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
      <CustomerForm
        onSubmit={handleAddCustomer}
        onCancel={() => setShowForm(false)}
      />
    )
  }

  if (editingCustomer) {
    return (
      <CustomerForm
        customer={editingCustomer}
        onSubmit={handleEditCustomer}
        onCancel={() => setEditingCustomer(null)}
        isEditing
      />
    )
  }

  if (selectedCustomer) {
    return (
      <CustomerDetail
        customer={selectedCustomer}
        onBack={() => setSelectedCustomer(null)}
        onEdit={() => {
          setEditingCustomer(selectedCustomer)
          setSelectedCustomer(null)
        }}
        onDelete={() => {
          handleDeleteCustomer(selectedCustomer.id)
          setSelectedCustomer(null)
        }}
      />
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Clientes</h1>
          <p className="text-muted-foreground">
            Gestiona tu base de datos de clientes
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filtros
          </Button>
          <Button onClick={() => setShowForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Cliente
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Clientes</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{customers.length}</div>
            <p className="text-xs text-muted-foreground">
              +2 desde el mes pasado
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Clientes Activos</CardTitle>
            <Users className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {customers.filter(c => c.status === 'active').length}
            </div>
            <p className="text-xs text-muted-foreground">
              {Math.round((customers.filter(c => c.status === 'active').length / customers.length) * 100)}% del total
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ingresos Totales</CardTitle>
            <span className="text-sm">€</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatPrice(customers.reduce((sum, c) => sum + c.totalSpent, 0))}
            </div>
            <p className="text-xs text-muted-foreground">
              +15% desde el mes pasado
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pedidos Totales</CardTitle>
            <span className="text-sm">#</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {customers.reduce((sum, c) => sum + c.totalOrders, 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              +8% desde el mes pasado
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Lista de Clientes</CardTitle>
              <CardDescription>
                {filteredCustomers.length} clientes encontrados
              </CardDescription>
            </div>
            <div className="relative w-72">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar clientes..."
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
                <TableHead>Cliente</TableHead>
                <TableHead>Contacto</TableHead>
                <TableHead>Empresa</TableHead>
                <TableHead>Pedidos</TableHead>
                <TableHead>Total Gastado</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Último Pedido</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCustomers.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={customer.avatar || "/placeholder.svg"} />
                        <AvatarFallback>
                          {customer.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{customer.name}</p>
                        <p className="text-sm text-muted-foreground">
                          Cliente desde {formatDate(customer.createdAt)}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="h-3 w-3" />
                        {customer.email}
                      </div>
                      {customer.phone && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Phone className="h-3 w-3" />
                          {customer.phone}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {customer.company || '-'}
                  </TableCell>
                  <TableCell className="font-medium">{customer.totalOrders}</TableCell>
                  <TableCell className="font-medium">{formatPrice(customer.totalSpent)}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(customer.status)}>
                      {getStatusText(customer.status)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {customer.lastOrderDate ? formatDate(customer.lastOrderDate) : 'Nunca'}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setSelectedCustomer(customer)}>
                          <Eye className="h-4 w-4 mr-2" />
                          Ver detalles
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setEditingCustomer(customer)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleDeleteCustomer(customer.id)}
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
