CREATE TABLE "blogs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"slug" text NOT NULL,
	"title" text NOT NULL,
	"excerpt" text NOT NULL,
	"cover_image" text NOT NULL,
	"author_name" text NOT NULL,
	"published_at" date NOT NULL,
	"read_time" integer NOT NULL,
	"published" boolean DEFAULT false NOT NULL,
	"content_json" jsonb NOT NULL,
	"content_html" text NOT NULL,
	CONSTRAINT "blogs_slug_unique" UNIQUE("slug")
);
