import { Client } from "pg";

export const getPgClient=()=> new Client({
    host: 'localhost',
    port: 5439,
    user: 'pothos',
    password: '3c3Pv3jtIpNGzg5UJTa1mzbqgwduGmSh2hMJlNdnRE',
    database: 'postgres',
  });
