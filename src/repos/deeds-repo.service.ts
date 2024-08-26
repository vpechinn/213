import { Injectable, Scope } from "@nestjs/common";
import { Client } from "pg";
import { Deed } from "../../models/Deed";
import { getPgClient } from "../dbClientFactory";

@Injectable({ scope: Scope.DEFAULT })
export class DeedsRepo {
  private client: Client;

  constructor() {
    this.client = getPgClient();

    this.client
      .connect()
      .catch((err) => console.error("Connection error", err.stack));
  }

  async createDeed({
                     title,
                     description,
                     userId
                   }: {
    title: string;
    description: string;
    userId: string;
  }) {
    await this.client.query(
      `INSERT INTO  deeds VALUES (gen_random_uuid(), $1, $2, $3)`,
      [userId, title, description]
    );
  }

  async listDeedsOfUser(userId: string): Promise<Deed[]> {
    const result = await this.client.query(
      `SELECT deedId, userId, title, description 
        FROM  deeds
        WHERE userId = $1`,
      [userId]
    );

    return result.rows;
  }

  async updateDeed(deed: Deed): Promise<void> {
    await this.client.query(
      `UPDATE  deeds
        SET title = $1, description = $2
        WHERE deedId = $3`,
      [deed.title, deed.description, deed.deedId]
    );
  }

  async deleteDeed(deedId: string): Promise<void> {
    await this.client.query(
      `
        DELETE FROM  deeds 
        WHERE deedId = $1
        `,
      [deedId]
    );
  }
  async isFriend(userid: string, friendUserId: string): Promise<boolean> {
    const result = await this.client.query(
      `
        SELECT COUNT(*) FROM  friends WHERE (userId1 = $1 and userId2 = $2)
                         or  (userId2 = $1 and userId1 = $2) LIMIT 1
        `,
      [userid,friendUserId]
    );

    return Boolean(result.rows[0].count)
  }


}