import {
  pgTable,
  text,
  varchar,
  timestamp,
  uuid,
  integer,
  boolean,
  jsonb,
  serial,
} from "drizzle-orm/pg-core";

// ─── Users (NextAuth) ────────────────────────────────────────────────
export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: text("password").notNull(),
  role: varchar("role", { length: 50 }).notNull().default("admin"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ─── Hero Slides ─────────────────────────────────────────────────────
export const heroSlides = pgTable("hero_slides", {
  id: serial("id").primaryKey(),
  image: text("image").notNull(),
  tag: varchar("tag", { length: 255 }).notNull(),
  tagIcon: varchar("tag_icon", { length: 100 }).notNull().default("Leaf"),
  headline: text("headline").notNull(),
  subtext: text("subtext").notNull(),
  ctaLabel: varchar("cta_label", { length: 100 }).notNull(),
  ctaHref: varchar("cta_href", { length: 255 }).notNull(),
  accent: varchar("accent", { length: 20 }).notNull().default("#f4c430"),
  statValue: varchar("stat_value", { length: 50 }),
  statLabel: varchar("stat_label", { length: 100 }),
  sortOrder: integer("sort_order").notNull().default(0),
  active: boolean("active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ─── Dignitaries ─────────────────────────────────────────────────────
export const dignitaries = pgTable("dignitaries", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  role: varchar("role", { length: 255 }).notNull(),
  image: text("image").notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
  active: boolean("active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ─── Site Settings (key-value) ───────────────────────────────────────
export const siteSettings = pgTable("site_settings", {
  id: serial("id").primaryKey(),
  key: varchar("key", { length: 100 }).notNull().unique(),
  value: text("value").notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ─── Tribes ──────────────────────────────────────────────────────────
export const tribes = pgTable("tribes", {
  id: varchar("id", { length: 100 }).primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  image: text("image").notNull().default(""),
  excerpt: text("excerpt").notNull().default(""),
  content: text("content").notNull().default(""),
  accent: varchar("accent", { length: 20 }).notNull().default("#1077A6"),
  heroImage: text("hero_image").notNull(),
  sections: jsonb("sections").notNull().default("[]"),
  gallery: jsonb("gallery").notNull().default("[]"),
  sortOrder: integer("sort_order").notNull().default(0),
  active: boolean("active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ─── Staff (Who's Who) ──────────────────────────────────────────────
export const staff = pgTable("staff", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  position: varchar("position", { length: 255 }).notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
  active: boolean("active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ─── Gallery Categories ─────────────────────────────────────────────
export const galleryCategories = pgTable("gallery_categories", {
  id: serial("id").primaryKey(),
  slug: varchar("slug", { length: 100 }).notNull().unique(),
  label: varchar("label", { length: 255 }).notNull(),
  description: text("description"),
  sortOrder: integer("sort_order").notNull().default(0),
  active: boolean("active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ─── Gallery Images ─────────────────────────────────────────────────
export const galleryImages = pgTable("gallery_images", {
  id: serial("id").primaryKey(),
  categoryId: integer("category_id")
    .notNull()
    .references(() => galleryCategories.id, { onDelete: "cascade" }),
  src: text("src").notNull(),
  alt: varchar("alt", { length: 255 }).notNull(),
  caption: text("caption"),
  sortOrder: integer("sort_order").notNull().default(0),
  active: boolean("active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ─── Contact Messages ───────────────────────────────────────────────
export const contactMessages = pgTable("contact_messages", {
  id: serial("id").primaryKey(),
  firstName: varchar("first_name", { length: 100 }).notNull(),
  lastName: varchar("last_name", { length: 100 }),
  email: varchar("email", { length: 255 }).notNull(),
  message: text("message").notNull(),
  read: boolean("read").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ─── Pages (About, etc.) ────────────────────────────────────────────
export const pages = pgTable("pages", {
  id: serial("id").primaryKey(),
  slug: varchar("slug", { length: 100 }).notNull().unique(),
  title: varchar("title", { length: 255 }).notNull(),
  content: jsonb("content").notNull().default("{}"),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ─── Updates (News, Events, Circulars, Training) ────────────────────
export const updates = pgTable("updates", {
  id: serial("id").primaryKey(),
  category: varchar("category", { length: 50 }).notNull(),
  title: varchar("title", { length: 500 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  excerpt: text("excerpt"),
  content: text("content").notNull(),
  image: text("image"),
  publishedAt: timestamp("published_at").defaultNow().notNull(),
  active: boolean("active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ─── Type exports ────────────────────────────────────────────────────
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type HeroSlide = typeof heroSlides.$inferSelect;
export type NewHeroSlide = typeof heroSlides.$inferInsert;
export type Dignitary = typeof dignitaries.$inferSelect;
export type Staff = typeof staff.$inferSelect;
export type Tribe = typeof tribes.$inferSelect;
export type GalleryCategory = typeof galleryCategories.$inferSelect;
export type GalleryImage = typeof galleryImages.$inferSelect;
export type ContactMessage = typeof contactMessages.$inferSelect;
export type Page = typeof pages.$inferSelect;
export type Update = typeof updates.$inferSelect;
export type SiteSetting = typeof siteSettings.$inferSelect;
