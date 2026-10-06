import type { ResourceColumn, ResourceData, ResourceDefinition } from './resources'

interface ResourceTableProps {
  resource: ResourceDefinition
  rows: unknown[]
  allData: ResourceData
  loading: boolean
  error?: string
}

function resolveValue(
  row: Record<string, unknown>,
  column: ResourceColumn,
  allData: ResourceData,
): string {
  const value = row[column.key]
  if (!column.relation) return displayValue(value)
  if (value === null || value === undefined || value === '') {
    return column.relation.emptyLabel ?? '—'
  }

  const relatedRows = allData[column.relation.resource] ?? []
  const relatedItem = relatedRows.find((item) => {
    const record = item as Record<string, unknown>
    return record.id === value
  }) as Record<string, unknown> | undefined

  if (!relatedItem) return 'No disponible'

  const displayKey = column.relation.displayKeys.find((key) => {
    const candidate = relatedItem[key]
    return candidate !== null && candidate !== undefined && candidate !== ''
  })

  return displayKey ? displayValue(relatedItem[displayKey]) : 'No disponible'
}

function displayValue(value: unknown): string {
  if (value === null || value === undefined || value === '') return '—'
  if (typeof value === 'boolean') return value ? 'Sí' : 'No'
  if (typeof value !== 'string') return String(value)

  if (/^\d{4}-\d{2}-\d{2}T/.test(value)) {
    return new Intl.DateTimeFormat('es-CO', { dateStyle: 'medium' }).format(new Date(value))
  }
  if (/^[0-9a-f]{8}-[0-9a-f-]{27}$/i.test(value)) return `${value.slice(0, 8)}…`
  return value
}

export function ResourceTable({ resource, rows, allData, loading, error }: ResourceTableProps) {
  if (loading) {
    return <div className="table-state"><span className="spinner" />Consultando el backend…</div>
  }

  if (error) {
    return <div className="table-state error-state">No fue posible consultar: {error}</div>
  }

  if (rows.length === 0) {
    return <div className="table-state">El backend respondió correctamente, pero no hay registros.</div>
  }

  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            {resource.columns.map((column) => <th key={column.key}>{column.label}</th>)}
            <th>ID</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((item, index) => {
            const row = item as Record<string, unknown>
            return (
              <tr key={String(row.id ?? index)}>
                {resource.columns.map((column) => (
                  <td key={column.key}>{resolveValue(row, column, allData)}</td>
                ))}
                <td><code className="id-code">{displayValue(row.id)}</code></td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
