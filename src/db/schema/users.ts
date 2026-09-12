import { boolean, uuid, decimal, pgTable, varchar, timestamp } from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
    id: uuid("id").defaultRandom().primaryKey(),
    logtoUserId: varchar("logto_user_id", { length: 255 }).notNull().unique(),
    firstName: varchar("first_name", { length: 255 }).notNull(),
    lastName: varchar("last_name", { length: 255 }).notNull(),
    email: varchar("email", { length: 255 }).notNull().unique(),
    cashBalance: decimal("cash_balance", { precision: 14, scale: 2 }).notNull().default('0.00'),
    profilePicture: varchar("profile_picture", { length: 255 }),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").$onUpdate(() => new Date()),
});




