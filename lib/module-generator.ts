export interface FieldDefinition {
  id: string
  name: string
  type: 'text' | 'number' | 'email' | 'date' | 'boolean' | 'select' | 'textarea' | 'relation'
  required: boolean
  options?: string[] // Para campos select
  relationTo?: string // Para relaciones
  relationType?: 'one-to-one' | 'one-to-many' | 'many-to-many'
  displayField?: string // Campo a mostrar en relaciones
}

export interface ModuleSchema {
  id: string
  name: string
  description: string
  tableName: string
  fields: FieldDefinition[]
  relations: RelationDefinition[]
  createdAt: string
  updatedAt: string
  status: 'active' | 'draft'
}

export interface RelationDefinition {
  id: string
  fromModule: string
  toModule: string
  fromField: string
  toField: string
  type: 'one-to-one' | 'one-to-many' | 'many-to-many'
  name: string
  description?: string
}

export class ModuleGenerator {
  private static modules: Map<string, ModuleSchema> = new Map()
  private static relations: Map<string, RelationDefinition> = new Map()
  private static initialized = false

  static init() {
    if (!this.initialized && typeof window !== 'undefined') {
      this.loadFromStorage()
      this.initialized = true
      console.log('ModuleGenerator initialized with', this.modules.size, 'modules')
    }
  }

  static addModule(module: ModuleSchema) {
    this.init()
    console.log('Adding module:', module.name)
    this.modules.set(module.id, module)
    this.saveToStorage()
    console.log('Module added. Total modules:', this.modules.size)
  }

  static getModule(id: string): ModuleSchema | undefined {
    this.init()
    return this.modules.get(id)
  }

  static getAllModules(): ModuleSchema[] {
    this.init()
    return Array.from(this.modules.values())
  }

  static addRelation(relation: RelationDefinition) {
    this.init()
    this.relations.set(relation.id, relation)
    this.saveToStorage()
  }

  static getRelationsForModule(moduleId: string): RelationDefinition[] {
    this.init()
    return Array.from(this.relations.values()).filter(
      rel => rel.fromModule === moduleId || rel.toModule === moduleId
    )
  }

  static generateModuleData(moduleId: string): any[] {
    this.init()
    const module = this.getModule(moduleId)
    if (!module) return []

    // Generar datos de ejemplo basados en el esquema
    const sampleData = []
    for (let i = 1; i <= 5; i++) {
      const record: any = { id: i.toString() }
      
      module.fields.forEach(field => {
        switch (field.type) {
          case 'text':
            record[field.name] = `${field.name} ${i}`
            break
          case 'number':
            record[field.name] = Math.floor(Math.random() * 1000) + 1
            break
          case 'email':
            record[field.name] = `usuario${i}@email.com`
            break
          case 'date':
            record[field.name] = new Date().toISOString().split('T')[0]
            break
          case 'boolean':
            record[field.name] = Math.random() > 0.5
            break
          case 'select':
            record[field.name] = field.options?.[0] || 'Opción 1'
            break
          case 'textarea':
            record[field.name] = `Descripción detallada para ${field.name} ${i}`
            break
          case 'relation':
            record[field.name] = `rel_${i}`
            break
        }
      })
      
      sampleData.push(record)
    }
    
    return sampleData
  }

  private static saveToStorage() {
    if (typeof window !== 'undefined') {
      try {
        const data = {
          modules: Array.from(this.modules.entries()),
          relations: Array.from(this.relations.entries())
        }
        localStorage.setItem('dynamic_modules', JSON.stringify(data))
        console.log('Data saved to localStorage')
      } catch (error) {
        console.error('Error saving to localStorage:', error)
      }
    }
  }

  static loadFromStorage() {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('dynamic_modules')
        if (stored) {
          const data = JSON.parse(stored)
          this.modules = new Map(data.modules || [])
          this.relations = new Map(data.relations || [])
          console.log('Data loaded from localStorage:', this.modules.size, 'modules')
        } else {
          console.log('No data in localStorage, initializing with default modules')
          this.initializeDefaultModules()
        }
      } catch (error) {
        console.error('Error loading from localStorage:', error)
        this.initializeDefaultModules()
      }
    }
  }

  private static initializeDefaultModules() {
    // Módulo de Productos
    const productsModule: ModuleSchema = {
      id: 'products',
      name: 'Productos',
      description: 'Gestión de catálogo de productos',
      tableName: 'products',
      fields: [
        { id: '1', name: 'id', type: 'number', required: true },
        { id: '2', name: 'name', type: 'text', required: true },
        { id: '3', name: 'description', type: 'textarea', required: false },
        { id: '4', name: 'price', type: 'number', required: true },
        { id: '5', name: 'stock', type: 'number', required: true },
        { id: '6', name: 'category', type: 'select', required: true, options: ['Electrónicos', 'Ropa', 'Hogar'] },
        { id: '7', name: 'active', type: 'boolean', required: false }
      ],
      relations: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: 'active'
    }

    // Módulo de Clientes
    const customersModule: ModuleSchema = {
      id: 'customers',
      name: 'Clientes',
      description: 'Base de datos de clientes',
      tableName: 'customers',
      fields: [
        { id: '1', name: 'id', type: 'number', required: true },
        { id: '2', name: 'name', type: 'text', required: true },
        { id: '3', name: 'email', type: 'email', required: true },
        { id: '4', name: 'phone', type: 'text', required: false },
        { id: '5', name: 'company', type: 'text', required: false },
        { id: '6', name: 'active', type: 'boolean', required: false }
      ],
      relations: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: 'active'
    }

    this.modules.set('products', productsModule)
    this.modules.set('customers', customersModule)
    this.saveToStorage()
  }

  static deleteModule(id: string) {
    this.init()
    this.modules.delete(id)
    // Eliminar relaciones asociadas
    const relationsToDelete = Array.from(this.relations.entries())
      .filter(([_, rel]) => rel.fromModule === id || rel.toModule === id)
      .map(([id]) => id)
    
    relationsToDelete.forEach(relId => this.relations.delete(relId))
    this.saveToStorage()
  }

  static clearAll() {
    this.modules.clear()
    this.relations.clear()
    if (typeof window !== 'undefined') {
      localStorage.removeItem('dynamic_modules')
    }
  }
}
