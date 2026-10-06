import { apiRequest } from '../http'
import type { Uuid } from '../api.types'
import type { CreateUserInput, UpdateUserInput, User } from './users.types'

const USERS_PATH = '/api/v1/users'

export const usersService = {
  list: () => apiRequest<User[]>(USERS_PATH),
  get: (id: Uuid) => apiRequest<User>(`${USERS_PATH}/${id}`),
  create: (input: CreateUserInput) =>
    apiRequest<User>(USERS_PATH, { method: 'POST', body: input }),
  update: (id: Uuid, input: UpdateUserInput) =>
    apiRequest<User>(`${USERS_PATH}/${id}`, { method: 'PUT', body: input }),
  remove: (id: Uuid) => apiRequest<void>(`${USERS_PATH}/${id}`, { method: 'DELETE' }),
}
