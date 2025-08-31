import {
  pgTable,
  serial,
  text,
  integer,
  timestamp,
  boolean,
  index,
  uniqueIndex,
  pgEnum,
} from 'drizzle-orm/pg-core';

// source.type enum
export const sourceType = pgEnum('source_type', ['gmail', 'rss']);

export const source = pgTable(
  'source',
  {
    id: serial('id').primaryKey(),
    name: text('name').notNull(),
    type: sourceType('type').notNull(),
    address: text('address').notNull(),
    importance: integer('importance').notNull().default(0),
  },
  (t) => ({
    nameIdx: index('source_name_idx').on(t.name),
  })
);

export const item = pgTable(
  'item',
  {
    id: serial('id').primaryKey(),
    sourceId: integer('source_id')
      .notNull()
      .references(() => source.id, { onDelete: 'cascade' }),
    receivedAt: timestamp('received_at', { withTimezone: true }).notNull(),
    subject: text('subject'),
    author: text('author'),
    html: text('html'),
    text: text('text'),
    url: text('url'),
    includedInDigest: boolean('included_in_digest').notNull().default(false),
    naturalKey: text('natural_key').notNull(),
  },
  (t) => ({
    sourceIdIdx: index('item_source_id_idx').on(t.sourceId),
    naturalKeyUnique: uniqueIndex('item_natural_key_unique').on(t.naturalKey),
  })
);

