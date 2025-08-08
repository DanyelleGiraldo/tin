"use client"

import { useState, useEffect } from "react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { MessageSquare, Package, Users, Settings, BarChart3, Bot, Database, Plus, GripVertical, ChevronDown, User, LogOut } from 'lucide-react'
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd"
import { ModuleGenerator } from "@/lib/module-generator"

const defaultMenuItems = [
  {
    id: "dashboard",
    title: "Dashboard",
    url: "/dashboard",
    icon: BarChart3,
  },
  {
    id: "chatbot",
    title: "ChatBot",
    url: "/dashboard/chatbot",
    icon: Bot,
  },
  {
    id: "messages",
    title: "Mensajes",
    url: "/dashboard/messages",
    icon: MessageSquare,
  },
  {
    id: "products",
    title: "Productos",
    url: "/dashboard/products",
    icon: Package,
  },
  {
    id: "customers",
    title: "Clientes",
    url: "/dashboard/customers",
    icon: Users,
  },
]

export function AppSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [menuItems, setMenuItems] = useState(defaultMenuItems)
  const [dynamicModules, setDynamicModules] = useState<any[]>([])
  const [user] = useState({ name: "Usuario Demo", email: "demo@email.com" })

  useEffect(() => {
    // Cargar módulos dinámicos
    const modules = ModuleGenerator.getAllModules()
    const moduleMenuItems = modules.map(module => ({
      id: `module_${module.id}`,
      title: module.name,
      url: `/dashboard/modules/${module.id}`,
      icon: Database,
      isDynamic: true
    }))
    setDynamicModules(moduleMenuItems)
  }, [])

  const handleDragEnd = (result: any) => {
    if (!result.destination) return

    const items = Array.from(menuItems)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)

    setMenuItems(items)
  }

  const handleLogout = () => {
    localStorage.removeItem("user")
    router.push("/")
  }

  const allMenuItems = [...menuItems, ...dynamicModules]

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2 py-2">
          <div className="h-8 w-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">CB</span>
          </div>
          <span className="font-semibold text-lg group-data-[collapsible=icon]:hidden">
            ChatBot Manager
          </span>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navegación Principal</SidebarGroupLabel>
          <SidebarGroupContent>
            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="sidebar-menu">
                {(provided) => (
                  <SidebarMenu {...provided.droppableProps} ref={provided.innerRef}>
                    {menuItems.map((item, index) => (
                      <Draggable key={item.id} draggableId={item.id} index={index}>
                        {(provided, snapshot) => (
                          <SidebarMenuItem
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            className={snapshot.isDragging ? "opacity-50" : ""}
                          >
                            <div className="flex items-center">
                              <div
                                {...provided.dragHandleProps}
                                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded group-data-[collapsible=icon]:hidden"
                              >
                                <GripVertical className="h-3 w-3 text-gray-400" />
                              </div>
                              <SidebarMenuButton
                                asChild
                                isActive={pathname === item.url}
                                className="flex-1"
                              >
                                <Link href={item.url}>
                                  <item.icon className="h-4 w-4" />
                                  <span>{item.title}</span>
                                </Link>
                              </SidebarMenuButton>
                            </div>
                          </SidebarMenuItem>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </SidebarMenu>
                )}
              </Droppable>
            </DragDropContext>
          </SidebarGroupContent>
        </SidebarGroup>

        {dynamicModules.length > 0 && (
          <SidebarGroup>
            <SidebarGroupLabel>Módulos Dinámicos</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {dynamicModules.map((item) => (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton
                      asChild
                      isActive={pathname === item.url}
                    >
                      <Link href={item.url}>
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        <SidebarGroup>
          <SidebarGroupLabel>Gestión</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/dashboard/modules">
                    <Database className="h-4 w-4" />
                    <span>Módulos</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/dashboard/modules/create">
                    <Plus className="h-4 w-4" />
                    <span>Crear Módulo</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/dashboard/settings">
                    <Settings className="h-4 w-4" />
                    <span>Configuración</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton>
                  <User className="h-4 w-4" />
                  <span className="truncate">{user.name}</span>
                  <ChevronDown className="ml-auto h-4 w-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="top" className="w-[--radix-popper-anchor-width]">
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  <span>Perfil</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Cerrar Sesión</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}
