This is a web app for managing an online "ledger" for your little one.  Making money fun (funey?  My 5 year old suggested it).

Supports:

*  Parent login on a per account basis (so that you can add / subtract money from the ledger)
*  View only link for children (so they can see how much money they have)
*  Automatic monthly interest calculation (So they can watch their funey grow)
*  Automatic weekly allowance calculation
*  Mobile device friendly display (Can be added as a home icon so they can view their totals from ipod / iphone / chromebook etc)

You can create your own account and play around at:

https://funey.badpirate.net

Or host it yourself.

## Warning

This is for tracking a virtual balance, not the storage of actual money and while I've kept funey.badpirate.net 
up for a number of years (and plan to keep hosting until my kids are in college), I
make no guaruntee that something won't happen to hosting or storage, use at your own risk.

## Privacy

You can review the code yourself, but I've intentially left no place to store email addresses or account names,
though the transactions themselves are not stored encrypted. If you host yourself I have no access to your data
or transactions.

If you choose to use funey.badpirate.net, I will not share the transaction details / descriptions / values with
third parties, or try to associate them with accounts or IP addresses.  This is mostly a tool for myself that
I believe might have value for other parents and so leave open in hopes that it can be a benefit.  There will be 
no commercial or private use of your data.

## Development

### Setup DB

You'll need to setup a Postgres SQL database to run locally:

1.  Setup a new database
2.  Upload the default schema into your DB, `psql dbname < schema.dump`
3.  Set `PGHOST`, `PGPORT`, `PGPASS` and `DB` values in `.env.local` (and your production env)

### Getting Started

First, run the development server:

```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.