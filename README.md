# Quiz App - Digital Nomad Type Assessment

A production-ready lead-magnet quiz web app built with Next.js 14, TypeScript, Tailwind CSS, Supabase, and Resend.

## Features

- **Lead Generation**: Collect emails and classify users into personas based on quiz answers
- **Mobile-First Design**: Responsive UI with custom Co404 color palette  
- **Email Integration**: Automatic result emails via Resend with customizable templates
- **Database**: Supabase Postgres with proper schema, migrations, and indexing
- **Analytics**: Basic tracking with IP hashing, user agent, and referrer logging
- **Rate Limiting**: 5 submissions per hour per IP address for spam protection
- **Embeddable**: Iframe-friendly embed version for external websites
- **Testing**: Unit tests with Vitest and E2E tests with Playwright
- **SEO-Friendly**: Server-side rendered with proper meta tags

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Set up Supabase

First, make sure you have the Supabase CLI installed:
```bash
npx supabase --version
```

If not installed, install it:
```bash
npm install -g supabase
```

Then start the local Supabase stack:
```bash
npm run db:start
```

Apply the database migrations:
```bash
npm run db:push
```

Seed the database with sample quiz data:
```bash
npm run db:seed
```

### 3. Environment Variables

Create `.env.local` in the project root:

```env
NEXT_PUBLIC_SITE_URL=http://localhost:3000
SUPABASE_URL=http://127.0.0.1:54321
SUPABASE_SERVICE_ROLE=your_service_role_key_here
RESEND_API_KEY=your_resend_api_key_here
RESEND_FROM=Co404 <quiz@co404.com>
QUIZ_SLUG=digital-nomad-type
```

**Get your Supabase service role key:**
```bash
npm run db:status
```
Look for the `service_role key` in the output and copy it to your `.env.local`.

