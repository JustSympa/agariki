import { 
  pgTable, 
  uuid, 
  varchar, 
  text, 
  timestamp, 
  boolean, 
  decimal, 
  smallint,
  index 
} from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'

// User types: 0 = producer, 1 = consumer
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  userType: smallint('user_type').notNull(), // 0: producer, 1: consumer
  fullName: varchar('full_name', { length: 255 }).notNull(),
  bio: text('bio'),
  email: text('email').notNull().unique(),
  phone: varchar('phone', { length: 20 }),
  avatarUrl: text('avatar_url'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => {
  return {
    emailIdx: index('users_email_idx').on(table.email),
    userTypeIdx: index('users_user_type_idx').on(table.userType),
  }
})

// Point of Activity types: 0 = PoP (Producer), 1 = PoD (Consumer)
export const pointsOfActivity = pgTable('points_of_activity', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  type: smallint('type').notNull(), // 0: PoP, 1: PoD
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  latitude: decimal('latitude', { precision: 10, scale: 8 }).notNull(),
  longitude: decimal('longitude', { precision: 11, scale: 8 }).notNull(),
  freshCapacity: decimal('fresh_capacity', { precision: 10, scale: 2 }).default('0'),
  dryCapacity: decimal('dry_capacity', { precision: 10, scale: 2 }).default('0'),
  isActive: boolean('is_active').default(true).notNull(),
  addressHint: text('address_hint').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => {
  return {
    userIdIdx: index('poa_user_id_idx').on(table.userId),
    typeIdx: index('poa_type_idx').on(table.type),
    locationIdx: index('poa_location_idx').on(table.latitude, table.longitude),
  }
})

// Conversations between users
export const conversations = pgTable('conversations', {
  id: uuid('id').primaryKey().defaultRandom(),
  participant1Id: uuid('participant1_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  participant2Id: uuid('participant2_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  lastMessageAt: timestamp('last_message_at').defaultNow().notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => {
  return {
    participantsIdx: index('conversations_participants_idx').on(table.participant1Id, table.participant2Id),
    lastMessageIdx: index('conversations_last_message_idx').on(table.lastMessageAt),
  }
})

// Messages in conversations
export const messages = pgTable('messages', {
  id: uuid('id').primaryKey().defaultRandom(),
  conversationId: uuid('conversation_id').references(() => conversations.id, { onDelete: 'cascade' }).notNull(),
  senderId: uuid('sender_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  content: text('content').notNull(),
  read: boolean('read').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => {
  return {
    conversationIdx: index('messages_conversation_idx').on(table.conversationId),
    senderIdx: index('messages_sender_idx').on(table.senderId),
    createdAtIdx: index('messages_created_at_idx').on(table.createdAt),
  }
})

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  pointsOfActivity: many(pointsOfActivity),
  conversationsAsParticipant1: many(conversations, { relationName: 'participant1' }),
  conversationsAsParticipant2: many(conversations, { relationName: 'participant2' }),
  sentMessages: many(messages),
}))

export const pointsOfActivityRelations = relations(pointsOfActivity, ({ one }) => ({
  user: one(users, {
    fields: [pointsOfActivity.userId],
    references: [users.id],
  }),
}))

export const conversationsRelations = relations(conversations, ({ one, many }) => ({
  participant1: one(users, {
    fields: [conversations.participant1Id],
    references: [users.id],
    relationName: 'participant1',
  }),
  participant2: one(users, {
    fields: [conversations.participant2Id],
    references: [users.id],
    relationName: 'participant2',
  }),
  messages: many(messages),
}))

export const messagesRelations = relations(messages, ({ one }) => ({
  conversation: one(conversations, {
    fields: [messages.conversationId],
    references: [conversations.id],
  }),
  sender: one(users, {
    fields: [messages.senderId],
    references: [users.id],
  }),
}))

// Types for TypeScript
export type User = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert

export type PointOfActivity = typeof pointsOfActivity.$inferSelect
export type NewPointOfActivity = typeof pointsOfActivity.$inferInsert

export type Conversation = typeof conversations.$inferSelect
export type NewConversation = typeof conversations.$inferInsert

export type Message = typeof messages.$inferSelect
export type NewMessage = typeof messages.$inferInsert

// Enum constants for use in application
export const USER_TYPES = {
  PRODUCER: 0 as const,
  CONSUMER: 1 as const,
} as const

export const POA_TYPES = {
  POP: 0 as const, // Point of Presence (Producer)
  POD: 1 as const, // Point of Delivery (Consumer)
} as const