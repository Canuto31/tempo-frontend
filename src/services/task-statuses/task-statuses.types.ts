import type { IsoDateTime, Uuid } from '../api.types'

export interface TaskStatus {
  id?: Uuid
  ownerId?: Uuid | null
  name?: string
  position?: number
  defaultStatus?: boolean
  createdAt?: IsoDateTime
  updatedAt?: IsoDateTime
}

export interface CreateTaskStatusInput {
  name: string
  position: number
  ownerId?: Uuid
  defaultStatus?: boolean
}

export interface UpdateTaskStatusInput {
  name: string
  position: number
  defaultStatus?: boolean
}

export interface ListTaskStatusesQuery {
  ownerId?: Uuid
  global?: boolean
}
