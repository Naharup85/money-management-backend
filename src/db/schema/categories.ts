import { integer, pgTable, varchar, timestamp } from "drizzle-orm/pg-core";



export const categoriesTable = pgTable("categories", {
    id: integer("id").primaryKey(),
    name: varchar("name", { length: 100 }).unique().notNull(),
    type: varchar("type", { length: 15 }).notNull(),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").$onUpdate(() => new Date()),
});