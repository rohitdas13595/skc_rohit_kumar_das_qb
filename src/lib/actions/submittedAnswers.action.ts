"use server";
import * as crypto from "crypto";

import { and, desc, ilike, count, or, eq } from "drizzle-orm";
import { db } from "../db/connection";
import { SubmittedAnswer } from "../db/schema";
import { GeminiAgentService } from "../gemini";

export const listSubmittedAnswers = async ({
  limit = 10,
  offset = 0,
  query = "",
}: {
  limit: number;
  offset: number;
  query?: string;
}) => {
  console.log("query.........", query);
  const doctorList = await db.query.SubmittedAnswer.findMany({
    limit,
    offset,
    where: (SubmittedAnswer, { eq, or, and }) => {
      return and(
        !!query ? or(ilike(SubmittedAnswer.answer, `%${query}%`)) : undefined
      );
    },
    orderBy: [desc(SubmittedAnswer.createdAt)],
  });

  const Numbers = await db
    .select({ count: count(SubmittedAnswer.id) })
    .from(SubmittedAnswer)
    .where(
      and(!!query ? or(ilike(SubmittedAnswer.answer, `%${query}%`)) : undefined)
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

export const getAllSubmittedAnswers = async () => {
  const doctorList = await db.query.SubmittedAnswer.findMany();
  if (doctorList) {
    return doctorList;
  }
  return null;
};

export const getSubmittedAnswer = async (SubmittedAnswerId: string) => {
  const child = await db
    .select()
    .from(SubmittedAnswer)
    .where(eq(SubmittedAnswer.id, SubmittedAnswerId));
  if (SubmittedAnswer && child[0]) {
    return child[0];
  }
  return null;
};

export const createSubmittedAnswer = async (
  child: typeof SubmittedAnswer.$inferInsert
) => {
  const token = crypto.randomBytes(16).toString("hex");

  const response = await db.insert(SubmittedAnswer).values({
    ...child,
  });
  if (response) {
    return response;
  }
  return null;
};

export const updateSubmittedAnswer = async (
  id: string,
  child: Partial<typeof SubmittedAnswer.$inferSelect>
) => {
  const response = await db
    .update(SubmittedAnswer)
    .set({
      ...child,
    })
    .where(eq(SubmittedAnswer.id, id))
    .returning();
  if (response && response[0]) {
    return response[0];
  }
  return null;
};

export const deleteSubmittedAnswer = async (id: string) => {
  const response = await db
    .delete(SubmittedAnswer)
    .where(eq(SubmittedAnswer.id, id))
    .returning();
  if (response && response[0]) {
    return response[0];
  }
  return null;
};
