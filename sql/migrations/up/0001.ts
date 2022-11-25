import sql from "../../sql.ts";

export default async function up0001() {
  await sql`
    create extension if not exists pg_trgm;
  `;
  console.debug("created extension");
  await sql`
    create table if not exists "gh_owner" (
      "id" int not null primary key,
      "type" smallint not null,
      "login" text not null,
      "avatarUrl" text,
      "url" text not null,
      "maxCrates" smallint,
      "banned" boolean not null,
      "canCreateCrateWithPush" boolean not null
    );
  `;
  console.debug("created gh_owner");
  await sql`
    create index if not exists "idx_gh_owner" on "gh_owner" using gist ("login" gist_trgm_ops(siglen=32));
  `;
  console.debug("created idx_gh_owner(login)");
  await sql`
    create table if not exists "gh_crate" (
      "id" int not null primary key,
      "name" text not null,
      "repository" text not null,
      "url" text not null,
      "owner" int not null, -- ref: gh_crate_owner
      "summary" text not null,
      "hidden" boolean not null,
      "softRemoved" boolean not null,
      foreign key ("owner") references "gh_owner"("id")
    );
  `;
  console.debug("created gh_crate");
  await sql`
    create index if not exists "idx_gh_crate" on "gh_crate" using gist ("name" gist_trgm_ops(siglen=32), "repository" gist_trgm_ops(siglen=32), "summary" gist_trgm_ops(siglen=32));
  `;
  console.debug("created idx_gh_crate(name, repository, summary)");
  await sql`
    create table if not exists "gh_crate_version" (
      "id" serial not null primary key,
      "crate" int not null,
      "name" text not null,
      "deployed" boolean not null,
      "hidden" boolean not null,
      "softRemoved" boolean not null,
      "at" int not null,
      "sender" int not null,
      foreign key ("crate") references "gh_crate"("id"),
      foreign key ("sender") references "gh_owner"("id")
    );
  `;
  console.debug("created gh_crate_version");
  await sql`
    create table if not exists "gh_dir" (
      "id" serial not null primary key,
      "crate_version" int not null,
      "name" text not null,
      "parent" int,
      foreign key ("parent") references "gh_dir"("id"),
      foreign key ("crate_version") references "gh_crate_version"("id")
    );
  `;
  console.debug("created gh_dir");
  await sql`
    create index if not exists "idx_gh_dir" on "gh_dir" using gist ("name" gist_trgm_ops(siglen=32));
  `;
  console.debug("created idx_gh_dir(name)");
  await sql`
    create table if not exists "s3_file" (
      "id" serial not null primary key,
      "sum1" int not null,
      "sum2" int not null,
      "sum3" int not null,
      "sum4" int not null,
      "url" text not null,
      "size" int not null
    );
  `;
  console.debug("created s3_file");
  await sql`
    create table if not exists "gh_file" (
      "id" serial not null primary key,
      "crate_version" int not null,
      "name" text not null,
      "parent" int,
      "file" int not null,
      foreign key ("crate_version") references "gh_crate_version"("id"),
      foreign key ("parent") references "gh_dir"("id"),
      foreign key ("file") references "s3_file"("id")
    );
  `;
  console.debug("created gh_file");
  await sql`
    create index if not exists "idx_gh_file" on "gh_file" using gist ("name" gist_trgm_ops(siglen=32));
  `;
  console.debug("created idx_gh_file(name)");
}
