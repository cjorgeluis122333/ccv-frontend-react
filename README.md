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
