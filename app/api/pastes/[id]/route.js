import { redis } from "@/lib/redis";

export async function GET(req, { params }) {
  const { id } = await params;

  const paste = await redis.get(`paste:${id}`);

  if (!paste) {
    return Response.json(
      { error: "Paste not found" },
      { status: 404 }
    );
  }

  // ⏱ Expiry check
  if (paste.expiresAt && Date.now() > paste.expiresAt) {
    await redis.del(`paste:${id}`);
    return Response.json(
      { error: "This Page has Expired." },
      { status: 410 }
    );
  }

  // 👁 View limit check
  if (paste.maxViews !== null && paste.views >= paste.maxViews) {
    await redis.del(`paste:${id}`);
    return Response.json(
      { error: "View limit reached" },
      { status: 410 }
    );
  }

  // Increase views
  paste.views += 1;
  await redis.set(`paste:${id}`, paste);

  return Response.json({
    content: paste.content,
    remainingViews:
      paste.maxViews !== null
        ? paste.maxViews - paste.views
        : "∞",
  });
}
