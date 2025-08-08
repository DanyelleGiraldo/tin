"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Database, Settings, Trash2, Edit, Eye, Link, RefreshCw } from 'lucide-react'
import { useRouter } from "next/navigation"
import { ModuleGenerator, ModuleSchema } from "@/lib/module-generator"
import { useToast } from "@/hooks/use-toast"

export default function ModulesPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [modules, setModules] = useState<ModuleSchema[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadModules()
  }, [])

  const loadModules = () => {
    setIsLoading(true)
    try {
      ModuleGenerator.init()
      const loadedModules = ModuleGenerator.getAllModules()
      console.log('Loaded modules:', loadedModules.length)
      setModules(loadedModules)
    } catch (error) {
      console.error('Error loading modules:', error)
      toast({
        title: "Error",
        description: "No se pudieron cargar los módulos",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteModule = (id: string, name: string) => {
    if (confirm(`¿Estás seguro de que quieres eliminar el módulo "${name}"?`)) {
      try {
        ModuleGenerator.deleteModule(id)
        loadModules()
        toast({
          title: "Módulo eliminado",
          description: `El módulo "${name}" ha sido eliminado exitosamente`,
        })
      } catch (error) {
        console.error('Error deleting module:', error)
        toast({
          title: "Error",
          description: "No se pudo eliminar el módulo",
          variant: "destructive",
        })
      }
    }
  }

  const handleViewModule = (module: ModuleSchema) => {
    router.push(`/dashboard/modules/${module.id}`)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES')
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-muted-foreground" />
          <p>Cargando módulos...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Módulos Dinámicos</h1>
          <p className="text-muted-foreground">
            Crea y gestiona módulos personalizados con relaciones
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={loadModules}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Actualizar
          </Button>
          <Button onClick={() => router.push('/dashboard/modules/create')}>
            <Plus className="h-4 w-4 mr-2" />
            Crear Módulo
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {modules.map((module) => (
          <Card key={module.id} className="relative">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  {module.name}
                </CardTitle>
                <Badge variant={module.status === "active" ? "default" : "secondary"}>
                  {module.status === "active" ? "Activo" : "Borrador"}
                </Badge>
              </div>
              <CardDescription>{module.description || 'Sin descripción'}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium mb-2">Tabla: <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">{module.tableName}</code></p>
                  <p className="text-sm font-medium mb-2">Campos ({module.fields.length}):</p>
                  <div className="flex flex-wrap gap-1">
                    {module.fields.slice(0, 4).map((field) => (
                      <Badge key={field.id} variant="outline" className="text-xs">
                        {field.name}
                      </Badge>
                    ))}
                    {module.fields.length > 4 && (
                      <Badge variant="outline" className="text-xs">
                        +{module.fields.length - 4} más
                      </Badge>
                    )}
                  </div>
                </div>

                {module.relations.length > 0 && (
                  <div>
                    <p className="text-sm font-medium mb-2 flex items-center gap-1">
                      <Link className="h-3 w-3" />
                      Relaciones ({module.relations.length})
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {module.relations.slice(0, 2).map((relation) => (
                        <Badge key={relation.id} variant="secondary" className="text-xs">
                          {relation.name}
                        </Badge>
                      ))}
                      {module.relations.length > 2 && (
                        <Badge variant="secondary" className="text-xs">
                          +{module.relations.length - 2} más
                        </Badge>
                      )}
                    </div>
                  </div>
                )}
                
                <div className="text-xs text-muted-foreground">
                  Creado: {formatDate(module.createdAt)}
                </div>

                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1"
                    onClick={() => handleViewModule(module)}
                  >
                    <Eye className="h-3 w-3 mr-1" />
                    Ver
                  </Button>
                  <Button variant="outline" size="sm">
                    <Edit className="h-3 w-3" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-red-600 hover:text-red-700"
                    onClick={() => handleDeleteModule(module.id, module.name)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        <Card className="border-dashed border-2 flex items-center justify-center min-h-[300px]">
          <div className="text-center">
            <Plus className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="font-medium mb-2">Crear Nuevo Módulo</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Diseña un módulo personalizado con relaciones
            </p>
            <Button onClick={() => router.push('/dashboard/modules/create')}>
              Comenzar
            </Button>
          </div>
        </Card>
      </div>

      {modules.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Resumen de Módulos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-4">
              <div className="text-center">
                <p className="text-2xl font-bold">{modules.length}</p>
                <p className="text-sm text-muted-foreground">Total Módulos</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold">
                  {modules.filter(m => m.status === 'active').length}
                </p>
                <p className="text-sm text-muted-foreground">Activos</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold">
                  {modules.reduce((sum, m) => sum + m.fields.length, 0)}
                </p>
                <p className="text-sm text-muted-foreground">Total Campos</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold">
                  {modules.reduce((sum, m) => sum + m.relations.length, 0)}
                </p>
                <p className="text-sm text-muted-foreground">Total Relaciones</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {modules.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Database className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-medium mb-2">No hay módulos creados</h3>
            <p className="text-muted-foreground mb-4">
              Crea tu primer módulo dinámico para comenzar
            </p>
            <Button onClick={() => router.push('/dashboard/modules/create')}>
              <Plus className="h-4 w-4 mr-2" />
              Crear Primer Módulo
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
