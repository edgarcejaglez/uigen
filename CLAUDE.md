# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run setup        # First-time: install deps, generate Prisma client, run migrations
npm run dev          # Dev server with Turbopack (http://localhost:3000)
npm run build        # Production build
npm run lint         # ESLint
npm run test         # Vitest unit tests (run all)
npx vitest run src/path/to/__tests__/file.test.ts  # Run a single test file
npm run db:reset     # Reset database (destructive)
```

Set `ANTHROPIC_API_KEY` in `.env.local` for real AI generation; omit it to use the mock provider.

## Architecture

UIGen is an AI-powered React component generator. Users describe a UI in chat; Claude generates React files in a virtual file system; an iframe renders a live preview.

### Request Flow

```
User prompt → ChatContext → POST /api/chat
  → Claude (streaming) uses tool calls (str_replace_editor, file_manager)
  → FileSystemContext applies file operations to VirtualFileSystem
  → PreviewFrame detects changes, transforms JSX via Babel, renders in iframe
  → On completion: project state saved to DB (authenticated users only)
```

### Key Layers

**AI / API** (`src/app/api/chat/route.ts`, `src/lib/provider.ts`)
Streams Claude responses using the AI SDK. Claude uses two tools — `str_replace_editor` (create/edit files) and `file_manager` (rename/delete/list) — defined in `src/lib/tools/`. The system prompt lives in `src/lib/prompts/generation.tsx`.

**Virtual File System** (`src/lib/file-system.ts`, `src/lib/contexts/file-system-context.tsx`)
All generated files live in memory (no disk I/O). `VirtualFileSystem` is the core class; `FileSystemContext` wraps it in React state and exposes file operations to UI components. The FS is serialized to JSON and saved as `Project.data` in the database.

**Live Preview** (`src/components/preview/PreviewFrame.tsx`, `src/lib/transform/jsx-transformer.ts`)
An iframe receives a Blob URL of transformed code. `jsx-transformer.ts` uses `@babel/standalone` to compile JSX and rewrites bare imports to `esm.sh` CDN URLs via an import map.

**Chat** (`src/lib/contexts/chat-context.tsx`, `src/components/chat/`)
`ChatContext` owns message state and drives streaming from `/api/chat`. It processes the stream's tool-call events and forwards file operations to `FileSystemContext`.

**Auth** (`src/lib/auth.ts`, `src/actions/index.ts`, `src/middleware.ts`)
JWT sessions (jose) stored as HTTP-only cookies, 7-day expiry. Bcrypt for passwords. Anonymous users can work without auth; their FS state is tracked in localStorage via `anon-work-tracker.ts` and can be migrated on sign-up.

**Database** (`prisma/schema.prisma`, `src/lib/prisma.ts`)
SQLite via Prisma. Two models: `User` and `Project`. `Project.messages` stores chat history as a JSON string; `Project.data` stores the serialized VirtualFileSystem. Always reference `prisma/schema.prisma` to understand the data structure.

**Routing** (`src/app/`)
- `/` — auth check, redirects authenticated users to their first project
- `/[projectId]` — main workspace
- `/api/chat` — streaming chat endpoint

### Path Alias

`@/*` maps to `src/*` throughout the codebase.
