# NumVerify AI

## Overview

NumVerify AI is a full-stack phone number intelligence application that validates and provides insights about phone numbers. Built with React, Express, and PostgreSQL, it offers a modern SaaS dashboard experience for searching phone numbers, viewing validation results, and tracking search history. The application uses the NumVerify API for phone number validation and includes JWT-based authentication, analytics tracking, and a responsive UI inspired by Linear and Vercel's design aesthetics.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Technology Stack**: React 18 with Vite bundler, TypeScript, and Tailwind CSS for styling. The UI component library is based on shadcn/ui (Radix UI primitives) with customized theming.

**Routing**: Wouter is used for client-side routing instead of React Router, providing a lightweight alternative for navigation between authentication, dashboard, search history, and profile pages.

**State Management**: TanStack Query (React Query) handles server state, caching, and data synchronization. Local state is managed with React hooks, and theme preferences are persisted to localStorage.

**Design System**: The application follows a reference-based SaaS aesthetic drawing from Linear and Vercel dashboards. Key design decisions include:
- Inter font family via Google Fonts CDN
- Tailwind utility-first approach with custom CSS variables for theming
- Dark/light mode support with class-based theme switching
- Responsive layouts with mobile-first breakpoints
- Consistent spacing primitives (Tailwind units: 2, 4, 6, 8, 12, 16)
- Framer Motion for animations and transitions

**Component Structure**: 
- Protected routes enforce authentication before accessing dashboard features
- Sidebar navigation with collapsible mobile drawer
- Reusable UI components from shadcn/ui with custom styling
- Theme toggle component with animated icon transitions

### Backend Architecture

**Framework**: Express.js with TypeScript running on Node.js, using ESM modules throughout.

**Authentication**: JWT-based authentication system with:
- bcryptjs for password hashing (10 salt rounds)
- 7-day token expiration
- Bearer token authorization headers
- Development mode bypass for easier testing

**API Endpoints**:
- `POST /api/signup` - User registration with email/password
- `POST /api/login` - User authentication returning JWT
- `POST /api/search` - Phone number validation (protected)
- `GET /api/searches` - User's search history (protected)
- `GET /api/analytics` - User statistics (protected)
- `GET /api/profile` - User profile data (protected)

**Middleware**: Custom auth middleware validates JWT tokens on protected routes, with graceful handling for development environments.

**Caching Strategy**: In-memory cache for NumVerify API responses with 1-hour TTL to reduce external API calls and improve response times.

### Data Storage

**Database**: PostgreSQL accessed via Neon serverless driver for edge-compatible database connections.

**ORM**: Drizzle ORM provides type-safe database access with schema definitions in `shared/schema.ts`.

**Schema Design**:
- `users` table: Core authentication with id (UUID), email (unique), hashed password, and timestamp
- `searches` table: Stores validation results with foreign key to users, including phone number, country, carrier, line type, validation status, and AI insights
- `analytics` table: Aggregated user metrics (total searches, recent searches, valid numbers count) with one-to-one relationship to users

**Migration Strategy**: Drizzle Kit handles schema migrations with configuration pointing to PostgreSQL database via `DATABASE_URL` environment variable.

### External Dependencies

**NumVerify API**: Third-party phone number validation service providing:
- Number format validation
- Country and location identification  
- Carrier detection
- Line type classification (mobile, landline, etc.)

The application uses the free tier API key stored in environment variables with graceful error handling for API failures.

**AI Insights**: Mock AI insight generation (placeholder for future OpenAI integration) provides contextual information about validated phone numbers.

**Neon Database**: Serverless PostgreSQL hosting platform providing:
- Automatic connection pooling
- HTTP-based database access for edge compatibility
- Built-in connection string via `DATABASE_URL`

**shadcn/ui Components**: Radix UI-based component library providing accessible, unstyled primitives customized with Tailwind CSS. The "New York" style variant is configured with neutral base colors and CSS variables for theming.

**Development Tools**:
- Vite for fast development builds and HMR
- Replit-specific plugins for runtime error overlays and development banners
- TypeScript for type safety across the full stack
- ESBuild for production server bundling