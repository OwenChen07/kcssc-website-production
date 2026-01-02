# KCCSC Website

The official website for the Kanata Chinese Seniors Support Centre, built with modern web technologies.

## Tech Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui (Radix UI)
- **Routing**: React Router v6
- **Database**: Supabase (PostgreSQL)
- **State Management**: TanStack Query
- **Backend**: Express.js (optional - can run as static site)

## Getting Started

### Prerequisites

- Node.js 18+ and npm (install with [nvm](https://github.com/nvm-sh/nvm))
- PostgreSQL (if running with database features)

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd kccsc-website-deploy

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration
```

### Development

```bash
# Run frontend only (uses Supabase client or mock data)
npm run dev

# Run both frontend and backend (legacy mode)
npm run dev:all

# Run backend server only (legacy mode)
npm run server:dev
```

The frontend will be available at `http://localhost:8080`

**Note**: The site can now run as a static site using Supabase directly (no server required). See [SETUP_SUPABASE.md](SETUP_SUPABASE.md) for setup instructions.

### Database Setup

```bash
# Initialize database
npm run db:init

# Seed with sample data
npm run db:seed

# Migrate photos (if needed)
npm run db:migrate-photos
```

See [DATABASE_INTEGRATION.md](DATABASE_INTEGRATION.md) for detailed database documentation.

## Building for Production

```bash
# Build frontend
npm run build

# Build folder will be created at ./dist

# Build backend
npm run server:build

# Start production server
npm run server:start:prod
```

## Project Structure

```
├── src/                    # Frontend source code
│   ├── components/        # React components
│   ├── pages/            # Page components
│   ├── lib/              # Utilities and services
│   └── hooks/            # Custom React hooks
├── server/                # Backend source code
│   ├── routes/           # API routes
│   └── db/               # Database scripts
├── public/               # Static assets
└── dist/                 # Production build output
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run dev:all` - Start both frontend and backend
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run server:dev` - Start backend in development mode
- `npm run server:start` - Start backend server
- `npm run db:init` - Initialize database
- `npm run db:seed` - Seed database with sample data

## Documentation

- **[Quick Setup with Supabase](SETUP_SUPABASE.md)** ⭐ - Get started in 5 minutes
- [Supabase Client Migration Guide](SUPABASE_CLIENT_MIGRATION.md) - Detailed migration instructions
- [Setup Guide](SETUP.md) - Legacy setup with Express server
- [Database Integration](DATABASE_INTEGRATION.md)
- [Supabase Setup](SUPABASE_SETUP.md) - Legacy server-based Supabase setup
- [Supabase Quickstart](SUPABASE_QUICKSTART.md)
- [Troubleshooting](SUPABASE_TROUBLESHOOTING.md)

## License

© 2025 Korean Community Center of the South Coast. All rights reserved.
