import type { IsoDateTime, Uuid } from '../api.types'

export interface Category {
  id?: Uuid
  ownerId?: Uuid | null
  name?: string
  createdAt?: IsoDateTime
  updatedAt?: IsoDateTime
}

export interface CreateCategoryInput {
  name: string
  ownerId?: Uuid
}

export interface UpdateCategoryInput {
  name: string
}

export interface ListCategoriesQuery {
  ownerId?: Uuid
  global?: boolean
}
