import { index, integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

// Every message sent through the contact form. The owner reads these on the
// Layerwise Database page.
export const contactMessages = sqliteTable(
  'contact_messages',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    name: text('name').notNull(),
    email: text('email').notNull(),
    message: text('message').notNull(),
    // 'sent', 'failed', or 'skipped' when ownerEmail is empty.
    emailStatus: text('email_status').notNull().default('skipped'),
    createdAt: integer('created_at', { mode: 'timestamp' })
      .notNull()
      .$defaultFn(() => new Date())
  },
  (table) => [index('contact_messages_created_at_idx').on(table.createdAt)]
);

// Fixed-window counter for the contact form, keyed by a hash of the sender's IP.
// Shared across Worker instances, unlike an in-memory limit.
export const contactRateLimits = sqliteTable(
  'contact_rate_limits',
  {
    key: text('key').primaryKey(),
    windowStart: integer('window_start').notNull(),
    count: integer('count').notNull().default(0)
  },
  (table) => [index('contact_rate_limits_window_idx').on(table.windowStart)]
);
