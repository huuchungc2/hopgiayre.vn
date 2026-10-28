export type BlogDraft = {
  title: string;
  slug: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  summary: string;
  contentHtml: string;
  tags: string[];
  callToAction: string;
};

export type ProductDescriptionDraft = {
  title: string;
  shortDescription: string;
  contentHtml: string;
  sellingPoints: string[];
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
};

export type SeoDraft = {
  slug: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  outline: string[];
};
