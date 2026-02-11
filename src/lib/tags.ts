export const LINK_TAGS = [
  'design-inspiration',
  'ai-tool',
  'dev-article',
  'ui-pattern',
  'open-source',
  'product-launch',
  'tutorial',
  'news',
  'other',
] as const;

export type LinkTag = (typeof LINK_TAGS)[number];
