import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import { z } from "zod";
import { createInsertSchema } from "drizzle-zod";

const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull(),
  role: text('role', { enum: ['admin', 'user'] }).notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

const insertUserSchema = createInsertSchema(users, {
  id: (schema) => schema.id.positive(),
  email: (schema) => schema.email.email(),
  role: z.string(),
});
 
// Usage
const user = insertUserSchema.parse({
  name: 'John Doe',
  email: 'johndoe@test.com',
  role: 'admin',
});
 
// Zod schema type is also inferred from the table schema, so you have full type safety
const requestSchema = insertUserSchema.pick({ name: true, email: true });
