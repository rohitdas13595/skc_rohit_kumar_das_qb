"use server";
import * as crypto from "crypto";

import { and, desc, ilike, count, or, eq } from "drizzle-orm";
import { db } from "../db/connection";
import { Question, Test } from "../db/schema";
import { GeminiAgentService } from "../gemini";

export const listTests = async ({
  limit = 10,
  offset = 0,
  query = "",
  childId,
}: {
  limit: number;
  offset: number;
  query?: string;
  childId: string;
}) => {
  console.log("query.........", query);
  const doctorList = await db.query.Test.findMany({
    limit,
    offset,
    where: (Test, { eq, or, and }) => {
      return and(!!query ? or(ilike(Test.name, `%${query}%`)) : undefined);
    },
    orderBy: [desc(Test.createdAt)],
  });

  const Numbers = await db
    .select({ count: count(Test.id) })
    .from(Test)
    .where(
      and(
        eq(Test.childId, childId),
        !!query ? or(ilike(Test.name, `%${query}%`)) : undefined
      )
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

export const getAllTests = async () => {
  const doctorList = await db.query.Test.findMany();
  if (doctorList) {
    return doctorList;
  }
  return null;
};

export const getTest = async (testId: string) => {
  const test = await db.select().from(Test).where(eq(Test.id, testId));
  if (Test && test[0]) {
    return test[0];
  }
  return null;
};

export const createTest = async (
  test: typeof Test.$inferInsert,
  numberOfQuestions: number = 5,
  level: "beginner" | "intermediate" | "advanced" = "beginner",
  apiKey?: string
) => {
  const response = await db
    .insert(Test)
    .values({
      ...test,
      level,
    })
    .returning();
  if (response && response[0]) {
    const questions = await createQuestions(
      response[0].id,
      response[0].language ?? test.language ?? "python",
      numberOfQuestions,
      level,
      apiKey
    );
    if (!questions) {
      await deleteTest(response[0].id);
      return null;
    }
    return response[0];
  }
  return null;
};

export const updateTest = async (
  id: string,
  test: Partial<typeof Test.$inferSelect>
) => {
  const response = await db
    .update(Test)
    .set({
      ...test,
    })
    .where(eq(Test.id, id))
    .returning();
  if (response && response[0]) {
    return response[0];
  }
  return null;
};

const createQuestions = async (
  testId: string,
  language: string,
  numberOfQuestions: number,
  level: string,
  apiKey?: string
) => {
  const geminiAgentService = new GeminiAgentService(apiKey);
  const result = await geminiAgentService.generateQuestions({
    language: language,
    numberOfQuestions: numberOfQuestions,
    level: level,
  });
  if (!result || !(result instanceof Array) || result.length == 0) {
    return false;
  }

  const questions = await db
    .insert(Question)
    .values(
      result.map((question) => ({
        testId: String(testId),
        question: question.question,
        options: question.options,
        answer: question.answer,
      }))
    )
    .returning();
  if (questions && questions.length > 0) {
    return true;
  }
  return false;
};

export const deleteTest = async (id: string) => {
  const response = await db.delete(Test).where(eq(Test.id, id)).returning();
  if (response && response[0]) {
    return response[0];
  }
  return null;
};
