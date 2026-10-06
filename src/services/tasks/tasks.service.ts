import type { Uuid } from '../api.types'
import { apiRequest } from '../http'
import type {
  CreateTaskInput,
  ListTasksQuery,
  Task,
  UpdateTaskCompletionInput,
  UpdateTaskInput,
} from './tasks.types'

const TASKS_PATH = '/api/v1/tasks'

export const tasksService = {
  list: (query: ListTasksQuery = {}) =>
    apiRequest<Task[]>(TASKS_PATH, { query: { ...query } }),
  get: (id: Uuid) => apiRequest<Task>(`${TASKS_PATH}/${id}`),
  create: (input: CreateTaskInput) =>
    apiRequest<Task>(TASKS_PATH, { method: 'POST', body: input }),
  update: (id: Uuid, input: UpdateTaskInput) =>
    apiRequest<Task>(`${TASKS_PATH}/${id}`, { method: 'PUT', body: input }),
  updateCompletion: (id: Uuid, input: UpdateTaskCompletionInput) =>
    apiRequest<Task>(`${TASKS_PATH}/${id}/completion`, { method: 'PATCH', body: input }),
  remove: (id: Uuid) => apiRequest<void>(`${TASKS_PATH}/${id}`, { method: 'DELETE' }),
}
