"use server";
import * as crypto from "crypto";

import { and, desc, ilike, count, or, eq, sql } from "drizzle-orm";
import { db } from "../db/connection";
import { SubmittedAnswer, TestSubmission } from "../db/schema";
import { GeminiAgentService } from "../gemini";
import { QuestionAnswer } from "@/components/test/takeTest";
import { getTest } from "./test.action";
import dayjs from "dayjs";

export const listTestSubmissions = async ({
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
  const doctorList = await db.query.TestSubmission.findMany({
    limit,
    offset,
    where: (TestSubmission, { eq, or, and }) => {
      return and(
        eq(TestSubmission.testId, testId),
        !!query ? or(ilike(TestSubmission.name, `%${query}%`)) : undefined
      );
    },
    orderBy: [desc(TestSubmission.createdAt)],
  });

  const Numbers = await db
    .select({ count: count(TestSubmission.id) })
    .from(TestSubmission)
    .where(
      and(!!query ? or(ilike(TestSubmission.name, `%${query}%`)) : undefined)
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

export const getAllTestSubmissions = async () => {
  const doctorList = await db.query.TestSubmission.findMany();
  if (doctorList) {
    return doctorList;
  }
  return null;
};

export const getTestSubmission = async (TestSubmissionId: string) => {
  const submission = await db
    .select()
    .from(TestSubmission)
    .where(eq(TestSubmission.id, TestSubmissionId));
  if (TestSubmission && submission[0]) {
    return submission[0];
  }
  return null;
};

export const createTestSubmission = async (
  qaData: QuestionAnswer[],
  testId: string
) => {
  const test = await getTest(testId);

  if (!test) {
    return null;
  }

  const correct = qaData.filter((qa) => qa.a === qa.q.answer).length;

  const response = await db
    .insert(TestSubmission)
    .values({
      testId: String(testId),
      childId: test.childId,
      name: `${test.name}${dayjs().format("YYYY-MM-DD-HH-mm-ss")}`,
      description: test.description,
      total: qaData.length,
      correct: correct,
    })
    .returning();
  if (response && response[0]) {
    const result = await createSubmittedAnswer(qaData, testId, response[0].id);
    if (!result) {
      await deleteTestSubmission(response[0].id);
      return null;
    }
    const query = sql`UPDATE test SET status = 'completed' WHERE id = ${testId}`;
    return response[0];
  }
  return null;
};

const createSubmittedAnswer = async (
  qaData: QuestionAnswer[],
  testId: string,
  submissionId: string
) => {
  const created = await db
    .insert(SubmittedAnswer)
    .values(
      qaData.map((qa) => ({
        testId: String(testId),
        submissionId: String(submissionId),
        answer: qa.a,
        testSubmissionId: String(submissionId),
        isCorrect: qa.a === qa.q.answer,
        questionId: qa.q.id,
        correctAnswer: qa.q.answer,
      }))
    )
    .returning();

  if (created && created.length > 0) {
    return true;
  }
  return false;
};

export const updateTestSubmission = async (
  id: string,
  submission: Partial<typeof TestSubmission.$inferSelect>
) => {
  const response = await db
    .update(TestSubmission)
    .set({
      ...submission,
    })
    .where(eq(TestSubmission.id, id))
    .returning();
  if (response && response[0]) {
    return response[0];
  }
  return null;
};

export const deleteTestSubmission = async (id: string) => {
  const response = await db
    .delete(TestSubmission)
    .where(eq(TestSubmission.id, id))
    .returning();
  if (response && response[0]) {
    return response[0];
  }
  return null;
};
