# Contexto y Reglas Base del Proyecto `ccv-fronent-react`

> **Instrucción para el Asistente AI:** Lee este archivo siempre que inicies una nueva tarea en este proyecto para tener el contexto exacto de cómo está estructurada la aplicación y qué convenciones seguir, sin necesidad de explorar todo de nuevo.

## 1. Stack Tecnológico
- **Core:** React 19, TypeScript, Vite.
- **Enrutamiento:** React Router DOM v7.
- **Estilos:** Tailwind CSS (`tailwind-merge`, `clsx`, `@tailwindcss/forms`).
- **Formularios y Validación:** `react-hook-form` + `zod` (`@hookform/resolvers`).
- **Peticiones HTTP:** `axios`.
- **Estado Global:** No hay Redux ni Zustand instalados. Se utiliza React Context (ej. `ToastContext.tsx`) y estado local manejado por custom hooks encapsulados.

## 2. Arquitectura de Carpetas (Feature-Sliced Design)
El proyecto utiliza una arquitectura altamente modular y encapsulada por dominios de negocio (features):
- `src/features/`: **El núcleo del proyecto.** Cada carpeta aquí (ej. `auth`, `dashboard`, `partner`) es un módulo independiente que contiene su propia lógica:
  - `components/`: Componentes específicos de la vista/módulo.
  - `hooks/`: Lógica de negocio y conexión de estado para las vistas (ej. `useLogin.ts`).
  - `services/`: Peticiones a la API exclusivas del dominio usando Axios.
  - `schemas/`: Esquemas de validación de Zod.
  - `types/`: Interfaces y tipos exclusivos del dominio.
  - `adapter/`: Transformaciones de datos entre la API y el UI.
- `src/components/`: Componentes UI puros y genéricos compartidos por toda la app (botones, inputs, layouts).
- `src/router/AppRouter.tsx`: Punto de entrada de todas las rutas, dividiendo las públicas y las privadas (envueltas en `<MainLayout>`).
- `src/services/`: Configuración core de Axios y servicios compartidos o principales (ej. `mainService.ts`).

## 3. Patrones de Diseño Obligatorios

### Formularios
**Regla:** TODO formulario debe construirse usando `react-hook-form` y `zod`.
*   Definir el esquema Zod en `features/[dominio]/schemas/`.
*   Usar `zodResolver` en el componente.
*   Delegar la función de *submit* a un Custom Hook. 
*   **Ejemplo:** `const { register, handleSubmit, formState } = useForm<FormTypes>({ resolver: zodResolver(schema) })`.

### Separación de Responsabilidades (UI vs Lógica)
**Regla:** Los componentes (como `LoginScreen.tsx`) NO deben contener axios ni promesas directas para peticiones HTTP.
*   **Componente UI:** Renderiza, extrae funciones de un custom hook y pasa variables a los componentes base.
*   **Custom Hook:** (`useAlgo()`) maneja la llamada a los servicios (Axios), gestiona propiedades como `isLoading`, `error` y el flujo de navegación lógico.
*   **Service:** Llama al endpoint de la API y maneja respuestas/errores usando una instancia configurada compartida de Axios (`api`).

### Estilos y UI
**Regla:** NO usar CSS plano a menos que sea inevitable.
*   Construir UI usando las clases utilitarias de Tailwind.
*   **REGLA OBLIGATORIA SOBRE COMPONENTES:** Antes de generar una interfaz o formulario, DEBES comprobar si existe un componente genérico (ej. un input, button o select) en `src/components/` que permita reutilizar código. Si lo hay, úsalo obligatoriamente. Si no existe un componente genérico para ese caso pero es posible usar uno, **primero créalo en `src/components/`** y luego incorpóralo en tu interfaz. Esta idea debe guiar siempre tu desarrollo de UI.
*   Reutilizar componentes de `src/components/` (como `Input`, `Button`) que ya tienen unificación de clases (usando `clsx` y `tailwind-merge`) en lugar de construir etiquetas HTML directas repetitivas.

## 4. Pasos para añadir una nueva característica (Feature)
1.  **¿Es un dominio nuevo o parte de uno existente?** Si es nuevo, crea una carpeta en `src/features/nuevo-dominio/`.
2.  Crea la estructura interna: `components`, `hooks`, `services`, `types`, etc.
3.  Crea el componente principal (ej. `PantallaNuevoDominio.tsx`) en el root del feature o en `pages/`.
4.  Agrega la URL a `src/router/AppRouter.tsx` bajo la sección correspondiente (Pública o Privada).
5.  Mantén el estado y tipos aislados en su respectiva subcarpeta dentro del feature.

## 5. Estrategias de Optimización y Caché (Mandatorio)

Para garantizar una experiencia de usuario fluida y evitar peticiones redundantes al servidor, se han establecido las siguientes reglas de implementación:

### Paginación con Caché (Pattern: Record-based Cache)
**Regla:** Toda sección que utilice paginación DEBE implementar un sistema de caché en el hook encargado de los datos.
*   **Estado del Hook:** Utilizar un objeto `Record<number, PaginatedResponse>` para almacenar las páginas ya consultadas.
*   **Lógica de Carga:** Antes de realizar una petición Axios, verificar si la página ya existe en el objeto de caché. Si existe, simplemente actualizar el estado de la 'página actual' sin disparar una petición de red.
*   **Invalidación:** La caché debe limpiarse (`{} `) únicamente cuando:
    1. Se detecta un cambio de "Socio" o entidad principal.
    2. Se realiza una operación de escritura exitosa (POST/PUT/DELETE) que afecte los datos de esa lista.

### Persistencia entre Pestañas (Pattern: Tab State Tracking)
**Regla:** Si una pantalla tiene múltiples secciones (Tabs) que cargan datos diferentes, el componente debe recordar qué secciones ya fueron cargadas.
*   **Estado del Componente:** Usar un estado `loadedSections` (ej. `{ ingreso: boolean; historial: boolean }`).
*   **Lógica:** Solo invocar las funciones de carga del hook si el flag de la sección correspondiente es `false`. Una vez cargada, cambiar a `true`.
*   **Invalidación:** Reiniciar todos los flags a `false` al cambiar de Socio o tras una inserción exitosa si es necesario refrescar el contexto global.

---
**Nota para la IA:** No reinventes la rueda. Si vas a hacer peticiones, busca el hook/servicio existente. Si vas a validar, busca/crea un esquema Zod. Si vas a añadir estilos, usa Tailwind.
