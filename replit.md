# Kerala Economic Forum Website

## Overview

Kerala Economic Forum (KEF) is a statewide non-profit website that empowers entrepreneurs, startups, students, and institutions across Kerala. The platform provides information about programs, events, membership opportunities, and partnerships while facilitating contact and engagement with the entrepreneurial ecosystem.

This is a modern full-stack web application built with React (frontend) and Express (backend), featuring a component-based UI architecture with shadcn/ui components, form handling, and database integration for managing contact submissions and membership applications.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Build System**
- React 18+ with TypeScript for type-safe component development
- Vite as the build tool and development server with HMR (Hot Module Replacement)
- Wouter for client-side routing (lightweight alternative to React Router)
- Single Page Application (SPA) architecture with client-side routing

**UI Component System**
- shadcn/ui component library (Radix UI primitives) for accessible, customizable components
- Tailwind CSS for utility-first styling with custom design tokens
- Custom design system based on Kerala Economic Forum brand guidelines (modern startup aesthetic)
- Framer Motion for animations and transitions
- Component structure: reusable UI components in `/client/src/components/ui/` and custom composed components in `/client/src/components/`

**State Management & Data Fetching**
- TanStack Query (React Query) for server state management, caching, and API calls
- React Hook Form with Zod resolvers for form validation
- Context API for theme management (light/dark mode)

**Design Principles**
- Bold typography using Inter and Space Grotesk fonts
- Gradient-heavy design (purple-to-blue, teal-to-indigo spectra)
- Card-based layouts with hover effects and shadows
- Responsive grid systems (3-column desktop, 2-column tablet, single-column mobile)
- Modern spacing using Tailwind's spacing scale (multiples of 4)

### Backend Architecture

**Server Framework**
- Express.js for HTTP server and API routing
- Node.js runtime with ES modules (type: "module")
- Custom middleware for logging, JSON parsing, and request tracking

**API Design**
- RESTful API endpoints under `/api/` prefix
- Routes defined in `/server/routes.ts`:
  - POST `/api/contact` - Submit contact form
  - GET `/api/contact` - Retrieve contact submissions
  - POST `/api/membership` - Submit membership application
  - GET `/api/membership` - Retrieve membership applications
- Schema validation using Zod with detailed error messages via zod-validation-error

**Data Layer Abstraction**
- Storage interface pattern (`IStorage`) for data operations
- Database-backed implementation (`DatabaseStorage`) for production data persistence
- PostgreSQL database with Drizzle ORM for all data operations

### Data Storage Solution

**Database Configuration**
- Drizzle ORM configured for PostgreSQL via Neon serverless driver
- Schema defined in `/shared/schema.ts` with main tables:
  - `users` - User authentication (username/password)
  - `contact_submissions` - Contact form submissions
  - `membership_applications` - Membership applications with status tracking
  - `bootcamp_registrations` - Startup Boot Camp registration data
  - `programs` - Dynamic programs management (title, description, icon, gradient, banner image, features, active status, eventDate, venue, feeLabel, feeAmount, earlyBirdOffer)
  - `partners` - Partner organizations (name, logo, website, priority order, active status)
- Zod schemas derived from Drizzle tables for runtime validation
- Migration system configured via `drizzle-kit` (migrations output to `/migrations/`)

## Recent Changes (December 2025)

### Programs Enhancement
- Programs now open in full-screen detail pages instead of modals
- Added banner image support for programs (displays as hero background on detail page)
- Added features field to programs (comma-separated list displayed as badges)
- Programs fetched dynamically from database via API
- Added new program metadata fields: eventDate, venue, feeLabel, feeAmount, earlyBirdOffer
- Admin panel updated with form inputs for editing program event details
- Programs display page shows date, venue, and fee information prominently when available

### Partner Management
- Added complete partner management infrastructure
- Partners table in database with name, logo URL, website, priority order, active status
- Admin panel includes Partners tab for CRUD operations
- Partners API endpoints: GET/POST/PATCH/DELETE under `/api/admin/partners`

### Navigation Updates
- Reorganized navigation: Home, Programs, Membership, Partners, About Us, Contact
- Programs link to individual detail pages (/programs/:id)

### Image Upload System (December 2025)
- Converted admin panel from URL-based image inputs to file uploads
- File upload endpoint at `/api/admin/upload` with admin authentication
- Supported formats: JPG, PNG, GIF, WebP (SVG disabled for security)
- Max file size: 10MB
- Files stored in `public/uploads/` directory
- ImageUpload component with drag-and-drop, preview, and progress indicator
- Works for popup banners, program banners, and partner logos

