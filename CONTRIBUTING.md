# Contributing to Funey

Thank you for your interest in contributing to Funey!

## Getting Started

1. Fork and clone the repository:
   ```bash
   git clone https://github.com/<your-username>/funey.git
   cd funey
   ```
2. Install dependencies:
   ```bash
   yarn install
   ```
3. Configure environment:
   1. Copy the example env file and edit:
      ```bash
      cp .env.local.EXAMPLE .env.local
      ```
   2. In `.env.local`, set `DATABASE_URL`:
      - For local SQLite development:
        ```ini
        DATABASE_URL=file:./dev.db
        ```
      - For PostgreSQL development:
        ```ini
        DATABASE_URL=postgresql://user:pass@localhost:5432/funey
        ```
4. Initialize the database:
   ```bash
   yarn build:prisma-schemas
   yarn db:clean
   ```
5. Start development server:
   ```bash
   yarn dev
   ```

## Code Style

- Indentation: 4 spaces
- Strings: double quotes
- Semicolons: follow existing style
- Use functional React components
- Organize pages under `/pages`
- Keep shared components/utilities in `/src`
- Update `schema.dump` after DB changes

## Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` new feature
- `fix:` bug fix
- `docs:` documentation changes
- `style:` formatting changes
- `refactor:` code restructuring
- `test:` adding/updating tests
- `chore:` build process changes

## Pull Requests

- Base against `main` branch
- Include clear description
- Link relevant issues
- Add screenshots for UI changes

## Testing

- Manually verify changes with `yarn dev`
