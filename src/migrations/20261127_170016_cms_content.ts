import { type MigrateUpArgs, type MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_posts_cover_scene_kind" AS ENUM('chat', 'code', 'browser', 'search', 'migration', 'cms', 'checklist', 'steps', 'compare', 'shield', 'quote');
  CREATE TYPE "public"."enum_posts_pillar" AS ENUM('ai-for-business', 'ai-development', 'web-development', 'honest-takes');
  CREATE TYPE "public"."enum_posts_source" AS ENUM('manual', 'autopost');
  CREATE TYPE "public"."enum_posts_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__posts_v_version_cover_scene_kind" AS ENUM('chat', 'code', 'browser', 'search', 'migration', 'cms', 'checklist', 'steps', 'compare', 'shield', 'quote');
  CREATE TYPE "public"."enum__posts_v_version_pillar" AS ENUM('ai-for-business', 'ai-development', 'web-development', 'honest-takes');
  CREATE TYPE "public"."enum__posts_v_version_source" AS ENUM('manual', 'autopost');
  CREATE TYPE "public"."enum__posts_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_projects_filters" AS ENUM('nextjs', 'migration', 'landing', 'wordpress', 'ecommerce');
  CREATE TYPE "public"."enum_projects_gallery_device" AS ENUM('desktop', 'mobile');
  CREATE TYPE "public"."enum_home_page_featured_services_icon" AS ENUM('browser', 'react', 'cart', 'store', 'pen', 'spark', 'bolt', 'code', 'layers', 'shield', 'clock', 'check', 'award', 'mail', 'chat', 'pin', 'arrow', 'arrowUpRight', 'download', 'send', 'linkedin', 'github', 'upwork', 'menu', 'close', 'star', 'camera', 'users', 'briefcase', 'monitor', 'cpu', 'cap', 'globe');
  CREATE TYPE "public"."enum_about_page_skill_cards_icon" AS ENUM('browser', 'react', 'cart', 'store', 'pen', 'spark', 'bolt', 'code', 'layers', 'shield', 'clock', 'check', 'award', 'mail', 'chat', 'pin', 'arrow', 'arrowUpRight', 'download', 'send', 'linkedin', 'github', 'upwork', 'menu', 'close', 'star', 'camera', 'users', 'briefcase', 'monitor', 'cpu', 'cap', 'globe');
  CREATE TYPE "public"."enum_about_page_about_focus_icon" AS ENUM('browser', 'react', 'cart', 'store', 'pen', 'spark', 'bolt', 'code', 'layers', 'shield', 'clock', 'check', 'award', 'mail', 'chat', 'pin', 'arrow', 'arrowUpRight', 'download', 'send', 'linkedin', 'github', 'upwork', 'menu', 'close', 'star', 'camera', 'users', 'briefcase', 'monitor', 'cpu', 'cap', 'globe');
  CREATE TYPE "public"."enum_about_page_principles_icon" AS ENUM('browser', 'react', 'cart', 'store', 'pen', 'spark', 'bolt', 'code', 'layers', 'shield', 'clock', 'check', 'award', 'mail', 'chat', 'pin', 'arrow', 'arrowUpRight', 'download', 'send', 'linkedin', 'github', 'upwork', 'menu', 'close', 'star', 'camera', 'users', 'briefcase', 'monitor', 'cpu', 'cap', 'globe');
  CREATE TYPE "public"."enum_services_page_services_icon" AS ENUM('browser', 'react', 'cart', 'store', 'pen', 'spark', 'bolt', 'code', 'layers', 'shield', 'clock', 'check', 'award', 'mail', 'chat', 'pin', 'arrow', 'arrowUpRight', 'download', 'send', 'linkedin', 'github', 'upwork', 'menu', 'close', 'star', 'camera', 'users', 'briefcase', 'monitor', 'cpu', 'cap', 'globe');
  CREATE TABLE "posts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"description" varchar,
  	"content" varchar,
  	"review_notes" varchar,
  	"cover_id" integer,
  	"cover_scene_kind" "enum_posts_cover_scene_kind",
  	"cover_scene_labels" varchar,
  	"slug" varchar,
  	"date" timestamp(3) with time zone,
  	"updated" timestamp(3) with time zone,
  	"pillar" "enum_posts_pillar",
  	"tags" varchar,
  	"service" varchar,
  	"ai_assisted" boolean DEFAULT true,
  	"reviewed" boolean DEFAULT true,
  	"source" "enum_posts_source" DEFAULT 'manual',
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_posts_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_posts_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_description" varchar,
  	"version_content" varchar,
  	"version_review_notes" varchar,
  	"version_cover_id" integer,
  	"version_cover_scene_kind" "enum__posts_v_version_cover_scene_kind",
  	"version_cover_scene_labels" varchar,
  	"version_slug" varchar,
  	"version_date" timestamp(3) with time zone,
  	"version_updated" timestamp(3) with time zone,
  	"version_pillar" "enum__posts_v_version_pillar",
  	"version_tags" varchar,
  	"version_service" varchar,
  	"version_ai_assisted" boolean DEFAULT true,
  	"version_reviewed" boolean DEFAULT true,
  	"version_source" "enum__posts_v_version_source" DEFAULT 'manual',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__posts_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "projects_filters" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_projects_filters",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "projects_gallery" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer NOT NULL,
  	"device" "enum_projects_gallery_device" DEFAULT 'desktop' NOT NULL
  );
  
  CREATE TABLE "projects" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"_order" varchar,
  	"title" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"category" varchar NOT NULL,
  	"year" varchar NOT NULL,
  	"client" varchar NOT NULL,
  	"summary" varchar NOT NULL,
  	"cover_id" integer NOT NULL,
  	"tint" varchar DEFAULT '#edeae0' NOT NULL,
  	"featured" boolean DEFAULT false,
  	"tagline" varchar NOT NULL,
  	"role" varchar NOT NULL,
  	"stack" varchar NOT NULL,
  	"tags" varchar,
  	"overview" varchar NOT NULL,
  	"challenge" varchar NOT NULL,
  	"approach" varchar NOT NULL,
  	"features" varchar,
  	"tech" varchar,
  	"cta_title" varchar NOT NULL,
  	"cta_text" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "faqs" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"_order" varchar,
  	"question" varchar NOT NULL,
  	"answer" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "site_settings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"role" varchar NOT NULL,
  	"location" varchar NOT NULL,
  	"availability" varchar NOT NULL,
  	"hours" varchar NOT NULL,
  	"description" varchar NOT NULL,
  	"languages" varchar,
  	"resume_id" integer NOT NULL,
  	"email" varchar NOT NULL,
  	"phone" varchar NOT NULL,
  	"whatsapp" varchar NOT NULL,
  	"linkedin" varchar NOT NULL,
  	"github" varchar NOT NULL,
  	"upwork" varchar,
  	"ga_id" varchar,
  	"search_console" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "home_page_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"value" varchar NOT NULL
  );
  
  CREATE TABLE "home_page_featured_services" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"text" varchar NOT NULL,
  	"points" varchar,
  	"tag" varchar NOT NULL,
  	"href" varchar NOT NULL,
  	"icon" "enum_home_page_featured_services_icon" NOT NULL
  );
  
  CREATE TABLE "home_page_problems" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"text" varchar NOT NULL
  );
  
  CREATE TABLE "home_page_ai_workflow_points" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"text" varchar NOT NULL
  );
  
  CREATE TABLE "home_page" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"ai_workflow_tools" varchar,
  	"ai_workflow_closing" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "about_page_certifications" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"issuer" varchar NOT NULL,
  	"date" varchar NOT NULL,
  	"text" varchar NOT NULL
  );
  
  CREATE TABLE "about_page_skill_cards" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"icon" "enum_about_page_skill_cards_icon" NOT NULL,
  	"items" varchar
  );
  
  CREATE TABLE "about_page_about_focus" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"icon" "enum_about_page_about_focus_icon" NOT NULL,
  	"text" varchar NOT NULL
  );
  
  CREATE TABLE "about_page_principles" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"icon" "enum_about_page_principles_icon" NOT NULL,
  	"text" varchar NOT NULL
  );
  
  CREATE TABLE "about_page" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"experience_role" varchar NOT NULL,
  	"experience_company" varchar NOT NULL,
  	"experience_place" varchar NOT NULL,
  	"experience_period" varchar NOT NULL,
  	"experience_summary" varchar NOT NULL,
  	"experience_points" varchar,
  	"experience_tags" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "services_page_services" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"icon" "enum_services_page_services_icon" NOT NULL,
  	"short" varchar NOT NULL,
  	"body" varchar NOT NULL,
  	"points" varchar,
  	"tags" varchar,
  	"tags_label" varchar,
  	"image_id" integer NOT NULL,
  	"image_alt" varchar
  );
  
  CREATE TABLE "services_page_packages" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"title" varchar NOT NULL,
  	"price" varchar NOT NULL,
  	"text" varchar NOT NULL,
  	"points" varchar,
  	"featured" boolean DEFAULT false
  );
  
  CREATE TABLE "services_page_process" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"text" varchar NOT NULL
  );
  
  CREATE TABLE "services_page" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"approach" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "contact_page" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"help_with" varchar,
  	"project_types" varchar,
  	"budgets" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "posts_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "projects_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "faqs_id" integer;
  ALTER TABLE "posts" ADD CONSTRAINT "posts_cover_id_media_id_fk" FOREIGN KEY ("cover_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_posts_v" ADD CONSTRAINT "_posts_v_parent_id_posts_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."posts"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_posts_v" ADD CONSTRAINT "_posts_v_version_cover_id_media_id_fk" FOREIGN KEY ("version_cover_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "projects_filters" ADD CONSTRAINT "projects_filters_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_gallery" ADD CONSTRAINT "projects_gallery_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "projects_gallery" ADD CONSTRAINT "projects_gallery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects" ADD CONSTRAINT "projects_cover_id_media_id_fk" FOREIGN KEY ("cover_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_resume_id_media_id_fk" FOREIGN KEY ("resume_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "home_page_stats" ADD CONSTRAINT "home_page_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_page_featured_services" ADD CONSTRAINT "home_page_featured_services_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_page_problems" ADD CONSTRAINT "home_page_problems_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_page_ai_workflow_points" ADD CONSTRAINT "home_page_ai_workflow_points_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_page_certifications" ADD CONSTRAINT "about_page_certifications_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_page_skill_cards" ADD CONSTRAINT "about_page_skill_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_page_about_focus" ADD CONSTRAINT "about_page_about_focus_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_page_principles" ADD CONSTRAINT "about_page_principles_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_page_services" ADD CONSTRAINT "services_page_services_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "services_page_services" ADD CONSTRAINT "services_page_services_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_page_packages" ADD CONSTRAINT "services_page_packages_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_page_process" ADD CONSTRAINT "services_page_process_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services_page"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "posts_cover_idx" ON "posts" USING btree ("cover_id");
  CREATE UNIQUE INDEX "posts_slug_idx" ON "posts" USING btree ("slug");
  CREATE INDEX "posts_updated_at_idx" ON "posts" USING btree ("updated_at");
  CREATE INDEX "posts_created_at_idx" ON "posts" USING btree ("created_at");
  CREATE INDEX "posts__status_idx" ON "posts" USING btree ("_status");
  CREATE INDEX "_posts_v_parent_idx" ON "_posts_v" USING btree ("parent_id");
  CREATE INDEX "_posts_v_version_version_cover_idx" ON "_posts_v" USING btree ("version_cover_id");
  CREATE INDEX "_posts_v_version_version_slug_idx" ON "_posts_v" USING btree ("version_slug");
  CREATE INDEX "_posts_v_version_version_updated_at_idx" ON "_posts_v" USING btree ("version_updated_at");
  CREATE INDEX "_posts_v_version_version_created_at_idx" ON "_posts_v" USING btree ("version_created_at");
  CREATE INDEX "_posts_v_version_version__status_idx" ON "_posts_v" USING btree ("version__status");
  CREATE INDEX "_posts_v_created_at_idx" ON "_posts_v" USING btree ("created_at");
  CREATE INDEX "_posts_v_updated_at_idx" ON "_posts_v" USING btree ("updated_at");
  CREATE INDEX "_posts_v_latest_idx" ON "_posts_v" USING btree ("latest");
  CREATE INDEX "projects_filters_order_idx" ON "projects_filters" USING btree ("order");
  CREATE INDEX "projects_filters_parent_idx" ON "projects_filters" USING btree ("parent_id");
  CREATE INDEX "projects_gallery_order_idx" ON "projects_gallery" USING btree ("_order");
  CREATE INDEX "projects_gallery_parent_id_idx" ON "projects_gallery" USING btree ("_parent_id");
  CREATE INDEX "projects_gallery_image_idx" ON "projects_gallery" USING btree ("image_id");
  CREATE INDEX "projects__order_idx" ON "projects" USING btree ("_order");
  CREATE UNIQUE INDEX "projects_slug_idx" ON "projects" USING btree ("slug");
  CREATE INDEX "projects_cover_idx" ON "projects" USING btree ("cover_id");
  CREATE INDEX "projects_updated_at_idx" ON "projects" USING btree ("updated_at");
  CREATE INDEX "projects_created_at_idx" ON "projects" USING btree ("created_at");
  CREATE INDEX "faqs__order_idx" ON "faqs" USING btree ("_order");
  CREATE INDEX "faqs_updated_at_idx" ON "faqs" USING btree ("updated_at");
  CREATE INDEX "faqs_created_at_idx" ON "faqs" USING btree ("created_at");
  CREATE INDEX "site_settings_resume_idx" ON "site_settings" USING btree ("resume_id");
  CREATE INDEX "home_page_stats_order_idx" ON "home_page_stats" USING btree ("_order");
  CREATE INDEX "home_page_stats_parent_id_idx" ON "home_page_stats" USING btree ("_parent_id");
  CREATE INDEX "home_page_featured_services_order_idx" ON "home_page_featured_services" USING btree ("_order");
  CREATE INDEX "home_page_featured_services_parent_id_idx" ON "home_page_featured_services" USING btree ("_parent_id");
  CREATE INDEX "home_page_problems_order_idx" ON "home_page_problems" USING btree ("_order");
  CREATE INDEX "home_page_problems_parent_id_idx" ON "home_page_problems" USING btree ("_parent_id");
  CREATE INDEX "home_page_ai_workflow_points_order_idx" ON "home_page_ai_workflow_points" USING btree ("_order");
  CREATE INDEX "home_page_ai_workflow_points_parent_id_idx" ON "home_page_ai_workflow_points" USING btree ("_parent_id");
  CREATE INDEX "about_page_certifications_order_idx" ON "about_page_certifications" USING btree ("_order");
  CREATE INDEX "about_page_certifications_parent_id_idx" ON "about_page_certifications" USING btree ("_parent_id");
  CREATE INDEX "about_page_skill_cards_order_idx" ON "about_page_skill_cards" USING btree ("_order");
  CREATE INDEX "about_page_skill_cards_parent_id_idx" ON "about_page_skill_cards" USING btree ("_parent_id");
  CREATE INDEX "about_page_about_focus_order_idx" ON "about_page_about_focus" USING btree ("_order");
  CREATE INDEX "about_page_about_focus_parent_id_idx" ON "about_page_about_focus" USING btree ("_parent_id");
  CREATE INDEX "about_page_principles_order_idx" ON "about_page_principles" USING btree ("_order");
  CREATE INDEX "about_page_principles_parent_id_idx" ON "about_page_principles" USING btree ("_parent_id");
  CREATE INDEX "services_page_services_order_idx" ON "services_page_services" USING btree ("_order");
  CREATE INDEX "services_page_services_parent_id_idx" ON "services_page_services" USING btree ("_parent_id");
  CREATE INDEX "services_page_services_image_idx" ON "services_page_services" USING btree ("image_id");
  CREATE INDEX "services_page_packages_order_idx" ON "services_page_packages" USING btree ("_order");
  CREATE INDEX "services_page_packages_parent_id_idx" ON "services_page_packages" USING btree ("_parent_id");
  CREATE INDEX "services_page_process_order_idx" ON "services_page_process" USING btree ("_order");
  CREATE INDEX "services_page_process_parent_id_idx" ON "services_page_process" USING btree ("_parent_id");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_posts_fk" FOREIGN KEY ("posts_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_projects_fk" FOREIGN KEY ("projects_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_faqs_fk" FOREIGN KEY ("faqs_id") REFERENCES "public"."faqs"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_posts_id_idx" ON "payload_locked_documents_rels" USING btree ("posts_id");
  CREATE INDEX "payload_locked_documents_rels_projects_id_idx" ON "payload_locked_documents_rels" USING btree ("projects_id");
  CREATE INDEX "payload_locked_documents_rels_faqs_id_idx" ON "payload_locked_documents_rels" USING btree ("faqs_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "posts" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_posts_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "projects_filters" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "projects_gallery" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "projects" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "faqs" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "site_settings" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "home_page_stats" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "home_page_featured_services" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "home_page_problems" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "home_page_ai_workflow_points" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "home_page" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "about_page_certifications" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "about_page_skill_cards" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "about_page_about_focus" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "about_page_principles" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "about_page" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "services_page_services" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "services_page_packages" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "services_page_process" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "services_page" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "contact_page" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "posts" CASCADE;
  DROP TABLE "_posts_v" CASCADE;
  DROP TABLE "projects_filters" CASCADE;
  DROP TABLE "projects_gallery" CASCADE;
  DROP TABLE "projects" CASCADE;
  DROP TABLE "faqs" CASCADE;
  DROP TABLE "site_settings" CASCADE;
  DROP TABLE "home_page_stats" CASCADE;
  DROP TABLE "home_page_featured_services" CASCADE;
  DROP TABLE "home_page_problems" CASCADE;
  DROP TABLE "home_page_ai_workflow_points" CASCADE;
  DROP TABLE "home_page" CASCADE;
  DROP TABLE "about_page_certifications" CASCADE;
  DROP TABLE "about_page_skill_cards" CASCADE;
  DROP TABLE "about_page_about_focus" CASCADE;
  DROP TABLE "about_page_principles" CASCADE;
  DROP TABLE "about_page" CASCADE;
  DROP TABLE "services_page_services" CASCADE;
  DROP TABLE "services_page_packages" CASCADE;
  DROP TABLE "services_page_process" CASCADE;
  DROP TABLE "services_page" CASCADE;
  DROP TABLE "contact_page" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_posts_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_projects_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_faqs_fk";
  
  DROP INDEX "payload_locked_documents_rels_posts_id_idx";
  DROP INDEX "payload_locked_documents_rels_projects_id_idx";
  DROP INDEX "payload_locked_documents_rels_faqs_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "posts_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "projects_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "faqs_id";
  DROP TYPE "public"."enum_posts_cover_scene_kind";
  DROP TYPE "public"."enum_posts_pillar";
  DROP TYPE "public"."enum_posts_source";
  DROP TYPE "public"."enum_posts_status";
  DROP TYPE "public"."enum__posts_v_version_cover_scene_kind";
  DROP TYPE "public"."enum__posts_v_version_pillar";
  DROP TYPE "public"."enum__posts_v_version_source";
  DROP TYPE "public"."enum__posts_v_version_status";
  DROP TYPE "public"."enum_projects_filters";
  DROP TYPE "public"."enum_projects_gallery_device";
  DROP TYPE "public"."enum_home_page_featured_services_icon";
  DROP TYPE "public"."enum_about_page_skill_cards_icon";
  DROP TYPE "public"."enum_about_page_about_focus_icon";
  DROP TYPE "public"."enum_about_page_principles_icon";
  DROP TYPE "public"."enum_services_page_services_icon";`)
}
