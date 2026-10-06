import { env } from '../../config/env'
import { ApiError, type ApiErrorPayload } from './api-error'

type QueryValue = string | number | boolean | null | undefined

export interface RequestOptions extends Omit<RequestInit, 'body'> {
  body?: unknown
  query?: Record<string, QueryValue>
}

function buildUrl(path: string, query?: Record<string, QueryValue>): string {
  // El segundo argumento permite usar tanto una URL absoluta como la ruta
  // relativa que Vite redirige al backend durante el desarrollo local.
  const url = new URL(env.apiBaseUrl, window.location.origin)
  const [rawPath, rawQuery = ''] = path.split('?')
  const requestPath = rawPath.startsWith('/') ? rawPath : `/${rawPath}`
  url.pathname = `${url.pathname.replace(/\/$/, '')}${requestPath}`
  url.search = rawQuery

  Object.entries(query ?? {}).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      url.searchParams.set(key, String(value))
    }
  })

  return url.toString()
}

async function parseBody(response: Response): Promise<unknown> {
  if (response.status === 204) return undefined

  const contentType = response.headers.get('content-type') ?? ''
  return contentType.includes('application/json') ? response.json() : response.text()
}

/**
 * Cliente HTTP compartido. Agrega JSON automáticamente y transforma cualquier
 * respuesta no exitosa en ApiError para que la UI tenga un contrato consistente.
 */
export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { body, headers, query, ...requestInit } = options
  const response = await fetch(buildUrl(path, query), {
    ...requestInit,
    headers: {
      Accept: 'application/json',
      ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}),
      ...headers,
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  })
  const payload = await parseBody(response)

  if (!response.ok) {
    const errorPayload = payload as ApiErrorPayload | string | undefined
    const message =
      typeof errorPayload === 'object' && errorPayload?.message
        ? errorPayload.message
        : `La API respondió con estado ${response.status}`
    throw new ApiError(response.status, message, errorPayload)
  }

  return payload as T
}
