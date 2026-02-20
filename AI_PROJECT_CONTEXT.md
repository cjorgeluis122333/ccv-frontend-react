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
*   Reutilizar componentes de `src/components/` (como `Input`, `Button`) que ya tienen unificación de clases (usando `clsx` y `tailwind-merge`) en lugar de construir etiquetas HTML directas repetitivas.

## 4. Pasos para añadir una nueva característica (Feature)
1.  **¿Es un dominio nuevo o parte de uno existente?** Si es nuevo, crea una carpeta en `src/features/nuevo-dominio/`.
2.  Crea la estructura interna: `components`, `hooks`, `services`, `types`, etc.
3.  Crea el componente principal (ej. `PantallaNuevoDominio.tsx`) en el root del feature o en `pages/`.
4.  Agrega la URL a `src/router/AppRouter.tsx` bajo la sección correspondiente (Pública o Privada).
5.  Mantén el estado y tipos aislados en su respectiva subcarpeta dentro del feature.

---
**Nota para la IA:** No reinventes la rueda. Si vas a hacer peticiones, busca el hook/servicio existente. Si vas a validar, busca/crea un esquema Zod. Si vas a añadir estilos, usa Tailwind.
