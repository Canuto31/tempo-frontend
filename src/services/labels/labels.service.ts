import type { Uuid } from '../api.types'
import { apiRequest } from '../http'
import type { CreateLabelInput, Label, ListLabelsQuery, UpdateLabelInput } from './labels.types'

const LABELS_PATH = '/api/v1/labels'

export const labelsService = {
  list: (query: ListLabelsQuery = {}) =>
    apiRequest<Label[]>(LABELS_PATH, { query: { ...query } }),
  get: (id: Uuid) => apiRequest<Label>(`${LABELS_PATH}/${id}`),
  create: (input: CreateLabelInput) =>
    apiRequest<Label>(LABELS_PATH, { method: 'POST', body: input }),
  update: (id: Uuid, input: UpdateLabelInput) =>
    apiRequest<Label>(`${LABELS_PATH}/${id}`, { method: 'PUT', body: input }),
  remove: (id: Uuid) => apiRequest<void>(`${LABELS_PATH}/${id}`, { method: 'DELETE' }),
}
