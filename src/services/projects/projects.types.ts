import type { IsoDate, IsoDateTime, Uuid } from '../api.types'

export interface Project {
  id?: Uuid
  ownerId?: Uuid
  parentProjectId?: Uuid | null
  name?: string
  description?: string | null
  deadline?: IsoDate | null
  createdAt?: IsoDateTime
  updatedAt?: IsoDateTime
}

export interface CreateProjectInput {
  ownerId: Uuid
  name: string
  parentProjectId?: Uuid
  description?: string
  deadline?: IsoDate
}

export interface UpdateProjectInput {
  name: string
  parentProjectId?: Uuid
  description?: string
  deadline?: IsoDate
}

export interface ListProjectsQuery {
  ownerId?: Uuid
}
