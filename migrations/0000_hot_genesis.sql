CREATE TABLE "admin_users" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"username" text NOT NULL,
	"password" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "admin_users_username_unique" UNIQUE("username")
);
--> statement-breakpoint
CREATE TABLE "bootcamp_registrations" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"full_name" text NOT NULL,
	"email" text NOT NULL,
	"phone" text NOT NULL,
	"age" text NOT NULL,
	"organization" text NOT NULL,
	"payment_proof" text NOT NULL,
	"district" text NOT NULL,
	"place" text,
	"address" text,
	"photo" text,
	"experience" text NOT NULL,
	"expectations" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"status" text DEFAULT 'approved' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "contact_submissions" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"phone" text,
	"subject" text NOT NULL,
	"message" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "membership_applications" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"full_name" text NOT NULL,
	"email" text NOT NULL,
	"phone" text NOT NULL,
	"organization" text,
	"designation" text,
	"membership_type" text NOT NULL,
	"interests" text NOT NULL,
	"message" text,
	"payment_amount" text,
	"payment_screenshot" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "partners" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"logo" text NOT NULL,
	"description" text,
	"website" text,
	"category" text DEFAULT 'partner' NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"order" text DEFAULT '0' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "popup_settings" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"is_enabled" boolean DEFAULT true NOT NULL,
	"title" text DEFAULT 'Startup Boot Camp' NOT NULL,
	"banner_image" text NOT NULL,
	"button_text" text DEFAULT 'Register Now' NOT NULL,
	"button_link" text DEFAULT '/register' NOT NULL,
	"delay_seconds" text DEFAULT '1' NOT NULL,
	"show_once" boolean DEFAULT false NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "programs" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"icon" text NOT NULL,
	"features" text[],
	"gradient" text DEFAULT 'purple' NOT NULL,
	"banner_image" text,
	"is_active" boolean DEFAULT true NOT NULL,
	"program_status" text DEFAULT 'upcoming' NOT NULL,
	"order" text DEFAULT '0' NOT NULL,
	"event_date" text,
	"venue" text,
	"fee_label" text,
	"fee_amount" text,
	"early_bird_offer" text,
	"register_url" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "program_registrations" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"program_id" varchar NOT NULL,
	"full_name" text NOT NULL,
	"email" text NOT NULL,
	"phone" text NOT NULL,
	"country_code" text DEFAULT '+91' NOT NULL,
	"company" text,
	"attendee_type" text NOT NULL,
	"affiliation" text NOT NULL,
	"expectations" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"username" text NOT NULL,
	"password" text NOT NULL,
	CONSTRAINT "users_username_unique" UNIQUE("username")
);
