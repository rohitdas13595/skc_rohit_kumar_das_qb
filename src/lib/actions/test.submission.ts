"use server";
import * as crypto from "crypto";

import { and, desc, ilike, count, or, eq } from "drizzle-orm";
import { db } from "../db/connection";
import { TestSubmission } from "../db/schema";
import { GeminiAgentService } from "../gemini";

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
  const child = await db
    .select()
    .from(TestSubmission)
    .where(eq(TestSubmission.id, TestSubmissionId));
  if (TestSubmission && child[0]) {
    return child[0];
  }
  return null;
};

export const createTestSubmission = async (
  child: typeof TestSubmission.$inferInsert
) => {
  const token = crypto.randomBytes(16).toString("hex");

  const response = await db.insert(TestSubmission).values({
    ...child,
  });
  if (response) {
    return response;
  }
  return null;
};

export const updateTestSubmission = async (
  id: string,
  child: Partial<typeof TestSubmission.$inferSelect>
) => {
  const response = await db
    .update(TestSubmission)
    .set({
      ...child,
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
