import { createInsertSchema } from "drizzle-zod";
import {
  date,
  integer,
  pgTable,
  serial,
  text,
  timestamp,
  unique,
} from "drizzle-orm/pg-core";
import { z } from "zod/v4";

export const roomInventory = pgTable(
  "room_inventory",
  {
    id: serial("id").primaryKey(),
    roomType: text("room_type").notNull(),
    totalRooms: integer("total_rooms").notNull().default(42),
  },
  (table) => [unique("room_inventory_room_type_unique").on(table.roomType)],
);

export const stayRequests = pgTable("stay_requests", {
  id: serial("id").primaryKey(),
  reference: text("reference").notNull().unique(),
  checkIn: date("check_in", { mode: "string" }).notNull(),
  checkOut: date("check_out", { mode: "string" }).notNull(),
  guests: integer("guests").notNull(),
  rooms: integer("rooms").notNull(),
  status: text("status").notNull().default("pending"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertStayRequestSchema = createInsertSchema(stayRequests).omit({
  id: true,
  createdAt: true,
});

export type InsertStayRequest = z.infer<typeof insertStayRequestSchema>;
export type StayRequest = typeof stayRequests.$inferSelect;