## TODO
1. El componente modal de cerrar section y mostrar el nombre y correo tiene 
que minimizarse al pulsar fuera de él
2. Check the request of list partner for see if you can make better
## Validation

Para formularios robustos en React, el estándar de la industria hoy en día es:

1. React Hook Form + Zod (para validación).
2. Y Axios para las peticiones HTTP.
3.

```
npm install axios react-router-dom react-hook-form zod @hookform/resolvers
```

## Style

```
npm install @fontsource/inter @fontsource/jetbrains-mono
```

## Zod

Data mapper with zod using ***COERCE***

```jsx
z.coerce.number().parse("123");   // → 123
z.coerce.number().parse("");      // → 0 ❗
z.coerce.number().parse("abc");   // → NaN ❌
```



https://cjorgeluis122333.github.io/ccv-frontend-react/dashboard



src/features/auth/
├── api/             # Servicios de Axios específicos de Auth
├── components/      # Componentes exclusivos de Auth (LoginForm, RegisterCard)
├── hooks/           # Lógica reutilizable solo en Auth (useAuth, useSession)
├── types/           # Interfaces de TypeScript de este dominio
├── utils/           # Helpers específicos
└── index.ts         # El "Public API" del feature