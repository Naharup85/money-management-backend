ALTER TABLE "users" ADD COLUMN "refresh_token" varchar(255);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "refresh_token_expiry" timestamp;