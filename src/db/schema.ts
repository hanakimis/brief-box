import {
  pgTable,
  serial,
  text,
  integer,
  timestamp,
  boolean,
  date,
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

// ── Milestone 2: Summarization ──────────────────────────────────────

export const summary = pgTable('summary', {
  id: serial('id').primaryKey(),
  itemId: integer('item_id')
    .notNull()
    .references(() => item.id, { onDelete: 'cascade' })
    .unique(),
  bullets: text('bullets').notNull(), // JSON-serialized string[]
  changeNote: text('change_note').notNull(),
  model: text('model').notNull(),
  promptVersion: text('prompt_version').notNull(),
  tokenCount: integer('token_count'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

export const link = pgTable(
  'link',
  {
    id: serial('id').primaryKey(),
    url: text('url').notNull(),
    urlHash: text('url_hash').notNull(),
    title: text('title'),
    description: text('description'),
    ogImage: text('og_image'),
    domain: text('domain').notNull(),
    tags: text('tags').notNull().default('[]'), // JSON array of tag strings
    firstSeenAt: timestamp('first_seen_at', { withTimezone: true }).notNull().defaultNow(),
    sourceCount: integer('source_count').notNull().default(1),
  },
  (t) => ({
    urlHashUnique: uniqueIndex('link_url_hash_unique').on(t.urlHash),
    domainIdx: index('link_domain_idx').on(t.domain),
  })
);

export const itemLink = pgTable(
  'item_link',
  {
    id: serial('id').primaryKey(),
    itemId: integer('item_id')
      .notNull()
      .references(() => item.id, { onDelete: 'cascade' }),
    linkId: integer('link_id')
      .notNull()
      .references(() => link.id, { onDelete: 'cascade' }),
    anchorText: text('anchor_text'),
    context: text('context'),
    position: integer('position'),
  },
  (t) => ({
    itemLinkUnique: uniqueIndex('item_link_unique').on(t.itemId, t.linkId),
  })
);

// ── Milestone 4 stubs: Digest ───────────────────────────────────────

export const digestType = pgEnum('digest_type', ['daily', 'weekly']);

export const digest = pgTable('digest', {
  id: serial('id').primaryKey(),
  type: digestType('type').notNull(),
  date: date('date').notNull(),
  title: text('title'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

export const digestItem = pgTable(
  'digest_item',
  {
    id: serial('id').primaryKey(),
    digestId: integer('digest_id')
      .notNull()
      .references(() => digest.id, { onDelete: 'cascade' }),
    itemId: integer('item_id')
      .notNull()
      .references(() => item.id, { onDelete: 'cascade' }),
    position: integer('position'),
  },
  (t) => ({
    digestItemUnique: uniqueIndex('digest_item_unique').on(t.digestId, t.itemId),
  })
);

