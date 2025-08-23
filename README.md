# TBR Manager

A visual, interactive book management system designed to organize and track reading lists with a beautiful cork board aesthetic and intuitive drag-and-drop functionality.

## Features

- **Cork Board Interface**: Visual grid where book covers are "pinned" like notes
- **Drag & Drop**: Mouse-based drag and drop to easily reorder book covers
- **Multiple Shelves**: Support for different TBR categories and custom shelves
- **Smart Organization**: Multiple view modes and flexible organization
- **Book Search**: Integration with Google Books API for easy book discovery
- **Mobile Responsive**: Touch-friendly interface optimized for all devices

## Tech Stack

- **Framework**: Next.js 15+ with App Router
- **Language**: TypeScript with strict mode
- **Styling**: Tailwind CSS
- **Database**: Supabase
- **Drag & Drop**: @dnd-kit
- **State Management**: Zustand + React Query
- **Animation**: Framer Motion
- **UI Components**: Radix UI primitives

## Development Setup

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd tbr-manager

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your Supabase credentials

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm run start` - Start production server  
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking
- `npm run test` - Run Jest tests
- `npm run format` - Format code with Prettier

## Project Structure

```
src/
├── app/                 # Next.js App Router pages
│   ├── dashboard/       # Main dashboard interface
│   ├── auth/           # Authentication pages
│   └── api/            # API routes
├── components/          # React components
│   ├── ui/             # Reusable UI components
│   └── features/       # Feature-specific components
├── lib/                # Utilities and configurations
├── hooks/              # Custom React hooks
├── stores/             # Zustand stores
├── types/              # TypeScript type definitions
└── constants/          # App constants
```

## Environment Variables

Create a `.env.local` file with:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
GOOGLE_BOOKS_API_KEY=your_google_books_key
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run tests and linting (`npm run test && npm run lint`)
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.