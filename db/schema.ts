import {
	pgTable,
	uuid,
	varchar,
	text,
	timestamp,
	boolean,
	smallint,
	integer,
	bigint,
	decimal,
	date,
	jsonb,
	index,
	uniqueIndex,
	check,
	customType,
} from 'drizzle-orm/pg-core'
import { relations, sql } from 'drizzle-orm'

// ============================================================================
// PostGIS Custom Type
// ============================================================================

/**
 * PostGIS geometry(Point, 4326) custom column type.
 * Stores [longitude, latitude] as a WGS84 point.
 *
 * IMPORTANT: Requires `CREATE EXTENSION IF NOT EXISTS postgis;` in the database.
 *
 * When reading, PostGIS returns WKB hex by default. For application use,
 * query with ST_AsText() or ST_X()/ST_Y() to extract coordinates.
 * The fromDriver here handles the WKT string format from ST_AsText().
 */
const point = customType<{ data: [number, number]; driverData: string }>({
	dataType() {
		return 'geometry(Point, 4326)'
	},
	toDriver(value: [number, number]): string {
		return `SRID=4326;POINT(${value[0]} ${value[1]})`
	},
	fromDriver(value: string): [number, number] {
		const match = value.match(/POINT\(([^ ]+) ([^ ]+)\)/)
		if (match) {
			return [parseFloat(match[1]), parseFloat(match[2])]
		}
		return [0, 0]
	},
})

// ============================================================================
// Enum Definitions (as text + check constraints)
// ============================================================================

// --- Domain 1: Identity ---
export const ROLES = {
	FARMER: 'farmer' as const,
	CONSUMER: 'consumer' as const,
	ADMIN: 'admin' as const,
}
export type Role = (typeof ROLES)[keyof typeof ROLES]

export const CONSUMER_TYPES = {
	RESTAURANT: 'restaurant' as const,
	SHOP: 'shop' as const,
	HOUSEHOLD: 'household' as const,
}
export type ConsumerType = (typeof CONSUMER_TYPES)[keyof typeof CONSUMER_TYPES]

export const VERIFICATION_LEVELS = {
	BASIC: 'basic' as const,
	REFERRED: 'referred' as const,
	PARTNER: 'partner' as const,
}
export type PseudoVerification = (typeof VERIFICATION_LEVELS)[keyof typeof VERIFICATION_LEVELS]

export const LANGUAGES = {
	EN: 'en' as const,
	FR: 'fr' as const,
}
export type Language = (typeof LANGUAGES)[keyof typeof LANGUAGES]

export const MAGIC_LINK_CHANNELS = {
	WHATSAPP: 'whatsapp' as const,
	EMAIL: 'email' as const,
}
export type MagicLinkChannel = (typeof MAGIC_LINK_CHANNELS)[keyof typeof MAGIC_LINK_CHANNELS]

export const MAGIC_LINK_PURPOSES = {
	LOGIN: 'login' as const,
	REGISTRATION: 'registration' as const,
	PHONE_CHANGE: 'phone_change' as const,
	EMAIL_CHANGE: 'email_change' as const,
	LOST_DEVICE: 'lost_device' as const,
}
export type MagicLinkPurpose = (typeof MAGIC_LINK_PURPOSES)[keyof typeof MAGIC_LINK_PURPOSES]

// --- Domain 2: Geography ---
export const POA_TYPES = {
	POP: 'pop' as const,  // Point of Presence (Farmer)
	POD: 'pod' as const,  // Point of Delivery (Consumer)
}
export type PoaType = (typeof POA_TYPES)[keyof typeof POA_TYPES]

export const URGENT_FLAGS = {
	NONE: 'none' as const,
	SURPLUS_SALE: 'surplus_sale' as const,
	URGENT_DEMAND: 'urgent_demand' as const,
}
export type UrgentFlag = (typeof URGENT_FLAGS)[keyof typeof URGENT_FLAGS]

export const LANDMARK_SOURCES = {
	ADMIN: 'admin' as const,
	AI: 'ai' as const,
	USER_CORRECTION: 'user_correction' as const,
}
export type LandmarkSource = (typeof LANDMARK_SOURCES)[keyof typeof LANDMARK_SOURCES]

// --- Domain 3: Financial ---
export const WALLET_TRANSACTION_TYPES = {
	DEPOSIT: 'deposit' as const,
	WITHDRAWAL: 'withdrawal' as const,
	SUBSCRIPTION_DEBIT: 'subscription_debit' as const,
	REFERRAL_BONUS: 'referral_bonus' as const,
	REFERRAL_DISCOUNT: 'referral_discount' as const,
	DECEMBER_BONUS: 'december_bonus' as const,
	REFUND: 'refund' as const,
	ADJUSTMENT: 'adjustment' as const,
}
export type WalletTransactionType = (typeof WALLET_TRANSACTION_TYPES)[keyof typeof WALLET_TRANSACTION_TYPES]

export const PAYMENT_DIRECTIONS = {
	INBOUND: 'inbound' as const,
	OUTBOUND: 'outbound' as const,
}
export type PaymentDirection = (typeof PAYMENT_DIRECTIONS)[keyof typeof PAYMENT_DIRECTIONS]

export const PAYMENT_METHODS = {
	MTN_MOMO: 'mtn_momo' as const,
	ORANGE_MONEY: 'orange_money' as const,
}
export type PaymentMethod = (typeof PAYMENT_METHODS)[keyof typeof PAYMENT_METHODS]

export const PAYMENT_STATUSES = {
	INITIATED: 'initiated' as const,
	PENDING: 'pending' as const,
	COMPLETED: 'completed' as const,
	FAILED: 'failed' as const,
	REVERSED: 'reversed' as const,
}
export type PaymentStatus = (typeof PAYMENT_STATUSES)[keyof typeof PAYMENT_STATUSES]

