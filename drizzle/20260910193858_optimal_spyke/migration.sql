CREATE TYPE "account_type" AS ENUM('bank', 'card', 'cash', 'credit_card', 'investment', 'other');--> statement-breakpoint
CREATE TYPE "payment_status" AS ENUM('cleared', 'pending');--> statement-breakpoint
CREATE TYPE "payment_type" AS ENUM('cash', 'bank', 'card', 'upi');--> statement-breakpoint
CREATE TYPE "transaction_type" AS ENUM('income', 'expense', 'transfer');--> statement-breakpoint
CREATE TABLE "accounts" (
	"id" uuid PRIMARY KEY,
	"user_id" uuid NOT NULL,
	"account_name" varchar(255) NOT NULL,
	"type" "account_type" DEFAULT 'cash'::"account_type",
	"color" varchar(255) DEFAULT '#83b5f0ff',
	"balance" numeric(14,2) DEFAULT '0.00' NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "categories" (
	"id" integer PRIMARY KEY,
	"name" varchar(100) NOT NULL UNIQUE,
	"type" varchar(15) NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "records" (
	"id" uuid PRIMARY KEY,
	"from_account_id" uuid NOT NULL,
	"to_account_id" uuid,
	"amount" numeric(14,2) DEFAULT '0.00' NOT NULL,
	"type" "transaction_type" DEFAULT 'expense'::"transaction_type",
	"category" integer NOT NULL,
	"description" varchar(255),
	"date" timestamp DEFAULT now() NOT NULL,
	"note" varchar(255),
	"payer" varchar(255),
	"payment_type" "payment_type" DEFAULT 'cash'::"payment_type",
	"payment_status" "payment_status" DEFAULT 'cleared'::"payment_status",
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY,
	"first_name" varchar(255) NOT NULL,
	"last_name" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL UNIQUE,
	"password" varchar(255) NOT NULL,
	"cash_balance" numeric(14,2) DEFAULT '0.00' NOT NULL,
	"profile_picture" varchar(255),
	"isEmailVerified" boolean DEFAULT false,
	"email_verification_code" varchar(255),
	"email_verification_code_expiry" timestamp,
	"password_reset_code" varchar(255),
	"password_reset_code_expiry" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp
);
--> statement-breakpoint
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_user_id_users_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id");--> statement-breakpoint
ALTER TABLE "records" ADD CONSTRAINT "records_from_account_id_accounts_id_fkey" FOREIGN KEY ("from_account_id") REFERENCES "accounts"("id");--> statement-breakpoint
ALTER TABLE "records" ADD CONSTRAINT "records_to_account_id_accounts_id_fkey" FOREIGN KEY ("to_account_id") REFERENCES "accounts"("id");--> statement-breakpoint
ALTER TABLE "records" ADD CONSTRAINT "records_category_categories_id_fkey" FOREIGN KEY ("category") REFERENCES "categories"("id");