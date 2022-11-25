import sql, { bigintOffset } from "../sql.ts";
import { type Owner } from "../types.ts";

export interface OwnerUpsertPayload {
  id: bigint;
  login: string;
  avatarUrl?: string;
  url: string;
  type: 0 | 1;
}

export default async function upsertOwner(payload: OwnerUpsertPayload) {
  payload = { ...payload };
  payload.id = payload.id - bigintOffset;
  const { rows: [row] } = await sql`
    insert into "gh_owner"
      (
        "id",
        "type",
        "login",
        "avatarUrl",
        "url",
        "maxCrates",
        "banned",
        "canCreateCrateWithPush"
      )
    values
      (
        ${payload.id},
        ${payload.type},
        ${payload.login},
        ${payload.avatarUrl || null},
        ${payload.url},
        0,
        false,
        false
      )
    on conflict (id) do update set
      "type" = "excluded"."type",
      "login" = "excluded"."login",
      "avatarUrl" = "excluded"."avatarUrl",
      "url" = "excluded"."url"
    returning
      "id",
      "type",
      "login",
      "avatarUrl",
      "url",
      "maxCrates",
      "banned",
      "canCreateCrateWithPush";
  `;
  row.id += bigintOffset;
  return row as Owner;
}
