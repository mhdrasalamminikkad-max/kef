# Kerala Economic Forum - Session State

## Last Updated: December 13, 2025

## Current Status
All changes complete and working:

### Recent Changes Made
1. **Popup Modal** (`client/src/components/bootcamp-modal.tsx`)
   - Registration enabled (`REGISTRATION_OPEN = true`)
   - "Register Now" button redirects to https://keralastartupfest.com

2. **Boot Camp Registration Page** (`client/src/pages/register.tsx`)
   - Added `BOOTCAMP_REDIRECT_URL = "https://keralastartupfest.com"`
   - When URL is set, shows redirect card instead of registration form
   - Clicking "Register Now" redirects to external site

3. **Breaking News Ticker** (`client/src/components/breaking-news.tsx`)
   - Updated text to "Kerala Startup Fest 2026 - First of Its Kind in the State | January 7-8, 2026 | Kozhikode Beach | Register Now!"
   - All buttons redirect to https://keralastartupfest.com

## Key Configuration Files
- `client/src/components/bootcamp-modal.tsx` - Popup modal settings (REGISTRATION_OPEN flag)
- `client/src/pages/register.tsx` - Boot camp registration (BOOTCAMP_REDIRECT_URL)
- `client/src/components/breaking-news.tsx` - Ticker content and links

## How to Toggle Registration
- To enable Boot Camp registration form: Set `BOOTCAMP_REDIRECT_URL = ""` in register.tsx
- To change popup to "Coming Soon": Set `REGISTRATION_OPEN = false` in bootcamp-modal.tsx

## Database
- Using Replit's built-in PostgreSQL database
- All migrations applied successfully

## Workflow
- "Start application" runs `npm run dev` on port 5000
- Application is running and accessible
