import { airtableSelect } from "./client";

export type CategoryRecord = {
  Name?: string;
  Description?: string;
  Status?: "Active" | "Archived";
  "Display Order"?: number;
  Subcategories?: string[];
  Articles?: string[];
};

export type SubcategoryRecord = {
  Name?: string;
  Category?: string[];
  Description?: string;
  Status?: "Active" | "Archived" | "Done";
  "Display Order"?: number;
  Articles?: string[];
};

const CATEGORIES_TABLE = process.env.AIRTABLE_TABLE_CATEGORIES || "Categories";
const SUBCATEGORIES_TABLE = process.env.AIRTABLE_TABLE_SUBCATEGORIES || "Subcategories";

export type CategoryWithMeta = CategoryRecord & {
  id: string;
  articleCount: number;
};

export type SubcategoryWithMeta = SubcategoryRecord & {
  id: string;
  articleCount: number;
};

export async function getActiveCategories(): Promise<CategoryWithMeta[]> {
  const response = await airtableSelect<CategoryRecord>(CATEGORIES_TABLE, {
    filterByFormula: `{Status} = 'Active'`,
    sort: [{ field: "Display Order", direction: "asc" }],
    maxRecords: 100,
  });

  return response.records.map((record) => ({
    id: record.id,
    ...record.fields,
    articleCount: record.fields.Articles?.length ?? 0,
  }));
}

export async function getSubcategoriesByCategory(
  categoryName: string,
): Promise<SubcategoryWithMeta[]> {
  const formula = `AND({Status} != 'Archived', FIND('${categoryName.replace(/'/g, "\\'")}', ARRAYJOIN({Category}, ',')))`;

  const response = await airtableSelect<SubcategoryRecord>(SUBCATEGORIES_TABLE, {
    filterByFormula: formula,
    sort: [{ field: "Display Order", direction: "asc" }],
    maxRecords: 100,
  });

  return response.records.map((record) => ({
    id: record.id,
    ...record.fields,
    articleCount: record.fields.Articles?.length ?? 0,
  }));
}

export async function getAllSubcategories(): Promise<SubcategoryWithMeta[]> {
  const response = await airtableSelect<SubcategoryRecord>(SUBCATEGORIES_TABLE, {
    filterByFormula: `{Status} != 'Archived'`,
    sort: [{ field: "Display Order", direction: "asc" }],
    maxRecords: 200,
  });

  return response.records.map((record) => ({
    id: record.id,
    ...record.fields,
    articleCount: record.fields.Articles?.length ?? 0,
  }));
}
