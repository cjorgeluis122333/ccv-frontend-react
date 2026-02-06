/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', 'sans-serif'], // Ya que instalaste @fontsource/inter
                mono: ['JetBrains Mono', 'monospace'],
            },
            colors: {
                // Define tu paleta aquí para consistencia
                primary: {
                    DEFAULT: '#3b82f6',
                    foreground: '#ffffff'
                }
            }
        },
    },
    plugins: [
        require('@tailwindcss/forms'),
        require('@tailwindcss/container-queries'),
    ],
}