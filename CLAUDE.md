# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Chatzia is a chatbot platform built with React, TypeScript, and Vite. The application allows users to create, configure, and manage AI chatbots with integration capabilities for WhatsApp and Telegram.

## Development Commands

```bash
# Install dependencies
npm install

# Start development server (runs on default Vite port, typically http://localhost:5173)
npm run dev

# Type check without emitting files
npm run check

# Build for production
npm run build

# Preview production build
npm run preview
```

## Architecture

### Tech Stack
- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite 5 with `@vitejs/plugin-react`
- **Styling**: TailwindCSS v4 with PostCSS
- **Icons**: lucide-react

**Build Configuration**:
- `vite.config.ts`: Configures React plugin and PostCSS integration
- Vite processes CSS imports through the PostCSS pipeline defined in `postcss.config.cjs`

### Application Structure

This is a single-page application (SPA) with view-based navigation managed through state. The app does not use a routing library; views are conditionally rendered based on `currentView` state.

**Main Components** (all defined in `src/App.tsx`):
- `Sidebar`: Fixed navigation menu for switching between views
- `Dashboard`: Overview with metrics and chatbot list
- `CreateBot`: Form for creating/editing chatbots with knowledge training tabs
- `Conversations`: List and detail view of chatbot conversations
- `Integrations`: WhatsApp and Telegram integration setup
- `Analytics`: Charts and metrics visualization
- `Settings`: Account and plan configuration

### Data Model

The application uses local state management (React useState) with persistent storage via `window.storage` API:

**Core Types**:
- `Chatbot`: Bot configuration including name, description, language, personality, and knowledge base
- `Conversation`: Chat sessions with messages, status (active/closed), and channel
- `Knowledge`: Training data structure with files, URLs, FAQs, and text fields
- `Message`: Individual chat messages with role (user/bot), content, and timestamp

**Storage Keys**:
- `chatbots`: Array of chatbot configurations
- `conversations`: Array of conversation histories

Data is stored as JSON strings and parsed on load. The `window.storage` API is expected to be provided by the runtime environment.

### State Management

- No external state management library (Redux, Zustand, etc.)
- All state is managed in the root `App` component
- Data persistence handled through `window.storage.get()` and `window.storage.set()`
- State updates trigger `saveData()` to persist changes

### View Navigation

Views are selected through the `currentView` state variable:
- `dashboard`: Main overview
- `create`: Bot creation/editing (check `selectedBot` to determine mode)
- `conversations`: Conversation list
- `integrations`: Channel integration setup
- `analytics`: Metrics and reporting
- `settings`: Account configuration

### CSS and Styling

**CSS Loading**:
- CSS is imported in `src/main.tsx` via `import './index.css'`
- No `<link>` tag in `index.html` - Vite handles CSS bundling through JavaScript imports
- `src/index.css` uses Tailwind v4 syntax: `@import "tailwindcss";` (NOT the old v3 `@tailwind` directives)

**Configuration**:
- **TailwindCSS v4**: Utility-first CSS framework
- **PostCSS**: Processes CSS with `@tailwindcss/postcss` plugin and autoprefixer

**Configuration Files**:
- `tailwind.config.cjs`: Content paths include `./index.html` and `./src/**/*.{js,ts,jsx,tsx}`
- `postcss.config.cjs`: Configures TailwindCSS PostCSS plugin and autoprefixer

**Styling Approach**:
- Pure utility-class approach - no custom CSS classes defined
- All styling done inline via Tailwind utility classes in JSX `className` attributes
- Responsive design with mobile-first breakpoints (md:, lg:)
- Color scheme: Gray scale (50, 100-900) with blue (100-700), green, purple, and yellow accents
- Layout uses fixed sidebar (w-64) with main content offset (ml-64)

**Common Patterns**:
- Cards: `bg-white rounded-lg shadow p-6`
- Buttons: `bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition`
- Inputs: `w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500`
- Status badges: `bg-green-100 text-green-800 text-xs px-2 py-1 rounded`

## Important Notes

- `global.d.ts` provides TypeScript definitions for JSX and `window.storage`
- The `window.storage` API is a custom interface - ensure it's available in the runtime environment
- Icons are imported from `lucide-react` and may require type casting to `any` in some contexts
- Dates use ISO string format and are displayed with `toLocaleString('es-ES')`
