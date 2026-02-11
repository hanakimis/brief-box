import { notInArray, asc } from 'drizzle-orm';
import { db } from '../db';
import { item, summary } from '../db/schema';
import { processItem } from './process-item';

const DEFAULT_BATCH_SIZE = 20;

export interface BatchResult {
  processed: number;
  failed: number;
  errors: Array<{ itemId: number; error: string }>;
}

export async function processBatch(batchSize = DEFAULT_BATCH_SIZE): Promise<BatchResult> {
  // Find items that don't have summaries yet
  const summarizedItemIds = db
    .select({ itemId: summary.itemId })
    .from(summary);

  const unsummarized = await db
    .select({ id: item.id })
    .from(item)
    .where(notInArray(item.id, summarizedItemIds))
    .orderBy(asc(item.id))
    .limit(batchSize);

  const result: BatchResult = { processed: 0, failed: 0, errors: [] };

  for (const row of unsummarized) {
    try {
      await processItem(row.id);
      result.processed++;
    } catch (err) {
      result.failed++;
      result.errors.push({
        itemId: row.id,
        error: err instanceof Error ? err.message : String(err),
      });
    }
  }

  return result;
}
