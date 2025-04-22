# Contributing to Funey

Thank you for your interest in contributing to Funey!

## Getting Started

1. Fork the repository and clone your fork:
   ```bash
   git clone git@github.com:<your-username>/funey.git
   cd funey
   ```
2. Install dependencies:
   ```bash
   yarn install
   ```
3. Set up the database:
   - Create a new Postgres database.
   - Load the schema:
     ```bash
     psql <dbname> < schema.dump
     ```
4. Create a `.env.local` file in the project root and define your database connection:
   ```bash
   PGHOST=localhost
   PGPORT=5432
   PGPASS=<your_password>
   DB=<your_database_name>
   ```
5. Start the development server:
   ```bash
   yarn dev
   ```

Open http://localhost:3000 in your browser to verify everything is working.

## Code Style

- Indentation: 4 spaces (to match existing code)
- Strings: use double quotes consistently
- Semicolons: follow existing code style where used
- Functional React components and Next.js conventions
- Organize pages under `/pages`; shared components or utilities under `/src`
- After any DB schema change, regenerate `schema.dump`

## Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):
- `feat(scope): description` – a new feature
- `fix(scope): description` – a bug fix
- `docs(scope): description` – documentation only changes
- `style(scope): description` – formatting, missing semicolons, etc
- `refactor(scope): description` – code change that neither fixes a bug nor adds a feature
- `test(scope): description` – adding or updating tests
- `chore(scope): description` – changes to build process or auxiliary tools

## Pull Requests

- Base your PR against the `main` branch
- Include a clear description of your changes
- Link to any relevant issues
- Add screenshots or GIFs for UI changes

## Issues

Please use GitHub Issues to report bugs or suggest features.

## Testing

- There are currently no automated tests.
- Manually verify your changes by running `yarn dev` and checking the app.

## Linting

- You can run `npx next lint` to check for lint errors (if ESLint is configured).