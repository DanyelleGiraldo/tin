"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Trash2, Database, ArrowLeft, Link, Save, AlertCircle } from 'lucide-react'
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { ModuleGenerator, FieldDefinition, ModuleSchema, RelationDefinition } from "@/lib/module-generator"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function CreateModulePage() {
  const router = useRouter()
  const { toast } = useToast()
  
  const [moduleName, setModuleName] = useState("")
  const [moduleDescription, setModuleDescription] = useState("")
  const [tableName, setTableName] = useState("")
  const [fields, setFields] = useState<FieldDefinition[]>([
    { id: "1", name: "id", type: "number", required: true },
    { id: "2", name: "name", type: "text", required: true },
  ])
  const [relations, setRelations] = useState<RelationDefinition[]>([])
  const [availableModules, setAvailableModules] = useState<ModuleSchema[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<string[]>([])

  useEffect(() => {
    // Inicializar ModuleGenerator y cargar módulos
    ModuleGenerator.init()
    const modules = ModuleGenerator.getAllModules()
    setAvailableModules(modules)
    console.log('Available modules loaded:', modules.length)
  }, [])

  useEffect(() => {
    if (moduleName) {
      const cleanName = moduleName.toLowerCase()
        .replace(/[^a-z0-9\s]/g, '') // Remover caracteres especiales
        .replace(/\s+/g, '_') // Reemplazar espacios con guiones bajos
      setTableName(cleanName)
    }
  }, [moduleName])

  const validateForm = (): string[] => {
    const newErrors: string[] = []

    if (!moduleName.trim()) {
      newErrors.push("El nombre del módulo es requerido")
    }

    if (!tableName.trim()) {
      newErrors.push("El nombre de la tabla es requerido")
    }

    if (fields.length < 2) {
      newErrors.push("Debe tener al menos 2 campos")
    }

    // Validar nombres de campos únicos
    const fieldNames = fields.map(f => f.name.toLowerCase())
    const duplicateFields = fieldNames.filter((name, index) => fieldNames.indexOf(name) !== index)
    if (duplicateFields.length > 0) {
      newErrors.push(`Nombres de campos duplicados: ${duplicateFields.join(', ')}`)
    }

    // Validar campos vacíos
    const emptyFields = fields.filter(f => !f.name.trim())
    if (emptyFields.length > 0) {
      newErrors.push("Todos los campos deben tener un nombre")
    }

    // Validar campos select con opciones
    const selectFieldsWithoutOptions = fields.filter(f => f.type === 'select' && (!f.options || f.options.length === 0))
    if (selectFieldsWithoutOptions.length > 0) {
      newErrors.push("Los campos de selección deben tener opciones definidas")
    }

    // Validar campos de relación
    const relationFieldsWithoutTarget = fields.filter(f => f.type === 'relation' && !f.relationTo)
    if (relationFieldsWithoutTarget.length > 0) {
      newErrors.push("Los campos de relación deben especificar el módulo relacionado")
    }

    return newErrors
  }

  const addField = () => {
    const newField: FieldDefinition = {
      id: Date.now().toString(),
      name: "",
      type: "text",
      required: false,
    }
    setFields([...fields, newField])
  }

  const removeField = (id: string) => {
    if (fields.length <= 2) {
      toast({
        title: "Error",
        description: "Debe mantener al menos 2 campos",
        variant: "destructive",
      })
      return
    }
    setFields(fields.filter(field => field.id !== id))
  }

  const updateField = (id: string, updates: Partial<FieldDefinition>) => {
    setFields(fields.map(field => 
      field.id === id ? { ...field, ...updates } : field
    ))
  }

  const addRelation = () => {
    const newRelation: RelationDefinition = {
      id: Date.now().toString(),
      fromModule: "",
      toModule: "",
      fromField: "",
      toField: "id",
      type: "one-to-many",
      name: "",
      description: ""
    }
    setRelations([...relations, newRelation])
  }

  const removeRelation = (id: string) => {
    setRelations(relations.filter(rel => rel.id !== id))
  }

  const updateRelation = (id: string, updates: Partial<RelationDefinition>) => {
    setRelations(relations.map(rel => 
      rel.id === id ? { ...rel, ...updates } : rel
    ))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    const validationErrors = validateForm()
    if (validationErrors.length > 0) {
      setErrors(validationErrors)
      setIsSubmitting(false)
      return
    }

    setErrors([])

    try {
      const moduleId = `module_${Date.now()}`
      
      const moduleSchema: ModuleSchema = {
        id: moduleId,
        name: moduleName.trim(),
        description: moduleDescription.trim(),
        tableName: tableName.trim(),
        fields: fields.map(field => ({
          ...field,
          name: field.name.trim()
        })),
        relations: relations,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        status: 'active'
      }

      console.log('Creating module:', moduleSchema)

      // Guardar módulo
      ModuleGenerator.addModule(moduleSchema)

      // Guardar relaciones
      relations.forEach(relation => {
        if (relation.name && relation.toModule) {
          ModuleGenerator.addRelation({
            ...relation,
            fromModule: moduleId
          })
        }
      })

      toast({
        title: "¡Módulo creado exitosamente!",
        description: `El módulo "${moduleName}" ha sido creado y está disponible en el menú`,
      })

      // Esperar un poco antes de navegar para asegurar que se guarde
      setTimeout(() => {
        router.push('/dashboard/modules')
      }, 500)

    } catch (error) {
      console.error('Error creating module:', error)
      toast({
        title: "Error al crear módulo",
        description: "Hubo un problema al crear el módulo. Inténtalo de nuevo.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const fieldTypes = [
    { value: "text", label: "Texto" },
    { value: "number", label: "Número" },
    { value: "email", label: "Email" },
    { value: "date", label: "Fecha" },
    { value: "boolean", label: "Booleano" },
    { value: "select", label: "Selección" },
    { value: "textarea", label: "Texto largo" },
    { value: "relation", label: "Relación" },
  ]

  const relationTypes = [
    { value: "one-to-one", label: "Uno a Uno" },
    { value: "one-to-many", label: "Uno a Muchos" },
    { value: "many-to-many", label: "Muchos a Muchos" },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Crear Módulo Dinámico</h1>
          <p className="text-muted-foreground">
            Diseña un nuevo módulo con relaciones personalizadas
          </p>
        </div>
      </div>

      {errors.length > 0 && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <ul className="list-disc list-inside space-y-1">
              {errors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <Tabs defaultValue="basic" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="basic">Información Básica</TabsTrigger>
            <TabsTrigger value="fields">Campos ({fields.length})</TabsTrigger>
            <TabsTrigger value="relations">Relaciones ({relations.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Información del Módulo</CardTitle>
                <CardDescription>
                  Define los detalles principales del módulo
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nombre del Módulo *</Label>
                    <Input
                      id="name"
                      value={moduleName}
                      onChange={(e) => setModuleName(e.target.value)}
                      placeholder="ej: Facturas, Pedidos, Inventario..."
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tableName">Nombre de Tabla *</Label>
                    <Input
                      id="tableName"
                      value={tableName}
                      onChange={(e) => setTableName(e.target.value)}
                      placeholder="nombre_tabla"
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Descripción</Label>
                  <Textarea
                    id="description"
                    value={moduleDescription}
                    onChange={(e) => setModuleDescription(e.target.value)}
                    placeholder="Describe la funcionalidad del módulo..."
                    rows={3}
                  />
                </div>

                <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                  <h4 className="font-medium mb-2">Vista Previa</h4>
                  <p><strong>Módulo:</strong> {moduleName || 'Sin nombre'}</p>
                  <p><strong>Tabla:</strong> {tableName || 'sin_nombre'}</p>
                  <p><strong>Descripción:</strong> {moduleDescription || 'Sin descripción'}</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="fields" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Campos del Módulo</CardTitle>
                    <CardDescription>
                      Define la estructura de datos ({fields.length} campos)
                    </CardDescription>
                  </div>
                  <Button type="button" onClick={addField} size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Agregar Campo
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {fields.map((field, index) => (
                    <div key={field.id} className="flex gap-4 items-end p-4 border rounded-lg">
                      <div className="flex-1 space-y-2">
                        <Label>Nombre del Campo *</Label>
                        <Input
                          value={field.name}
                          onChange={(e) => updateField(field.id, { name: e.target.value })}
                          placeholder="nombre_campo"
                          className={!field.name.trim() ? 'border-red-300' : ''}
                        />
                      </div>
                      <div className="flex-1 space-y-2">
                        <Label>Tipo</Label>
                        <Select
                          value={field.type}
                          onValueChange={(value) => updateField(field.id, { type: value as any })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {fieldTypes.map((type) => (
                              <SelectItem key={type.value} value={type.value}>
                                {type.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      {field.type === 'select' && (
                        <div className="flex-1 space-y-2">
                          <Label>Opciones (separadas por coma) *</Label>
                          <Input
                            value={field.options?.join(', ') || ''}
                            onChange={(e) => updateField(field.id, { 
                              options: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                            })}
                            placeholder="Opción 1, Opción 2, Opción 3"
                            className={field.type === 'select' && (!field.options || field.options.length === 0) ? 'border-red-300' : ''}
                          />
                        </div>
                      )}

                      {field.type === 'relation' && (
                        <div className="flex-1 space-y-2">
                          <Label>Relacionar con *</Label>
                          <Select
                            value={field.relationTo || ''}
                            onValueChange={(value) => updateField(field.id, { relationTo: value })}
                          >
                            <SelectTrigger className={field.type === 'relation' && !field.relationTo ? 'border-red-300' : ''}>
                              <SelectValue placeholder="Seleccionar módulo" />
                            </SelectTrigger>
                            <SelectContent>
                              {availableModules.map((module) => (
                                <SelectItem key={module.id} value={module.id}>
                                  {module.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      )}
                      
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={field.required}
                          onChange={(e) => updateField(field.id, { required: e.target.checked })}
                          className="rounded"
                        />
                        <Label className="text-sm">Requerido</Label>
                      </div>
                      
                      {index > 1 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeField(field.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="relations" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Relaciones entre Módulos</CardTitle>
                    <CardDescription>
                      Define cómo se relaciona este módulo con otros ({relations.length} relaciones)
                    </CardDescription>
                  </div>
                  <Button type="button" onClick={addRelation} size="sm" disabled={availableModules.length === 0}>
                    <Link className="h-4 w-4 mr-2" />
                    Agregar Relación
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {availableModules.length === 0 && (
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      No hay módulos disponibles para crear relaciones. Crea este módulo primero y luego podrás crear relaciones con otros módulos.
                    </AlertDescription>
                  </Alert>
                )}

                <div className="space-y-4">
                  {relations.map((relation) => (
                    <div key={relation.id} className="p-4 border rounded-lg space-y-4">
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label>Nombre de la Relación</Label>
                          <Input
                            value={relation.name}
                            onChange={(e) => updateRelation(relation.id, { name: e.target.value })}
                            placeholder="ej: productos_en_factura"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Tipo de Relación</Label>
                          <Select
                            value={relation.type}
                            onValueChange={(value) => updateRelation(relation.id, { type: value as any })}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {relationTypes.map((type) => (
                                <SelectItem key={type.value} value={type.value}>
                                  {type.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label>Módulo Relacionado</Label>
                          <Select
                            value={relation.toModule}
                            onValueChange={(value) => updateRelation(relation.id, { toModule: value })}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Seleccionar módulo" />
                            </SelectTrigger>
                            <SelectContent>
                              {availableModules.map((module) => (
                                <SelectItem key={module.id} value={module.id}>
                                  {module.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Campo de Relación</Label>
                          <Input
                            value={relation.toField}
                            onChange={(e) => updateRelation(relation.id, { toField: e.target.value })}
                            placeholder="id"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Descripción</Label>
                        <Input
                          value={relation.description || ''}
                          onChange={(e) => updateRelation(relation.id, { description: e.target.value })}
                          placeholder="Describe la relación..."
                        />
                      </div>

                      <div className="flex justify-end">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeRelation(relation.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Eliminar Relación
                        </Button>
                      </div>
                    </div>
                  ))}

                  {relations.length === 0 && availableModules.length > 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      <Link className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No hay relaciones definidas</p>
                      <p className="text-sm">Las relaciones permiten conectar este módulo con otros</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            <Save className="h-4 w-4 mr-2" />
            {isSubmitting ? 'Creando...' : 'Crear Módulo'}
          </Button>
        </div>
      </form>
    </div>
  )
}
