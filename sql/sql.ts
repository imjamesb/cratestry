import { Pool } from "https://deno.land/x/postgres/mod.ts";

let pool: Pool | undefined = undefined;

export async function connect() {
  if (pool === undefined) {
    pool = new Pool(
      {
        database: Deno.env.get("DB")!,
        hostname: Deno.env.get("DB_HOST")!,
        port: Number(Deno.env.get("DB_PORT"))!,
        user: Deno.env.get("DB_USERNAME")!,
        password: Deno.env.get("DB_PASSWORD")!,
        tls: Deno.env.get("DB_TLS_CERT") || Deno.env.get("DB_TLS_ENABLE")
          ? {
            enabled: true,
            enforce: true,
            caCertificates: Deno.env.get("DB_TLS_CERT")
              ? Deno.env.get("DB_TLS_CERT")!.split(",").map((value) =>
                atob(value)
              )
              : undefined,
          }
          : undefined,
      },
      Number(Deno.env.get("DB_POOL_SIZE") || 3),
      true,
    );
  }
  return await pool.connect();
}

export async function sql(template: TemplateStringsArray, ...items: unknown[]) {
  const client = await connect();
  const result = client.queryObject(template, ...items);
  client.release();
  return result as any;
}

export default sql;

export const intOffset = 2147483648;
