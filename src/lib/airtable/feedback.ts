import { airtableCreate, airtableSelect } from "./client";
import type { ArticleRecord } from "./articles";

export type FeedbackPayload = {
  relatedArticleSlug?: string;
  topic: string;
  description: string;
  suggestedChange?: string;
  urgency?: "Low" | "Medium" | "High";
  contactInfo?: string;
  source?: string;
  type?: string;
  query?: string;
  categoryGuess?: string;
  roleFilter?: string;
  fileAttachment?: {
    filename: string;
    type?: string;
    data: string; // base64 payload without data URI prefix
  };
};

export type FeedbackRecord = {
  "Related Article"?: string[];
  Topic?: string;
  Description?: string;
  "Suggested Change"?: string;
  Urgency?: "Low" | "Medium" | "High";
  "Contact Info"?: string;
  Status?: "Pending" | "In Review" | "Resolved" | "Rejected";
  "Related Article Slug"?: string;
  Source?: string;
  Type?: string;
  Query?: string;
  "Category Guess"?: string;
  "Role Filter"?: string;
  File?: {
    filename?: string;
    url?: string;
    type?: string;
  }[];
};

const FEEDBACK_TABLE_NAME =
  process.env.AIRTABLE_TABLE_FEEDBACK && process.env.AIRTABLE_TABLE_FEEDBACK.length > 0
    ? process.env.AIRTABLE_TABLE_FEEDBACK
    : "Feedback";

const ARTICLES_TABLE_NAME =
  process.env.AIRTABLE_TABLE_ARTICLES && process.env.AIRTABLE_TABLE_ARTICLES.length > 0
    ? process.env.AIRTABLE_TABLE_ARTICLES
    : "Articles";

export async function createFeedback(payload: FeedbackPayload): Promise<string | undefined> {
  let relatedArticleRecordId: string | undefined;

  if (payload.relatedArticleSlug) {
    const result = await airtableSelect<ArticleRecord>(ARTICLES_TABLE_NAME, {
      maxRecords: 1,
      filterByFormula: `LOWER({Slug}) = '${payload.relatedArticleSlug
        .toLowerCase()
        .replace(/'/g, "\\'")}'`,
      view: "Articles (Published)",
      fields: ["Slug"],
    });

    const record = result.records[0];
    if (record) {
      relatedArticleRecordId = record.id;
    }
  }

  const fields: FeedbackRecord = {
    Topic: payload.topic,
    Description: payload.description,
    Status: "Pending",
  };

  if (payload.suggestedChange) {
    fields["Suggested Change"] = payload.suggestedChange;
  }

  if (payload.urgency) {
    fields.Urgency = payload.urgency;
  }

  if (payload.contactInfo) {
    fields["Contact Info"] = payload.contactInfo;
  }

  if (relatedArticleRecordId) {
    fields["Related Article"] = [relatedArticleRecordId];
  }

  if (payload.source) fields.Source = payload.source;
  if (payload.type) fields.Type = payload.type;
  if (payload.query) fields.Query = payload.query;
  if (payload.categoryGuess) fields["Category Guess"] = payload.categoryGuess;
  if (payload.roleFilter) fields["Role Filter"] = payload.roleFilter;
  if (payload.fileAttachment) {
    fields.File = [
      {
        filename: payload.fileAttachment.filename,
        type: payload.fileAttachment.type,
        // Airtable attachments allow base64 via the "data" property when using the API
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ...(payload.fileAttachment.data ? ({ data: payload.fileAttachment.data } as any) : {}),
      },
    ];
  }

  const record = await airtableCreate(FEEDBACK_TABLE_NAME, fields);
  return record?.id;
}

