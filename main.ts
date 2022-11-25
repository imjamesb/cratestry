/// <reference no-default-lib="true" />
/// <reference lib="dom" />
/// <reference lib="dom.iterable" />
/// <reference lib="dom.asynciterable" />
/// <reference lib="deno.ns" />

// Init database
import "https://deno.land/std@0.166.0/dotenv/load.ts";
import up0001 from "./sql/migrations/up/0001.ts";
await up0001();

// Init S3
import s3, { ensureBucket } from "./s3/mod.ts";
s3();
await ensureBucket(Deno.env.get("S3_BUCKET")!);

// Init webserver
import { start } from "$fresh/server.ts";
import manifest from "./fresh.gen.ts";

import twindPlugin from "$fresh/plugins/twind.ts";
import twindConfig from "./twind.config.ts";

await start(manifest, { plugins: [twindPlugin(twindConfig)] });
