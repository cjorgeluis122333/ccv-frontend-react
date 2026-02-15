# Codebase Description for AI Analysis

This document provides a detailed overview of the `ccv-fronent-react` project, designed to assist AI models in understanding its structure, technologies, and conventions.

## 1. Project Overview

`ccv-fronent-react` is a modern web frontend application built with React and TypeScript. It leverages Vite for a fast development experience and optimized builds, with Tailwind CSS for utility-first styling. The project is structured to support scalable development with clear separation of concerns, including dedicated modules for routing, state management, services, and UI components.

## 2. Core Technologies

*   **Frontend Framework:** React 19.x
    *   **Purpose:** Building interactive user interfaces using a component-based architecture.
*   **Language:** TypeScript 5.x
    *   **Purpose:** Enhances JavaScript with static type checking, improving code quality and maintainability.
*   **Build Tool:** Vite 7.x
    *   **Purpose:** A next-generation frontend tool that provides extremely fast hot module replacement (HMR) and optimized production builds.
*   **Styling Framework:** Tailwind CSS 3.x
    *   **Purpose:** A utility-first CSS framework for rapidly building custom designs directly in markup.
    *   **Configuration:** Custom `fontFamily` (Inter, JetBrains Mono) and `colors` (custom `primary` palette) are defined in `tailwind.config.js`. It also uses `@tailwindcss/forms` and `@tailwindcss/container-queries` plugins.
*   **Routing:** React Router DOM 7.x
    *   **Purpose:** Declarative routing for React applications.
*   **HTTP Client:** Axios 1.x
    *   **Purpose:** Promise-based HTTP client for making API requests.
*   **Form Management:** React Hook Form 7.x with Zod 4.x
    *   **Purpose:** Efficiently manages form state, validation, and submission, utilizing Zod for robust schema validation.
*   **Utility Libraries:**
    *   `clsx`: For conditionally joining class names.
    *   `tailwind-merge`: For intelligently merging Tailwind CSS classes to resolve conflicts.
    *   `lucide-react`: A collection of open-source icons for React.
*   **Fonts:** `@fontsource/inter` and `@fontsource/jetbrains-mono` are used to self-host and optimize font loading.
*   **Linting & Formatting:** ESLint 9.x and Prettier 3.x
    *   **Purpose:** Maintain code quality, consistency, and adherence to best practices.
*   **Deployment:** `gh-pages` is configured for deploying the `dist` folder to GitHub Pages.

## 3. Project Structure

The project follows a standard React application structure with a strong emphasis on modularity.

*   `public/`: Contains static assets like `index.html`, `vite.svg`, and various image directories (`acc`, `logo`, `perfil`, `sport`).
*   `src/`: The main application source code.
    *   `src/App.tsx`: The root component of the application.
    *   `src/main.tsx`: Entry point for the React application, rendering `App.tsx`.
    *   `src/index.css`: Global styles, likely including Tailwind CSS imports.
    *   `src/vite-env.d.ts`: Vite-specific TypeScript declaration file.
    *   `src/assets/`: Static assets specific to the source code (e.g., images, icons not in `public`).
    *   `src/components/`: Reusable UI components.
    *   `src/config/`: Application-wide configuration settings.
    *   `src/contexts/`: React Context API providers for global state or theme.
    *   `src/features/`: Modules encapsulating specific features or domains of the application.
    *   `src/hooks/`: Custom React hooks for reusable logic.
    *   `src/lib/`: Utility functions or third-party library integrations.
    *   `src/pages/`: Top-level components representing different views or routes of the application.
    *   `src/router/`: Defines application routes using React Router DOM.
    *   `src/services/`: Contains API service definitions and functions for interacting with backend endpoints (e.g., using Axios).
    *   `src/store/`: Manages application state, potentially using a library like Zustand or Redux (not explicitly identified, but a common pattern for this folder name).
    *   `src/types/`: TypeScript type and interface definitions.
    *   `src/utils/`: General utility functions.

## 4. Key Configuration Files

*   `package.json`: Defines project metadata, scripts, and dependencies.
*   `tsconfig.json`, `tsconfig.app.json`, `tsconfig.node.json`: TypeScript configuration files for different contexts (root, application, Node.js environment).
*   `vite.config.ts`: Vite build configuration, including React plugin and path aliases (`@` -> `./src`).
*   `tailwind.config.js`: Tailwind CSS configuration, including content paths, theme extensions, and plugins.
*   `postcss.config.js`: PostCSS configuration, typically used by Tailwind CSS.
*   `eslint.config.js`, `.prettierrc`: ESLint and Prettier configuration for code quality and formatting.
*   `.env.development`, `.env.production`: Environment variables for different deployment stages.
*   `vercel.json`: Configuration for Vercel deployment (if applicable).

## 5. Development Workflow

*   `npm run dev`: Starts the development server.
*   `npm run build`: Builds the application for production.
*   `npm run lint`: Runs ESLint checks.
*   `npm run deploy`: Deploys the application to GitHub Pages.

This comprehensive overview should enable an AI to effectively analyze, understand, and interact with the `ccv-fronent-react` codebase.