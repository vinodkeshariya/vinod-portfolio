import { type MigrateUpArgs, type MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_about_page_about_texts_hero_facts_icon" AS ENUM('browser', 'react', 'cart', 'store', 'pen', 'spark', 'bolt', 'code', 'layers', 'shield', 'clock', 'check', 'award', 'mail', 'chat', 'pin', 'arrow', 'arrowUpRight', 'download', 'send', 'linkedin', 'github', 'upwork', 'menu', 'close', 'star', 'camera', 'users', 'briefcase', 'monitor', 'cpu', 'cap', 'globe');
  CREATE TYPE "public"."enum_about_page_about_texts_stack_groups_icon" AS ENUM('browser', 'react', 'cart', 'store', 'pen', 'spark', 'bolt', 'code', 'layers', 'shield', 'clock', 'check', 'award', 'mail', 'chat', 'pin', 'arrow', 'arrowUpRight', 'download', 'send', 'linkedin', 'github', 'upwork', 'menu', 'close', 'star', 'camera', 'users', 'briefcase', 'monitor', 'cpu', 'cap', 'globe');
  CREATE TYPE "public"."enum_hire_me_page_texts_get_items_icon" AS ENUM('browser', 'react', 'cart', 'store', 'pen', 'spark', 'bolt', 'code', 'layers', 'shield', 'clock', 'check', 'award', 'mail', 'chat', 'pin', 'arrow', 'arrowUpRight', 'download', 'send', 'linkedin', 'github', 'upwork', 'menu', 'close', 'star', 'camera', 'users', 'briefcase', 'monitor', 'cpu', 'cap', 'globe');
  CREATE TYPE "public"."enum_hire_me_page_texts_why_items_icon" AS ENUM('browser', 'react', 'cart', 'store', 'pen', 'spark', 'bolt', 'code', 'layers', 'shield', 'clock', 'check', 'award', 'mail', 'chat', 'pin', 'arrow', 'arrowUpRight', 'download', 'send', 'linkedin', 'github', 'upwork', 'menu', 'close', 'star', 'camera', 'users', 'briefcase', 'monitor', 'cpu', 'cap', 'globe');
  CREATE TABLE "home_page_texts_hero_showcase" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer NOT NULL,
  	"alt" varchar
  );
  
  CREATE TABLE "about_page_about_texts_hero_facts" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"icon" "enum_about_page_about_texts_hero_facts_icon" NOT NULL
  );
  
  CREATE TABLE "about_page_about_texts_stack_groups" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"icon" "enum_about_page_about_texts_stack_groups_icon" NOT NULL,
  	"items" varchar
  );
  
  CREATE TABLE "about_page_experience_texts_hero_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar,
  	"label" varchar
  );
  
  CREATE TABLE "work_page" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"texts_seo_title" varchar,
  	"texts_seo_description" varchar,
  	"texts_hero_eyebrow" varchar,
  	"texts_hero_title" varchar,
  	"texts_hero_lead" varchar,
  	"texts_filters_all" varchar,
  	"texts_filters_nextjs" varchar,
  	"texts_filters_migration" varchar,
  	"texts_filters_landing" varchar,
  	"texts_filters_wordpress" varchar,
  	"texts_filters_ecommerce" varchar,
  	"texts_cta_title" varchar,
  	"texts_cta_text" varchar,
  	"texts_cta_primary" varchar,
  	"texts_case_study_eyebrow" varchar,
  	"texts_case_study_cta" varchar,
  	"texts_case_study_client" varchar,
  	"texts_case_study_role" varchar,
  	"texts_case_study_stack" varchar,
  	"texts_case_study_year" varchar,
  	"texts_case_study_overview_eyebrow" varchar,
  	"texts_case_study_overview_title" varchar,
  	"texts_case_study_overview_nav" varchar,
  	"texts_case_study_challenge_eyebrow" varchar,
  	"texts_case_study_challenge_title" varchar,
  	"texts_case_study_challenge_nav" varchar,
  	"texts_case_study_approach_eyebrow" varchar,
  	"texts_case_study_approach_title" varchar,
  	"texts_case_study_approach_nav" varchar,
  	"texts_case_study_features_eyebrow" varchar,
  	"texts_case_study_features_title" varchar,
  	"texts_case_study_features_nav" varchar,
  	"texts_case_study_gallery_eyebrow" varchar,
  	"texts_case_study_gallery_title" varchar,
  	"texts_case_study_gallery_nav" varchar,
  	"texts_case_study_tech_eyebrow" varchar,
  	"texts_case_study_tech_title" varchar,
  	"texts_case_study_tech_nav" varchar,
  	"texts_case_study_previous" varchar,
  	"texts_case_study_next" varchar,
  	"texts_case_study_back" varchar,
  	"texts_case_study_back_to" varchar,
  	"texts_case_study_all" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "hire_me_page_texts_get_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"icon" "enum_hire_me_page_texts_get_items_icon" NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "hire_me_page_texts_why_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"icon" "enum_hire_me_page_texts_why_items_icon" NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "hire_me_page" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"texts_seo_title" varchar,
  	"texts_seo_description" varchar,
  	"texts_hero_eyebrow" varchar,
  	"texts_hero_title" varchar,
  	"texts_hero_lead" varchar,
  	"texts_hero_primary" varchar,
  	"texts_hero_upwork" varchar,
  	"texts_hero_work" varchar,
  	"texts_get_eyebrow" varchar,
  	"texts_get_title" varchar,
  	"texts_process_eyebrow" varchar,
  	"texts_process_title" varchar,
  	"texts_why_eyebrow" varchar,
  	"texts_why_title" varchar,
  	"texts_why_text" varchar,
  	"texts_areas_eyebrow" varchar,
  	"texts_areas_title" varchar,
  	"texts_areas_details_title" varchar,
  	"texts_areas_details_text" varchar,
  	"texts_cta_title" varchar,
  	"texts_cta_text" varchar,
  	"texts_cta_primary" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "contact_page_texts_steps_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"text" varchar
  );
  
  CREATE TABLE "blog_page" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"texts_seo_title" varchar,
  	"texts_seo_description" varchar,
  	"texts_hero_eyebrow" varchar,
  	"texts_hero_title" varchar,
  	"texts_hero_lead" varchar,
  	"texts_hero_primary" varchar,
  	"texts_hero_secondary" varchar,
  	"texts_empty_eyebrow" varchar,
  	"texts_empty_text" varchar,
  	"texts_empty_work" varchar,
  	"texts_empty_contact" varchar,
  	"texts_filter_all" varchar,
  	"texts_cta_title" varchar,
  	"texts_cta_text" varchar,
  	"texts_cta_primary" varchar,
  	"texts_cta_secondary" varchar,
  	"texts_post_by" varchar,
  	"texts_post_updated" varchar,
  	"texts_post_min_read" varchar,
  	"texts_post_ai_reviewed" varchar,
  	"texts_post_ai_unreviewed" varchar,
  	"texts_post_author_bio" varchar,
  	"texts_post_about_link" varchar,
  	"texts_post_related_service" varchar,
  	"texts_post_help_fallback" varchar,
  	"texts_post_view_service" varchar,
  	"texts_post_more" varchar,
  	"texts_post_all_articles" varchar,
  	"texts_post_cta_title" varchar,
  	"texts_post_cta_text" varchar,
  	"texts_post_cta_primary" varchar,
  	"texts_post_cta_secondary" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "site_settings" ADD COLUMN "layout_menu_home" varchar;
  ALTER TABLE "site_settings" ADD COLUMN "layout_menu_about" varchar;
  ALTER TABLE "site_settings" ADD COLUMN "layout_menu_services" varchar;
  ALTER TABLE "site_settings" ADD COLUMN "layout_menu_work" varchar;
  ALTER TABLE "site_settings" ADD COLUMN "layout_menu_experience" varchar;
  ALTER TABLE "site_settings" ADD COLUMN "layout_menu_blog" varchar;
  ALTER TABLE "site_settings" ADD COLUMN "layout_menu_contact" varchar;
  ALTER TABLE "site_settings" ADD COLUMN "layout_seo_title" varchar;
  ALTER TABLE "site_settings" ADD COLUMN "layout_seo_keywords" varchar;
  ALTER TABLE "site_settings" ADD COLUMN "layout_footer_subtitle" varchar;
  ALTER TABLE "site_settings" ADD COLUMN "layout_footer_rights" varchar;
  ALTER TABLE "site_settings" ADD COLUMN "layout_footer_built_with" varchar;
  ALTER TABLE "site_settings" ADD COLUMN "layout_footer_using" varchar;
  ALTER TABLE "site_settings" ADD COLUMN "layout_mobile_bar_title" varchar;
  ALTER TABLE "site_settings" ADD COLUMN "layout_mobile_bar_text" varchar;
  ALTER TABLE "site_settings" ADD COLUMN "layout_mobile_bar_button" varchar;
  ALTER TABLE "site_settings" ADD COLUMN "layout_not_found_eyebrow" varchar;
  ALTER TABLE "site_settings" ADD COLUMN "layout_not_found_title" varchar;
  ALTER TABLE "site_settings" ADD COLUMN "layout_not_found_lead" varchar;
  ALTER TABLE "site_settings" ADD COLUMN "layout_not_found_home" varchar;
  ALTER TABLE "site_settings" ADD COLUMN "layout_not_found_projects" varchar;
  ALTER TABLE "site_settings" ADD COLUMN "layout_not_found_try" varchar;
  ALTER TABLE "home_page" ADD COLUMN "texts_seo_title" varchar;
  ALTER TABLE "home_page" ADD COLUMN "texts_seo_description" varchar;
  ALTER TABLE "home_page" ADD COLUMN "texts_hero_eyebrow" varchar;
  ALTER TABLE "home_page" ADD COLUMN "texts_hero_title" varchar;
  ALTER TABLE "home_page" ADD COLUMN "texts_hero_lead" varchar;
  ALTER TABLE "home_page" ADD COLUMN "texts_hero_primary" varchar;
  ALTER TABLE "home_page" ADD COLUMN "texts_hero_secondary" varchar;
  ALTER TABLE "home_page" ADD COLUMN "texts_services_eyebrow" varchar;
  ALTER TABLE "home_page" ADD COLUMN "texts_services_title" varchar;
  ALTER TABLE "home_page" ADD COLUMN "texts_services_link" varchar;
  ALTER TABLE "home_page" ADD COLUMN "texts_work_eyebrow" varchar;
  ALTER TABLE "home_page" ADD COLUMN "texts_work_title" varchar;
  ALTER TABLE "home_page" ADD COLUMN "texts_work_button" varchar;
  ALTER TABLE "home_page" ADD COLUMN "texts_experience_bar_caption" varchar;
  ALTER TABLE "home_page" ADD COLUMN "texts_problems_eyebrow" varchar;
  ALTER TABLE "home_page" ADD COLUMN "texts_problems_title" varchar;
  ALTER TABLE "home_page" ADD COLUMN "texts_ai_workflow_eyebrow" varchar;
  ALTER TABLE "home_page" ADD COLUMN "texts_ai_workflow_title" varchar;
  ALTER TABLE "home_page" ADD COLUMN "texts_process_eyebrow" varchar;
  ALTER TABLE "home_page" ADD COLUMN "texts_process_title" varchar;
  ALTER TABLE "home_page" ADD COLUMN "texts_process_button" varchar;
  ALTER TABLE "home_page" ADD COLUMN "texts_faq_eyebrow" varchar;
  ALTER TABLE "home_page" ADD COLUMN "texts_faq_title" varchar;
  ALTER TABLE "home_page" ADD COLUMN "texts_faq_text" varchar;
  ALTER TABLE "home_page" ADD COLUMN "texts_cta_title" varchar;
  ALTER TABLE "home_page" ADD COLUMN "texts_cta_text" varchar;
  ALTER TABLE "home_page" ADD COLUMN "texts_cta_primary" varchar;
  ALTER TABLE "about_page" ADD COLUMN "about_texts_seo_title" varchar;
  ALTER TABLE "about_page" ADD COLUMN "about_texts_seo_description" varchar;
  ALTER TABLE "about_page" ADD COLUMN "about_texts_hero_eyebrow" varchar;
  ALTER TABLE "about_page" ADD COLUMN "about_texts_hero_title" varchar;
  ALTER TABLE "about_page" ADD COLUMN "about_texts_hero_lead" varchar;
  ALTER TABLE "about_page" ADD COLUMN "about_texts_hero_intro" varchar;
  ALTER TABLE "about_page" ADD COLUMN "about_texts_hero_primary" varchar;
  ALTER TABLE "about_page" ADD COLUMN "about_texts_hero_resume" varchar;
  ALTER TABLE "about_page" ADD COLUMN "about_texts_story_title" varchar;
  ALTER TABLE "about_page" ADD COLUMN "about_texts_story_lead" varchar;
  ALTER TABLE "about_page" ADD COLUMN "about_texts_story_left" varchar;
  ALTER TABLE "about_page" ADD COLUMN "about_texts_story_right" varchar;
  ALTER TABLE "about_page" ADD COLUMN "about_texts_story_quote" varchar;
  ALTER TABLE "about_page" ADD COLUMN "about_texts_story_link" varchar;
  ALTER TABLE "about_page" ADD COLUMN "about_texts_what_i_do_title" varchar;
  ALTER TABLE "about_page" ADD COLUMN "about_texts_what_i_do_text" varchar;
  ALTER TABLE "about_page" ADD COLUMN "about_texts_what_i_do_button" varchar;
  ALTER TABLE "about_page" ADD COLUMN "about_texts_philosophy_eyebrow" varchar;
  ALTER TABLE "about_page" ADD COLUMN "about_texts_philosophy_title" varchar;
  ALTER TABLE "about_page" ADD COLUMN "about_texts_stack_title" varchar;
  ALTER TABLE "about_page" ADD COLUMN "about_texts_stack_button" varchar;
  ALTER TABLE "about_page" ADD COLUMN "about_texts_stack_experience_title" varchar;
  ALTER TABLE "about_page" ADD COLUMN "about_texts_stack_certifications_title" varchar;
  ALTER TABLE "about_page" ADD COLUMN "about_texts_cta_title" varchar;
  ALTER TABLE "about_page" ADD COLUMN "about_texts_cta_text" varchar;
  ALTER TABLE "about_page" ADD COLUMN "about_texts_cta_primary" varchar;
  ALTER TABLE "about_page" ADD COLUMN "about_texts_cta_secondary" varchar;
  ALTER TABLE "about_page" ADD COLUMN "experience_texts_seo_title" varchar;
  ALTER TABLE "about_page" ADD COLUMN "experience_texts_seo_description" varchar;
  ALTER TABLE "about_page" ADD COLUMN "experience_texts_hero_eyebrow" varchar;
  ALTER TABLE "about_page" ADD COLUMN "experience_texts_hero_title" varchar;
  ALTER TABLE "about_page" ADD COLUMN "experience_texts_hero_lead" varchar;
  ALTER TABLE "about_page" ADD COLUMN "experience_texts_headings_timeline" varchar;
  ALTER TABLE "about_page" ADD COLUMN "experience_texts_headings_certifications" varchar;
  ALTER TABLE "about_page" ADD COLUMN "experience_texts_headings_languages" varchar;
  ALTER TABLE "about_page" ADD COLUMN "experience_texts_headings_ai_workflow" varchar;
  ALTER TABLE "about_page" ADD COLUMN "experience_texts_headings_skills" varchar;
  ALTER TABLE "about_page" ADD COLUMN "experience_texts_headings_ai_workflow_text" varchar;
  ALTER TABLE "about_page" ADD COLUMN "experience_texts_cta_title" varchar;
  ALTER TABLE "about_page" ADD COLUMN "experience_texts_cta_text" varchar;
  ALTER TABLE "about_page" ADD COLUMN "experience_texts_cta_primary" varchar;
  ALTER TABLE "about_page" ADD COLUMN "experience_texts_cta_secondary" varchar;
  ALTER TABLE "services_page" ADD COLUMN "texts_seo_title" varchar;
  ALTER TABLE "services_page" ADD COLUMN "texts_seo_description" varchar;
  ALTER TABLE "services_page" ADD COLUMN "texts_hero_eyebrow" varchar;
  ALTER TABLE "services_page" ADD COLUMN "texts_hero_title" varchar;
  ALTER TABLE "services_page" ADD COLUMN "texts_hero_lead" varchar;
  ALTER TABLE "services_page" ADD COLUMN "texts_hero_primary" varchar;
  ALTER TABLE "services_page" ADD COLUMN "texts_hero_secondary" varchar;
  ALTER TABLE "services_page" ADD COLUMN "texts_cards_link" varchar;
  ALTER TABLE "services_page" ADD COLUMN "texts_cards_tags_label" varchar;
  ALTER TABLE "services_page" ADD COLUMN "texts_packages_title" varchar;
  ALTER TABLE "services_page" ADD COLUMN "texts_packages_text" varchar;
  ALTER TABLE "services_page" ADD COLUMN "texts_packages_button" varchar;
  ALTER TABLE "services_page" ADD COLUMN "texts_process_title" varchar;
  ALTER TABLE "services_page" ADD COLUMN "texts_process_text" varchar;
  ALTER TABLE "services_page" ADD COLUMN "texts_cta_title" varchar;
  ALTER TABLE "services_page" ADD COLUMN "texts_cta_text" varchar;
  ALTER TABLE "services_page" ADD COLUMN "texts_cta_primary" varchar;
  ALTER TABLE "contact_page" ADD COLUMN "texts_seo_title" varchar;
  ALTER TABLE "contact_page" ADD COLUMN "texts_seo_description" varchar;
  ALTER TABLE "contact_page" ADD COLUMN "texts_hero_eyebrow" varchar;
  ALTER TABLE "contact_page" ADD COLUMN "texts_hero_title" varchar;
  ALTER TABLE "contact_page" ADD COLUMN "texts_hero_lead" varchar;
  ALTER TABLE "contact_page" ADD COLUMN "texts_hero_intro" varchar;
  ALTER TABLE "contact_page" ADD COLUMN "texts_hero_form_note" varchar;
  ALTER TABLE "contact_page" ADD COLUMN "texts_details_email" varchar;
  ALTER TABLE "contact_page" ADD COLUMN "texts_details_phone" varchar;
  ALTER TABLE "contact_page" ADD COLUMN "texts_details_location" varchar;
  ALTER TABLE "contact_page" ADD COLUMN "texts_details_availability" varchar;
  ALTER TABLE "contact_page" ADD COLUMN "texts_details_availability_value" varchar;
  ALTER TABLE "contact_page" ADD COLUMN "texts_details_response" varchar;
  ALTER TABLE "contact_page" ADD COLUMN "texts_details_response_value" varchar;
  ALTER TABLE "contact_page" ADD COLUMN "texts_details_upwork" varchar;
  ALTER TABLE "contact_page" ADD COLUMN "texts_steps_title" varchar;
  ALTER TABLE "contact_page" ADD COLUMN "texts_help_with_title" varchar;
  ALTER TABLE "contact_page" ADD COLUMN "texts_help_with_link" varchar;
  ALTER TABLE "contact_page" ADD COLUMN "texts_faq_eyebrow" varchar;
  ALTER TABLE "contact_page" ADD COLUMN "texts_faq_title" varchar;
  ALTER TABLE "contact_page" ADD COLUMN "texts_faq_text" varchar;
  ALTER TABLE "contact_page" ADD COLUMN "texts_form_title" varchar;
  ALTER TABLE "contact_page" ADD COLUMN "texts_form_note" varchar;
  ALTER TABLE "contact_page" ADD COLUMN "texts_form_name" varchar;
  ALTER TABLE "contact_page" ADD COLUMN "texts_form_name_placeholder" varchar;
  ALTER TABLE "contact_page" ADD COLUMN "texts_form_email" varchar;
  ALTER TABLE "contact_page" ADD COLUMN "texts_form_email_placeholder" varchar;
  ALTER TABLE "contact_page" ADD COLUMN "texts_form_company" varchar;
  ALTER TABLE "contact_page" ADD COLUMN "texts_form_company_placeholder" varchar;
  ALTER TABLE "contact_page" ADD COLUMN "texts_form_optional" varchar;
  ALTER TABLE "contact_page" ADD COLUMN "texts_form_type" varchar;
  ALTER TABLE "contact_page" ADD COLUMN "texts_form_budget" varchar;
  ALTER TABLE "contact_page" ADD COLUMN "texts_form_budget_placeholder" varchar;
  ALTER TABLE "contact_page" ADD COLUMN "texts_form_message" varchar;
  ALTER TABLE "contact_page" ADD COLUMN "texts_form_message_placeholder" varchar;
  ALTER TABLE "contact_page" ADD COLUMN "texts_form_submit" varchar;
  ALTER TABLE "contact_page" ADD COLUMN "texts_form_sending" varchar;
  ALTER TABLE "contact_page" ADD COLUMN "texts_form_reply" varchar;
  ALTER TABLE "contact_page" ADD COLUMN "texts_form_sent_title" varchar;
  ALTER TABLE "contact_page" ADD COLUMN "texts_form_sent_again" varchar;
  ALTER TABLE "contact_page" ADD COLUMN "texts_form_sent_text" varchar;
  ALTER TABLE "contact_page" ADD COLUMN "texts_form_failed" varchar;
  ALTER TABLE "contact_page" ADD COLUMN "texts_form_limited" varchar;
  ALTER TABLE "contact_page" ADD COLUMN "texts_form_fallback" varchar;
  ALTER TABLE "contact_page" ADD COLUMN "texts_cta_title" varchar;
  ALTER TABLE "contact_page" ADD COLUMN "texts_cta_text" varchar;
  ALTER TABLE "contact_page" ADD COLUMN "texts_cta_primary" varchar;
  ALTER TABLE "contact_page" ADD COLUMN "texts_cta_secondary" varchar;
  ALTER TABLE "home_page_texts_hero_showcase" ADD CONSTRAINT "home_page_texts_hero_showcase_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "home_page_texts_hero_showcase" ADD CONSTRAINT "home_page_texts_hero_showcase_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_page_about_texts_hero_facts" ADD CONSTRAINT "about_page_about_texts_hero_facts_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_page_about_texts_stack_groups" ADD CONSTRAINT "about_page_about_texts_stack_groups_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_page_experience_texts_hero_stats" ADD CONSTRAINT "about_page_experience_texts_hero_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "hire_me_page_texts_get_items" ADD CONSTRAINT "hire_me_page_texts_get_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."hire_me_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "hire_me_page_texts_why_items" ADD CONSTRAINT "hire_me_page_texts_why_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."hire_me_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "contact_page_texts_steps_items" ADD CONSTRAINT "contact_page_texts_steps_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."contact_page"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "home_page_texts_hero_showcase_order_idx" ON "home_page_texts_hero_showcase" USING btree ("_order");
  CREATE INDEX "home_page_texts_hero_showcase_parent_id_idx" ON "home_page_texts_hero_showcase" USING btree ("_parent_id");
  CREATE INDEX "home_page_texts_hero_showcase_image_idx" ON "home_page_texts_hero_showcase" USING btree ("image_id");
  CREATE INDEX "about_page_about_texts_hero_facts_order_idx" ON "about_page_about_texts_hero_facts" USING btree ("_order");
  CREATE INDEX "about_page_about_texts_hero_facts_parent_id_idx" ON "about_page_about_texts_hero_facts" USING btree ("_parent_id");
  CREATE INDEX "about_page_about_texts_stack_groups_order_idx" ON "about_page_about_texts_stack_groups" USING btree ("_order");
  CREATE INDEX "about_page_about_texts_stack_groups_parent_id_idx" ON "about_page_about_texts_stack_groups" USING btree ("_parent_id");
  CREATE INDEX "about_page_experience_texts_hero_stats_order_idx" ON "about_page_experience_texts_hero_stats" USING btree ("_order");
  CREATE INDEX "about_page_experience_texts_hero_stats_parent_id_idx" ON "about_page_experience_texts_hero_stats" USING btree ("_parent_id");
  CREATE INDEX "hire_me_page_texts_get_items_order_idx" ON "hire_me_page_texts_get_items" USING btree ("_order");
  CREATE INDEX "hire_me_page_texts_get_items_parent_id_idx" ON "hire_me_page_texts_get_items" USING btree ("_parent_id");
  CREATE INDEX "hire_me_page_texts_why_items_order_idx" ON "hire_me_page_texts_why_items" USING btree ("_order");
  CREATE INDEX "hire_me_page_texts_why_items_parent_id_idx" ON "hire_me_page_texts_why_items" USING btree ("_parent_id");
  CREATE INDEX "contact_page_texts_steps_items_order_idx" ON "contact_page_texts_steps_items" USING btree ("_order");
  CREATE INDEX "contact_page_texts_steps_items_parent_id_idx" ON "contact_page_texts_steps_items" USING btree ("_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "home_page_texts_hero_showcase" CASCADE;
  DROP TABLE "about_page_about_texts_hero_facts" CASCADE;
  DROP TABLE "about_page_about_texts_stack_groups" CASCADE;
  DROP TABLE "about_page_experience_texts_hero_stats" CASCADE;
  DROP TABLE "work_page" CASCADE;
  DROP TABLE "hire_me_page_texts_get_items" CASCADE;
  DROP TABLE "hire_me_page_texts_why_items" CASCADE;
  DROP TABLE "hire_me_page" CASCADE;
  DROP TABLE "contact_page_texts_steps_items" CASCADE;
  DROP TABLE "blog_page" CASCADE;
  ALTER TABLE "site_settings" DROP COLUMN "layout_menu_home";
  ALTER TABLE "site_settings" DROP COLUMN "layout_menu_about";
  ALTER TABLE "site_settings" DROP COLUMN "layout_menu_services";
  ALTER TABLE "site_settings" DROP COLUMN "layout_menu_work";
  ALTER TABLE "site_settings" DROP COLUMN "layout_menu_experience";
  ALTER TABLE "site_settings" DROP COLUMN "layout_menu_blog";
  ALTER TABLE "site_settings" DROP COLUMN "layout_menu_contact";
  ALTER TABLE "site_settings" DROP COLUMN "layout_seo_title";
  ALTER TABLE "site_settings" DROP COLUMN "layout_seo_keywords";
  ALTER TABLE "site_settings" DROP COLUMN "layout_footer_subtitle";
  ALTER TABLE "site_settings" DROP COLUMN "layout_footer_rights";
  ALTER TABLE "site_settings" DROP COLUMN "layout_footer_built_with";
  ALTER TABLE "site_settings" DROP COLUMN "layout_footer_using";
  ALTER TABLE "site_settings" DROP COLUMN "layout_mobile_bar_title";
  ALTER TABLE "site_settings" DROP COLUMN "layout_mobile_bar_text";
  ALTER TABLE "site_settings" DROP COLUMN "layout_mobile_bar_button";
  ALTER TABLE "site_settings" DROP COLUMN "layout_not_found_eyebrow";
  ALTER TABLE "site_settings" DROP COLUMN "layout_not_found_title";
  ALTER TABLE "site_settings" DROP COLUMN "layout_not_found_lead";
  ALTER TABLE "site_settings" DROP COLUMN "layout_not_found_home";
  ALTER TABLE "site_settings" DROP COLUMN "layout_not_found_projects";
  ALTER TABLE "site_settings" DROP COLUMN "layout_not_found_try";
  ALTER TABLE "home_page" DROP COLUMN "texts_seo_title";
  ALTER TABLE "home_page" DROP COLUMN "texts_seo_description";
  ALTER TABLE "home_page" DROP COLUMN "texts_hero_eyebrow";
  ALTER TABLE "home_page" DROP COLUMN "texts_hero_title";
  ALTER TABLE "home_page" DROP COLUMN "texts_hero_lead";
  ALTER TABLE "home_page" DROP COLUMN "texts_hero_primary";
  ALTER TABLE "home_page" DROP COLUMN "texts_hero_secondary";
  ALTER TABLE "home_page" DROP COLUMN "texts_services_eyebrow";
  ALTER TABLE "home_page" DROP COLUMN "texts_services_title";
  ALTER TABLE "home_page" DROP COLUMN "texts_services_link";
  ALTER TABLE "home_page" DROP COLUMN "texts_work_eyebrow";
  ALTER TABLE "home_page" DROP COLUMN "texts_work_title";
  ALTER TABLE "home_page" DROP COLUMN "texts_work_button";
  ALTER TABLE "home_page" DROP COLUMN "texts_experience_bar_caption";
  ALTER TABLE "home_page" DROP COLUMN "texts_problems_eyebrow";
  ALTER TABLE "home_page" DROP COLUMN "texts_problems_title";
  ALTER TABLE "home_page" DROP COLUMN "texts_ai_workflow_eyebrow";
  ALTER TABLE "home_page" DROP COLUMN "texts_ai_workflow_title";
  ALTER TABLE "home_page" DROP COLUMN "texts_process_eyebrow";
  ALTER TABLE "home_page" DROP COLUMN "texts_process_title";
  ALTER TABLE "home_page" DROP COLUMN "texts_process_button";
  ALTER TABLE "home_page" DROP COLUMN "texts_faq_eyebrow";
  ALTER TABLE "home_page" DROP COLUMN "texts_faq_title";
  ALTER TABLE "home_page" DROP COLUMN "texts_faq_text";
  ALTER TABLE "home_page" DROP COLUMN "texts_cta_title";
  ALTER TABLE "home_page" DROP COLUMN "texts_cta_text";
  ALTER TABLE "home_page" DROP COLUMN "texts_cta_primary";
  ALTER TABLE "about_page" DROP COLUMN "about_texts_seo_title";
  ALTER TABLE "about_page" DROP COLUMN "about_texts_seo_description";
  ALTER TABLE "about_page" DROP COLUMN "about_texts_hero_eyebrow";
  ALTER TABLE "about_page" DROP COLUMN "about_texts_hero_title";
  ALTER TABLE "about_page" DROP COLUMN "about_texts_hero_lead";
  ALTER TABLE "about_page" DROP COLUMN "about_texts_hero_intro";
  ALTER TABLE "about_page" DROP COLUMN "about_texts_hero_primary";
  ALTER TABLE "about_page" DROP COLUMN "about_texts_hero_resume";
  ALTER TABLE "about_page" DROP COLUMN "about_texts_story_title";
  ALTER TABLE "about_page" DROP COLUMN "about_texts_story_lead";
  ALTER TABLE "about_page" DROP COLUMN "about_texts_story_left";
  ALTER TABLE "about_page" DROP COLUMN "about_texts_story_right";
  ALTER TABLE "about_page" DROP COLUMN "about_texts_story_quote";
  ALTER TABLE "about_page" DROP COLUMN "about_texts_story_link";
  ALTER TABLE "about_page" DROP COLUMN "about_texts_what_i_do_title";
  ALTER TABLE "about_page" DROP COLUMN "about_texts_what_i_do_text";
  ALTER TABLE "about_page" DROP COLUMN "about_texts_what_i_do_button";
  ALTER TABLE "about_page" DROP COLUMN "about_texts_philosophy_eyebrow";
  ALTER TABLE "about_page" DROP COLUMN "about_texts_philosophy_title";
  ALTER TABLE "about_page" DROP COLUMN "about_texts_stack_title";
  ALTER TABLE "about_page" DROP COLUMN "about_texts_stack_button";
  ALTER TABLE "about_page" DROP COLUMN "about_texts_stack_experience_title";
  ALTER TABLE "about_page" DROP COLUMN "about_texts_stack_certifications_title";
  ALTER TABLE "about_page" DROP COLUMN "about_texts_cta_title";
  ALTER TABLE "about_page" DROP COLUMN "about_texts_cta_text";
  ALTER TABLE "about_page" DROP COLUMN "about_texts_cta_primary";
  ALTER TABLE "about_page" DROP COLUMN "about_texts_cta_secondary";
  ALTER TABLE "about_page" DROP COLUMN "experience_texts_seo_title";
  ALTER TABLE "about_page" DROP COLUMN "experience_texts_seo_description";
  ALTER TABLE "about_page" DROP COLUMN "experience_texts_hero_eyebrow";
  ALTER TABLE "about_page" DROP COLUMN "experience_texts_hero_title";
  ALTER TABLE "about_page" DROP COLUMN "experience_texts_hero_lead";
  ALTER TABLE "about_page" DROP COLUMN "experience_texts_headings_timeline";
  ALTER TABLE "about_page" DROP COLUMN "experience_texts_headings_certifications";
  ALTER TABLE "about_page" DROP COLUMN "experience_texts_headings_languages";
  ALTER TABLE "about_page" DROP COLUMN "experience_texts_headings_ai_workflow";
  ALTER TABLE "about_page" DROP COLUMN "experience_texts_headings_skills";
  ALTER TABLE "about_page" DROP COLUMN "experience_texts_headings_ai_workflow_text";
  ALTER TABLE "about_page" DROP COLUMN "experience_texts_cta_title";
  ALTER TABLE "about_page" DROP COLUMN "experience_texts_cta_text";
  ALTER TABLE "about_page" DROP COLUMN "experience_texts_cta_primary";
  ALTER TABLE "about_page" DROP COLUMN "experience_texts_cta_secondary";
  ALTER TABLE "services_page" DROP COLUMN "texts_seo_title";
  ALTER TABLE "services_page" DROP COLUMN "texts_seo_description";
  ALTER TABLE "services_page" DROP COLUMN "texts_hero_eyebrow";
  ALTER TABLE "services_page" DROP COLUMN "texts_hero_title";
  ALTER TABLE "services_page" DROP COLUMN "texts_hero_lead";
  ALTER TABLE "services_page" DROP COLUMN "texts_hero_primary";
  ALTER TABLE "services_page" DROP COLUMN "texts_hero_secondary";
  ALTER TABLE "services_page" DROP COLUMN "texts_cards_link";
  ALTER TABLE "services_page" DROP COLUMN "texts_cards_tags_label";
  ALTER TABLE "services_page" DROP COLUMN "texts_packages_title";
  ALTER TABLE "services_page" DROP COLUMN "texts_packages_text";
  ALTER TABLE "services_page" DROP COLUMN "texts_packages_button";
  ALTER TABLE "services_page" DROP COLUMN "texts_process_title";
  ALTER TABLE "services_page" DROP COLUMN "texts_process_text";
  ALTER TABLE "services_page" DROP COLUMN "texts_cta_title";
  ALTER TABLE "services_page" DROP COLUMN "texts_cta_text";
  ALTER TABLE "services_page" DROP COLUMN "texts_cta_primary";
  ALTER TABLE "contact_page" DROP COLUMN "texts_seo_title";
  ALTER TABLE "contact_page" DROP COLUMN "texts_seo_description";
  ALTER TABLE "contact_page" DROP COLUMN "texts_hero_eyebrow";
  ALTER TABLE "contact_page" DROP COLUMN "texts_hero_title";
  ALTER TABLE "contact_page" DROP COLUMN "texts_hero_lead";
  ALTER TABLE "contact_page" DROP COLUMN "texts_hero_intro";
  ALTER TABLE "contact_page" DROP COLUMN "texts_hero_form_note";
  ALTER TABLE "contact_page" DROP COLUMN "texts_details_email";
  ALTER TABLE "contact_page" DROP COLUMN "texts_details_phone";
  ALTER TABLE "contact_page" DROP COLUMN "texts_details_location";
  ALTER TABLE "contact_page" DROP COLUMN "texts_details_availability";
  ALTER TABLE "contact_page" DROP COLUMN "texts_details_availability_value";
  ALTER TABLE "contact_page" DROP COLUMN "texts_details_response";
  ALTER TABLE "contact_page" DROP COLUMN "texts_details_response_value";
  ALTER TABLE "contact_page" DROP COLUMN "texts_details_upwork";
  ALTER TABLE "contact_page" DROP COLUMN "texts_steps_title";
  ALTER TABLE "contact_page" DROP COLUMN "texts_help_with_title";
  ALTER TABLE "contact_page" DROP COLUMN "texts_help_with_link";
  ALTER TABLE "contact_page" DROP COLUMN "texts_faq_eyebrow";
  ALTER TABLE "contact_page" DROP COLUMN "texts_faq_title";
  ALTER TABLE "contact_page" DROP COLUMN "texts_faq_text";
  ALTER TABLE "contact_page" DROP COLUMN "texts_form_title";
  ALTER TABLE "contact_page" DROP COLUMN "texts_form_note";
  ALTER TABLE "contact_page" DROP COLUMN "texts_form_name";
  ALTER TABLE "contact_page" DROP COLUMN "texts_form_name_placeholder";
  ALTER TABLE "contact_page" DROP COLUMN "texts_form_email";
  ALTER TABLE "contact_page" DROP COLUMN "texts_form_email_placeholder";
  ALTER TABLE "contact_page" DROP COLUMN "texts_form_company";
  ALTER TABLE "contact_page" DROP COLUMN "texts_form_company_placeholder";
  ALTER TABLE "contact_page" DROP COLUMN "texts_form_optional";
  ALTER TABLE "contact_page" DROP COLUMN "texts_form_type";
  ALTER TABLE "contact_page" DROP COLUMN "texts_form_budget";
  ALTER TABLE "contact_page" DROP COLUMN "texts_form_budget_placeholder";
  ALTER TABLE "contact_page" DROP COLUMN "texts_form_message";
  ALTER TABLE "contact_page" DROP COLUMN "texts_form_message_placeholder";
  ALTER TABLE "contact_page" DROP COLUMN "texts_form_submit";
  ALTER TABLE "contact_page" DROP COLUMN "texts_form_sending";
  ALTER TABLE "contact_page" DROP COLUMN "texts_form_reply";
  ALTER TABLE "contact_page" DROP COLUMN "texts_form_sent_title";
  ALTER TABLE "contact_page" DROP COLUMN "texts_form_sent_again";
  ALTER TABLE "contact_page" DROP COLUMN "texts_form_sent_text";
  ALTER TABLE "contact_page" DROP COLUMN "texts_form_failed";
  ALTER TABLE "contact_page" DROP COLUMN "texts_form_limited";
  ALTER TABLE "contact_page" DROP COLUMN "texts_form_fallback";
  ALTER TABLE "contact_page" DROP COLUMN "texts_cta_title";
  ALTER TABLE "contact_page" DROP COLUMN "texts_cta_text";
  ALTER TABLE "contact_page" DROP COLUMN "texts_cta_primary";
  ALTER TABLE "contact_page" DROP COLUMN "texts_cta_secondary";
  DROP TYPE "public"."enum_about_page_about_texts_hero_facts_icon";
  DROP TYPE "public"."enum_about_page_about_texts_stack_groups_icon";
  DROP TYPE "public"."enum_hire_me_page_texts_get_items_icon";
  DROP TYPE "public"."enum_hire_me_page_texts_why_items_icon";`)
}
