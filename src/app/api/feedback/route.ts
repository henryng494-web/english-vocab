import { NextRequest, NextResponse } from "next/server";

const MAX_MESSAGE = 4000;
const MAX_IMAGE_BYTES = 4 * 1024 * 1024;

export async function POST(request: NextRequest) {
  try {
    const form = await request.formData();
    const message = String(form.get("message") ?? "").trim();
    const pageUrl = String(form.get("pageUrl") ?? "").trim();
    const image = form.get("image");

    if (!message || message.length < 5) {
      return NextResponse.json(
        { error: "Please describe the issue (at least 5 characters)." },
        { status: 400 },
      );
    }
    if (message.length > MAX_MESSAGE) {
      return NextResponse.json(
        { error: "Message is too long." },
        { status: 400 },
      );
    }

    let imageMeta: { name: string; type: string; size: number } | null = null;
    if (image instanceof File && image.size > 0) {
      if (!image.type.startsWith("image/")) {
        return NextResponse.json(
          { error: "Attachment must be an image." },
          { status: 400 },
        );
      }
      if (image.size > MAX_IMAGE_BYTES) {
        return NextResponse.json(
          { error: "Image must be 4 MB or smaller." },
          { status: 400 },
        );
      }
      imageMeta = { name: image.name, type: image.type, size: image.size };
    }

    const referenceId = `fb-${Date.now().toString(36)}`;
    const payload = {
      id: referenceId,
      message,
      pageUrl: pageUrl || null,
      userAgent: request.headers.get("user-agent"),
      createdAt: new Date().toISOString(),
      image: imageMeta,
    };

    const webhook = process.env.FEEDBACK_WEBHOOK_URL?.trim();
    if (webhook) {
      const body = new FormData();
      body.set("payload", JSON.stringify(payload));
      body.set("message", message);
      if (pageUrl) body.set("pageUrl", pageUrl);
      if (image instanceof File && image.size > 0) {
        body.set("image", image, image.name);
      }
      await fetch(webhook, { method: "POST", body });
    } else {
      console.info("[feedback]", JSON.stringify(payload));
    }

    return NextResponse.json({ ok: true, id: referenceId });
  } catch (error) {
    console.error("[feedback]", error);
    return NextResponse.json(
      { error: "Could not submit report. Please try again." },
      { status: 500 },
    );
  }
}
