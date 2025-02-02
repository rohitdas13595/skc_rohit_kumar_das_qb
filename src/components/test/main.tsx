"use client";

import { cn } from "@/lib/utils";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { FlaskConical, MonitorCheck, Workflow } from "lucide-react";
import { Submission } from "./submission";
import { TestView } from "./test";
import { Test, User } from "@/lib/db/schema";
import { useState } from "react";

export enum Views {
  Test = "test",
  Submission = "submission",
}

export function TestPage({
  user,
  test,
}: {
  user: Partial<typeof User.$inferSelect>;
  test: typeof Test.$inferSelect;
}) {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <ChatbotPageComponent user={user} test={test} />
    </QueryClientProvider>
  );
}
export function ChatbotPageComponent({
  user,
  test,
}: {
  user: Partial<typeof User.$inferSelect>;
  test: typeof Test.$inferSelect;
}) {
  const [view, setView] = useState(Views.Test);
  const [extended, setExtended] = useState(true);
  const commonClass =
    "font-bold rounded px-4 py-2 flex items-center gap-2 justify-center";
  const inactiveClass = "text-gray-400";
  const activeClass = "text-white bg-crust border-b border-teal-400";

  return (
    <div>
      <div className="flex flex-row gap-4 border-b-2  border-surface0 border-collapse">
        <button
          onClick={() => setView(Views.Test)}
          className={cn(
            commonClass,
            view === Views.Test ? activeClass : inactiveClass
          )}
        >
          <FlaskConical />
          <p className="hidden lg:block"> Test Details</p>
        </button>
        <button
          onClick={() => setView(Views.Submission)}
          className={cn(
            commonClass,
            view === Views.Submission ? activeClass : inactiveClass
          )}
        >
          <Workflow />
          <p className="hidden lg:block">Submissions</p>
        </button>
      </div>
      <div className="pt-4">
        {
          {
            [Views.Test]: <TestView test={test} />,
            [Views.Submission]: <Submission testId={test.id} />,
          }[view]
        }
      </div>
    </div>
  );
}