**Get your Resend API key:**
1. Sign up at [resend.com](https://resend.com) (free tier available)
2. Create an API key in your dashboard
3. Verify your sending domain (or use the sandbox for testing)
4. Copy the API key to your `.env.local`

### 4. Run Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the landing page.

### 5. Test the Quiz

1. Go to [http://localhost:3000/quiz/digital-nomad-type](http://localhost:3000/quiz/digital-nomad-type)
2. Fill out your email address
3. Answer all 6 questions 
4. Accept the terms and conditions
5. Submit the quiz
6. Check your email for the personalized result!

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production  
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run test` - Run unit tests with Vitest
- `npm run test:e2e` - Run E2E tests with Playwright
- `npm run db:start` - Start Supabase locally
- `npm run db:stop` - Stop Supabase
- `npm run db:push` - Apply database migrations
- `npm run db:seed` - Seed database with sample data
- `npm run db:status` - Show Supabase connection info

## Database Schema

The app uses a well-structured relational database with the following tables:

### Core Tables

- **quizzes**: Quiz definitions with slug, title, and active status
- **results**: Persona definitions (A/B/C/D) with email templates and descriptions
- **questions**: Quiz questions with position ordering
- **options**: Answer options that map to result keys
- **submissions**: User submissions with email, result, and metadata
- **answers**: Individual question answers linked to submissions

### Adding/Removing Questions

The app is designed to be flexible. To modify questions:

```sql
-- Add a new question
INSERT INTO questions (quiz_id, position, title) VALUES 
('quiz_id_here', 7, 'What motivates you most about remote work?');

-- Add options for the new question  
INSERT INTO options (question_id, label, text, result_key) VALUES 
('new_question_id', 'A', 'Freedom and flexibility', 'A'),
('new_question_id', 'B', 'Adventure and travel', 'B'),
('new_question_id', 'C', 'Cultural experiences', 'C'),
('new_question_id', 'D', 'Work-life balance', 'D');
```

**No code changes needed!** The app dynamically loads questions from the database.

## Majority Logic

The app uses a sophisticated majority calculation with deterministic tie-breaking:

1. Count how many times each answer (A, B, C, D) was selected
2. The option with the most selections wins
3. In case of ties, priority order is: A > B > C > D
4. This ensures consistent results even with tied scores

Example: If a user answers A,A,B,B,C,D → A and B both have 2 selections, but A wins due to higher priority.

## Email Templates

Email content is stored in the database and supports token replacement:

- `{{RESULT_NAME}}` - The persona name (e.g., "The Social Butterfly")
- `{{RESULT_HEADLINE}}` - The persona headline
- `{{RESULT_DESCRIPTION}}` - Detailed description
- `{{CTA_URL}}` - Call-to-action URL (defaults to site URL)

## Embed Usage

To embed the quiz on any website, use this HTML snippet:

```html
<iframe 
  src="https://yourdomain.com/embed/digital-nomad-type" 
  width="100%" 
  height="720" 
  style="border:0; border-radius: 8px;">
</iframe>
```

The embed version removes headers/footers for a clean embedded experience.

## Color Palette

The app uses the Co404 brand colors defined in CSS custom properties:

- **Primary**: `#b47775` (main brand color)
- **Accent**: `#c48c72` (secondary actions)  
- **Background**: `#e3dbd6` (page background)
- **Card**: `#ede8e5` (content cards)
- **Text**: `#43362d` (primary text)
- **Light Text**: `#f7f5f4` (light text on dark backgrounds)

## API Routes

### POST /api/submit

Submit a completed quiz with the following payload:

```json
{
  "quiz_slug": "digital-nomad-type",
  "email": "user@example.com", 
  "consent": true,
  "answers": [
    {
      "question_id": "uuid-here",
      "selected_label": "A"
    }
  ]
}
```

Returns:
```json
{
  "success": true,
  "result_key": "A",
  "result": {
    "key": "A",
    "name": "The Social Butterfly",
    "headline": "You thrive on connections!",
    "description": "..."
  },
  "submission_id": "uuid-here"
}
```

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect the repository to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy!

### Production Environment Variables

```env
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE=your_production_service_role_key
RESEND_API_KEY=your_resend_api_key
RESEND_FROM=Your Name <quiz@yourdomain.com>
QUIZ_SLUG=digital-nomad-type
```

### Supabase Production Setup

1. Create a new project at [supabase.com](https://supabase.com)
2. Run the migration SQL in your production database
3. Seed with your quiz data
4. Copy the production URL and service role key to your environment variables

## Security Features

- **Server-Only Database Access**: No client-side Supabase access, all queries go through API routes
- **IP-Based Rate Limiting**: Maximum 5 submissions per hour per IP address
- **Input Validation**: Comprehensive validation with Zod schemas
- **CSRF Protection**: Built-in protection via Next.js
- **IP Address Hashing**: User IPs are SHA-256 hashed for privacy
- **Email Validation**: Proper email format validation on both client and server

## Architecture

- **Frontend**: Next.js 14 with App Router and TypeScript
- **Styling**: Tailwind CSS v4 with custom color system
- **Database**: Supabase Postgres with optimized indexes
- **Email**: Resend for reliable transactional emails  
- **Hosting**: Vercel-optimized with environment variable support
- **Testing**: Vitest for unit tests, Playwright for E2E testing

## Testing

Run the test suite:

```bash
# Unit tests
npm run test

# E2E tests (make sure dev server is running)
npm run test:e2e
```

The tests cover:
- Majority calculation logic with edge cases
- Quiz form validation  
- Complete user flow from landing page to result
- API endpoint validation

## Support

For questions or issues:

1. Check the console for error messages
2. Verify all environment variables are set correctly
3. Ensure Supabase is running locally (`npm run db:status`)
4. Check that your Resend API key is valid and domain is verified

## License

MIT License - feel free to use this project as a foundation for your own quiz applications!
#   D e p l o y m e n t   t r i g g e r   f o r   c a c h e   i n v a l i d a t i o n  
 