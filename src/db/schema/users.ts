import { boolean, uuid, decimal, pgTable, varchar, timestamp } from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
    id: uuid().defaultRandom().primaryKey(),
    firstName: varchar("first_name", { length: 255 }).notNull(),
    lastName: varchar("last_name", { length: 255 }).notNull(),
    email: varchar("email", { length: 255 }).notNull().unique(),
    password: varchar("password", { length: 255 }).notNull(),
    cashBalance: decimal("cash_balance",{precision:14,scale:2}).notNull().default('0.00'),
    profilePicture: varchar("profile_picture", { length: 255 }),
    isEmailVerified: boolean().default(false),
    emailVerifactionCode: varchar("email_verification_code", { length: 255 }),
    emailVerifactionCodeExpiry: timestamp("email_verification_code_expiry"),
    passwordResetCode: varchar("password_reset_code", { length: 255 }),
    passwordResetCodeExpiry: timestamp("password_reset_code_expiry"),
    refreshToken: varchar("refresh_token", { length: 255 }),
    refreshTokenExpiry: timestamp("refresh_token_expiry"),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").$onUpdate(() => new Date()),
});




