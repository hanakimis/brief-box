import { z } from 'zod';
import { LINK_TAGS } from '../tags';

export const extractedLinkSchema = z.object({
  url: z.string(),
  title: z.string(),
  description: z.string(),
  anchor_text: z.string(),
  context: z.string(),
  tags: z.array(z.enum(LINK_TAGS)),
  is_primary: z.boolean(),
});

export const llmResponseSchema = z.object({
  summary: z.object({
    bullets: z.array(z.string()).min(1).max(5),
    change_note: z.string(),
  }),
  links: z.array(extractedLinkSchema),
});

export type LLMResponse = z.infer<typeof llmResponseSchema>;
export type ExtractedLink = z.infer<typeof extractedLinkSchema>;
