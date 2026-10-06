import type { Uuid } from '../api.types'
import { apiRequest } from '../http'
import type {
  Category,
  CreateCategoryInput,
  ListCategoriesQuery,
  UpdateCategoryInput,
} from './categories.types'

const CATEGORIES_PATH = '/api/v1/categories'

export const categoriesService = {
  list: (query: ListCategoriesQuery = {}) =>
    apiRequest<Category[]>(CATEGORIES_PATH, { query: { ...query } }),
  get: (id: Uuid) => apiRequest<Category>(`${CATEGORIES_PATH}/${id}`),
  create: (input: CreateCategoryInput) =>
    apiRequest<Category>(CATEGORIES_PATH, { method: 'POST', body: input }),
  update: (id: Uuid, input: UpdateCategoryInput) =>
    apiRequest<Category>(`${CATEGORIES_PATH}/${id}`, { method: 'PUT', body: input }),
  remove: (id: Uuid) => apiRequest<void>(`${CATEGORIES_PATH}/${id}`, { method: 'DELETE' }),
}
