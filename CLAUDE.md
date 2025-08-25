# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Development
- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint with Next.js config
- `npm run type-check` - Run TypeScript type checking (use this after making changes)
- `npm run format` - Format code with Prettier and Tailwind plugin
- `npm run format:check` - Check code formatting

### Testing
- `npm run test` - Run Jest tests
- `npm run test:watch` - Run Jest tests in watch mode

### Analysis
- `npm run analyze` - Analyze bundle size (requires ANALYZE=true env var)

## Architecture Overview

### Tech Stack
- **Framework**: Next.js 15+ with App Router and TypeScript (strict mode)
- **Database**: Supabase with type-safe client configuration
- **Styling**: Tailwind CSS with custom cork theme and animations
- **State Management**: Zustand + React Query for server state
- **UI Components**: Custom components with Radix UI primitives
- **Drag & Drop**: @dnd-kit for cork board interactions
- **Animation**: Framer Motion for smooth transitions
- **Validation**: Zod for type-safe forms and API validation

### Core Concepts
This is a visual book management app with a "cork board" aesthetic where book covers are pinned like notes and can be dragged around. The app supports multiple shelves (TBR categories) and integrates with Google Books API for book discovery.

### File Structure
```
src/
├── app/                 # Next.js App Router
│   ├── auth/           # Authentication pages (SignIn, SignUp, Reset)
│   ├── dashboard/      # Main cork board interface
│   └── api/            # API routes (health, debug endpoints)
├── components/
│   ├── ui/             # Reusable components with centralized exports
│   │   ├── Button.tsx, Card.tsx, Typography.tsx
│   │   ├── Compound/   # Complex components (Modal)
│   │   └── index.ts    # Central export point
│   └── auth/           # Authentication-specific components
├── lib/
│   ├── supabase/       # Database client (client.ts, server.ts)
│   ├── auth/           # Auth utilities and error handling
│   ├── validation/     # Zod schemas (auth.ts, book.ts)
│   └── utils.ts        # General utilities
├── stores/
│   └── auth-store.ts   # Zustand auth state management
├── types/
│   ├── database.types.ts # Generated Supabase types
│   └── book.ts          # Domain-specific types
└── middleware.ts        # Supabase auth middleware
```

### Database Schema
The app uses a comprehensive book management schema:
- `books` - Core book data with status tracking (tbr, reading, completed, dnf, archived)
- `shelves` - Custom user-defined categories with positioning
- `book_positions` - Tracks book placement on shelves and cork board positions
- `tags` - User-defined tags with colors
- `reading_sessions` - Reading progress tracking
- `user_preferences` - Theme, view mode, and app settings

### Authentication
Uses Supabase Auth with middleware protection. The middleware redirects unauthenticated users to `/auth` except for public routes (`/`, `/api/*`, `/auth`, `/test-db`).

### State Management
- **Zustand**: Client state (auth store with sign in/up/out methods)
- **React Query**: Server state caching and synchronization
- **Supabase**: Real-time database subscriptions

### Styling Conventions
- Custom cork color palette (cork-50 to cork-900)
- Cork board themed animations (push-pin, book-hover, fade-in)
- Responsive design with touch-friendly interfaces
- Uses @/imports for clean import paths

### Component Architecture
- Central exports through `components/ui/index.ts`
- Polymorphic components for flexibility
- Compound components in dedicated folders
- Type-safe props with strict TypeScript config

### Security
- Comprehensive CSP headers in next.config.js
- Supabase RLS policies for user data isolation
- Image optimization with safe external domains
- Strict TypeScript configuration with unused variable checks

### Performance Considerations
- Image optimization configured for book covers
- Package import optimization for large libraries (@dnd-kit, lucide-react)
- Webpack fallback configuration for browser compatibility