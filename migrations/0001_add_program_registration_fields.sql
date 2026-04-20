-- Add new fields to program_registrations table
ALTER TABLE "program_registrations" ADD COLUMN "age" text;
ALTER TABLE "program_registrations" ADD COLUMN "designation" text;
ALTER TABLE "program_registrations" ADD COLUMN "is_member" boolean DEFAULT false NOT NULL;
ALTER TABLE "program_registrations" ADD COLUMN "membership_number" text;
