# Funey - Making Money Fun for Kids

A web app for managing a virtual "ledger" for your children. Making money fun (funey? My 5 year old suggested it).

## Features

- Parent login for managing accounts (add/subtract money)
- View-only link for children
- Automatic monthly interest calculation
- Automatic weekly allowance
- Mobile-friendly display (can be added as a home icon)
- No email or personal info required; all account keys are derived from username+password using sha256

## Development

### Database Setup

Funey uses Prisma for database access, with support for both SQLite (local/dev) and PostgreSQL (production or advanced testing).

1. Copy the example environment file:
   ```bash
   cp .env.local.EXAMPLE .env.local
   ```
2. In `.env.local`, set `DATABASE_URL`:
   - For local development (SQLite):
     ```ini
     DATABASE_URL=file:./dev.db
     ```
   - For PostgreSQL (e.g. CI or prod):
     ```ini
     DATABASE_URL=postgresql://user:password@localhost:5432/funey
     ```

### Initializing the Database

Funey provides helper scripts in `package.json`:

- `yarn build:prisma-schemas`  
  Regenerates the Prisma schema variants (`prisma/generated/sqlite.prisma` and `prisma/generated/postgresql.prisma`).
- `yarn db:clean`  
  Drops (if SQLite) and recreates the database specified by `DATABASE_URL`, and generates the Prisma Client against that schema. For SQLite, this resets `dev.db` in the project root.

To start from a clean slate locally:

```bash
yarn install
yarn build:prisma-schemas
yarn db:clean
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

### Running Locally

```bash
yarn install
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

### Testing

- Run unit tests:
  ```bash
  yarn test
  ```
- Run end-to-end (e2e) tests with Playwright:
  ```bash
  yarn test:e2e
  ```

## Code Quality

This project uses ESLint and Prettier for code linting and formatting. These checks are enforced automatically before each commit using Husky and lint-staged.

Additionally, a GitHub Actions workflow runs on every push and pull request to the `main` branch, executing linters, build steps, and automated tests to ensure code quality and stability.

## Warning

This is for tracking virtual balances, not actual money storage. While stable, use at your own risk.

## Privacy

No email addresses or account names are stored. Transactions are not encrypted but are private to your instance.

## License

MIT License - See LICENSE file for details.

Workspace Check: This line was added to verify workspace sharing.