**Production Database**
- Application uses PostgreSQL database for all data persistence
- Database connection via `DATABASE_URL` environment variable

### Build & Deployment

**Development Mode**
- Vite dev server with middleware mode integrated into Express
- HMR enabled through `/vite-hmr` WebSocket path
- Development-only Replit plugins (cartographer, dev-banner, runtime error overlay)

**Production Build**
- Two-stage build process (`script/build.ts`):
  1. Vite builds client to `/dist/public/`
  2. esbuild bundles server with selective dependency bundling
- Server dependencies bundled into single CJS file to reduce cold start times
- Static file serving from `/dist/public/` with SPA fallback to `index.html`

**Optimization Strategy**
- Allowlist of frequently-used dependencies bundled with server (Drizzle, Neon, etc.)
- External dependencies excluded from bundle to reduce size
- Source maps supported for debugging

## External Dependencies

### Database & ORM
- **Neon Serverless PostgreSQL** (`@neondatabase/serverless`) - Serverless Postgres driver
- **Drizzle ORM** (`drizzle-orm`) - TypeScript ORM for database operations
- **drizzle-zod** - Automatic Zod schema generation from Drizzle tables
- **connect-pg-simple** - PostgreSQL session store (configured but not actively used)

### UI Component Libraries
- **Radix UI** - Headless component primitives for accessibility (accordion, dialog, dropdown, etc.)
- **shadcn/ui** - Pre-styled components built on Radix UI
- **Framer Motion** - Animation library for smooth transitions
- **Lucide React** - Icon library
- **embla-carousel-react** - Carousel/slider component

### Form & Validation
- **React Hook Form** - Form state management and validation
- **@hookform/resolvers** - Validation schema resolvers
- **Zod** - TypeScript-first schema validation
- **zod-validation-error** - Human-readable Zod error formatting

### Styling & Theming
- **Tailwind CSS** - Utility-first CSS framework
- **tailwind-merge** & **clsx** - Conditional class name utilities
- **class-variance-authority** - Type-safe variant styling

### Development Tools
- **TypeScript** - Static type checking
- **Vite** - Fast development server and build tool
- **tsx** - TypeScript execution for Node.js
- **esbuild** - Fast JavaScript bundler for production builds
- **Replit-specific plugins** - Development experience enhancements for Replit environment

### Date & Utilities
- **date-fns** - Date manipulation and formatting
- **nanoid** - Unique ID generation
- **cmdk** - Command palette component

### Email Integration (ACTIVE - December 2025)

**Email System Configuration:**
- **Provider**: Gmail via Nodemailer
- **Recipient**: All notifications sent to `keralaeconomicforum@gmail.com`
- **Implementation**: `server/email.ts`

**Required Environment Variables (MUST BE SET):**
- `EMAIL_USER` - Gmail address used to send emails
- `EMAIL_PASS` - Gmail App Password (NOT regular password)
  - To create App Password: Google Account → Security → 2-Step Verification → App Passwords → Create new

**Email Triggers:**
1. **Bootcamp Registration** (`sendBootcampRegistrationEmail`)
   - Triggered when user submits registration form at `/register`
   - Includes: Name, email, phone, age, organization, district, experience, expectations, timestamps
   
2. **Membership Application** (`sendMembershipApplicationEmail`)
   - Triggered when user submits membership form
   - Includes: Name, email, phone, membership type, interests, organization, designation
   
3. **Contact Form** (`sendContactFormEmail`)
   - Triggered when user submits contact form
   - Includes: Name, email, phone, subject, message

**Email Format:**
- Professional HTML templates with Kerala Economic Forum branding
- Red-orange gradient headers matching website theme
- Timestamps in Indian timezone (Asia/Kolkata)

**Troubleshooting:**
- If emails not sending, check server logs for "Email sent successfully" or error messages
- Verify EMAIL_USER and EMAIL_PASS are correctly set in Replit Secrets
- Gmail may require "Less secure app access" or App Password for authentication

### RBI Compliance Policy Pages (December 2025)

**Required for PhonePe Merchant Account Setup:**
- `/terms` - Terms and Conditions
- `/privacy` - Privacy Policy
- `/refund-policy` - Refund Policy

**Policy Page Content:**
- Terms: Services, eligibility, payment terms, program participation, intellectual property, liability
- Privacy: Data collection, storage, security, sharing, user rights, cookies, children's privacy
- Refund: Cancellation windows (100%/50%/0% based on timing), refund processing, transfer policy

**Footer Integration:**
- Legal section added with links to all three policy pages
- URLs ready for PhonePe merchant account configuration