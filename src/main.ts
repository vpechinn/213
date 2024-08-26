import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { getPgClient } from './dbClientFactory';

async function migrateDb() {
  const client = getPgClient();

  await client.connect();

  await client.query(`
            create table if not exists users 
            (
                userId   uuid primary key,
                name     text not null unique,
                password text not null
            );
        
            
            create table if not exists auth_tokens 
            (
                tokenId  uuid primary key,
                userId   uuid not null REFERENCES users,
                token    text not null
            );

            create table if not exists deeds
            (
                deedId uuid primary key,
                userId uuid not null REFERENCES users,
                title text not null,
                description text not null
            );
            create table if not exists friends
            (
                userId1 uuid not null REFERENCES users,
                userId2 uuid not null REFERENCES users
            );`);
  await client.end();
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}

migrateDb().then(bootstrap);
