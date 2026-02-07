import { NextResponse } from "next/server";
import * as Minio from "minio";

const minioClient = new Minio.Client({
  endPoint: process.env.MINIO_ENDPOINT || "localhost",
  port: parseInt(process.env.MINIO_PORT || "9000"),
  useSSL: process.env.MINIO_USE_SSL === "true",
  accessKey: process.env.MINIO_ACCESS_KEY || "",
  secretKey: process.env.MINIO_SECRET_KEY || "",
});

const BUCKET_NAME = "zimplar-assignments";

export async function POST(request: Request) {
  try {
    const { filename } = await request.json();

    if (!filename) {
      return NextResponse.json({ error: "Filename is required" }, { status: 400 });
    }

    // Ensure bucket exists
    const exists = await minioClient.bucketExists(BUCKET_NAME);
    if (!exists) {
      await minioClient.makeBucket(BUCKET_NAME);
    }

    // Generate presigned URL for putObject
    const presignedUrl = await minioClient.presignedPutObject(BUCKET_NAME, filename, 24 * 60 * 60);

    return NextResponse.json({ url: presignedUrl });
  } catch (error) {
    console.error("MinIO Error:", error);
    return NextResponse.json({ error: "Failed to generate presigned URL" }, { status: 500 });
  }
}
