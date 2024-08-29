import { Client } from "pg";

export const getPgClient=()=> new Client({
    host: 'localhost',
    port: 5432,
    user: 'postgres',
    password: '2012',
    database: 'postgres',
  });
