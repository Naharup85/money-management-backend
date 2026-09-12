
import { boolean, uuid, decimal, pgTable, varchar, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { usersTable } from "./users.js";

export const accountTypeEnum = pgEnum("account_type", ["bank", "card", "cash", "credit_card", "investment", "other"]);
export const accountsTable = pgTable("accounts", {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id").notNull().references(() => usersTable.id),
    accountName: varchar("account_name", { length: 255 }).notNull(),
    type: accountTypeEnum("type").default("cash"),
    color: varchar("color", { length: 255 }).default("#83b5f0ff").unique(),
    balance: decimal("balance", { precision: 14, scale: 2 }).notNull().default('0.00'),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").$onUpdate(() => new Date()),
});
