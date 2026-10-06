import type { Uuid } from '../api.types'
import { apiRequest } from '../http'
import type {
  CreateTaskStatusInput,
  ListTaskStatusesQuery,
  TaskStatus,
  UpdateTaskStatusInput,
} from './task-statuses.types'

const TASK_STATUSES_PATH = '/api/v1/task-statuses'

export const taskStatusesService = {
  list: (query: ListTaskStatusesQuery = {}) =>
    apiRequest<TaskStatus[]>(TASK_STATUSES_PATH, { query: { ...query } }),
  get: (id: Uuid) => apiRequest<TaskStatus>(`${TASK_STATUSES_PATH}/${id}`),
  create: (input: CreateTaskStatusInput) =>
    apiRequest<TaskStatus>(TASK_STATUSES_PATH, { method: 'POST', body: input }),
  update: (id: Uuid, input: UpdateTaskStatusInput) =>
    apiRequest<TaskStatus>(`${TASK_STATUSES_PATH}/${id}`, { method: 'PUT', body: input }),
  remove: (id: Uuid) =>
    apiRequest<void>(`${TASK_STATUSES_PATH}/${id}`, { method: 'DELETE' }),
}
