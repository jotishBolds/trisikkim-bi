CREATE TABLE "video_gallery_categories" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" varchar(100) NOT NULL,
	"label" varchar(255) NOT NULL,
	"description" text,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"active" boolean DEFAULT true NOT NULL,
	"translations" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "video_gallery_categories_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
ALTER TABLE "gallery_videos" DROP CONSTRAINT "gallery_videos_category_id_gallery_categories_id_fk";
--> statement-breakpoint
ALTER TABLE "gallery_videos" ADD CONSTRAINT "gallery_videos_category_id_video_gallery_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."video_gallery_categories"("id") ON DELETE set null ON UPDATE no action;