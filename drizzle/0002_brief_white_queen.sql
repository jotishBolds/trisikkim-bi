ALTER TABLE "dignitaries" ADD COLUMN "translations" jsonb;--> statement-breakpoint
ALTER TABLE "gallery_categories" ADD COLUMN "translations" jsonb;--> statement-breakpoint
ALTER TABLE "gallery_images" ADD COLUMN "translations" jsonb;--> statement-breakpoint
ALTER TABLE "hero_slides" ADD COLUMN "translations" jsonb;--> statement-breakpoint
ALTER TABLE "pages" ADD COLUMN "translations" jsonb;--> statement-breakpoint
ALTER TABLE "staff" ADD COLUMN "designation" varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE "staff" ADD COLUMN "cadre" varchar(255);--> statement-breakpoint
ALTER TABLE "staff" ADD COLUMN "email" varchar(255);--> statement-breakpoint
ALTER TABLE "staff" ADD COLUMN "phone" varchar(50);--> statement-breakpoint
ALTER TABLE "staff" ADD COLUMN "type" varchar(20) DEFAULT 'staff' NOT NULL;--> statement-breakpoint
ALTER TABLE "staff" ADD COLUMN "translations" jsonb;--> statement-breakpoint
ALTER TABLE "tribes" ADD COLUMN "translations" jsonb;--> statement-breakpoint
ALTER TABLE "updates" ADD COLUMN "translations" jsonb;--> statement-breakpoint
ALTER TABLE "staff" DROP COLUMN "position";