# Agariki

**A demand mapping and distribution optimization platform for the fungus sector in Cameroon**

## Table of Contents

- [Overview](#overview)
- [Problem Statement](#problem-statement)
- [Solution](#solution)
- [Key Features](#key-features)
- [Technology Stack](#technology-stack)
- [System Architecture](#system-architecture)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
  - [Running the Application](#running-the-application)
- [Project Structure](#project-structure)
- [Database Schema](#database-schema)
- [User Roles and Workflows](#user-roles-and-workflows)
  - [Consumer Workflow](#consumer-workflow)
  - [Producer Workflow](#producer-workflow)
- [Core Functionalities](#core-functionalities)
  - [Demand Registration](#demand-registration)
  - [Demand Mapping and Visualization](#demand-mapping-and-visualization)
  - [Distribution Circuit Planning](#distribution-circuit-planning)
  - [Producer Dashboard](#producer-dashboard)
- [API Routes](#api-routes)
- [Authentication and Authorization](#authentication-and-authorization)
- [Deployment](#deployment)
  - [Vercel Deployment](#vercel-deployment)
  - [Supabase Setup](#supabase-setup)
- [Development Guidelines](#development-guidelines)
  - [Code Style](#code-style)
  - [Git Workflow](#git-workflow)
  - [Testing](#testing)
- [Contributing](#contributing)
- [Roadmap](#roadmap)
- [License](#license)
- [Contact and Support](#contact-and-support)

## Overview

Agariki is a specialized web application designed to bridge the information gap in Cameroon's fungus sector. The platform serves as a centralized information hub that connects fungus consumers with producers by enabling demand registration and providing producers with visual demand mapping tools to optimize their distribution strategies.

The name "Agariki" is derived from the scientific classification of mushrooms (Agaricus), reflecting our focus on the fungus industry while maintaining a memorable and culturally relevant identity for the Cameroonian market.

## Problem Statement

Cameroon's fungus sector faces a critical challenge: demand significantly exceeds supply, yet there is no centralized mechanism for producers to understand where demand is concentrated. This information asymmetry leads to several issues:

1. **Inefficient Distribution**: Producers lack visibility into demand hotspots, resulting in suboptimal distribution routes and wasted resources
2. **Unmet Consumer Demand**: Consumers in high-demand areas struggle to access fungus products consistently
3. **Market Fragmentation**: Without a unified platform, both consumers and producers operate in silos, leading to market inefficiencies
4. **Lost Revenue Opportunities**: Producers miss opportunities to expand into underserved markets due to lack of demand data
5. **Supply Chain Gaps**: The absence of demand mapping prevents effective supply chain planning and inventory management

These challenges stem from a fundamental lack of information infrastructure in the sector, not from a lack of interest or market potential.

## Solution

Agariki addresses these challenges by providing a simple yet powerful platform that:

- **For Consumers**: Enables easy registration of fungus demand, including preferred types, quantities, and locations
- **For Producers**: Provides comprehensive demand mapping and visualization tools to identify high-demand zones
- **For the Sector**: Creates a centralized information repository that brings transparency and efficiency to the fungus market

The platform focuses exclusively on information aggregation and visualization—it is not an e-commerce platform, educational resource, or marketplace. Its singular purpose is to create transparency around demand patterns to enable better distribution planning.

## Key Features

### Consumer-Facing Features
- **Demand Registration Form**: Simple, intuitive interface for consumers to register their fungus demand
- **Location Specification**: GPS-based or manual location entry to ensure accurate demand mapping
- **Quantity and Type Selection**: Specify fungus varieties and desired quantities
- **Demand History**: View past demand registrations for personal tracking

### Producer-Facing Features
- **Interactive Demand Map**: Visual representation of demand concentration across regions
- **Demand Analytics Dashboard**: Aggregate statistics on demand patterns, trends, and growth
- **High-Demand Zone Identification**: Algorithmic identification of areas with concentrated demand
- **Distribution Circuit Planner**: Tools to plan optimized delivery routes based on demand density
- **Demand Filtering**: Filter demand data by fungus type, quantity, date range, and location
- **Export Capabilities**: Download demand data and maps for offline analysis

### Administrative Features
- **User Management**: Basic authentication and role-based access control
- **Data Validation**: Ensures quality and accuracy of demand registrations
- **Platform Analytics**: Monitor platform usage and adoption metrics

## Technology Stack

Agariki is built using modern, scalable technologies optimized for rapid development and reliable performance:

### Frontend
- **Next.js 14+**: React framework with App Router for server-side rendering and optimal performance
- **React 18+**: Component-based UI library
- **TypeScript**: Type-safe development for reduced bugs and better developer experience
- **Tailwind CSS**: Utility-first CSS framework for responsive design
- **Leaflet / Mapbox GL JS**: Interactive mapping libraries for demand visualization
- **Recharts / Chart.js**: Data visualization for analytics dashboards
- **React Hook Form**: Form state management and validation
- **Zod**: Schema validation for form inputs and API responses

### Backend
- **Next.js API Routes**: Serverless API endpoints
- **Supabase**: Backend-as-a-Service providing:
  - **PostgreSQL Database**: Relational database for structured data
  - **Authentication**: Built-in auth with social providers and email/password
  - **Row Level Security (RLS)**: Database-level security policies
  - **Real-time Subscriptions**: Live data updates for collaborative features
  - **Storage**: File storage for user uploads (if needed in future)

### Development Tools
- **ESLint**: Code linting for consistent code quality
- **Prettier**: Code formatting
- **Husky**: Git hooks for pre-commit checks
- **pnpm / npm / yarn**: Package management

### Deployment & Infrastructure
- **Vercel**: Frontend and API hosting with automatic deployments
- **Supabase Cloud**: Managed database and backend services
- **GitHub Actions**: CI/CD pipeline for automated testing and deployment

## System Architecture

Agariki follows a modern, serverless architecture pattern:

```
┌─────────────────────────────────────────────────────────┐
│                     Client Browser                       │
│                    (Next.js Frontend)                    │
└─────────────────────┬───────────────────────────────────┘
                      │
                      │ HTTPS
                      │
┌─────────────────────▼───────────────────────────────────┐
│                  Vercel Edge Network                     │
│              (Static Assets + SSR/SSG)                   │
└─────────────────────┬───────────────────────────────────┘
                      │
                      │ API Calls
                      │
┌─────────────────────▼───────────────────────────────────┐
│              Next.js API Routes (Serverless)             │
│            (Business Logic + Data Processing)            │
└─────────────────────┬───────────────────────────────────┘
                      │
                      │ REST / GraphQL
                      │
┌─────────────────────▼───────────────────────────────────┐
│                    Supabase Backend                      │
│  ┌──────────────────────────────────────────────────┐   │
│  │          PostgreSQL Database                     │   │
│  │  - Users Table                                   │   │
│  │  - Demands Table                                 │   │
│  │  - Producers Table                               │   │
│  │  - Distribution_Circuits Table                   │   │
│  └──────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────┐   │
│  │          Authentication Service                  │   │
│  └──────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────┐   │
│  │          Real-time Subscriptions                 │   │
│  └──────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────┘
```

**Data Flow:**

1. User interacts with Next.js frontend
2. Frontend makes authenticated requests to Next.js API routes
3. API routes validate requests and interact with Supabase
4. Supabase applies Row Level Security policies
5. Database operations are performed
6. Response data flows back through the stack to the client

## Getting Started

### Prerequisites

Before setting up Agariki locally, ensure you have the following installed:

- **Node.js**: Version 18.x or higher
- **Package Manager**: npm, yarn, or pnpm
- **Git**: For version control
- **Supabase Account**: Create a free account at [supabase.com](https://supabase.com)
- **Code Editor**: VS Code recommended with ESLint and Prettier extensions

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/yourusername/agariki.git
cd agariki
```

2. **Install dependencies**

```bash
npm install
# or
pnpm install
# or
yarn install
```

3. **Set up Supabase**

- Create a new project in your Supabase dashboard
- Note your project URL and anon key
- Run the database migrations (see [Database Schema](#database-schema))

### Environment Variables

Create a `.env.local` file in the root directory:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Application Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Map Configuration (if using Mapbox)
NEXT_PUBLIC_MAPBOX_TOKEN=your_mapbox_token

# Optional: Analytics
NEXT_PUBLIC_ANALYTICS_ID=your_analytics_id
```

**Important**: Never commit `.env.local` to version control. Add it to `.gitignore`.

### Running the Application

**Development Mode:**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

**Production Build:**

```bash
npm run build
npm start
```

**Linting:**

```bash
npm run lint
```

**Type Checking:**

```bash
npm run type-check
```

## Project Structure

```
agariki/
├── public/                    # Static assets
│   ├── icons/
│   ├── images/
│   └── favicon.ico
├── src/
│   ├── app/                   # Next.js App Router
│   │   ├── (auth)/            # Auth route group
│   │   │   ├── login/
│   │   │   └── register/
│   │   ├── (consumer)/        # Consumer route group
│   │   │   ├── dashboard/
│   │   │   └── demand/
│   │   ├── (producer)/        # Producer route group
│   │   │   ├── dashboard/
│   │   │   ├── map/
│   │   │   └── circuits/
│   │   ├── api/               # API routes
│   │   │   ├── demands/
│   │   │   ├── producers/
│   │   │   └── auth/
│   │   ├── layout.tsx         # Root layout
│   │   └── page.tsx           # Home page
│   ├── components/            # Reusable components
│   │   ├── ui/                # Base UI components
│   │   ├── forms/             # Form components
│   │   ├── maps/              # Map components
│   │   └── dashboards/        # Dashboard components
│   ├── lib/                   # Utility functions
│   │   ├── supabase/          # Supabase client config
│   │   ├── utils.ts
│   │   └── constants.ts
│   ├── types/                 # TypeScript types
│   │   ├── database.ts
│   │   ├── demand.ts
│   │   └── producer.ts
│   ├── hooks/                 # Custom React hooks
│   │   ├── useDemands.ts
│   │   └── useAuth.ts
│   └── middleware.ts          # Next.js middleware
├── supabase/
│   ├── migrations/            # Database migrations
│   └── seed.sql               # Seed data
├── .env.local                 # Environment variables
├── .eslintrc.json             # ESLint configuration
├── .gitignore
├── next.config.js             # Next.js configuration
├── package.json
├── tsconfig.json              # TypeScript configuration
├── tailwind.config.ts         # Tailwind configuration
└── README.md
```

## Database Schema

The Agariki database consists of the following core tables:

### Users Table

Managed by Supabase Auth, extended with custom fields:

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  email TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('consumer', 'producer', 'admin')),
  full_name TEXT,
  phone_number TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Demands Table

Stores consumer demand registrations:

```sql
CREATE TABLE demands (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  consumer_id UUID REFERENCES users(id) ON DELETE CASCADE,
  fungus_type TEXT NOT NULL,
  quantity DECIMAL(10, 2) NOT NULL,
  unit TEXT NOT NULL,
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  location_name TEXT,
  region TEXT,
  city TEXT,
  notes TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'fulfilled', 'expired')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_demands_location ON demands(latitude, longitude);
CREATE INDEX idx_demands_consumer ON demands(consumer_id);
CREATE INDEX idx_demands_status ON demands(status);
CREATE INDEX idx_demands_created_at ON demands(created_at);
```

### Producers Table

Stores producer-specific information:

```sql
CREATE TABLE producers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  business_name TEXT NOT NULL,
  production_capacity DECIMAL(10, 2),
  production_types TEXT[],
  base_location_lat DECIMAL(10, 8),
  base_location_lng DECIMAL(11, 8),
  service_regions TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Distribution Circuits Table

Stores planned distribution routes:

```sql
CREATE TABLE distribution_circuits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  producer_id UUID REFERENCES producers(id) ON DELETE CASCADE,
  circuit_name TEXT NOT NULL,
  route_points JSONB NOT NULL,
  estimated_demand DECIMAL(10, 2),
  covered_demands UUID[],
  status TEXT DEFAULT 'planned' CHECK (status IN ('planned', 'active', 'completed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Row Level Security Policies

```sql
-- Consumers can only view and create their own demands
ALTER TABLE demands ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Consumers can view own demands"
  ON demands FOR SELECT
  USING (auth.uid() = consumer_id);

CREATE POLICY "Consumers can create demands"
  ON demands FOR INSERT
  WITH CHECK (auth.uid() = consumer_id);

-- Producers can view all active demands
CREATE POLICY "Producers can view all demands"
  ON demands FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid() AND users.role = 'producer'
    )
  );

-- Producers can manage their own circuits
ALTER TABLE distribution_circuits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Producers manage own circuits"
  ON distribution_circuits FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM producers
      WHERE producers.id = producer_id AND producers.user_id = auth.uid()
    )
  );
```

## User Roles and Workflows

### Consumer Workflow

1. **Registration**: Consumer creates an account with email/password
2. **Profile Setup**: Provides name, phone number, and default location
3. **Demand Registration**:
   - Selects fungus type from predefined list
   - Specifies quantity and unit
   - Confirms or adjusts location on map
   - Adds optional notes about preferences
   - Submits demand
4. **Demand Tracking**: Views submitted demands and their status
5. **Updates**: Modifies or cancels active demands as needed

### Producer Workflow

1. **Registration**: Producer creates account and selects producer role
2. **Business Profile**: Completes producer-specific information
3. **Demand Exploration**:
   - Views interactive map with demand heatmap overlay
   - Filters demands by type, quantity, location, and date
   - Analyzes demand concentration patterns
4. **Circuit Planning**:
   - Identifies high-demand zones
   - Creates distribution circuit by selecting demand points
   - Views route optimization suggestions
   - Saves circuit for future reference
5. **Analytics Review**: Monitors demand trends and market opportunities

## Core Functionalities

### Demand Registration

The demand registration system allows consumers to easily communicate their fungus requirements:

- **Form Validation**: Client-side and server-side validation using Zod schemas
- **Location Services**: Integration with browser Geolocation API and map picker
- **Fungus Type Selection**: Dropdown with common varieties (oyster, shiitake, button, etc.)
- **Quantity Input**: Flexible unit selection (kg, pieces, baskets)
- **Duplicate Prevention**: Warns users if similar demand already exists

### Demand Mapping and Visualization

The core value proposition for producers:

- **Interactive Map**: Pan, zoom, and click on individual demand points
- **Heatmap Layer**: Visual representation of demand density
- **Clustering**: Automatic grouping of nearby demands at different zoom levels
- **Info Windows**: Detailed demand information on marker click
- **Layer Controls**: Toggle between different visualization modes

### Distribution Circuit Planning

Tools to optimize delivery routes:

- **Route Selection**: Click-to-add demands to circuit
- **Distance Calculation**: Automatic route distance computation
- **Demand Aggregation**: Total quantity calculation for circuit
- **Route Optimization**: Suggest optimal visit order (future enhancement)
- **Circuit Saving**: Persist circuits for reuse and modification

### Producer Dashboard

Comprehensive analytics and insights:

- **Demand Statistics**: Total demands, growth trends, regional breakdown
- **Fungus Type Analysis**: Most requested varieties
- **Temporal Patterns**: Demand variations by time period
- **Geographic Distribution**: Demand concentration by region
- **Circuit Performance**: Tracking of planned and completed circuits

## API Routes

### Authentication Endpoints

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/session` - Get current session

### Demand Endpoints

- `GET /api/demands` - List all demands (with filters)
- `GET /api/demands/:id` - Get single demand
- `POST /api/demands` - Create new demand
- `PATCH /api/demands/:id` - Update demand
- `DELETE /api/demands/:id` - Delete demand
- `GET /api/demands/map` - Get demand data for map visualization

### Producer Endpoints

- `GET /api/producers/:id` - Get producer profile
- `PATCH /api/producers/:id` - Update producer profile
- `GET /api/producers/:id/analytics` - Get producer analytics

### Circuit Endpoints

- `GET /api/circuits` - List producer's circuits
- `POST /api/circuits` - Create new circuit
- `GET /api/circuits/:id` - Get circuit details
- `PATCH /api/circuits/:id` - Update circuit
- `DELETE /api/circuits/:id` - Delete circuit

## Authentication and Authorization

Agariki uses Supabase Auth with the following configuration:

- **Email/Password Authentication**: Primary method
- **Social Providers**: Optional (Google, Facebook) for future enhancement
- **JWT Tokens**: Secure, stateless authentication
- **Role-Based Access**: Consumer, Producer, and Admin roles
- **Row Level Security**: Database-level authorization
- **Session Management**: Automatic token refresh

**Middleware Protection:**

Routes are protected using Next.js middleware that checks authentication status and user roles before allowing access to protected pages.

## Deployment

### Vercel Deployment

1. **Connect Repository**: Link GitHub repo to Vercel
2. **Configure Environment Variables**: Add all env vars from `.env.local`
3. **Deploy**: Automatic deployment on push to main branch

```bash
# Manual deployment
npm run build
vercel --prod
```

### Supabase Setup

1. **Create Project**: New project in Supabase dashboard
2. **Run Migrations**: Execute SQL migrations in Supabase SQL editor
3. **Configure Auth**: Set up auth providers and email templates
4. **Set Environment Variables**: Copy credentials to Vercel

## Development Guidelines

### Code Style

- Use TypeScript for all new code
- Follow ESLint and Prettier configurations
- Use functional components with hooks
- Implement proper error handling
- Write descriptive commit messages

### Git Workflow

- `main`: Production-ready code
- `develop`: Development branch
- Feature branches: `feature/feature-name`
- Bug fixes: `fix/bug-description`

```bash
# Create feature branch
git checkout -b feature/demand-filtering

# Commit changes
git commit -m "feat: add demand filtering by fungus type"

# Push and create PR
git push origin feature/demand-filtering
```

### Testing

While comprehensive testing is a future enhancement, current best practices:

- Manual testing of all user flows
- Cross-browser testing (Chrome, Firefox, Safari)
- Mobile responsiveness testing
- API endpoint testing with Postman

## Contributing

We welcome contributions to Agariki! To contribute:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Write clear commit messages
5. Submit a pull request
6. Ensure CI checks pass

For major changes, please open an issue first to discuss proposed changes.

## Roadmap

### Phase 1 (Current)
- ✅ Basic demand registration
- ✅ Interactive demand map
- ✅ Producer dashboard
- ✅ Distribution circuit planning

### Phase 2 (Next Quarter)
- 🔄 SMS notifications for producers
- 🔄 Advanced analytics and reporting
- 🔄 Export functionality (PDF, CSV)
- 🔄 Mobile-responsive optimization

### Phase 3 (Future)
- 📋 Route optimization algorithms
- 📋 Multi-language support (French, English)
- 📋 Producer-consumer messaging
- 📋 Demand forecasting
- 📋 Integration with payment systems (if scope expands)

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Contact and Support

For questions, issues, or suggestions:

- **Email**: support@agariki.cm
- **GitHub Issues**: [github.com/yourusername/agariki/issues](https://github.com/yourusername/agariki/issues)
- **Documentation**: [docs.agariki.cm](https://docs.agariki.cm)

---

**Built with ❤️ for Cameroon's fungus sector**

*Agariki - Connecting demand with supply through information transparency*
