import { nanoid } from "nanoid";
import { redis } from "@/lib/redis";

export async function POST(req) {
  const body = await req.json();
  const { content, ttl_seconds, max_views } = body;

  if (!content) {
    return Response.json(
      { error: "Content is required" },
      { status: 400 }
    );
  }

  const id = nanoid(8);

  const paste = {
    content,
    createdAt: Date.now(),
    expiresAt: ttl_seconds
      ? Date.now() + ttl_seconds * 1000
      : null,
    maxViews: max_views || null,
    views: 0,
  };

  await redis.set(`paste:${id}`, paste);

  return Response.json({
    id,
    url: `/p/${id}`,
  });
}
