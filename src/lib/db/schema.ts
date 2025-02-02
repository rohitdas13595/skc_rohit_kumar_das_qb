import {
  pgSchema,
  uuid,
  varchar,
  text,
  timestamp,
  pgTable,
  PgEnumColumn,
  boolean,
  json,
  integer,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { int } from "drizzle-orm/mysql-core";

export const User = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom().notNull(),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: varchar("password", { length: 255 }),
  isVerified: boolean("is_verified").default(false),
  signUpType: varchar("sign_up_type", {
    length: 255,
    enum: ["password", "google"],
  }),
  logo: varchar("logo", { length: 500 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .notNull()
    .$onUpdateFn(() => sql`update users set updated_at = CURRENT_TIMESTAMP`),
});

export const Child = pgTable("child", {
  id: uuid("id").primaryKey().defaultRandom().notNull(),
  name: varchar("name", { length: 255 }),
  parentId: uuid("parent_id")
    .notNull()
    .references(() => User.id, { onDelete: "cascade" }),
  age: integer("age"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .notNull()
    .$onUpdateFn(() => sql`update users set updated_at = CURRENT_TIMESTAMP`),
});

export const Test = pgTable("test", {
  id: uuid("id").primaryKey().defaultRandom().notNull(),
  language: varchar("language", { length: 255 }),
  level: varchar("level", { length: 255 }),
  childId: uuid("child_id")
    .notNull()
    .references(() => Child.id, { onDelete: "cascade" }),
  name: varchar("name", { length: 255 }),
  description: varchar("description", { length: 255 }),
  status: varchar("status", {
    length: 255,
    enum: ["pending", "in-progress", "completed"],
  }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .notNull()
    .$onUpdateFn(() => sql`update users set updated_at = CURRENT_TIMESTAMP`),
});

export const Question = pgTable("question", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  testId: uuid("test_id")
    .notNull()
    .references(() => Test.id, { onDelete: "cascade" }),
  question: varchar("question", { length: 255 }),
  options: json("options"),
  answer: varchar("answer", { length: 255 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .notNull()
    .$onUpdateFn(() => sql`update users set updated_at = CURRENT_TIMESTAMP`),
});

export const TestSubmission = pgTable("test_submission", {
  id: uuid("id").primaryKey().defaultRandom().notNull(),
  testId: uuid("test_id")
    .notNull()
    .references(() => Test.id, { onDelete: "cascade" }),
  childId: uuid("child_id")
    .notNull()
    .references(() => Child.id, { onDelete: "cascade" }),
  name: varchar("name", { length: 255 }),
  description: varchar("description", { length: 255 }),
  total: integer("total"),
  correct: integer("correct"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .notNull()
    .$onUpdateFn(() => sql`update users set updated_at = CURRENT_TIMESTAMP`),
});

export const SubmittedAnswer = pgTable("submitted_answer", {
  id: uuid("id").primaryKey().defaultRandom().notNull(),
  testId: uuid("test_id")
    .notNull()
    .references(() => Test.id, { onDelete: "cascade" }),
  questionId: integer("question_id")
    .notNull()
    .references(() => Question.id, { onDelete: "cascade" }),
  testSubmissionId: uuid("test_submission_id")
    .notNull()
    .references(() => TestSubmission.id, { onDelete: "cascade" }),
  answer: varchar("answer", { length: 255 }),
  correctAnswer: varchar("correct_answer", { length: 255 }),
  isCorrect: boolean("is_correct").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .notNull()
    .$onUpdateFn(() => sql`update users set updated_at = CURRENT_TIMESTAMP`),
});
