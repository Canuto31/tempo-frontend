# Tempo Frontend

Cliente web de Tempo construido con React, TypeScript y Vite. El proyecto incluye una capa de servicios completamente tipada para consumir la API REST publicada por el backend.

## Requisitos

- Node.js 20 o superior.
- npm 10 o superior.
- Tempo Backend disponible en `http://localhost:8080`.

La documentación interactiva del backend local está en:

```text
http://localhost:8080/tempo/api/swagger-ui/index.html
```

## Instalación y ejecución

```bash
npm install
copy .env.example .env
npm run dev
```

En PowerShell también se puede crear el archivo de entorno con:

```powershell
Copy-Item .env.example .env
```

Abra `http://localhost:5173` para usar el panel. La pantalla realiza una consulta
inicial a los seis módulos, muestra los registros recibidos y permite volver a
consultarlos con **Actualizar datos**.

La sección **Consola API** permite probar cualquier operación sin herramientas
externas:

1. Seleccione `GET`, `POST`, `PUT` o `DELETE`.
2. Escriba la ruta, por ejemplo `/api/v1/tasks`.
3. Para `POST` y `PUT`, agregue el body JSON.
4. Presione **Enviar solicitud** para ver el estado, tiempo y payload de respuesta.

Las eliminaciones solicitan confirmación antes de enviarse. Después de una
operación de escritura, el dashboard actualiza automáticamente sus tablas.

## Temas visuales

El botón de tema ubicado en la cabecera alterna entre **modo día** y **modo
noche**. La preferencia queda guardada en `localStorage` y, en la primera
visita, se utiliza la configuración de color del sistema operativo.

Ambos modos incluyen la identidad visual Matrix. El fondo animado respeta
`prefers-reduced-motion`, por lo que permanece estático cuando el usuario ha
solicitado reducir las animaciones del sistema.

Comandos disponibles:

```bash
npm run dev      # servidor local con recarga automática
npm run build    # validación TypeScript y build de producción
npm run lint     # análisis estático
npm run preview  # vista previa del build
```

## Configuración

| Variable | Valor local | Propósito |
| --- | --- | --- |
| `VITE_API_BASE_URL` | `/tempo/api` | Ruta base usada por el cliente HTTP. |
| `VITE_DEV_PROXY_TARGET` | `http://localhost:8080` | Destino del proxy de Vite. |

El proxy evita los bloqueos CORS durante el desarrollo. En producción, configure `VITE_API_BASE_URL` con una URL absoluta habilitada para CORS o publique frontend y backend detrás del mismo origen.

## Arquitectura de servicios

```text
src/
├── config/
│   └── env.ts
└── services/
    ├── http/             # fetch, serialización y errores normalizados
    ├── users/
    ├── projects/
    ├── tasks/
    ├── task-statuses/
    ├── categories/
    ├── labels/
    ├── system/
    ├── api.types.ts      # tipos comunes (UUID y fechas ISO)
    └── index.ts          # punto único de importación
```

Cada módulo separa los DTO de entrada/respuesta y el servicio que ejecuta las solicitudes. Todos los errores HTTP se convierten en `ApiError`, que expone `status` y `payload` para que la interfaz pueda decidir qué mostrar.

## Endpoints implementados

| Servicio | GET lista | GET detalle | POST | PUT | DELETE |
| --- | --- | --- | --- | --- | --- |
| Usuarios | ✓ | ✓ | ✓ | ✓ | ✓ |
| Proyectos | ✓ | ✓ | ✓ | ✓ | ✓ |
| Tareas | ✓ | ✓ | ✓ | ✓ | ✓ |
| Estados de tarea | ✓ | ✓ | ✓ | ✓ | ✓ |
| Categorías | ✓ | ✓ | ✓ | ✓ | ✓ |
| Etiquetas | ✓ | ✓ | ✓ | ✓ | ✓ |

También se expone `systemService.hello()` para el endpoint raíz publicado por Swagger.

## Ejemplos de consumo

Todos los servicios y tipos se importan desde un único archivo:

```ts
import {
  ApiError,
  projectsService,
  tasksService,
  type CreateTaskInput,
} from './services'

const projects = await projectsService.list({ ownerId: userId })

const task: CreateTaskInput = {
  title: 'Preparar entrega',
  responsibleUserId: userId,
  statusId,
  estimatedTimeSeconds: 3600,
  pokerPoints: 3,
  projectId: projects[0]?.id,
}

try {
  const createdTask = await tasksService.create(task)
  await tasksService.update(createdTask.id!, { ...task, pokerPoints: 5 })
  await tasksService.remove(createdTask.id!)
} catch (error) {
  if (error instanceof ApiError) {
    console.error(error.status, error.payload)
  }
}
```

Los filtros de tareas están modelados para aceptar como máximo una relación por solicitud, tal como lo exige el backend:

```ts
await tasksService.list({ projectId })
await tasksService.list({ responsibleUserId: userId })
```

### Tareas, subtareas y finalización

El módulo de tareas incluye `tasksService.updateCompletion(id, { completed })`,
que consume `PATCH /api/v1/tasks/{id}/completion`. Según el contrato OpenAPI,
esta operación recalcula automáticamente el estado de las tareas padre.

En el dashboard:

- **Nueva tarea** abre un formulario para crear una tarea padre junto con una o
  varias subtareas.
- Las subtareas se crean con `parentTaskId` y heredan responsable, estado,
  proyecto y categoría de la tarea padre.
- La tabla muestra la jerarquía, el progreso `completadas/total` y controles
  para completar o reabrir cada tarea.
- Después de cada cambio se consulta nuevamente el backend, de modo que la
  finalización automática del padre se refleja inmediatamente en pantalla.

## Flujo Git

El repositorio usa Git Flow:

- `master`: base estable y futuras entregas de producción.
- `develop`: integración del trabajo en curso.
- `feature/*`, `release/*` y `hotfix/*`: ramas auxiliares administradas por Git Flow.

Los módulos de API se mantienen en commits independientes para facilitar su revisión y validación.
