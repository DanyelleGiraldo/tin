"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft, Save } from 'lucide-react'
import { useToast } from "@/hooks/use-toast"
import { ModuleSchema, ModuleGenerator } from "@/lib/module-generator"

interface DynamicFormProps {
  module: ModuleSchema
  record?: any
  onSubmit: (data: any) => void
  onCancel: () => void
  isEditing?: boolean
}

export function DynamicForm({ module, record, onSubmit, onCancel, isEditing = false }: DynamicFormProps) {
  const { toast } = useToast()
  const [formData, setFormData] = useState(() => {
    const initialData: any = {}
    module.fields.forEach(field => {
      if (record) {
        initialData[field.name] = record[field.name] || getDefaultValue(field.type)
      } else {
        initialData[field.name] = getDefaultValue(field.type)
      }
    })
    return initialData
  })

  function getDefaultValue(type: string) {
    switch (type) {
      case 'number': return 0
      case 'boolean': return false
      case 'date': return new Date().toISOString().split('T')[0]
      default: return ''
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validar campos requeridos
    const missingFields = module.fields
      .filter(field => field.required && !formData[field.name])
      .map(field => field.name)

    if (missingFields.length > 0) {
      toast({
        title: "Error",
        description: `Los siguientes campos son requeridos: ${missingFields.join(', ')}`,
        variant: "destructive",
      })
      return
    }

    onSubmit(formData)
    toast({
      title: isEditing ? "Registro actualizado" : "Registro creado",
      description: `El registro ha sido ${isEditing ? 'actualizado' : 'creado'} exitosamente`,
    })
  }

  const handleInputChange = (fieldName: string, value: any) => {
    setFormData(prev => ({ ...prev, [fieldName]: value }))
  }

  const renderField = (field: any) => {
    const value = formData[field.name]

    switch (field.type) {
      case 'text':
      case 'email':
        return (
          <Input
            type={field.type}
            value={value}
            onChange={(e) => handleInputChange(field.name, e.target.value)}
            placeholder={`Ingresa ${field.name}`}
            required={field.required}
          />
        )

      case 'number':
        return (
          <Input
            type="number"
            value={value}
            onChange={(e) => handleInputChange(field.name, parseFloat(e.target.value) || 0)}
            placeholder={`Ingresa ${field.name}`}
            required={field.required}
          />
        )

      case 'date':
        return (
          <Input
            type="date"
            value={value}
            onChange={(e) => handleInputChange(field.name, e.target.value)}
            required={field.required}
          />
        )

      case 'boolean':
        return (
          <div className="flex items-center space-x-2">
            <Checkbox
              checked={value}
              onCheckedChange={(checked) => handleInputChange(field.name, checked)}
            />
            <Label className="text-sm">Activado</Label>
          </div>
        )

      case 'textarea':
        return (
          <Textarea
            value={value}
            onChange={(e) => handleInputChange(field.name, e.target.value)}
            placeholder={`Ingresa ${field.name}`}
            rows={3}
            required={field.required}
          />
        )

      case 'select':
        return (
          <Select
            value={value}
            onValueChange={(newValue) => handleInputChange(field.name, newValue)}
          >
            <SelectTrigger>
              <SelectValue placeholder={`Selecciona ${field.name}`} />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((option: string) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )

      case 'relation':
        const relatedModule = ModuleGenerator.getModule(field.relationTo || '')
        const relatedData = relatedModule ? ModuleGenerator.generateModuleData(field.relationTo || '') : []
        
        return (
          <Select
            value={value}
            onValueChange={(newValue) => handleInputChange(field.name, newValue)}
          >
            <SelectTrigger>
              <SelectValue placeholder={`Selecciona ${field.name}`} />
            </SelectTrigger>
            <SelectContent>
              {relatedData.map((item: any) => (
                <SelectItem key={item.id} value={item.id}>
                  {item.name || item.id}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )

      default:
        return (
          <Input
            value={value}
            onChange={(e) => handleInputChange(field.name, e.target.value)}
            placeholder={`Ingresa ${field.name}`}
            required={field.required}
          />
        )
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
            {isEditing ? `Editar ${module.name}` : `Nuevo ${module.name}`}
          </h1>
          <p className="text-muted-foreground">
            {isEditing ? 'Modifica los detalles del registro' : 'Crea un nuevo registro'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Información del Registro</CardTitle>
                <CardDescription>
                  Completa los campos del {module.name.toLowerCase()}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {module.fields.map((field) => (
                  <div key={field.id} className="space-y-2">
                    <Label htmlFor={field.name}>
                      {field.name}
                      {field.required && <span className="text-red-500 ml-1">*</span>}
                    </Label>
                    {renderField(field)}
                    {field.type === 'relation' && field.relationTo && (
                      <p className="text-xs text-muted-foreground">
                        Relacionado con: {ModuleGenerator.getModule(field.relationTo)?.name}
                      </p>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Vista Previa</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <h4 className="font-medium">{module.name}</h4>
                  <div className="space-y-2">
                    {module.fields.slice(0, 5).map((field) => (
                      <div key={field.id} className="flex justify-between text-sm">
                        <span className="text-muted-foreground">{field.name}:</span>
                        <span className="font-medium">
                          {field.type === 'boolean' 
                            ? (formData[field.name] ? 'Sí' : 'No')
                            : (formData[field.name] || '-')
                          }
                        </span>
                      </div>
                    ))}
                  </div>
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
                  {isEditing ? 'Actualizar Registro' : 'Crear Registro'}
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
