
# Funey - Making Money Fun for Kids

A web app for managing a virtual "ledger" for your children. Making money fun (funey? My 5 year old suggested it).

## Features

* Parent login for managing accounts (add/subtract money)
* View-only link for children
* Automatic monthly interest calculation
* Automatic weekly allowance
* Mobile-friendly display (can be added as a home icon)

## Development

### Database Setup

1. Setup a Postgres SQL database
2. Upload schema: `psql dbname < schema.dump`
3. Configure environment in `.env.local`:
   ```
   PGHOST=0.0.0.0
   PGPORT=5432
   PGUSER=your_user
   PGPASS=your_password
   DB=your_database
   ```

### Running Locally

```bash
yarn install
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## Warning

This is for tracking virtual balances, not actual money storage. While stable, use at your own risk.

## Privacy

No email addresses or account names are stored. Transactions are not encrypted but are private to your instance.

## License

MIT License - See LICENSE file for details.
