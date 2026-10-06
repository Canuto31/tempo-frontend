import type { Uuid } from '../api.types'
import { apiRequest } from '../http'
import type {
  CreateProjectInput,
  ListProjectsQuery,
  Project,
  UpdateProjectInput,
} from './projects.types'

const PROJECTS_PATH = '/api/v1/projects'

export const projectsService = {
  list: (query: ListProjectsQuery = {}) =>
    apiRequest<Project[]>(PROJECTS_PATH, { query: { ...query } }),
  get: (id: Uuid) => apiRequest<Project>(`${PROJECTS_PATH}/${id}`),
  create: (input: CreateProjectInput) =>
    apiRequest<Project>(PROJECTS_PATH, { method: 'POST', body: input }),
  update: (id: Uuid, input: UpdateProjectInput) =>
    apiRequest<Project>(`${PROJECTS_PATH}/${id}`, { method: 'PUT', body: input }),
  remove: (id: Uuid) => apiRequest<void>(`${PROJECTS_PATH}/${id}`, { method: 'DELETE' }),
}
