const AIRTABLE_API_URL = "https://api.airtable.com/v0";

const baseId = process.env.AIRTABLE_BASE_ID;
const apiKey = process.env.AIRTABLE_PAT;

const hasAirtableConfig = Boolean(baseId && apiKey);

if (!hasAirtableConfig) {
  console.warn(
    "Airtable env vars are missing; API routes will return empty datasets or throw if writes are attempted.",
  );
}

type AirtableListResponse<T> = {
  records: {
    id: string;
    fields: T;
    createdTime: string;
  }[];
  offset?: string;
};

type AirtableSelectOptions = {
  maxRecords?: number;
  view?: string;
  filterByFormula?: string;
  sort?: { field: string; direction: "asc" | "desc" }[];
  fields?: string[];
};

function encodeSelectParams(options: AirtableSelectOptions = {}): string {
  const params = new URLSearchParams();

  if (options.maxRecords != null) {
    params.append("maxRecords", String(options.maxRecords));
  }

  if (options.view) {
    params.append("view", options.view);
  }

  if (options.filterByFormula) {
    params.append("filterByFormula", options.filterByFormula);
  }

  if (options.fields) {
    for (const field of options.fields) {
      params.append("fields[]", field);
    }
  }

  if (options.sort) {
    options.sort.forEach((sort, index) => {
      params.append(`sort[${index}][field]`, sort.field);
      params.append(`sort[${index}][direction]`, sort.direction);
    });
  }

  return params.toString();
}

export async function airtableSelect<T>(
  tableName: string,
  options: AirtableSelectOptions = {},
): Promise<AirtableListResponse<T>> {
  // Return empty data if Airtable is not configured (development mode)
  if (!hasAirtableConfig) {
    return { records: [] };
  }

  const query = encodeSelectParams(options);
  const tablePath = encodeURIComponent(tableName);
  const url = `${AIRTABLE_API_URL}/${baseId}/${tablePath}${query ? `?${query}` : ""}`;

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${apiKey}`,
    },
    // Ensure fetch is only ever called from the server
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(
      `Airtable select failed for table "${tableName}" with status ${res.status}: ${await res.text()}`,
    );
  }

  return res.json() as Promise<AirtableListResponse<T>>;
}

type AirtableCreateResponse<T> = {
  id: string;
  fields: T;
  createdTime: string;
};

export async function airtableCreate<T extends Record<string, unknown>>(
  tableName: string,
  fields: T,
): Promise<AirtableCreateResponse<T>> {
  if (!hasAirtableConfig) {
    throw new Error("Airtable configuration is missing; cannot create records.");
  }
  const tablePath = encodeURIComponent(tableName);
  const url = `${AIRTABLE_API_URL}/${baseId}/${tablePath}`;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ fields }),
  });

  if (!res.ok) {
    throw new Error(
      `Airtable create failed for table "${tableName}" with status ${res.status}: ${await res.text()}`,
    );
  }

  return res.json() as Promise<AirtableCreateResponse<T>>;
}

export async function airtableUpdate<T extends Record<string, unknown>>(
  tableName: string,
  recordId: string,
  fields: Partial<T>,
): Promise<{ id: string; fields: T; createdTime: string }> {
  if (!hasAirtableConfig) {
    throw new Error("Airtable configuration is missing; cannot update records.");
  }
  const tablePath = encodeURIComponent(tableName);
  const url = `${AIRTABLE_API_URL}/${baseId}/${tablePath}/${recordId}`;

  const res = await fetch(url, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ fields }),
  });

  if (!res.ok) {
    throw new Error(
      `Airtable update failed for table "${tableName}" record "${recordId}" with status ${res.status}: ${await res.text()}`,
    );
  }

  return res.json() as Promise<{ id: string; fields: T; createdTime: string }>;
}

export async function airtableFindByField<T>(
  tableName: string,
  fieldName: string,
  value: string,
  options: Omit<AirtableSelectOptions, "filterByFormula"> = {},
): Promise<T | null> {
  // Return null if Airtable is not configured (development mode)
  if (!hasAirtableConfig) {
    return null;
  }

  const formula = `LOWER({${fieldName}}) = '${value.toLowerCase().replace(/'/g, "\\'")}'`;

  const result = await airtableSelect<T>(tableName, {
    ...options,
    maxRecords: 1,
    filterByFormula: formula,
  });

  const record = result.records[0];
  return record ? record.fields : null;
}

