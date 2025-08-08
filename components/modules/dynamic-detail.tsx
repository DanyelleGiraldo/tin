"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Edit, Trash2, Link, Calendar } from 'lucide-react'
import { ModuleSchema, ModuleGenerator } from "@/lib/module-generator"

interface DynamicDetailProps {
  module: ModuleSchema
  record: any
  onBack: () => void
  onEdit: () => void
  onDelete: () => void
}

export function DynamicDetail({ module, record, onBack, onEdit, onDelete }: DynamicDetailProps) {
  const formatValue = (value: any, field: any) => {
    if (field.type === 'boolean') {
      return value ? 'Sí' : 'No'
    }
    if (field.type === 'date') {
      return new Date(value).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    }
    if (field.type === 'number') {
      return typeof value === 'number' ? value.toLocaleString() : value
    }
    if (field.type === 'relation' && field.relationTo) {
      const relatedModule = ModuleGenerator.getModule(field.relationTo)
      return `${relatedModule?.name || 'Relación'}: ${value}`
    }
    return String(value || '-')
  }

  const getFieldIcon = (type: string) => {
    switch (type) {
      case 'relation': return <Link className="h-4 w-4" />
      case 'date': return <Calendar className="h-4 w-4" />
      default: return null
    }
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
            <h1 className="text-3xl font-bold">
              {record.name || `${module.name} #${record.id}`}
            </h1>
            <p className="text-muted-foreground">
              Detalles del registro
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
              <CardTitle>Información del {module.name}</CardTitle>
              <CardDescription>
                Datos completos del registro
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                {module.fields.map((field) => (
                  <div key={field.id} className="space-y-1">
                    <div className="flex items-center gap-2">
                      {getFieldIcon(field.type)}
                      <Label className="text-sm font-medium text-muted-foreground">
                        {field.name}
                        {field.required && <span className="text-red-500 ml-1">*</span>}
                      </Label>
                    </div>
                    <div className="text-sm">
                      {field.type === 'boolean' ? (
                        <Badge variant={record[field.name] ? 'default' : 'secondary'}>
                          {formatValue(record[field.name], field)}
                        </Badge>
                      ) : field.type === 'relation' ? (
                        <Badge variant="outline">
                          {formatValue(record[field.name], field)}
                        </Badge>
                      ) : (
                        <span className="font-medium">
                          {formatValue(record[field.name], field)}
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Tipo: {field.type}
                      {field.relationTo && ` → ${ModuleGenerator.getModule(field.relationTo)?.name}`}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {module.relations.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Link className="h-5 w-5" />
                  Relaciones
                </CardTitle>
                <CardDescription>
                  Conexiones con otros módulos
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {module.relations.map((relation) => (
                    <div key={relation.id} className="p-3 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">{relation.name}</h4>
                        <Badge variant="outline">{relation.type}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {relation.description || `Relación ${relation.type} con ${ModuleGenerator.getModule(relation.toModule)?.name}`}
                      </p>
                      <div className="mt-2">
                        <Button variant="outline" size="sm">
                          Ver registros relacionados
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Información del Módulo</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                <h3 className="font-medium text-blue-600">{module.name}</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {module.description}
                </p>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Tabla</span>
                  <span className="font-medium font-mono text-sm">{module.tableName}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Campos</span>
                  <span className="font-medium">{module.fields.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Relaciones</span>
                  <span className="font-medium">{module.relations.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Estado</span>
                  <Badge variant={module.status === 'active' ? 'default' : 'secondary'}>
                    {module.status === 'active' ? 'Activo' : 'Borrador'}
                  </Badge>
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
                Duplicar registro
              </Button>
              <Button variant="outline" className="w-full justify-start">
                Exportar datos
              </Button>
              <Button variant="outline" className="w-full justify-start">
                Ver historial
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

function Label({ children, className, ...props }: any) {
  return (
    <label className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${className || ''}`} {...props}>
      {children}
    </label>
  )
}
