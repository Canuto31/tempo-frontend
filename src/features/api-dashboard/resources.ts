import {
  categoriesService,
  labelsService,
  projectsService,
  taskStatusesService,
  tasksService,
  usersService,
} from '../../services'

export type ResourceKey = 'users' | 'projects' | 'tasks' | 'statuses' | 'categories' | 'labels'
export type ResourceData = Partial<Record<ResourceKey, unknown[]>>

export interface ResourceColumn {
  key: string
  label: string
  relation?: {
    resource: ResourceKey
    displayKeys: string[]
    emptyLabel?: string
  }
}

export interface ResourceDefinition {
  key: ResourceKey
  label: string
  singular: string
  path: string
  columns: ResourceColumn[]
  load: () => Promise<unknown[]>
}

export const resources: ResourceDefinition[] = [
  {
    key: 'users',
    label: 'Usuarios',
    singular: 'usuario',
    path: '/api/v1/users',
    columns: [
      { key: 'name', label: 'Nombre' },
      { key: 'username', label: 'Usuario' },
      { key: 'email', label: 'Correo' },
      { key: 'authProvider', label: 'Proveedor' },
    ],
    load: usersService.list,
  },
  {
    key: 'projects',
    label: 'Proyectos',
    singular: 'proyecto',
    path: '/api/v1/projects',
    columns: [
      { key: 'name', label: 'Proyecto' },
      { key: 'ownerId', label: 'Propietario', relation: { resource: 'users', displayKeys: ['name', 'username', 'email'] } },
      { key: 'parentProjectId', label: 'Proyecto padre', relation: { resource: 'projects', displayKeys: ['name'], emptyLabel: 'Proyecto raíz' } },
      { key: 'deadline', label: 'Fecha límite' },
    ],
    load: projectsService.list,
  },
  {
    key: 'tasks',
    label: 'Tareas',
    singular: 'tarea',
    path: '/api/v1/tasks',
    columns: [
      { key: 'title', label: 'Tarea' },
      { key: 'projectId', label: 'Proyecto', relation: { resource: 'projects', displayKeys: ['name'], emptyLabel: 'Sin proyecto' } },
      { key: 'responsibleUserId', label: 'Responsable', relation: { resource: 'users', displayKeys: ['name', 'username', 'email'] } },
      { key: 'categoryId', label: 'Categoría', relation: { resource: 'categories', displayKeys: ['name'], emptyLabel: 'Sin categoría' } },
      { key: 'statusId', label: 'Estado', relation: { resource: 'statuses', displayKeys: ['name'] } },
      { key: 'deadline', label: 'Fecha límite' },
    ],
    load: tasksService.list,
  },
  {
    key: 'statuses',
    label: 'Estados',
    singular: 'estado',
    path: '/api/v1/task-statuses',
    columns: [
      { key: 'name', label: 'Estado' },
      { key: 'position', label: 'Posición' },
      { key: 'defaultStatus', label: 'Predeterminado' },
      { key: 'ownerId', label: 'Propietario', relation: { resource: 'users', displayKeys: ['name', 'username', 'email'], emptyLabel: 'Global' } },
    ],
    load: taskStatusesService.list,
  },
  {
    key: 'categories',
    label: 'Categorías',
    singular: 'categoría',
    path: '/api/v1/categories',
    columns: [
      { key: 'name', label: 'Categoría' },
      { key: 'ownerId', label: 'Propietario', relation: { resource: 'users', displayKeys: ['name', 'username', 'email'], emptyLabel: 'Global' } },
      { key: 'createdAt', label: 'Creación' },
    ],
    load: categoriesService.list,
  },
  {
    key: 'labels',
    label: 'Etiquetas',
    singular: 'etiqueta',
    path: '/api/v1/labels',
    columns: [
      { key: 'name', label: 'Etiqueta' },
      { key: 'ownerId', label: 'Propietario', relation: { resource: 'users', displayKeys: ['name', 'username', 'email'], emptyLabel: 'Global' } },
      { key: 'createdAt', label: 'Creación' },
    ],
    load: labelsService.list,
  },
]
