"use server";
import * as crypto from "crypto";

import { and, desc, ilike, count, or, eq } from "drizzle-orm";
import { db } from "../db/connection";
import { Question } from "../db/schema";
import { GeminiAgentService } from "../gemini";

export const listQuestions = async ({
  limit = 10,
  offset = 0,
  query = "",
  testId,
}: {
  limit: number;
  offset: number;
  query?: string;
  testId: string;
}) => {
  console.log("query.........", query);
  const doctorList = await db.query.Question.findMany({
    limit,
    offset,
    where: (Question, { eq, or, and }) => {
      return and(
        eq(Question.testId, testId),
        !!query ? or(ilike(Question.question, `%${query}%`)) : undefined
      );
    },
    orderBy: [desc(Question.createdAt)],
  });

  const Numbers = await db
    .select({ count: count(Question.id) })
    .from(Question)
    .where(
      and(!!query ? or(ilike(Question.question, `%${query}%`)) : undefined)
    );

  if (
    doctorList &&
    Numbers &&
    Numbers.length > 0 &&
    Numbers[0] &&
    Numbers[0].count
  ) {
    return {
      data: doctorList,
      total: Numbers[0].count,
    };
  }
  return null;
};

export const getAllQuestions = async () => {
  const doctorList = await db.query.Question.findMany();
  if (doctorList) {
    return doctorList;
  }
  return null;
};

export const getQuestion = async (QuestionId: number) => {
  const question = await db
    .select()
    .from(Question)
    .where(eq(Question.id, QuestionId));
  if (Question && question[0]) {
    return question[0];
  }
  return null;
};

export const createQuestion = async (
  question: typeof Question.$inferInsert
) => {
  const token = crypto.randomBytes(16).toString("hex");

  const response = await db.insert(Question).values({
    ...question,
  });
  if (response) {
    return response;
  }
  return null;
};

export const updateQuestion = async (
  id: number,
  question: Partial<typeof Question.$inferSelect>
) => {
  const response = await db
    .update(Question)
    .set({
      ...question,
    })
    .where(eq(Question.id, id))
    .returning();
  if (response && response[0]) {
    return response[0];
  }
  return null;
};

export const deleteQuestion = async (id: number) => {
  const response = await db
    .delete(Question)
    .where(eq(Question.id, id))
    .returning();
  if (response && response[0]) {
    return response[0];
  }
  return null;
};
