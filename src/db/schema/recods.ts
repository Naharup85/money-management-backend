import { boolean, uuid, decimal,integer, pgTable, varchar, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { accountsTable } from "./accounts.js";
import { categoriesTable } from "./categories.js";

export const recordTypeEnum = pgEnum("transaction_type", ["income", "expense", "transfer"]);
export const paymentTypeEnum = pgEnum("payment_type", ["cash", "bank", "card", "upi"]);
export const paymentStatusEnum = pgEnum("payment_status", ["cleared", "pending"]);

export const recordsTable = pgTable("records", {
    id: uuid("id").primaryKey(),
    fromAccountId: uuid("from_account_id").notNull().references(() => accountsTable.id),
    toAccountId: uuid("to_account_id").references(() => accountsTable.id),
    amount: decimal("amount",{precision:14,scale:2}).notNull().default('0.00'),
    type: recordTypeEnum("type").default("expense"),
    category: integer("category").notNull().references(() => categoriesTable.id),
    description: varchar("description", { length: 255 }),
    date: timestamp('date').notNull().defaultNow(),
    note: varchar("note", { length: 255 }),
    payer: varchar("payer", { length: 255 }),
    paymentType: paymentTypeEnum("payment_type").default("cash"),
    paymentStatus: paymentStatusEnum("payment_status").default("cleared"),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").$onUpdate(() => new Date()),
});

