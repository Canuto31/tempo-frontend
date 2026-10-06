const DEFAULT_API_BASE_URL = 'http://localhost:8080/tempo/api'

/**
 * Centraliza la URL del backend para evitar que los módulos de dominio
 * conozcan detalles del entorno donde se despliega la aplicación.
 */
export const env = {
  apiBaseUrl: (import.meta.env.VITE_API_BASE_URL || DEFAULT_API_BASE_URL).replace(/\/$/, ''),
} as const
