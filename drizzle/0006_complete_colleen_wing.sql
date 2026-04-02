CREATE TABLE "publications" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(500) NOT NULL,
	"description" text,
	"pdf_url" text NOT NULL,
	"published_at" timestamp DEFAULT now() NOT NULL,
	"active" boolean DEFAULT true NOT NULL,
	"translations" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
