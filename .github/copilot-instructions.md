<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# Quiz App - Copilot Instructions

This is a production-ready lead-magnet quiz web app built with Next.js 14, TypeScript, Tailwind CSS, Supabase, and Resend.

## Architecture & Patterns

- **Next.js 14** with App Router (not Pages Router)
- **TypeScript** for all code - no JavaScript files
- **Tailwind CSS v4** with custom CSS properties for colors
- **Server Components** by default, use 'use client' only when needed
- **Server-only database access** - no client-side Supabase queries
- **API Routes** in `/app/api/` for all backend logic

## Color System

Use CSS custom properties defined in `globals.css`:
- `var(--primary)` - #b47775 (main brand color)
- `var(--accent)` - #c48c72 (secondary actions)
- `var(--background)` - #e3dbd6 (page background)
- `var(--card)` - #ede8e5 (content cards)
- `var(--text)` - #43362d (primary text)
- `var(--text-light)` - #f7f5f4 (light text)

## Database Schema

The app uses Supabase with these main tables:
- `quizzes` - Quiz definitions
- `questions` - Quiz questions with position ordering
- `options` - Answer choices that map to result keys (A/B/C/D)
- `results` - Persona definitions with email templates
- `submissions` - User submissions with metadata
- `answers` - Individual question answers

## Code Style

- Use proper TypeScript interfaces for all data structures
- Server components for data fetching, client components for interactivity
- Validate all inputs with Zod schemas
- Use the majority calculation logic in `lib/majority.ts`
- Follow the existing file structure and naming conventions
- Include proper error handling and loading states
- Make components mobile-first and accessible

## Key Files

- `lib/supabase.ts` - Server-only database client
- `lib/majority.ts` - Quiz result calculation logic
- `lib/email.ts` - Email sending functionality
- `app/api/submit/route.ts` - Quiz submission API
- `components/QuizForm.tsx` - Main quiz component
- `supabase/migrations/` - Database schema
- `supabase/seed.sql` - Sample data

## Environment Variables

Required environment variables:
- `SUPABASE_URL` - Supabase project URL
- `SUPABASE_SERVICE_ROLE` - Service role key (server-only)
- `RESEND_API_KEY` - Resend API key for emails
- `RESEND_FROM` - Email sender address
- `NEXT_PUBLIC_SITE_URL` - Public site URL

When writing code, prioritize type safety, performance, and maintainability. Follow the existing patterns and conventions established in the codebase.
