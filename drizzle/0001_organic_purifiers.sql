ALTER TABLE "tribes" ALTER COLUMN "accent" SET DEFAULT '#1077A6';--> statement-breakpoint
ALTER TABLE "tribes" ADD COLUMN "image" text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE "tribes" ADD COLUMN "excerpt" text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE "tribes" ADD COLUMN "content" text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE "tribes" ADD COLUMN "gallery" jsonb DEFAULT '[]' NOT NULL;