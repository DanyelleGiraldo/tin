"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
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
import { Search, Plus, ArrowLeft, Edit, Trash2, MoreHorizontal, Eye, Link, Database } from 'lucide-react'
import { ModuleGenerator, ModuleSchema } from "@/lib/module-generator"
import { DynamicForm } from "@/components/modules/dynamic-form"
import { DynamicDetail } from "@/components/modules/dynamic-detail"

export default function ModuleViewPage() {
  const params = useParams()
  const router = useRouter()
  const moduleId = params.id as string
  
  const [module, setModule] = useState<ModuleSchema | null>(null)
  const [data, setData] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [showForm, setShowForm] = useState(false)
  const [selectedRecord, setSelectedRecord] = useState<any>(null)
  const [editingRecord, setEditingRecord] = useState<any>(null)

  useEffect(() => {
    loadModule()
  }, [moduleId])

  const loadModule = () => {
    const moduleData = ModuleGenerator.getModule(moduleId)
    if (moduleData) {
      setModule(moduleData)
      setData(ModuleGenerator.generateModuleData(moduleId))
    }
  }

  const handleAddRecord = (recordData: any) => {
    const newRecord = {
      ...recordData,
      id: Date.now().toString()
    }
    setData([...data, newRecord])
    setShowForm(false)
  }

  const handleEditRecord = (recordData: any) => {
    if (editingRecord) {
      const updatedRecord = {
        ...recordData,
        id: editingRecord.id
      }
      setData(data.map(r => r.id === editingRecord.id ? updatedRecord : r))
      setEditingRecord(null)
    }
  }

  const handleDeleteRecord = (id: string) => {
    setData(data.filter(r => r.id !== id))
  }

  const filteredData = data.filter(record => {
    return Object.values(record).some(value => 
      String(value).toLowerCase().includes(searchTerm.toLowerCase())
    )
  })

  const formatValue = (value: any, field: any) => {
    if (field.type === 'boolean') {
      return value ? 'Sí' : 'No'
    }
    if (field.type === 'date') {
      return new Date(value).toLocaleDateString('es-ES')
    }
    if (field.type === 'number') {
      return typeof value === 'number' ? value.toLocaleString() : value
    }
    return String(value || '-')
  }

  if (!module) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Database className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="font-medium mb-2">Módulo no encontrado</h3>
          <Button onClick={() => router.push('/dashboard/modules')}>
            Volver a Módulos
          </Button>
        </div>
      </div>
    )
  }

  if (showForm) {
    return (
      <DynamicForm
        module={module}
        onSubmit={handleAddRecord}
        onCancel={() => setShowForm(false)}
      />
    )
  }

  if (editingRecord) {
    return (
      <DynamicForm
        module={module}
        record={editingRecord}
        onSubmit={handleEditRecord}
        onCancel={() => setEditingRecord(null)}
        isEditing
      />
    )
  }

  if (selectedRecord) {
    return (
      <DynamicDetail
        module={module}
        record={selectedRecord}
        onBack={() => setSelectedRecord(null)}
        onEdit={() => {
          setEditingRecord(selectedRecord)
          setSelectedRecord(null)
        }}
        onDelete={() => {
          handleDeleteRecord(selectedRecord.id)
          setSelectedRecord(null)
        }}
      />
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={() => router.push('/dashboard/modules')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{module.name}</h1>
            <p className="text-muted-foreground">
              {module.description}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Link className="h-4 w-4 mr-2" />
            Relaciones
          </Button>
          <Button onClick={() => setShowForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Registro
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Registros</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.length}</div>
            <p className="text-xs text-muted-foreground">
              En la tabla {module.tableName}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Campos</CardTitle>
            <span className="text-sm">#</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{module.fields.length}</div>
            <p className="text-xs text-muted-foreground">
              Campos definidos
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Relaciones</CardTitle>
            <Link className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{module.relations.length}</div>
            <p className="text-xs text-muted-foreground">
              Con otros módulos
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Estado</CardTitle>
            <span className="text-sm">●</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              <Badge variant={module.status === 'active' ? 'default' : 'secondary'}>
                {module.status === 'active' ? 'Activo' : 'Borrador'}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              Estado actual
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Registros de {module.name}</CardTitle>
              <CardDescription>
                {filteredData.length} registros encontrados
              </CardDescription>
            </div>
            <div className="relative w-72">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar registros..."
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
                {module.fields.slice(0, 6).map((field) => (
                  <TableHead key={field.id}>{field.name}</TableHead>
                ))}
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map((record) => (
                <TableRow key={record.id}>
                  {module.fields.slice(0, 6).map((field) => (
                    <TableCell key={field.id}>
                      {formatValue(record[field.name], field)}
                    </TableCell>
                  ))}
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setSelectedRecord(record)}>
                          <Eye className="h-4 w-4 mr-2" />
                          Ver detalles
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setEditingRecord(record)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleDeleteRecord(record.id)}
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
