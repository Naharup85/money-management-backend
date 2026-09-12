ALTER TABLE "users" ADD COLUMN "logto_user_id" varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "password";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "isEmailVerified";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "email_verification_code";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "email_verification_code_expiry";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "password_reset_code";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "password_reset_code_expiry";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "refresh_token";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "refresh_token_expiry";--> statement-breakpoint
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_color_key" UNIQUE("color");--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_logto_user_id_key" UNIQUE("logto_user_id");