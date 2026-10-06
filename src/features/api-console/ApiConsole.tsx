import { useState, type FormEvent } from 'react'
import { Icon } from '../../components/Icon'
import { ApiError, apiRequest } from '../../services'

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE'

const defaultBody = `{
  "name": "Nueva categoría"
}`

export function ApiConsole({ onMutation }: { onMutation: () => void }) {
  const [method, setMethod] = useState<HttpMethod>('GET')
  const [path, setPath] = useState('/api/v1/users')
  const [body, setBody] = useState(defaultBody)
  const [response, setResponse] = useState('Selecciona una operación y presiona “Enviar solicitud”.')
  const [resultStatus, setResultStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [sending, setSending] = useState(false)

  const sendRequest = async (event: FormEvent) => {
    event.preventDefault()

    if (method === 'DELETE' && !window.confirm('¿Confirmas que deseas eliminar este recurso?')) return

    setSending(true)
    setResultStatus('idle')
    const startedAt = performance.now()

    try {
      const requestBody = method === 'GET' || method === 'DELETE' ? undefined : JSON.parse(body)
      const payload = await apiRequest<unknown>(path, { method, body: requestBody })
      const elapsed = Math.round(performance.now() - startedAt)
      setResponse(JSON.stringify({ status: method === 'POST' ? 201 : method === 'DELETE' ? 204 : 200, timeMs: elapsed, data: payload ?? null }, null, 2))
      setResultStatus('success')
      if (method !== 'GET') onMutation()
    } catch (error) {
      const elapsed = Math.round(performance.now() - startedAt)
      const detail = error instanceof ApiError
        ? { status: error.status, message: error.message, payload: error.payload, timeMs: elapsed }
        : { status: 'CLIENT_ERROR', message: error instanceof Error ? error.message : 'Error desconocido', timeMs: elapsed }
      setResponse(JSON.stringify(detail, null, 2))
      setResultStatus('error')
    } finally {
      setSending(false)
    }
  }

  return (
    <section className="console-card" id="api-console">
      <div className="console-title">
        <span className="console-icon"><Icon name="terminal" /></span>
        <div>
          <span className="section-kicker">API PLAYGROUND</span>
          <h2>Prueba cualquier endpoint</h2>
          <p>Las solicitudes se envían al backend local mediante el proxy seguro de Vite.</p>
        </div>
      </div>

      <div className="console-grid">
        <form onSubmit={(event) => void sendRequest(event)}>
          <label>Solicitud</label>
          <div className="request-line">
            <select value={method} onChange={(event) => setMethod(event.target.value as HttpMethod)}>
              <option>GET</option><option>POST</option><option>PUT</option><option>DELETE</option>
            </select>
            <input aria-label="Ruta del endpoint" value={path} onChange={(event) => setPath(event.target.value)} />
          </div>
          <small className="field-help">Ejemplo: /api/v1/tasks o /api/v1/tasks/&#123;uuid&#125;?projectId=&#123;uuid&#125;</small>

          {method !== 'GET' && method !== 'DELETE' && (
            <>
              <label htmlFor="request-body">Body JSON</label>
              <textarea id="request-body" value={body} onChange={(event) => setBody(event.target.value)} spellCheck={false} />
            </>
          )}

          <button className="send-button" disabled={sending || !path.trim()} type="submit">
            {sending ? <span className="spinner light" /> : <Icon name="activity" size={17} />}
            {sending ? 'Enviando…' : 'Enviar solicitud'}
          </button>
        </form>

        <div className="response-panel">
          <div className="response-heading">
            <label>Respuesta</label>
            {resultStatus !== 'idle' && <span className={`response-badge ${resultStatus}`}>{resultStatus === 'success' ? 'Solicitud exitosa' : 'Error'}</span>}
          </div>
          <pre>{response}</pre>
        </div>
      </div>
    </section>
  )
}
