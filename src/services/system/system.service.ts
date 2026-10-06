import { apiRequest } from '../http'

/** Operaciones generales publicadas fuera de los módulos de dominio. */
export const systemService = {
  hello: () => apiRequest<string>('/'),
}
