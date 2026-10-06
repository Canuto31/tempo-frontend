import { useMemo, useState } from 'react'
import { ApiError, tasksService, type Task } from '../../services'
import type { ResourceData, ResourceKey } from '../api-dashboard/resources'

interface TaskHierarchyProps {
  allData: ResourceData
  loading: boolean
  error?: string
  onRefresh: () => void
}

interface TaskRow {
  task: Task
  depth: number
}

function relatedName(
  data: ResourceData,
  resource: ResourceKey,
  id?: string | null,
  fallback = '—',
): string {
  if (!id) return fallback
  const record = (data[resource] ?? []).find((item) => (item as { id?: string }).id === id) as
    | Record<string, unknown>
    | undefined
  return String(record?.name ?? record?.username ?? fallback)
}

function buildHierarchy(tasks: Task[]): TaskRow[] {
  const existingIds = new Set(tasks.map((task) => task.id).filter(Boolean))
  const children = new Map<string, Task[]>()
  tasks.forEach((task) => {
    if (!task.parentTaskId) return
    const siblings = children.get(task.parentTaskId) ?? []
    siblings.push(task)
    children.set(task.parentTaskId, siblings)
  })

  const rows: TaskRow[] = []
  const visited = new Set<string>()
  const append = (task: Task, depth: number) => {
    if (task.id && visited.has(task.id)) return
    if (task.id) visited.add(task.id)
    rows.push({ task, depth })
    ;(task.id ? children.get(task.id) : undefined)?.forEach((child) => append(child, depth + 1))
  }

  tasks
    .filter((task) => !task.parentTaskId || !existingIds.has(task.parentTaskId))
    .forEach((task) => append(task, 0))
  tasks.filter((task) => task.id && !visited.has(task.id)).forEach((task) => append(task, 0))
  return rows
}

export function TaskHierarchy({ allData, loading, error, onRefresh }: TaskHierarchyProps) {
  const tasks = useMemo(() => (allData.tasks ?? []) as Task[], [allData.tasks])
  const [updatingIds, setUpdatingIds] = useState<Set<string>>(new Set())
  const [actionError, setActionError] = useState<string>()
  const rows = useMemo(() => buildHierarchy(tasks), [tasks])

  const toggleCompletion = async (task: Task) => {
    if (!task.id) return
    setActionError(undefined)
    setUpdatingIds((current) => new Set(current).add(task.id!))
    try {
      await tasksService.updateCompletion(task.id, { completed: !task.completed })
      // Se consulta nuevamente toda la jerarquía porque el backend puede haber
      // cambiado también el estado de uno o varios ancestros.
      onRefresh()
    } catch (requestError) {
      setActionError(
        requestError instanceof ApiError ? requestError.message : 'No fue posible actualizar la tarea',
      )
    } finally {
      setUpdatingIds((current) => {
        const next = new Set(current)
        next.delete(task.id!)
        return next
      })
    }
  }

  if (loading) return <div className="table-state"><span className="spinner" />Consultando tareas…</div>
  if (error) return <div className="table-state error-state">No fue posible consultar: {error}</div>
  if (tasks.length === 0) return <div className="table-state">No hay tareas creadas.</div>

  return (
    <>
      {actionError && <div className="task-action-error">{actionError}</div>}
      <div className="table-wrap task-table-wrap">
        <table className="task-table">
          <thead><tr><th>Tarea</th><th>Proyecto</th><th>Responsable</th><th>Estado</th><th>Subtareas</th><th>Fecha límite</th></tr></thead>
          <tbody>
            {rows.map(({ task, depth }) => {
              const directChildren = tasks.filter((candidate) => candidate.parentTaskId === task.id)
              const completedChildren = directChildren.filter((child) => child.completed).length
              const updating = task.id ? updatingIds.has(task.id) : false
              return (
                <tr className={task.completed ? 'task-completed' : ''} key={task.id}>
                  <td>
                    <div className="task-title-cell" style={{ paddingLeft: `${depth * 23}px` }}>
                      {depth > 0 && <span className="tree-branch">↳</span>}
                      <button
                        aria-label={`${task.completed ? 'Reabrir' : 'Completar'} ${task.title}`}
                        className={`task-checkbox ${task.completed ? 'checked' : ''}`}
                        disabled={updating}
                        onClick={() => void toggleCompletion(task)}
                        type="button"
                      >{updating ? <span className="spinner light" /> : task.completed ? '✓' : ''}</button>
                      <div><strong>{task.title}</strong>{depth > 0 && <small>Subtarea</small>}</div>
                    </div>
                  </td>
                  <td>{relatedName(allData, 'projects', task.projectId, 'Sin proyecto')}</td>
                  <td>{relatedName(allData, 'users', task.responsibleUserId)}</td>
                  <td><span className={`task-status ${task.completed ? 'done' : ''}`}>{task.completed ? 'Completed' : relatedName(allData, 'statuses', task.statusId)}</span></td>
                  <td>
                    {directChildren.length > 0 ? (
                      <div className="subtask-progress"><span>{completedChildren}/{directChildren.length}</span><i><b style={{ width: `${(completedChildren / directChildren.length) * 100}%` }} /></i></div>
                    ) : <span className="no-children">—</span>}
                  </td>
                  <td>{task.deadline ?? '—'}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </>
  )
}
