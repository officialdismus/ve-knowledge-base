import { NextResponse } from "next/server";
import { createFeedback } from "@/lib/airtable/feedback";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.topic || !body.description) {
      return NextResponse.json(
        { error: "Topic and description are required" },
        { status: 400 },
      );
    }

    const referenceId = await createFeedback({
      relatedArticleSlug: body.relatedArticleSlug,
      topic: body.topic,
      description: body.description,
      suggestedChange: body.suggestedChange,
      urgency: body.urgency,
      contactInfo: body.contactInfo,
      source: body.source,
      type: body.type,
      query: body.query,
      categoryGuess: body.categoryGuess,
      roleFilter: body.roleFilter,
    });

    return NextResponse.json({ ok: true, referenceId });
  } catch (error) {
    console.error("Error creating feedback", error);
    return NextResponse.json(
      { error: "Unable to submit feedback right now. Please try again later." },
      { status: 500 },
    );
  }
}

