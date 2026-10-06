import type { IsoDateTime, Uuid } from '../api.types'

export interface Label {
  id?: Uuid
  ownerId?: Uuid | null
  name?: string
  createdAt?: IsoDateTime
  updatedAt?: IsoDateTime
}

export interface CreateLabelInput {
  name: string
  ownerId?: Uuid
}

export interface UpdateLabelInput {
  name: string
}

export interface ListLabelsQuery {
  ownerId?: Uuid
  global?: boolean
}
