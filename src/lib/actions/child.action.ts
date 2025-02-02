"use server";
import * as crypto from "crypto";

import { and, desc, ilike, count, or, eq } from "drizzle-orm";
import { db } from "../db/connection";
import { Child } from "../db/schema";
import { GeminiAgentService } from "../gemini";

export const listChildren = async ({
  limit = 10,
  offset = 0,
  query = "",
  parentId,
}: {
  limit: number;
  offset: number;
  parentId: string;
  query?: string;
}) => {
  console.log("query.........", query);
  const doctorList = await db.query.Child.findMany({
    limit,
    offset,
    where: (Child, { eq, or, and }) => {
      return and(
        eq(Child.parentId, parentId),
        !!query ? or(ilike(Child.name, `%${query}%`)) : undefined
      );
    },
    orderBy: [desc(Child.createdAt)],
  });

  const Numbers = await db
    .select({ count: count(Child.id) })
    .from(Child)
    .where(
      and(
        eq(Child.parentId, parentId),
        !!query ? or(ilike(Child.name, `%${query}%`)) : undefined
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

export const getAllChilds = async () => {
  const doctorList = await db.query.Child.findMany();
  if (doctorList) {
    return doctorList;
  }
  return null;
};

export const getChild = async (ChildId: string) => {
  const child = await db.select().from(Child).where(eq(Child.id, ChildId));
  if (Child && child[0]) {
    return child[0];
  }
  return null;
};

export const createChild = async (child: typeof Child.$inferInsert) => {
  const token = crypto.randomBytes(16).toString("hex");

  const response = await db
    .insert(Child)
    .values({
      ...child,
    })
    .returning();
  if (response && response[0]) {
    return response[0];
  }
  return null;
};

export const updateChild = async (
  id: string,
  child: Partial<typeof Child.$inferSelect>
) => {
  const response = await db
    .update(Child)
    .set({
      ...child,
    })
    .where(eq(Child.id, id))
    .returning();
  if (response && response[0]) {
    return response[0];
  }
  return null;
};

export const deleteChild = async (id: string) => {
  const response = await db.delete(Child).where(eq(Child.id, id)).returning();
  if (response && response[0]) {
    return response[0];
  }
  return null;
};
