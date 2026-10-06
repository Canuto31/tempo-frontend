export interface ApiErrorPayload {
  message?: string
  detail?: string
  [key: string]: unknown
}

/** Error normalizado que conserva el estado HTTP y la respuesta del backend. */
export class ApiError extends Error {
  readonly status: number
  readonly payload?: ApiErrorPayload | string

  constructor(status: number, message: string, payload?: ApiErrorPayload | string) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.payload = payload
  }
}
