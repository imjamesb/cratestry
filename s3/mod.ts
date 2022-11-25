import { type CreateBucketOptions, S3 } from "https://deno.land/x/s3/mod.ts";

let s3: S3 | undefined = undefined;

export default function getS3() {
  if (s3 === undefined) {
    s3 = new S3({
      region: Deno.env.get("S3_REGION")!,
      accessKeyID: Deno.env.get("S3_ACCESS_KEY_ID")!,
      secretKey: Deno.env.get("S3_SECRET_KEY")!,
      endpointURL: Deno.env.get("S3_ENDPOINT_URL")!,
    });
  }
  return s3;
}

export async function testBucket(name: string) {
  return await getS3().getBucket(name).listObjects({ maxKeys: 1 }) !==
    undefined;
}

export async function ensureBucket(
  name: string,
  options?: CreateBucketOptions | undefined,
) {
  if (!await testBucket(name)) {
    return await getS3().createBucket(name, options);
  } else {
    return getS3().getBucket(name);
  }
}
