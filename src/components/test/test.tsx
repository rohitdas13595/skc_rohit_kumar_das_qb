import { Test } from "@/lib/db/schema";
import Link from "next/link";

export function TestView({ test }: { test: typeof Test.$inferSelect }) {
  return (
    <div className="w-full flex flex-col border-2 rounded-xl p-4 gap-4">
      <p className="text-2xl"> Name : {test.name}</p>
      <p>
        Level :{" "}
        {
          {
            beginner: "Beginner",
            intermediate: "Intermediate",
            advanced: "Advanced",
          }[test.level as string]
        }
      </p>
      <p>
        Staus :{" "}
        {
          {
            pending: "Pending",
            "in-progress": "In Progress",
            completed: "Completed",
          }[test.status as string]
        }
      </p>
      <p>Description : {test.description}</p>
      {test.status === "pending" ? (
        <Link
          href={`/take-test/${test.id}`}
          className="py-2 w-fit  px-4 rounded-xl bg-crust text-white"
        >
          Start Test
        </Link>
      ) : (
        <Link
          href={`/take-test/${test.id}`}
          className="py-2 w-fit  px-4 rounded-xl bg-crust text-white"
        >
          Restart Test
        </Link>
      )}
    </div>
  );
}