export const SUBSCRIPTION_STATUSES = {
	ACTIVE: 'active' as const,
	EXPIRED: 'expired' as const,
	SUSPENDED: 'suspended' as const,
	CANCELLED: 'cancelled' as const,
}
export type SubscriptionStatus = (typeof SUBSCRIPTION_STATUSES)[keyof typeof SUBSCRIPTION_STATUSES]

// --- Domain 5: Notifications & Intents ---
export const NOTIFICATION_TYPES = {
	NEARBY_FARMER: 'nearby_farmer' as const,
	NEARBY_CONSUMER: 'nearby_consumer' as const,
	SUBSCRIPTION_EXPIRY: 'subscription_expiry' as const,
	SUBSCRIPTION_FAILED: 'subscription_failed' as const,
	PAYMENT_RECEIVED: 'payment_received' as const,
	PAYMENT_FAILED: 'payment_failed' as const,
	MATCH_SUGGESTION: 'match_suggestion' as const,
	URGENT_ALERT: 'urgent_alert' as const,
	SYSTEM: 'system' as const,
	RECEIPT: 'receipt' as const,
}
export type NotificationType = (typeof NOTIFICATION_TYPES)[keyof typeof NOTIFICATION_TYPES]

export const NOTIFICATION_CHANNELS = {
	WEB: 'web' as const,
	WHATSAPP: 'whatsapp' as const,
	BOTH: 'both' as const,
}
export type NotificationChannel = (typeof NOTIFICATION_CHANNELS)[keyof typeof NOTIFICATION_CHANNELS]

export const ORDER_INTENT_STATUSES = {
	PENDING: 'pending' as const,
	CONTACTED: 'contacted' as const,
	EXPIRED: 'expired' as const,
}
export type OrderIntentStatus = (typeof ORDER_INTENT_STATUSES)[keyof typeof ORDER_INTENT_STATUSES]

export const CONTACT_REQUEST_STATUSES = {
	PENDING: 'pending' as const,
	BATCHED: 'batched' as const,
	SENT: 'sent' as const,
	EXPIRED: 'expired' as const,
}
export type ContactRequestStatus = (typeof CONTACT_REQUEST_STATUSES)[keyof typeof CONTACT_REQUEST_STATUSES]

// --- Domain 6: WhatsApp Agent ---
export const AGENT_MESSAGE_ROLES = {
	USER: 'user' as const,
	AGENT: 'agent' as const,
	SYSTEM: 'system' as const,
}
export type AgentMessageRole = (typeof AGENT_MESSAGE_ROLES)[keyof typeof AGENT_MESSAGE_ROLES]

export const AGENT_AUDIT_ACTION_TYPES = {
	READ: 'read' as const,
	WRITE: 'write' as const,
}
export type AgentAuditActionType = (typeof AGENT_AUDIT_ACTION_TYPES)[keyof typeof AGENT_AUDIT_ACTION_TYPES]

export const AGENT_AUDIT_STATUSES = {
	SUCCESS: 'success' as const,
	FAILED: 'failed' as const,
	ESCALATED: 'escalated' as const,
	CONFIRMED: 'confirmed' as const,
	REJECTED: 'rejected' as const,
}
export type AgentAuditStatus = (typeof AGENT_AUDIT_STATUSES)[keyof typeof AGENT_AUDIT_STATUSES]

// ============================================================================
// Helper — build `col IN ('a','b',...)` SQL for check constraints
// ============================================================================

function inValues(column: any, values: readonly string[]) {
	return sql`${column} IN (${sql.join(values.map((v) => sql`${v}`), sql`, `)})`
}

// ============================================================================
// DOMAIN 1 — Identity & Authentication
// SRS: FR-01 to FR-05, FR-06 (user fields), FR-11 (consumer fields)
// ============================================================================

export const users = pgTable('users', {
	id: uuid('id').primaryKey().defaultRandom(),
	phoneNumber: varchar('phone_number', { length: 20 }).notNull().unique(),              // FR-03: primary identifier
	email: text('email').unique(),                                                        // FR-06/FR-11: optional for consumers
	fullName: varchar('full_name', { length: 255 }).notNull(),                            // FR-06/FR-11
	role: text('role').notNull(),                                                     	  // FR-01
	consumerType: text('consumer_type'),                                      			  // FR-12: only for consumers
	profilePhotoUrl: text('profile_photo_url'),                                           // FR-09
	pseudoVerification: text('pseudo_verification').default('basic').notNull(), 		  // FR-25, FR-37, FR-38
	phonePublic: boolean('phone_public').default(false).notNull(),                        // FR-13, FR-14: default false, set true for farmers in app logic
	preferredLanguage: text('preferred_language').default('fr').notNull(),         		  // FR-55, FR-57
	maxAlertsPerWeek: smallint('max_alerts_per_week').default(1),                         // FR-11: 7 restaurant, 2 shop, 1 household, cap 16
	referralCodeUsed: varchar('referral_code_used', { length: 50 }),                      // FR-08: code used at registration
	isActive: boolean('is_active').default(true).notNull(),                               // FR-64, FR-76
	isBlocked: boolean('is_blocked').default(false).notNull(),                            // FR-76
	lastActiveAt: timestamp('last_active_at', { withTimezone: true }),                    // FR-92
	createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
	updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => ([
	uniqueIndex('users_phone_idx').on(table.phoneNumber),
	uniqueIndex('users_email_idx').on(table.email),
	index('users_role_idx').on(table.role),
	index('users_is_active_idx').on(table.isActive),
	index('users_consumer_type_idx').on(table.consumerType),
	check('users_role_check', inValues(table.role, ['farmer', 'consumer', 'admin'])),
	check('users_consumer_type_check', sql`${table.consumerType} IS NULL OR ${inValues(table.consumerType, ['restaurant', 'shop', 'household'])}`),
	check('users_pseudo_verification_check', inValues(table.pseudoVerification, ['basic', 'referred', 'partner'])),
	check('users_preferred_language_check', inValues(table.preferredLanguage, ['en', 'fr'])),
]))

/**
 * Magic link tokens for passwordless authentication.
 * SRS: FR-02, FR-04
 */
export const magicLinks = pgTable('magic_links', {
	id: uuid('id').primaryKey().defaultRandom(),
	userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }),          // nullable for registration (user doesn't exist yet)
	phoneNumber: varchar('phone_number', { length: 20 }),                                 // FR-02
	email: text('email'),                                                                 // FR-02
	tokenHash: text('token_hash').notNull().unique(),                                     // FR-04: hashed token
	channel: text('channel').notNull(),                                   				  // FR-04: whatsapp or email
	purpose: text('purpose').notNull(),                                   				  // FR-02: login, registration, etc.
	expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
	consumedAt: timestamp('consumed_at', { withTimezone: true }),
	createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => ([
	uniqueIndex('magic_links_token_hash_idx').on(table.tokenHash),
	index('magic_links_expires_idx').on(table.expiresAt),
	check('magic_links_channel_check', inValues(table.channel, ['whatsapp', 'email'])),
	check('magic_links_purpose_check', inValues(table.purpose, ['login', 'registration', 'phone_change', 'email_change', 'lost_device'])),
]))

