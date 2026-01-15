# Agariki

**A privacy-focused location intelligence platform connecting fungus producers and consumers in Cameroon**

[![Next.js](https://img.shields.io/badge/Next.js-14+-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Backend-green?style=flat-square&logo=supabase)](https://supabase.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://opensource.org/licenses/MIT)

The project is deployed in the link below  
[Agariki](https://agariki.vercel.app)

For the Presentation follow the link below  
[Video 1 - 9 min](https://drive.google.com/file/d/1Hko3je7Q2u3cRAGs1cnA1l6viYvXGsl5/view?usp=sharing)

For the Cloud presentation follow the link below  
[Video 2 - 2 min](https://drive.google.com/file/d/17oOvat3j04XBzkdXfUMV2rnqJJycSG2y/view?usp=sharing)


## Table of Contents

- [Overview](#overview)
- [Academic Context](#academic-context)
- [Problem Statement](#problem-statement)
- [Solution](#solution)
  - [For Consumers](#for-consumers)
  - [For Producers](#for-producers)
  - [For the Market](#for-the-market)
- [Cloud Integration](#cloud-integration)
- [Core Concepts](#core-concepts)
  - [User Types](#user-types)
  - [Points of Activity (PoA)](#points-of-activity-poa)
  - [Privacy-First Design](#privacy-first-design)
  - [Role-Based Heatmap](#role-based-heatmap)
  - [In-App Chat System](#in-app-chat-system)
- [Application Flow](#application-flow)
- [Technology Stack](#technology-stack)
  - [Frontend](#frontend)
  - [Backend](#backend)
  - [Development Tools](#development-tools)
  - [Deployment](#deployment)
- [Design System](#design-system)
- [Getting Started](#getting-started)
- [Contributing](#contributing)
- [License](#license)

## Overview

Agariki is a location-based intelligence platform designed to solve critical information asymmetry in Cameroon's fungus sector. The platform connects fungus producers with consumers through interactive heatmaps and secure communication channels, enabling efficient market discovery while protecting user privacy.

The name "Agariki" derives from the scientific classification of mushrooms (Agaricus), reflecting our focus on the fungal industry while maintaining cultural relevance for the Cameroonian market.

## Academic Context

This project is developed as part of the **Wide Area Networks** course curriculum, demonstrating practical applications of cloud computing, distributed systems architecture, and real-time communication protocols. The project showcases:

- **Cloud-Native Architecture**: Serverless deployment leveraging modern cloud infrastructure (Vercel + Supabase)
- **Distributed Systems**: Implementing edge computing with geographic data distribution
- **Real-Time Communication**: WebSocket-based messaging system for instant user interaction
- **Geospatial Computing**: Location-based queries, heatmap generation, and spatial data processing
- **Security Engineering**: Authentication, authorization, and privacy-preserving design patterns **(nb: For the moment the design is secure but not the implementation)**
- **Database Design**: Relational data modeling with PostgreSQL and Row Level Security policies

The application addresses a real-world problem in Cameroon's agricultural technology sector, bridging theoretical networking concepts with practical cloud application development.

## Problem Statement

Cameroon's fungus sector faces a fundamental information challenge where demand consistently exceeds supply, yet no centralized mechanism exists for market participants to discover each other. This creates cascading inefficiencies across the value chain.

### For Producers

Producers operate without market visibility, leading to:

- **Inefficient Distribution**: No insight into demand concentration areas results in suboptimal routing and wasted resources
- **Missed Opportunities**: Inability to identify underserved high-demand markets limits revenue growth
- **Poor Capacity Planning**: Without demand signals, producers risk overproduction in low-demand areas while missing high-demand zones
- **Market Fragmentation**: Isolated from consumers, producers rely on inefficient informal networks

### For Consumers

Consumers struggle to locate reliable suppliers, resulting in:

- **Supply Uncertainty**: Difficulty finding consistent fungus sources in their vicinity
- **Information Search Costs**: Time and resources wasted navigating informal supply networks
- **Limited Options**: Lack of visibility into multiple supplier locations and capacities
- **Communication Barriers**: No safe mechanism to express demand or communicate with potential suppliers

### Security Concerns

Both parties face security risks in traditional direct contact methods:

- **Privacy Exposure**: Sharing phone numbers and addresses publicly creates vulnerability to fraud, theft, and harassment
- **No Vetting Mechanism**: Inability to verify legitimacy before establishing direct communication
- **Trust Deficit**: Lack of progressive trust-building creates high barriers to market entry

## Solution

Agariki addresses these challenges through a three-pillar approach: location intelligence, privacy-centric design, and secure communication.

### For Consumers

Agariki empowers consumers to:

- **Discover Producers**: View interactive heatmap showing producer locations and production capacity across regions
- **Assess Supply**: Identify high-density producer areas for reliable sourcing options
- **Express Demand**: Create Points of Delivery (PoD) indicating where they need fungus products and in what quantities
- **Communicate Safely**: Initiate conversations with producers through in-app chat without exposing personal contact information
- **Build Trust**: Verify producer legitimacy through dialogue before exchanging sensitive details
- **Manage Multiple Locations**: Create PoDs for different delivery points (home, business, etc.)

### For Producers

Agariki enables producers to:

- **Visualize Demand**: Access heatmap displaying consumer demand density and concentration areas
- **Identify High-Value Markets**: Quickly spot neighborhoods and regions with strong fungus demand
- **Optimize Distribution**: Plan efficient routes through high-demand zones to maximize coverage and minimize costs
- **Assess Capacity Needs**: View aggregate demand in target areas to inform production planning
- **Respond to Inquiries**: Engage with interested consumers through secure chat channels
- **Establish Presence**: Create Points of Presence (PoP) showing production locations and capacities
- **Expand Strategically**: Use demand data to guide market expansion decisions

### For the Market

Agariki creates systemic benefits:

- **Information Transparency**: Centralized platform aggregating supply and demand signals
- **Reduced Transaction Costs**: Eliminates time and resources spent on information search
- **Market Efficiency**: Better matching between supply and demand reduces waste
- **Trust Infrastructure**: Progressive disclosure model lowers barriers to legitimate transactions
- **Data Foundation**: Aggregate market intelligence (future analytics and forecasting)

## Cloud Integration
As the assignment is to "Use Cloud to solve a real life problem", **The Cloud is at the center of the deployment for this app**.
It is a monolith app deployed on the fully managed **Vercel Cloud Infrasctructure** and use **Supabase** for the backend.
Hence, the application uses 2 core concepts of Cloud Computing:
- **IaaS**: Cloud Infrastructures managed by Vercel and Supabase
- **PaaS**: **Severless platform** for the Next.JS app by Vercel and **Supabase Postgres** for the database by Supabase.
**nb**: It is interesting to note that Supabase is generally described as a **Backend as a Service** since it provides Database, Authentication, Storage and Edge Functions services at once.

## Core Concepts

### User Types

Agariki supports two distinct user types stored in the `user_type` database column:

**Consumers**: Individuals or businesses seeking fungus products. They create Points of Delivery (PoD) and view producer locations.

**Producers**: Farmers, cultivators, or distributors of fungus products. They create Points of Presence (PoP) and view demand density.

User type determines interface configuration, heatmap view, and available features upon login.

### Points of Activity (PoA)

Points of Activity represent the unified data structure for both producer locations and consumer delivery points. Despite serving different purposes, PoPs and PoDs share identical schema, stored in a single `points_of_activity` table.

**Structure:**
- **GPS Coordinates**: Latitude and longitude marking the activity location
- **Location Name**: Human-readable identifier (e.g., "Near Pharmacie Central")
- **Fresh Capacity**: Quantity in kilograms for fresh fungus (production or demand)
- **Dry Capacity**: Quantity in kilograms for dry fungus (production or demand)
- **Description**: Optional additional context
- **Active Status**: Whether the PoA is currently relevant

**Key Characteristics:**
- User association via `user_id` foreign key
- Semantic interpretation based on associated user type (consumer = demand, producer = supply)
- Multiple PoAs per user for different locations
- Soft-delete capability through `is_active` flag

### Privacy-First Design

Agariki protects user privacy through strategic information hiding and progressive disclosure:

**Public Landmark Strategy**: Users are encouraged to use nearby public landmarks rather than exact private addresses. Examples include "Opposite Hotel Merina," "Carrefour Bastos," or "Near Total Station." This provides sufficient location precision for business purposes while protecting against theft, stalking, or harassment.

**Information Hiding**: Phone numbers, email addresses, and other sensitive contact details remain hidden on the heatmap and in PoA details dialogs. Only business-relevant information (location, capacity, description) is publicly visible.

**Progressive Trust Model**: The in-app chat system enables users to communicate, verify legitimacy, and build mutual trust before voluntarily exchanging personal contact information. This "trust-first" approach dramatically reduces fraud risk while enabling legitimate business connections.

### Role-Based Heatmap

The heatmap serves as the primary interface for market discovery, with role-based views ensuring each user type receives actionable intelligence:

**For Producers (View Consumer PoDs)**:
- Heatmap displays demand density across geographical regions
- Color gradient indicates concentration levels (red = high demand, yellow = moderate, green = low)
- Individual markers show specific consumer delivery points
- Clicking markers reveals demand details (capacity, location name, description)
- Helps identify target neighborhoods for distribution planning

**For Consumers (View Producer PoPs)**:
- Heatmap displays supply density and producer concentration
- Visual representation of where production capacity exists
- Individual markers indicate specific producer locations
- Clicking markers shows supply details (production capacity, location)
- Enables sourcing decisions based on proximity and capacity

**Interaction Patterns**:
- **Click Marker**: Opens dialog with PoA details and "Start Chat" button
- **Long-Press Location**: Opens PoA creation dialog with pre-filled coordinates
- **Zoom/Pan**: Explore different geographical areas and zoom levels
- **Clustering**: Automatic marker grouping at different zoom levels for performance

### In-App Chat System

The chat system provides secure communication infrastructure that protects users until trust is established:

**Conversation Initiation**: Users start chats by clicking the "Start Chat" button in PoA detail dialogs. The system automatically creates or retrieves existing chat threads between users.

**Privacy Protection**: All communication occurs within the application without exposing phone numbers or email addresses. Users control when and whether to share personal contacts.

**Trust Building**: Through conversation, users can:
- Verify business legitimacy through detailed questions
- Assess reliability and professionalism
- Discuss pricing, quantities, quality expectations
- Schedule meetings at public locations
- Exchange personal contacts only when comfortable

**Security Features**:
- Real-time message delivery via WebSocket connections
- Persistent message history for reference
- Block and report functionality for suspicious accounts
- End-to-end conversation privacy

## Application Flow

### Navigation Structure

**Landing Page (`/`)**: Project presentation explaining Agariki's purpose, features, and usage instructions

**Authentication Routes**:
- `/auth/signup`: User registration with user type selection
- `/auth/login`: Authentication for existing users
- `/auth/forgot-password`: Password reset request
- `/auth/reset-password`: Password reset completion

**Application Routes** (authenticated):
- `/map`: Interactive heatmap with PoA markers (primary interface)
- `/chats`: Chat thread list and conversation view (`/chats/[threadId]` for specific threads)
- `/settings`: User profile management, PoA management, account settings

**Responsive Navigation**:
- **Mobile (< 768px)**: Bottom navigation bar with icons for Map, Chats, Settings
- **Desktop (≥ 768px)**: Collapsible left sidebar with icon/label navigation

### User Journey

**Consumer Flow**:
1. Register as consumer → Login → Land on map showing producer heatmap
2. Explore producer locations → Create PoD by long-pressing delivery location
3. Click producer marker → View details → Start chat
4. Build trust through conversation → Exchange contacts when ready
5. Manage PoDs via Settings for multiple delivery points

**Producer Flow**:
1. Register as producer → Login → Land on map showing demand heatmap
2. Analyze demand concentration → Create PoP by long-pressing production location
3. Identify high-demand zones → Plan distribution strategy
4. Respond to consumer inquiries via chat
5. Expand PoPs as business grows via Settings

## Technology Stack

### Frontend

**Core Framework**:
- **Next.js 14+**: React framework with App Router for SSR, SSG, and API routes
- **TypeScript 5.0+**: Type-safe development with strict mode enabled
- **React 18+**: Component-based UI with concurrent features

**UI & Styling**:
- **shadcn/ui**: Accessible component library built on Radix UI primitives
- **Tailwind CSS v4**: Utility-first CSS framework for rapid styling
- **Lucide React**: Comprehensive icon set with 1000+ consistent icons
- **Radix UI**: Unstyled, accessible component primitives

**State Management**:
- **Redux Toolkit**: Predictable state container with simplified API
- **Redux Persist**: Local storage persistence for offline capability
- **RTK Query**: Data fetching and caching solution

**Mapping & Geospatial**:
- **Leaflet** or **Mapbox GL JS**: Interactive map rendering and controls
- **React Leaflet** or **React Map GL**: React bindings for chosen map library
- **Leaflet.heat** or **Mapbox Heatmap Layer**: Density visualization
- **Turf.js**: Geospatial analysis and calculations (distance, clustering, etc.)

### Backend

**Infrastructure (Supabase)**:
- **Supabase Auth**: Managed JWT-based authentication with email/password
- **PostgreSQL**: Relational database with PostGIS extension for geospatial queries
- **Supabase Realtime**: WebSocket-based real-time subscriptions for chat
- **Supabase Storage**: Object storage for user-uploaded content (profile images)
- **Row Level Security (RLS)**: Database-level authorization policies

**ORM & Database**:
- **Drizzle ORM**: Type-safe, performant TypeScript ORM
- **Drizzle Kit**: Database migration and introspection tools

**API Layer**:
- **Next.js API Routes**: Serverless functions for backend logic
- **RESTful Design**: Standard HTTP methods with consistent JSON responses

### Development Tools

- **ESLint**: Code linting with TypeScript-aware rules
- **Prettier**: Automated code formatting
- **Husky**: Git hooks for pre-commit validation
- **TypeScript Compiler**: Type checking and compilation
- **pnpm**: Fast, disk-efficient package manager

### Deployment

**Frontend & API**:
- **Vercel**: Edge network deployment with automatic CI/CD from GitHub
- **Vercel Edge Functions**: Globally distributed API routes for low latency
- **Automatic Previews**: Unique URLs for pull requests and branches

**Backend Services**:
- **Supabase Cloud**: Fully managed PostgreSQL, Auth, Realtime, and Storage
- **Automatic Scaling**: Serverless infrastructure scales with demand
- **Geographic Distribution**: Data replication for global performance

## Design System

### Color Palette

Agariki uses a minimal, focused three-color palette:

- **White (`#FFFFFF`)**: Primary background color for clean, spacious interfaces
- **Black (`#000000`)**: Foreground color for text, icons, and UI elements
- **Accent (`#C6613F`)**: Brand color for CTAs, highlights, active states, and high-density heatmap areas

**Derived Colors**:
- Light gray (`#F5F5F5`): Secondary backgrounds and muted elements
- Border gray (`#E5E5E5`): Dividers and input borders
- Accent hover (`#A85434`): Darker accent for interactive states
- Accent light (`#F4E8E4`): Light accent for subtle backgrounds

### Typography & Spacing

- **Font Family**: System font stack for optimal performance and native feel
- **Spacing Scale**: 4px base unit (4, 8, 12, 16, 24, 32, 48, 64px)
- **Type Scale**: Clear hierarchy with defined sizes for headings, body, and captions

### Responsive Breakpoints

- **sm**: 640px (mobile landscape)
- **md**: 768px (tablet)
- **lg**: 1024px (desktop)
- **xl**: 1280px (large desktop)

## Getting Started

This repository contains the Agariki platform source code. To run the application locally:

1. Clone the repository
2. Install dependencies with your preferred package manager
3. Configure environment variables for Supabase connection
4. Run database migrations
5. Start the development server

Detailed setup instructions, environment configuration, and deployment guides are available in the project documentation for contributors.

## Contributing

Agariki welcomes contributions from the community. Whether you're fixing bugs, adding features, improving documentation, or suggesting enhancements, your input is valuable.

**How to Contribute**:
1. Fork the repository
2. Create a feature branch from `develop`
3. Make your changes with clear, descriptive commits
4. Submit a pull request with a detailed description

**Contribution Guidelines**:
- Follow TypeScript and React best practices
- Maintain consistent code style (ESLint + Prettier)
- Write clear commit messages using Conventional Commits format
- Add tests for new features when applicable
- Update documentation as needed

For major changes or new features, please open an issue first to discuss the proposed changes with maintainers.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for complete details.

---


*Agariki - Connecting supply with demand through location intelligence and secure communication*

**Academic Project**: Wide Area Networks Course | Cloud Computing Application


For questions or support, please open an issue on GitHub.
