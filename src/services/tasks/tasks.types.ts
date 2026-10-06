import type { IsoDate, IsoDateTime, Uuid } from '../api.types'

export interface Task {
  id?: Uuid
  title?: string
  description?: string | null
  notes?: string | null
  personalOwnerId?: Uuid | null
  projectId?: Uuid | null
  responsibleUserId?: Uuid
  parentTaskId?: Uuid | null
  categoryId?: Uuid | null
  statusId?: Uuid
  deadline?: IsoDate | null
  estimatedTimeSeconds?: number
  pokerPoints?: number
  createdAt?: IsoDateTime
  completedAt?: IsoDateTime | null
  updatedAt?: IsoDateTime
}

interface TaskWriteFields {
  title: string
  responsibleUserId: Uuid
  statusId: Uuid
  estimatedTimeSeconds: number
  pokerPoints: number
  description?: string
  notes?: string
  personalOwnerId?: Uuid
  projectId?: Uuid
  parentTaskId?: Uuid
  categoryId?: Uuid
  deadline?: IsoDate
}

export type CreateTaskInput = TaskWriteFields
export type UpdateTaskInput = TaskWriteFields

/** El backend acepta como máximo uno de estos filtros por solicitud. */
export type ListTasksQuery =
  | {
      personalOwnerId: Uuid
      projectId?: never
      responsibleUserId?: never
      parentTaskId?: never
    }
  | {
      personalOwnerId?: never
      projectId: Uuid
      responsibleUserId?: never
      parentTaskId?: never
    }
  | {
      personalOwnerId?: never
      projectId?: never
      responsibleUserId: Uuid
      parentTaskId?: never
    }
  | {
      personalOwnerId?: never
      projectId?: never
      responsibleUserId?: never
      parentTaskId: Uuid
    }
  | {
      personalOwnerId?: never
      projectId?: never
      responsibleUserId?: never
      parentTaskId?: never
    }
