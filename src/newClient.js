import { Client } from "pg";

export async function newClient() {

  let client;
  if (process.env.PGHOST) {
    client = new Client({
      host: process.env.PGHOST,
      port: process.env.PGPORT,
      user: process.env.PGUSER,
      password: process.env.PGPASS,
      database: process.env.DB,
    });
  } else {
    client = Client();
  }

  await client.connect();
  return client;
}

export default newClient