/**
 * JWT refresh token sessions.
 * SRS: FR-05 — Access tokens renew constantly, refresh tokens last 3 days.
 */
export const userSessions = pgTable('user_sessions', {
	id: uuid('id').primaryKey().defaultRandom(),
	userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
	refreshTokenHash: text('refresh_token_hash').notNull().unique(),                      // FR-05
	userAgent: text('user_agent'),
	ipAddress: varchar('ip_address', { length: 45 }),
	expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),                 // FR-05: 3 days
	revokedAt: timestamp('revoked_at', { withTimezone: true }),
	createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => ([
	index('user_sessions_user_id_idx').on(table.userId),
	uniqueIndex('user_sessions_token_idx').on(table.refreshTokenHash),
]))

// ============================================================================
// DOMAIN 2 — Geography & Points of Activity
// SRS: FR-06, FR-07, FR-09, FR-10, FR-15 to FR-20, FR-24, FR-80, FR-90, FR-91
// ============================================================================

/**
 * Known landmark database for improved geocoding accuracy.
 * SRS: FR-17, T-01 (feedback loop for AI training)
 */
export const landmarks = pgTable('landmarks', {
	id: uuid('id').primaryKey().defaultRandom(),
	name: varchar('name', { length: 255 }).notNull(),                                   // FR-17
	aliases: text('aliases').array(),                                                   // alternative names
	city: varchar('city', { length: 100 }),
	region: varchar('region', { length: 100 }),
	coordinates: point('coordinates').notNull(),                                        // FR-17: PostGIS point
	source: text('source').default('admin').notNull(),                       			// T-01
	createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => ([
	check('landmarks_source_check', inValues(table.source, ['admin', 'ai', 'user_correction'])),
]))

/**
 * Points of Activity — PoP (farmer) or PoD (consumer) map markers.
 * SRS: FR-06, FR-11, FR-15, FR-18, FR-19, FR-24, FR-90, FR-91
 */
export const pointsOfActivity = pgTable('points_of_activity', {
	id: uuid('id').primaryKey().defaultRandom(),
	userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
	type: text('type').notNull(),                                                   		// FR-24: pop or pod
	name: varchar('name', { length: 255 }).notNull(),                 						// FR-06
	locationText: text('location_text').notNull(),                                         	// FR-15: landmark description
	coordinates: point('coordinates').notNull(),                                           	// FR-18: PostGIS geometry
	coordinatesEditedManually: boolean('coordinates_edited_manually').default(false).notNull(), // FR-19
	weeklyCapacityKg: decimal('weekly_capacity_kg', { precision: 10, scale: 2 }).notNull(), // FR-06, FR-11
	qualityIndicators: text('quality_indicators'),                                         	// FR-90
	imageUrls: jsonb('image_urls'),                                                        	// FR-09: array of S3 URLs
	urgentFlag: text('urgent_flag').default('none').notNull(),                    			// FR-91
	urgentFlagExpiresAt: timestamp('urgent_flag_expires_at', { withTimezone: true }),       // FR-91: auto-expire
	isActive: boolean('is_active').default(true).notNull(),
	createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
	updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => ([
	index('poa_user_id_idx').on(table.userId),
	index('poa_type_idx').on(table.type),
	index('poa_is_active_idx').on(table.isActive),
	index('poa_urgent_flag_idx').on(table.urgentFlag),
	// NOTE: GIST index on `coordinates` must be created via raw SQL migration:
	//   CREATE INDEX poa_coordinates_gist_idx ON points_of_activity USING GIST (coordinates);
	// Drizzle doesn't support GIST index syntax natively.
	check('poa_type_check', inValues(table.type, ['pop', 'pod'])),
	check('poa_urgent_flag_check', inValues(table.urgentFlag, ['none', 'surplus_sale', 'urgent_demand'])),
]))

/**
 * Admin-managed catalog of mushroom varieties.
 * SRS: FR-07, FR-80. Bilingual names per FR-55.
 */
export const mushroomVarieties = pgTable('mushroom_varieties', {
	id: uuid('id').primaryKey().defaultRandom(),
	tag: varchar('tag', { length: 50 }).notNull().unique(),                                // FR-80: machine name
	displayNameEn: varchar('display_name_en', { length: 100 }).notNull(),                  // FR-55
	displayNameFr: varchar('display_name_fr', { length: 100 }).notNull(),                  // FR-55
	descriptionEn: text('description_en'),
	descriptionFr: text('description_fr'),
	photoUrl: text('photo_url'),
	isCustom: boolean('is_custom').default(false).notNull(),                               // FR-07: user-created variety
	createdByUserId: uuid('created_by_user_id').references(() => users.id, { onDelete: 'set null' }),
	isActive: boolean('is_active').default(true).notNull(),                                // FR-80
	createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => ([
	uniqueIndex('mushroom_varieties_tag_idx').on(table.tag),
]))

/**
 * Junction table: PoA ↔ Variety with per-variety pricing.
 * SRS: FR-07 — Farmers list multiple varieties with separate pricing.
 */
export const poaVarieties = pgTable('poa_varieties', {
	id: uuid('id').primaryKey().defaultRandom(),
	poaId: uuid('poa_id').references(() => pointsOfActivity.id, { onDelete: 'cascade' }).notNull(),
	varietyId: uuid('variety_id').references(() => mushroomVarieties.id, { onDelete: 'restrict' }).notNull(),
	pricePerKgXaf: integer('price_per_kg_xaf').notNull(),                                  // FR-06, FR-07
	createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
	updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => ([
	uniqueIndex('poa_varieties_unique_idx').on(table.poaId, table.varietyId),
	index('poa_varieties_poa_idx').on(table.poaId),
	index('poa_varieties_variety_idx').on(table.varietyId),
]))

/**
 * Farmer certification/documentation uploads.
 * SRS: FR-10
 */
export const farmerDocuments = pgTable('farmer_documents', {
	id: uuid('id').primaryKey().defaultRandom(),
	userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
	documentUrl: text('document_url').notNull(),                                           // FR-10: S3 URL
	documentType: varchar('document_type', { length: 100 }),                               // e.g. "certification", "license"
	label: varchar('label', { length: 255 }),
	uploadedAt: timestamp('uploaded_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => ([
	index('farmer_documents_user_id_idx').on(table.userId),
]))

// ============================================================================
// DOMAIN 3 — Financial (Wallet, Transactions, Subscriptions)
// SRS: FR-63 to FR-75
// ============================================================================

/**
 * Internal wallet — one per farmer, denominated in XAF.
 * SRS: FR-65, FR-70
 */
export const wallets = pgTable('wallets', {
	id: uuid('id').primaryKey().defaultRandom(),
	userId: uuid('user_id').references(() => users.id, { onDelete: 'restrict' }).notNull().unique(), // FR-65: one wallet per farmer
	balanceXaf: bigint('balance_xaf', { mode: 'number' }).notNull().default(0),            			// FR-65, FR-70
	createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
	updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => ([
	uniqueIndex('wallets_user_id_idx').on(table.userId),
	check('wallets_balance_non_negative', sql`${table.balanceXaf} >= 0`), // FR-70
]))

/**
 * Immutable ledger of all wallet transactions.
 * Application MUST NOT UPDATE or DELETE rows from this table.
 * SRS: FR-74, §10 (double-entry-style ledger, idempotency keys)
 */
export const walletTransactions = pgTable('wallet_transactions', {
	id: uuid('id').primaryKey().defaultRandom(),
	walletId: uuid('wallet_id').references(() => wallets.id, { onDelete: 'restrict' }).notNull(),
	type: text('type').notNull(),                                     						// FR-66–FR-69, FR-74
	amountXaf: bigint('amount_xaf', { mode: 'number' }).notNull(),                         // positive = credit, negative = debit
	balanceAfterXaf: bigint('balance_after_xaf', { mode: 'number' }).notNull(),             // snapshot for audit chain
	idempotencyKey: varchar('idempotency_key', { length: 255 }).notNull().unique(),        // §10: prevent duplicates
	reference: text('reference'),                                                          // external payment ref
	description: text('description'),                                                      // FR-72
	metadata: jsonb('metadata'),                                                           // provider details, etc.
	createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => ([
	index('wallet_tx_wallet_id_idx').on(table.walletId),
	index('wallet_tx_type_idx').on(table.type),
	index('wallet_tx_created_at_idx').on(table.createdAt),
	uniqueIndex('wallet_tx_idempotency_idx').on(table.idempotencyKey),
	check('wallet_tx_type_check', inValues(table.type, [
		'deposit', 'withdrawal', 'subscription_debit', 'referral_bonus',
		'referral_discount', 'december_bonus', 'refund', 'adjustment',
	])),
]))

/**
 * External payment gateway interactions (MoMo, Orange Money).
 * SRS: FR-66 (deposits/withdrawals), FR-75 (receipts and status)
 */
export const paymentTransactions = pgTable('payment_transactions', {
	id: uuid('id').primaryKey().defaultRandom(),
	walletId: uuid('wallet_id').references(() => wallets.id, { onDelete: 'restrict' }).notNull(),
	direction: text('direction').notNull(),                                 				// FR-66: inbound or outbound
	paymentMethod: text('payment_method').notNull(),                           				// FR-66: mtn_momo or orange_money
	amountXaf: bigint('amount_xaf', { mode: 'number' }).notNull(),                         // FR-66
	providerReference: text('provider_reference'),                                         // FR-75
	status: text('status').notNull(),                                         				// FR-75
	walletTransactionId: uuid('wallet_transaction_id').references(() => walletTransactions.id), // linked ledger entry
	initiatedAt: timestamp('initiated_at', { withTimezone: true }).defaultNow().notNull(),
	completedAt: timestamp('completed_at', { withTimezone: true }),
}, (table) => ([
	index('payment_tx_wallet_id_idx').on(table.walletId),
	index('payment_tx_status_idx').on(table.status),
	check('payment_tx_direction_check', inValues(table.direction, ['inbound', 'outbound'])),
	check('payment_tx_method_check', inValues(table.paymentMethod, ['mtn_momo', 'orange_money'])),
	check('payment_tx_status_check', inValues(table.status, ['initiated', 'pending', 'completed', 'failed', 'reversed'])),
]))

/**
 * Farmer subscription periods.
 * SRS: FR-64, FR-67, FR-68, FR-69
 */
export const subscriptions = pgTable('subscriptions', {
	id: uuid('id').primaryKey().defaultRandom(),
	userId: uuid('user_id').references(() => users.id, { onDelete: 'restrict' }).notNull(), // FR-64
	status: text('status').notNull(),                                    // FR-64
	monthlyPriceXaf: integer('monthly_price_xaf').notNull(),                               // FR-64: price at time of purchase
	discountPercent: smallint('discount_percent').default(0).notNull(),                     // FR-68: 40% for referral first month
	startsAt: timestamp('starts_at', { withTimezone: true }).notNull(),
	expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
	isDecemberBonus: boolean('is_december_bonus').default(false).notNull(),                 // FR-69
	walletTransactionId: uuid('wallet_transaction_id').references(() => walletTransactions.id), // FR-67: which tx paid for this
	createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => ([
	index('subscriptions_user_id_idx').on(table.userId),
	index('subscriptions_status_idx').on(table.status),
	index('subscriptions_expires_at_idx').on(table.expiresAt),
	check('subscriptions_status_check', inValues(table.status, ['active', 'expired', 'suspended', 'cancelled'])),
]))

// ============================================================================
// DOMAIN 4 — Referral System
// SRS: FR-08, FR-25, FR-68, FR-69, FR-77
// ============================================================================

/**
 * Admin-issued referral codes. Code owners get 'partner' badge.
 * SRS: FR-08, FR-25, FR-77
 */
export const referralCodes = pgTable('referral_codes', {
	id: uuid('id').primaryKey().defaultRandom(),
	code: varchar('code', { length: 50 }).notNull().unique(),                              // FR-08
	ownerUserId: uuid('owner_user_id').references(() => users.id, { onDelete: 'restrict' }).notNull(), // FR-25: partner
	referrerRewardPercent: smallint('referrer_reward_percent').default(25).notNull(),       // FR-68: 25% of discounted amount
	refereeDiscountPercent: smallint('referee_discount_percent').default(40).notNull(),     // FR-68: 40% first month
	isActive: boolean('is_active').default(true).notNull(),                                // FR-77: can be revoked
	validUntil: timestamp('valid_until', { withTimezone: true }),
	createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => ([
	uniqueIndex('referral_codes_code_idx').on(table.code),
	index('referral_codes_owner_idx').on(table.ownerUserId),
]))

/**
 * Tracks which users used which referral code and resulting bonuses.
 * SRS: FR-68
 */
export const referralUsages = pgTable('referral_usages', {
	id: uuid('id').primaryKey().defaultRandom(),
	referralCodeId: uuid('referral_code_id').references(() => referralCodes.id, { onDelete: 'restrict' }).notNull(),
	referredUserId: uuid('referred_user_id').references(() => users.id, { onDelete: 'restrict' }).notNull().unique(), // one use per user
	discountTransactionId: uuid('discount_transaction_id').references(() => walletTransactions.id), // FR-68
	bonusTransactionId: uuid('bonus_transaction_id').references(() => walletTransactions.id),       // FR-68
	createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => ([
	uniqueIndex('referral_usages_user_idx').on(table.referredUserId),
	index('referral_usages_code_idx').on(table.referralCodeId),
]))

// ============================================================================
// DOMAIN 5 — Notifications, Intents & Search
// SRS: FR-48 to FR-50, FR-62, FR-71, FR-88, FR-89, FR-34, FR-83
// ============================================================================

/**
 * In-app and WhatsApp notifications.
 * SRS: FR-48–FR-50, FR-71, FR-75
 */
export const notifications = pgTable('notifications', {
	id: uuid('id').primaryKey().defaultRandom(),
	userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
	type: text('type').notNull(),                                          // FR-48–FR-50, FR-71
	title: varchar('title', { length: 255 }).notNull(),
	message: text('message').notNull(),
	channel: text('channel').default('both').notNull(),                  // FR-75
	isRead: boolean('is_read').default(false).notNull(),
	isSentWhatsapp: boolean('is_sent_whatsapp').default(false).notNull(),
	relatedEntityType: varchar('related_entity_type', { length: 50 }),                     // e.g. 'user', 'subscription'
	relatedEntityId: uuid('related_entity_id'),
	createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => ([
	index('notifications_user_id_idx').on(table.userId),
	index('notifications_is_read_idx').on(table.isRead),
	index('notifications_type_idx').on(table.type),
	index('notifications_created_at_idx').on(table.createdAt),
	check('notifications_type_check', inValues(table.type, [
		'nearby_farmer', 'nearby_consumer', 'subscription_expiry', 'subscription_failed',
		'payment_received', 'payment_failed', 'match_suggestion', 'urgent_alert',
		'system', 'receipt',
	])),
	check('notifications_channel_check', inValues(table.channel, ['web', 'whatsapp', 'both'])),
]))

/**
 * "Interested" button — logs contact intent without sharing info.
 * SRS: FR-88
 */
export const orderIntents = pgTable('order_intents', {
	id: uuid('id').primaryKey().defaultRandom(),
	fromUserId: uuid('from_user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
	toUserId: uuid('to_user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
	poaId: uuid('poa_id').references(() => pointsOfActivity.id, { onDelete: 'set null' }),
	status: text('status').default('pending').notNull(),
	createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => ([
	index('order_intents_from_user_idx').on(table.fromUserId),
	index('order_intents_to_user_idx').on(table.toUserId),
	uniqueIndex('order_intents_unique_idx').on(
		table.fromUserId, table.toUserId, table.poaId
	),
	check('order_intents_status_check', inValues(table.status, ['pending', 'contacted', 'expired'])),
]))

/**
 * Privacy-respecting contact requests.
 * When a consumer's phone is private, intents are collected over a window
 * then batched into a single message to the target user.
 * SRS: FR-62
 */
export const contactRequests = pgTable('contact_requests', {
	id: uuid('id').primaryKey().defaultRandom(),
	requesterUserId: uuid('requester_user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
	targetUserId: uuid('target_user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
	status: text('status').default('pending').notNull(),                // FR-62
	batchSentAt: timestamp('batch_sent_at', { withTimezone: true }),                        // FR-62
	createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => ([
	index('contact_requests_requester_idx').on(table.requesterUserId),
	index('contact_requests_target_idx').on(table.targetUserId),
	index('contact_requests_status_idx').on(table.status),
	check('contact_requests_status_check', inValues(table.status, ['pending', 'batched', 'sent', 'expired'])),
]))

/**
 * Search history for analytics and "recent searches" dashboard.
 * SRS: FR-34, FR-83
 */
export const searchLogs = pgTable('search_logs', {
	id: uuid('id').primaryKey().defaultRandom(),
	userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
	queryText: text('query_text'),                                                         // FR-29
	filters: jsonb('filters'),                                                             // FR-27: variety, price, distance
	resultCount: integer('result_count'),
	createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => ([
	index('search_logs_user_id_idx').on(table.userId),
	index('search_logs_created_at_idx').on(table.createdAt),
]))

/**
 * Price snapshots for trend visualization.
 * SRS: FR-89 — show price trends over the last 30 days.
 */
export const priceHistory = pgTable('price_history', {
	id: uuid('id').primaryKey().defaultRandom(),
	poaId: uuid('poa_id').references(() => pointsOfActivity.id, { onDelete: 'cascade' }).notNull(),
	varietyId: uuid('variety_id').references(() => mushroomVarieties.id, { onDelete: 'restrict' }).notNull(),
	pricePerKgXaf: integer('price_per_kg_xaf').notNull(),
	recordedAt: timestamp('recorded_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => ([
	index('price_history_trend_idx').on(table.poaId, table.varietyId, table.recordedAt),
]))

// ============================================================================
// DOMAIN 6 — WhatsApp Agent
// SRS: FR-44, FR-52, FR-54, FR-84, FR-87
// ============================================================================

/**
 * WhatsApp agent conversation sessions.
 * SRS: FR-52
 */
export const agentConversations = pgTable('agent_conversations', {
	id: uuid('id').primaryKey().defaultRandom(),
	userId: uuid('user_id').references(() => users.id, { onDelete: 'set null' }),          // nullable: user may not be registered yet
	phoneNumber: varchar('phone_number', { length: 20 }).notNull(),                        // FR-84
	language: text('language').default('fr').notNull(),                             // FR-54
	startedAt: timestamp('started_at', { withTimezone: true }).defaultNow().notNull(),
	lastMessageAt: timestamp('last_message_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => ([
	index('agent_conv_user_id_idx').on(table.userId),
	index('agent_conv_phone_idx').on(table.phoneNumber),
	check('agent_conv_language_check', inValues(table.language, ['en', 'fr'])),
]))

/**
 * Individual messages within agent conversations.
 * SRS: FR-52
 */
export const agentMessages = pgTable('agent_messages', {
	id: uuid('id').primaryKey().defaultRandom(),
	conversationId: uuid('conversation_id').references(() => agentConversations.id, { onDelete: 'cascade' }).notNull(),
	role: text('role').notNull(),                                          // FR-52: user, agent, or system
	content: text('content').notNull(),
	createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => ([
	index('agent_msg_conversation_idx').on(table.conversationId),
	index('agent_msg_created_at_idx').on(table.createdAt),
	check('agent_msg_role_check', inValues(table.role, ['user', 'agent', 'system'])),
]))

/**
 * Audit log for every agent action that reads or modifies the database.
 * SRS: FR-52, FR-87
 */
export const agentAuditLogs = pgTable('agent_audit_logs', {
	id: uuid('id').primaryKey().defaultRandom(),
	conversationId: uuid('conversation_id').references(() => agentConversations.id, { onDelete: 'set null' }),
	userId: uuid('user_id').references(() => users.id, { onDelete: 'set null' }),
	phoneNumber: varchar('phone_number', { length: 20 }).notNull(),                        // FR-84
	action: varchar('action', { length: 100 }).notNull(),                                  // e.g. 'profile_update', 'wallet_fund'
	actionType: text('action_type').notNull(),                          // FR-87: read or write
	requestData: jsonb('request_data'),
	responseData: jsonb('response_data'),
	status: text('status').notNull(),                                      // FR-53, FR-85
	createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => ([
	index('agent_audit_user_id_idx').on(table.userId),
	index('agent_audit_action_idx').on(table.action),
	index('agent_audit_created_at_idx').on(table.createdAt),
	check('agent_audit_action_type_check', inValues(table.actionType, ['read', 'write'])),
	check('agent_audit_status_check', inValues(table.status, ['success', 'failed', 'escalated', 'confirmed', 'rejected'])),
]))

/**
 * Daily token quota tracking for the WhatsApp agent.
 * SRS: FR-44 — dynamic quota per user role, reset daily.
 */
export const agentTokenUsage = pgTable('agent_token_usage', {
	id: uuid('id').primaryKey().defaultRandom(),
	userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
	date: date('date').notNull(),                                                          // FR-44
	tokensUsed: integer('tokens_used').default(0).notNull(),
	tokenLimit: integer('token_limit').notNull(),                                          // FR-44: dynamic, computed by app logic
	createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => ([
	uniqueIndex('agent_token_usage_user_date_idx').on(table.userId, table.date),
]))

// ============================================================================
// DOMAIN 7 — Administration
// SRS: FR-76 to FR-80
// ============================================================================

/**
 * Audit trail for all admin panel operations.
 * SRS: FR-76–FR-80
 */
export const adminActions = pgTable('admin_actions', {
	id: uuid('id').primaryKey().defaultRandom(),
	adminUserId: uuid('admin_user_id').references(() => users.id, { onDelete: 'restrict' }).notNull(),
	action: varchar('action', { length: 100 }).notNull(),                                  // e.g. 'block_user', 'issue_referral'
	targetEntityType: varchar('target_entity_type', { length: 50 }).notNull(),             // e.g. 'user', 'referral_code', 'poa'
	targetEntityId: uuid('target_entity_id').notNull(),
	details: jsonb('details'),
	createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => ([
	index('admin_actions_admin_idx').on(table.adminUserId),
	index('admin_actions_created_at_idx').on(table.createdAt),
]))

// ============================================================================
// Relations
// ============================================================================

// --- Users ---
export const usersRelations = relations(users, ({ one, many }) => ({
	pointsOfActivity: many(pointsOfActivity),
	wallet: one(wallets),
	subscriptions: many(subscriptions),
	documents: many(farmerDocuments),
	notifications: many(notifications),
	searchLogs: many(searchLogs),
	sentOrderIntents: many(orderIntents, { relationName: 'sentIntents' }),
	receivedOrderIntents: many(orderIntents, { relationName: 'receivedIntents' }),
	sentContactRequests: many(contactRequests, { relationName: 'sentContactRequests' }),
	receivedContactRequests: many(contactRequests, { relationName: 'receivedContactRequests' }),
	agentConversations: many(agentConversations),
	agentAuditLogs: many(agentAuditLogs),
	agentTokenUsage: many(agentTokenUsage),
	sessions: many(userSessions),
	ownedReferralCodes: many(referralCodes),
	adminActions: many(adminActions),
}))

// --- Points of Activity ---
export const pointsOfActivityRelations = relations(pointsOfActivity, ({ one, many }) => ({
	user: one(users, {
		fields: [pointsOfActivity.userId],
		references: [users.id],
	}),
	varieties: many(poaVarieties),
	priceHistory: many(priceHistory),
}))

// --- PoA Varieties ---
export const poaVarietiesRelations = relations(poaVarieties, ({ one }) => ({
	poa: one(pointsOfActivity, {
		fields: [poaVarieties.poaId],
		references: [pointsOfActivity.id],
	}),
	variety: one(mushroomVarieties, {
		fields: [poaVarieties.varietyId],
		references: [mushroomVarieties.id],
	}),
}))

// --- Mushroom Varieties ---
export const mushroomVarietiesRelations = relations(mushroomVarieties, ({ one, many }) => ({
	poaVarieties: many(poaVarieties),
	priceHistory: many(priceHistory),
	createdBy: one(users, {
		fields: [mushroomVarieties.createdByUserId],
		references: [users.id],
	}),
}))

// --- Farmer Documents ---
export const farmerDocumentsRelations = relations(farmerDocuments, ({ one }) => ({
	user: one(users, {
		fields: [farmerDocuments.userId],
		references: [users.id],
	}),
}))

// --- Wallets ---
export const walletsRelations = relations(wallets, ({ one, many }) => ({
	user: one(users, {
		fields: [wallets.userId],
		references: [users.id],
	}),
	transactions: many(walletTransactions),
	paymentTransactions: many(paymentTransactions),
}))

// --- Wallet Transactions ---
export const walletTransactionsRelations = relations(walletTransactions, ({ one }) => ({
	wallet: one(wallets, {
		fields: [walletTransactions.walletId],
		references: [wallets.id],
	}),
}))

// --- Payment Transactions ---
export const paymentTransactionsRelations = relations(paymentTransactions, ({ one }) => ({
	wallet: one(wallets, {
		fields: [paymentTransactions.walletId],
		references: [wallets.id],
	}),
	walletTransaction: one(walletTransactions, {
		fields: [paymentTransactions.walletTransactionId],
		references: [walletTransactions.id],
	}),
}))

// --- Subscriptions ---
export const subscriptionsRelations = relations(subscriptions, ({ one }) => ({
	user: one(users, {
		fields: [subscriptions.userId],
		references: [users.id],
	}),
	walletTransaction: one(walletTransactions, {
		fields: [subscriptions.walletTransactionId],
		references: [walletTransactions.id],
	}),
}))

// --- Referral Codes ---
export const referralCodesRelations = relations(referralCodes, ({ one, many }) => ({
	owner: one(users, {
		fields: [referralCodes.ownerUserId],
		references: [users.id],
	}),
	usages: many(referralUsages),
}))

// --- Referral Usages ---
export const referralUsagesRelations = relations(referralUsages, ({ one }) => ({
	referralCode: one(referralCodes, {
		fields: [referralUsages.referralCodeId],
		references: [referralCodes.id],
	}),
	referredUser: one(users, {
		fields: [referralUsages.referredUserId],
		references: [users.id],
	}),
	discountTransaction: one(walletTransactions, {
		fields: [referralUsages.discountTransactionId],
		references: [walletTransactions.id],
	}),
	bonusTransaction: one(walletTransactions, {
		fields: [referralUsages.bonusTransactionId],
		references: [walletTransactions.id],
	}),
}))

// --- Notifications ---
export const notificationsRelations = relations(notifications, ({ one }) => ({
	user: one(users, {
		fields: [notifications.userId],
		references: [users.id],
	}),
}))

// --- Order Intents ---
export const orderIntentsRelations = relations(orderIntents, ({ one }) => ({
	fromUser: one(users, {
		fields: [orderIntents.fromUserId],
		references: [users.id],
		relationName: 'sentIntents',
	}),
	toUser: one(users, {
		fields: [orderIntents.toUserId],
		references: [users.id],
		relationName: 'receivedIntents',
	}),
	poa: one(pointsOfActivity, {
		fields: [orderIntents.poaId],
		references: [pointsOfActivity.id],
	}),
}))

// --- Contact Requests ---
export const contactRequestsRelations = relations(contactRequests, ({ one }) => ({
	requester: one(users, {
		fields: [contactRequests.requesterUserId],
		references: [users.id],
		relationName: 'sentContactRequests',
	}),
	target: one(users, {
		fields: [contactRequests.targetUserId],
		references: [users.id],
		relationName: 'receivedContactRequests',
	}),
}))

// --- Search Logs ---
export const searchLogsRelations = relations(searchLogs, ({ one }) => ({
	user: one(users, {
		fields: [searchLogs.userId],
		references: [users.id],
	}),
}))

// --- Price History ---
export const priceHistoryRelations = relations(priceHistory, ({ one }) => ({
	poa: one(pointsOfActivity, {
		fields: [priceHistory.poaId],
		references: [pointsOfActivity.id],
	}),
	variety: one(mushroomVarieties, {
		fields: [priceHistory.varietyId],
		references: [mushroomVarieties.id],
	}),
}))

// --- Agent Conversations ---
export const agentConversationsRelations = relations(agentConversations, ({ one, many }) => ({
	user: one(users, {
		fields: [agentConversations.userId],
		references: [users.id],
	}),
	messages: many(agentMessages),
	auditLogs: many(agentAuditLogs),
}))

// --- Agent Messages ---
export const agentMessagesRelations = relations(agentMessages, ({ one }) => ({
	conversation: one(agentConversations, {
		fields: [agentMessages.conversationId],
		references: [agentConversations.id],
	}),
}))

// --- Agent Audit Logs ---
export const agentAuditLogsRelations = relations(agentAuditLogs, ({ one }) => ({
	conversation: one(agentConversations, {
		fields: [agentAuditLogs.conversationId],
		references: [agentConversations.id],
	}),
	user: one(users, {
		fields: [agentAuditLogs.userId],
		references: [users.id],
	}),
}))

// --- Agent Token Usage ---
export const agentTokenUsageRelations = relations(agentTokenUsage, ({ one }) => ({
	user: one(users, {
		fields: [agentTokenUsage.userId],
		references: [users.id],
	}),
}))

// --- Magic Links ---
export const magicLinksRelations = relations(magicLinks, ({ one }) => ({
	user: one(users, {
		fields: [magicLinks.userId],
		references: [users.id],
	}),
}))

// --- User Sessions ---
export const userSessionsRelations = relations(userSessions, ({ one }) => ({
	user: one(users, {
		fields: [userSessions.userId],
		references: [users.id],
	}),
}))

// --- Admin Actions ---
export const adminActionsRelations = relations(adminActions, ({ one }) => ({
	admin: one(users, {
		fields: [adminActions.adminUserId],
		references: [users.id],
	}),
}))

// ============================================================================
// TypeScript Type Exports
// ============================================================================

export type User = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert

export type PointOfActivity = typeof pointsOfActivity.$inferSelect
export type NewPointOfActivity = typeof pointsOfActivity.$inferInsert

export type MushroomVariety = typeof mushroomVarieties.$inferSelect
export type NewMushroomVariety = typeof mushroomVarieties.$inferInsert

export type PoaVariety = typeof poaVarieties.$inferSelect
export type NewPoaVariety = typeof poaVarieties.$inferInsert

export type FarmerDocument = typeof farmerDocuments.$inferSelect
export type NewFarmerDocument = typeof farmerDocuments.$inferInsert

export type Wallet = typeof wallets.$inferSelect
export type NewWallet = typeof wallets.$inferInsert

export type WalletTransaction = typeof walletTransactions.$inferSelect
export type NewWalletTransaction = typeof walletTransactions.$inferInsert

export type PaymentTransaction = typeof paymentTransactions.$inferSelect
export type NewPaymentTransaction = typeof paymentTransactions.$inferInsert

export type Subscription = typeof subscriptions.$inferSelect
export type NewSubscription = typeof subscriptions.$inferInsert

export type ReferralCode = typeof referralCodes.$inferSelect
export type NewReferralCode = typeof referralCodes.$inferInsert

export type ReferralUsage = typeof referralUsages.$inferSelect
export type NewReferralUsage = typeof referralUsages.$inferInsert

export type Notification = typeof notifications.$inferSelect
export type NewNotification = typeof notifications.$inferInsert

export type OrderIntent = typeof orderIntents.$inferSelect
export type NewOrderIntent = typeof orderIntents.$inferInsert

export type ContactRequest = typeof contactRequests.$inferSelect
export type NewContactRequest = typeof contactRequests.$inferInsert

export type SearchLog = typeof searchLogs.$inferSelect
export type NewSearchLog = typeof searchLogs.$inferInsert

export type PriceHistoryEntry = typeof priceHistory.$inferSelect
export type NewPriceHistoryEntry = typeof priceHistory.$inferInsert

export type AgentConversation = typeof agentConversations.$inferSelect
export type NewAgentConversation = typeof agentConversations.$inferInsert

export type AgentMessage = typeof agentMessages.$inferSelect
export type NewAgentMessage = typeof agentMessages.$inferInsert

export type AgentAuditLog = typeof agentAuditLogs.$inferSelect
export type NewAgentAuditLog = typeof agentAuditLogs.$inferInsert

export type AgentTokenUsageEntry = typeof agentTokenUsage.$inferSelect
export type NewAgentTokenUsageEntry = typeof agentTokenUsage.$inferInsert

export type Landmark = typeof landmarks.$inferSelect
export type NewLandmark = typeof landmarks.$inferInsert

export type MagicLink = typeof magicLinks.$inferSelect
export type NewMagicLink = typeof magicLinks.$inferInsert

export type UserSession = typeof userSessions.$inferSelect
export type NewUserSession = typeof userSessions.$inferInsert

export type AdminAction = typeof adminActions.$inferSelect
export type NewAdminAction = typeof adminActions.$inferInsert

/** Default max alerts per week by consumer type (FR-11) */
export const DEFAULT_ALERTS_PER_WEEK = {
	restaurant: 7,
	shop: 2,
	household: 1,
} as const

/** Maximum alerts per week cap (FR-11) */
export const MAX_ALERTS_CAP = 16