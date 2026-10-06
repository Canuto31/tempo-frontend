import { useState, type FormEvent } from 'react'
import { ApiError, tasksService, type CreateTaskInput } from '../../services'
import type { ResourceData } from '../api-dashboard/resources'

interface CreateTaskDialogProps {
  data: ResourceData
  onClose: () => void
  onCreated: () => void
}

type DataRecord = Record<string, unknown>

export function CreateTaskDialog({ data, onClose, onCreated }: CreateTaskDialogProps) {
  const users = (data.users ?? []) as DataRecord[]
  const statuses = (data.statuses ?? []) as DataRecord[]
  const projects = (data.projects ?? []) as DataRecord[]
  const categories = (data.categories ?? []) as DataRecord[]
  const defaultStatusId = String(statuses.find((status) => status.defaultStatus)?.id ?? statuses[0]?.id ?? '')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [responsibleUserId, setResponsibleUserId] = useState(String(users[0]?.id ?? ''))
  const [statusId, setStatusId] = useState(defaultStatusId)
  const [projectId, setProjectId] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [deadline, setDeadline] = useState('')
  const [estimatedMinutes, setEstimatedMinutes] = useState(0)
  const [pokerPoints, setPokerPoints] = useState(0)
  const [subtasks, setSubtasks] = useState([''])
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string>()

  const updateSubtask = (index: number, value: string) => {
    setSubtasks((current) => current.map((subtask, position) => position === index ? value : subtask))
  }

  const submit = async (event: FormEvent) => {
    event.preventDefault()
    setError(undefined)
    setSaving(true)
    const sharedFields = {
      responsibleUserId,
      statusId,
      estimatedTimeSeconds: estimatedMinutes * 60,
      pokerPoints,
      ...(projectId ? { projectId } : {}),
      ...(categoryId ? { categoryId } : {}),
      ...(deadline ? { deadline } : {}),
    }

    try {
      const parent = await tasksService.create({ title: title.trim(), description, ...sharedFields })
      if (!parent.id) throw new Error('El backend no devolvió el ID de la tarea padre')

      const childTitles = subtasks.map((subtask) => subtask.trim()).filter(Boolean)
      await Promise.all(childTitles.map((childTitle) => {
        const child: CreateTaskInput = { title: childTitle, parentTaskId: parent.id!, ...sharedFields }
        return tasksService.create(child)
      }))
      onCreated()
      onClose()
    } catch (requestError) {
      setError(requestError instanceof ApiError ? requestError.message : requestError instanceof Error ? requestError.message : 'No fue posible crear la tarea')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="dialog-backdrop" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <div aria-labelledby="create-task-title" aria-modal="true" className="task-dialog" role="dialog">
        <div className="dialog-header"><div><span className="section-kicker">NUEVA JERARQUÍA</span><h2 id="create-task-title">Crear tarea y subtareas</h2><p>Las subtareas heredarán responsable, estado, proyecto y categoría.</p></div><button aria-label="Cerrar" onClick={onClose} type="button">×</button></div>
        <form onSubmit={(event) => void submit(event)}>
          <div className="form-grid">
            <label className="full-field">Título de la tarea<input required value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Ej. Publicar nueva versión" /></label>
            <label className="full-field">Descripción<textarea value={description} onChange={(event) => setDescription(event.target.value)} placeholder="Contexto de la tarea padre" /></label>
            <label>Responsable<select required value={responsibleUserId} onChange={(event) => setResponsibleUserId(event.target.value)}>{users.map((user) => <option key={String(user.id)} value={String(user.id)}>{String(user.name ?? user.username)}</option>)}</select></label>
            <label>Estado inicial<select required value={statusId} onChange={(event) => setStatusId(event.target.value)}>{statuses.map((status) => <option key={String(status.id)} value={String(status.id)}>{String(status.name)}</option>)}</select></label>
            <label>Proyecto<select value={projectId} onChange={(event) => setProjectId(event.target.value)}><option value="">Sin proyecto</option>{projects.map((project) => <option key={String(project.id)} value={String(project.id)}>{String(project.name)}</option>)}</select></label>
            <label>Categoría<select value={categoryId} onChange={(event) => setCategoryId(event.target.value)}><option value="">Sin categoría</option>{categories.map((category) => <option key={String(category.id)} value={String(category.id)}>{String(category.name)}</option>)}</select></label>
            <label>Fecha límite<input type="date" value={deadline} onChange={(event) => setDeadline(event.target.value)} /></label>
            <label>Tiempo estimado (min)<input min="0" type="number" value={estimatedMinutes} onChange={(event) => setEstimatedMinutes(Number(event.target.value))} /></label>
            <label>Puntos<input min="0" type="number" value={pokerPoints} onChange={(event) => setPokerPoints(Number(event.target.value))} /></label>
          </div>

          <div className="subtask-builder">
            <div><strong>Subtareas</strong><small>Al completar todas, el backend completará automáticamente la tarea padre.</small></div>
            {subtasks.map((subtask, index) => (
              <div className="subtask-input" key={index}><span>{index + 1}</span><input value={subtask} onChange={(event) => updateSubtask(index, event.target.value)} placeholder="Título de la subtarea" />{subtasks.length > 1 && <button aria-label="Eliminar subtarea" onClick={() => setSubtasks((current) => current.filter((_, position) => position !== index))} type="button">×</button>}</div>
            ))}
            <button className="add-subtask" onClick={() => setSubtasks((current) => [...current, ''])} type="button">+ Agregar otra subtarea</button>
          </div>

          {error && <div className="dialog-error">{error}</div>}
          <div className="dialog-actions"><button className="cancel-button" onClick={onClose} type="button">Cancelar</button><button className="send-button" disabled={saving || !responsibleUserId || !statusId} type="submit">{saving ? <span className="spinner light" /> : null}{saving ? 'Creando…' : 'Crear jerarquía'}</button></div>
        </form>
      </div>
    </div>
  )
}
