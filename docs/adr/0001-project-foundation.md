# ADR-0001: Project Foundation

## Status

Accepted

## Context

SprintHub is built as a production-grade MERN SaaS application.

The project adopts a pnpm Workspace monorepo architecture to enable scalability, code sharing, and maintainability.

## Decision

Use:

- pnpm Workspaces
- Monorepo Architecture
- apps/
- packages/
- shared configurations

## Consequences

- Easier scaling
- Shared packages
- Better developer experience
- Cleaner architecture