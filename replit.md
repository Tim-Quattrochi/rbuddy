# Reentry Buddy - Personal Recovery Companion

## Overview

Reentry Buddy is a web application designed to support individuals in their recovery journey by providing daily check-in functionality, streak tracking, and journaling capabilities. The application helps users maintain accountability and track their emotional well-being through a simple, accessible interface.

The app uses a local-first architecture with browser localStorage for data persistence, making it privacy-focused and immediately functional without requiring backend infrastructure or user authentication systems.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**React SPA with Wouter Routing**
- Single-page application built with React 18 and TypeScript
- Client-side routing using Wouter (lightweight React Router alternative)
- Route protection implemented via custom `ProtectedRoute` and `PublicRoute` wrapper components
- Three main routes: authentication (`/auth`), dashboard (`/dashboard`), and check-in (`/check-in`)

**State Management**
- React hooks-based state management (no Redux/Zustand)
- Custom hooks for business logic:
  - `useAuth`: Manages user authentication state and localStorage-based sessions
  - `useCheckIns`: Handles check-in data retrieval, creation, and streak calculation
  - `useToast`: Toast notification system
- TanStack Query (React Query) configured but primarily for future API integration

**UI Component System**
- Shadcn/ui component library (Radix UI primitives with Tailwind styling)
- "New York" style variant with custom theming
- Comprehensive component set including forms, dialogs, cards, and navigation elements
- Tailwind CSS for styling with CSS variables for theming

### Data Storage & Schema

**Local Storage Implementation**
- All data persisted in browser localStorage (no database currently)
- `LocalStorageService` class provides CRUD operations
- Data keyed by user name combination for multi-user support on same device

**Data Models** (defined in `shared/schema.ts`):
1. **User Schema**
   - Fields: id, firstName, lastName
   - Validation using Zod schemas
   
2. **CheckIn Schema**
   - Fields: id, userId, date, feeling, goal, journal (optional), createdAt
   - Tracks daily emotional state and goals
   - Optional journaling for additional reflection

**Streak Calculation Logic**
- Automatic streak tracking based on consecutive daily check-ins
- Streak resets if a day is missed
- Calculated in real-time from stored check-in history

### Authentication & Authorization

**Simplified Authentication System**
- Name-based authentication (firstName + lastName as identifier)
- No passwords or traditional authentication
- Session stored in localStorage with key `reentry_buddy_current_user`
- Auto-login for returning users if session exists
- Sign-out clears session but preserves user data

**Authorization Model**
- Route-level protection using wrapper components
- Unauthenticated users redirected to `/auth`
- Authenticated users redirected from `/auth` to `/dashboard`
- Loading states handled during auth check

### Backend Architecture (Prepared but Minimal)

**Express Server Setup**
- Express.js server configured with TypeScript
- Vite integration for development with HMR
- Routes defined in `server/routes.ts` (currently empty placeholder)
- Storage interface (`IStorage`) with in-memory implementation (`MemStorage`)
- Designed for future migration to database-backed storage

**Database Preparation**
- Drizzle ORM configured for PostgreSQL
- Neon Database serverless driver included
- Schema defined but not actively used (shared schema serves frontend)
- Migration system ready via `drizzle-kit`

**API Design**
- RESTful API structure prepared (routes prefixed with `/api`)
- Storage interface allows easy swap from memory to database
- JSON request/response logging middleware configured

## External Dependencies

### Core Framework Dependencies
- **React 18**: UI framework with TypeScript support
- **Vite**: Build tool and development server with HMR
- **Express**: Node.js web server framework
- **Wouter**: Lightweight client-side routing

### UI & Styling
- **Tailwind CSS**: Utility-first CSS framework
- **Shadcn/ui**: Component library based on Radix UI primitives
- **Radix UI**: Unstyled, accessible component primitives (30+ components)
- **class-variance-authority**: Variant-based component styling
- **Lucide React**: Icon library

### Data & Validation
- **Zod**: TypeScript-first schema validation
- **Drizzle ORM**: TypeScript ORM for SQL databases (configured, not actively used)
- **@neondatabase/serverless**: PostgreSQL serverless driver (prepared for future use)
- **TanStack Query**: Data fetching and caching library

### Form Handling
- **React Hook Form**: Performant form library (via `@hookform/resolvers`)
- **date-fns**: Date manipulation and formatting

### Development Tools
- **TypeScript**: Static type checking
- **ESBuild**: JavaScript bundler for production builds
- **tsx**: TypeScript execution for development
- **Replit Plugins**: Development banner, cartographer, and error overlay for Replit environment

### Session Management
- **connect-pg-simple**: PostgreSQL session store (configured, unused in current local-first implementation)
- Browser localStorage used for current session management

### Design Decisions

**Why Local Storage Over Database?**
- Immediate functionality without infrastructure setup
- Privacy-first approach (data never leaves user's device)
- Simplified deployment and zero backend costs
- Easy migration path to database when needed (interfaces already defined)

**Why Minimal Authentication?**
- Target users may need simple, accessible systems
- Removes barrier to entry (no password management)
- Suitable for personal/trusted device usage
- Can be enhanced with proper auth when requirements change

**Why Wouter Over React Router?**
- Smaller bundle size (1.5KB vs 20KB+)
- Simpler API suitable for basic routing needs
- Sufficient for current three-route application