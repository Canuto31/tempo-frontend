import { useCallback, useEffect, useMemo, useState } from 'react'
import { Icon } from './components/Icon'
import { ApiConsole } from './features/api-console/ApiConsole'
import { ResourceTable } from './features/api-dashboard/ResourceTable'
import { resources, type ResourceKey } from './features/api-dashboard/resources'
import './App.css'

type ResourceData = Partial<Record<ResourceKey, unknown[]>>
type ResourceErrors = Partial<Record<ResourceKey, string>>

const resourceIcons = {
  users: 'users',
  projects: 'folder',
  tasks: 'check',
  statuses: 'activity',
  categories: 'grid',
  labels: 'tag',
} as const

function App() {
  const [selectedKey, setSelectedKey] = useState<ResourceKey>('tasks')
  const [data, setData] = useState<ResourceData>({})
  const [errors, setErrors] = useState<ResourceErrors>({})
  const [loading, setLoading] = useState(true)
  const [lastUpdate, setLastUpdate] = useState<Date>()

  const loadAll = useCallback(async () => {
    const results = await Promise.allSettled(resources.map((resource) => resource.load()))
    const nextData: ResourceData = {}
    const nextErrors: ResourceErrors = {}

    results.forEach((result, index) => {
      const key = resources[index].key
      if (result.status === 'fulfilled') nextData[key] = result.value
      else nextErrors[key] = result.reason instanceof Error ? result.reason.message : 'Error desconocido'
    })

    setData(nextData)
    setErrors(nextErrors)
    setLastUpdate(new Date())
    setLoading(false)
  }, [])

  useEffect(() => {
    // Aplaza la consulta al siguiente ciclo para evitar actualizar estado de
    // forma síncrona dentro del efecto de montaje.
    const timeoutId = window.setTimeout(() => void loadAll(), 0)
    return () => window.clearTimeout(timeoutId)
  }, [loadAll])

  const selected = resources.find((resource) => resource.key === selectedKey) ?? resources[0]
  const connectedModules = resources.length - Object.keys(errors).length
  const totalRecords = useMemo(
    () => Object.values(data).reduce((total, rows) => total + (rows?.length ?? 0), 0),
    [data],
  )
  const online = !loading && connectedModules > 0

  const refresh = () => {
    setLoading(true)
    void loadAll()
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark"><span /></div>
          <div><strong>tempo</strong><small>API workspace</small></div>
        </div>

        <nav aria-label="Recursos de la API">
          <p className="nav-label">Workspace</p>
          <button className="nav-item active-overview" type="button">
            <Icon name="grid" /><span>Vista general</span>
          </button>
          <button className="nav-item" onClick={() => document.getElementById('api-console')?.scrollIntoView({ behavior: 'smooth' })} type="button">
            <Icon name="terminal" /><span>Consola API</span>
          </button>
          <p className="nav-label resources-label">Recursos</p>
          {resources.map((resource) => (
            <button
              className={`nav-item ${selectedKey === resource.key ? 'active' : ''}`}
              key={resource.key}
              onClick={() => setSelectedKey(resource.key)}
              type="button"
            >
              <Icon name={resourceIcons[resource.key]} />
              <span>{resource.label}</span>
              <b>{data[resource.key]?.length ?? 0}</b>
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className={`connection-dot ${online ? 'online' : ''}`} />
          <div><strong>{online ? 'Backend conectado' : loading ? 'Conectando…' : 'Sin conexión'}</strong><small>localhost:8080</small></div>
        </div>
      </aside>

      <main>
        <header className="topbar">
          <div>
            <span className="eyebrow">TEMPO / API DASHBOARD</span>
            <h1>Buenos días, equipo</h1>
            <p>Visualiza y prueba la comunicación entre el frontend y tu API local.</p>
          </div>
          <button className="refresh-button" disabled={loading} onClick={refresh} type="button">
            <Icon name="refresh" size={17} />
            {loading ? 'Actualizando…' : 'Actualizar datos'}
          </button>
        </header>

        <section className="status-strip">
          <div className="status-copy">
            <span className={`status-icon ${online ? 'success' : 'pending'}`}><Icon name={online ? 'check' : 'activity'} /></span>
            <div>
              <strong>{online ? 'Conexión establecida correctamente' : loading ? 'Comprobando conexión con el backend' : 'No fue posible conectar'}</strong>
              <p><code>GET</code> http://localhost:8080/tempo/api/api/v1/*</p>
            </div>
          </div>
          <span className="status-time">{lastUpdate ? `Última consulta ${lastUpdate.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' })}` : 'Esperando respuesta'}</span>
        </section>

        <section className="metrics-grid" aria-label="Resumen de la API">
          <article>
            <span className="metric-icon violet"><Icon name="activity" /></span>
            <div><small>Módulos conectados</small><strong>{connectedModules}<em>/ {resources.length}</em></strong></div>
            <span className="trend">En línea</span>
          </article>
          <article>
            <span className="metric-icon blue"><Icon name="grid" /></span>
            <div><small>Registros recibidos</small><strong>{totalRecords}</strong></div>
            <span className="trend neutral">Datos reales</span>
          </article>
          <article>
            <span className="metric-icon green"><Icon name="check" /></span>
            <div><small>Estado HTTP</small><strong>{online ? '200' : '—'}</strong></div>
            <span className="trend">OK</span>
          </article>
        </section>

        <section className="resource-card">
          <div className="resource-header">
            <div>
              <span className="section-kicker">RESPUESTA EN VIVO</span>
              <h2>{selected.label}</h2>
              <p>Datos obtenidos desde <code>{selected.path}</code></p>
            </div>
            <div className="resource-tabs">
              {resources.map((resource) => (
                <button
                  className={selectedKey === resource.key ? 'selected' : ''}
                  key={resource.key}
                  onClick={() => setSelectedKey(resource.key)}
                  type="button"
                >{resource.label}</button>
              ))}
            </div>
          </div>
          <ResourceTable
            error={errors[selected.key]}
            loading={loading}
            resource={selected}
            rows={data[selected.key] ?? []}
          />
        </section>

        <ApiConsole onMutation={refresh} />

        <footer className="dashboard-footer">
          <span><span className="pulse" /> API local activa</span>
          <span>Tempo Frontend · React + TypeScript</span>
        </footer>
      </main>
    </div>
  )
}

export default App
