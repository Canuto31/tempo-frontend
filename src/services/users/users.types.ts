import type { IsoDateTime, Uuid } from '../api.types'

export type AuthProvider = 'LOCAL' | 'GOOGLE'

export interface User {
  id?: Uuid
  name?: string
  username?: string
  email?: string
  authProvider?: AuthProvider
  profileImage?: string | null
  createdAt?: IsoDateTime
  updatedAt?: IsoDateTime
}

export interface CreateUserInput {
  name: string
  username: string
  email: string
  password: string
  authProvider: AuthProvider
  profileImage?: string
}

export interface UpdateUserInput {
  name: string
  username: string
  email: string
  profileImage?: string
}
