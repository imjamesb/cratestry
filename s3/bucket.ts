import { type S3Bucket } from "https://deno.land/x/s3/mod.ts";
import s3 from "./mod.ts";

let _bucket: S3Bucket | undefined = undefined;

export default function bucket() {
  return _bucket || (_bucket = s3().getBucket(Deno.env.get("S3_BUCKET")!));
}
