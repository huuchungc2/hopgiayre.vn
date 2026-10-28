import { cleanString, cleanText, slugify } from './utils.js';

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

type GenerateOptions = {
  temperature?: number;
  maxOutputTokens?: number;
};

const OPENAI_RESPONSES_URL = 'https://api.openai.com/v1/responses';

function getModel(): string {
  return process.env.AI_MODEL || 'gpt-4o-mini';
}

function getApiKey(): string {
  return process.env.OPENAI_API_KEY || '';
}

function parseJsonBlock<T>(value: string): T {
  const cleaned = value
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/```$/i, '')
    .trim();
  const first = cleaned.indexOf('{');
  const last = cleaned.lastIndexOf('}');
  const json = first >= 0 && last >= first ? cleaned.slice(first, last + 1) : cleaned;
  return JSON.parse(json) as T;
}

function extractText(payload: any): string {
  if (typeof payload?.output_text === 'string') return payload.output_text;
  const parts: string[] = [];
  for (const item of payload?.output || []) {
    for (const content of item?.content || []) {
      if (typeof content?.text === 'string') parts.push(content.text);
    }
  }
  return parts.join('\n').trim();
}

async function generateJson<T>(systemPrompt: string, userPrompt: string, options: GenerateOptions = {}): Promise<T> {
  const apiKey = getApiKey();
  if (!apiKey) {
    throw new Error('Chưa cấu hình OPENAI_API_KEY trong apps/api/.env');
  }

  const response = await fetch(OPENAI_RESPONSES_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: getModel(),
      temperature: options.temperature ?? 0.7,
      max_output_tokens: options.maxOutputTokens ?? 1800,
      input: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ]
    })
  });

  const payload = await response.json().catch(() => null);
  if (!response.ok) {
    const message = payload?.error?.message || `OpenAI API lỗi ${response.status}`;
    throw new Error(message);
  }

  const text = extractText(payload);
  if (!text) throw new Error('AI không trả về nội dung');
  return parseJsonBlock<T>(text);
}

const baseSystemPrompt = `Bạn là trợ lý viết nội dung SEO tiếng Việt cho HopGiayRe.vn, chuyên in hộp giấy, túi giấy, hộp quà Tết, catalogue, name card và bao bì giấy. Viết tự nhiên, bán hàng vừa phải, tránh cam kết sai sự thật. Chỉ trả về JSON hợp lệ, không markdown.`;

export async function generateBlogDraft(input: {
  topic: string;
  keywords?: string;
  tone?: string;
  length?: string;
  audience?: string;
}): Promise<BlogDraft> {
  const topic = cleanString(input.topic, 180);
  const keywords = cleanString(input.keywords, 500);
  const tone = cleanString(input.tone || 'chuyên nghiệp, dễ hiểu, có tính bán hàng nhẹ', 120);
  const length = cleanString(input.length || 'trung bình', 60);
  const audience = cleanString(input.audience || 'chủ shop, doanh nghiệp vừa và nhỏ cần in bao bì', 160);

  const draft = await generateJson<BlogDraft>(baseSystemPrompt, `Tạo bản nháp bài blog SEO.
Chủ đề: ${topic}
Từ khóa chính/phụ: ${keywords || 'tự gợi ý theo chủ đề'}
Giọng văn: ${tone}
Độ dài: ${length}
Đối tượng đọc: ${audience}

JSON schema bắt buộc:
{
  "title": "",
  "slug": "",
  "metaTitle": "",
  "metaDescription": "",
  "keywords": [""],
  "summary": "",
  "contentHtml": "<h2>...</h2><p>...</p>",
  "tags": [""],
  "callToAction": ""
}
Yêu cầu contentHtml dùng thẻ h2, h3, p, ul, li; không dùng h1; không chèn script/style; cuối bài có đoạn kêu gọi báo giá tại HopGiayRe.vn.`, { maxOutputTokens: length === 'dài' ? 3200 : 2200 });

  return normalizeBlogDraft(draft, topic);
}

export async function generateProductDescription(input: {
  productName: string;
  category?: string;
  material?: string;
  size?: string;
  price?: string;
  keywords?: string;
}): Promise<ProductDescriptionDraft> {
  const productName = cleanString(input.productName, 180);
  const category = cleanString(input.category, 120);
  const material = cleanString(input.material, 160);
  const size = cleanString(input.size, 120);
  const price = cleanString(input.price, 120);
  const keywords = cleanString(input.keywords, 500);

  const draft = await generateJson<ProductDescriptionDraft>(baseSystemPrompt, `Viết mô tả sản phẩm SEO cho website in ấn bao bì.
Tên sản phẩm: ${productName}
Danh mục: ${category || 'chưa rõ'}
Chất liệu/quy cách: ${material || 'chưa rõ'}
Kích thước: ${size || 'theo yêu cầu'}
Giá tham khảo: ${price || 'liên hệ'}
Từ khóa: ${keywords || 'tự gợi ý'}

JSON schema bắt buộc:
{
  "title": "",
  "shortDescription": "",
  "contentHtml": "<h2>...</h2><p>...</p>",
  "sellingPoints": [""],
  "metaTitle": "",
  "metaDescription": "",
  "keywords": [""]
}
Không bịa thông số kỹ thuật nếu chưa được cung cấp; hãy dùng cụm "có thể tùy chỉnh theo yêu cầu" khi cần.`, { maxOutputTokens: 1800 });

  return {
    title: cleanString(draft.title || productName, 200),
    shortDescription: cleanText(draft.shortDescription, 500),
    contentHtml: cleanHtml(draft.contentHtml),
    sellingPoints: normalizeStringArray(draft.sellingPoints, 8),
    metaTitle: cleanString(draft.metaTitle || draft.title || productName, 200),
    metaDescription: cleanString(draft.metaDescription || draft.shortDescription, 300),
    keywords: normalizeStringArray(draft.keywords, 12)
  };
}

export async function generateSeoDraft(input: {
  title: string;
  currentContent?: string;
  keywords?: string;
}): Promise<SeoDraft> {
  const title = cleanString(input.title, 200);
  const currentContent = cleanText(input.currentContent, 2500);
  const keywords = cleanString(input.keywords, 500);

  const draft = await generateJson<SeoDraft>(baseSystemPrompt, `Tối ưu SEO cho nội dung sau.
Tiêu đề/ý tưởng: ${title}
Từ khóa mong muốn: ${keywords || 'tự gợi ý'}
Nội dung hiện có: ${currentContent || 'chưa có'}

JSON schema bắt buộc:
{
  "slug": "",
  "metaTitle": "",
  "metaDescription": "",
  "keywords": [""],
  "outline": [""]
}`, { maxOutputTokens: 1200 });

  return {
    slug: slugify(draft.slug || title),
    metaTitle: cleanString(draft.metaTitle || title, 200),
    metaDescription: cleanString(draft.metaDescription, 300),
    keywords: normalizeStringArray(draft.keywords, 12),
    outline: normalizeStringArray(draft.outline, 12)
  };
}

function normalizeBlogDraft(draft: BlogDraft, fallbackTopic: string): BlogDraft {
  const title = cleanString(draft.title || fallbackTopic, 200);
  const summary = cleanString(draft.summary || draft.metaDescription, 500);
  return {
    title,
    slug: slugify(draft.slug || title),
    metaTitle: cleanString(draft.metaTitle || title, 200),
    metaDescription: cleanString(draft.metaDescription || summary, 300),
    keywords: normalizeStringArray(draft.keywords, 12),
    summary,
    contentHtml: cleanHtml(draft.contentHtml),
    tags: normalizeStringArray(draft.tags, 10),
    callToAction: cleanString(draft.callToAction || 'Liên hệ HopGiayRe.vn để được tư vấn và báo giá nhanh.', 300)
  };
}

function normalizeStringArray(value: unknown, max = 10): string[] {
  if (!Array.isArray(value)) return [];
  return value.map((item) => cleanString(item, 120)).filter(Boolean).slice(0, max);
}

function cleanHtml(value: unknown): string {
  return cleanText(value, 20000)
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?>[\s\S]*?<\/style>/gi, '')
    .replace(/\son\w+="[^"]*"/gi, '')
    .replace(/\son\w+='[^']*'/gi, '');
}
