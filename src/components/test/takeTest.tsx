"use client";
import { listQuestions } from "@/lib/actions/question.action";
import { Child, Test, User } from "@/lib/db/schema";
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";
import { PaginationState } from "@tanstack/react-table";
import { useState } from "react";
import { Question } from "@/lib/db/schema";
import { set } from "react-hook-form";
import { createTestSubmission } from "@/lib/actions/test.submission";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
export function TakeTest({
  user,
  test,
  child,
}: {
  user: Partial<typeof User.$inferSelect>;
  test: typeof Test.$inferSelect;
  child: typeof Child.$inferSelect;
}) {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <TakeTestComponent user={user} test={test} child={child} />
    </QueryClientProvider>
  );
}

export type QuestionAnswer = {
  q: typeof Question.$inferSelect;
  a: string | null | undefined;
};

function TakeTestComponent({
  user,
  test,
  child,
}: {
  user: Partial<typeof User.$inferSelect>;
  test: typeof Test.$inferSelect;
  child: typeof Child.$inferSelect;
}) {
  const [pagination, setpagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const [questionAnswers, setQuestionAnswers] = useState<QuestionAnswer[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const router = useRouter();

  const {
    data: questions,
    isLoading: isLoading,
    refetch,
  } = useQuery({
    queryKey: ["tests", pagination.pageIndex, pagination.pageSize],
    queryFn: async () => {
      const res = await listQuestions({
        limit: pagination.pageSize,
        offset: pagination.pageIndex * pagination.pageSize,
        testId: test.id,
      });

      if (res && res.data && res.data.length > 0) {
        setQuestionAnswers(res.data.map((q) => ({ q, a: null })));
      }
      return res;
    },
    enabled: !!test.id,
    staleTime: 1000,
  });

  console.log("questions", questions);
  return (
    <div className=" flex flex-col w-full">
      <div className="w-full flex justify-end">
        <button
          onClick={async () => {
            try {
              const result = await createTestSubmission(
                questionAnswers,
                test.id
              );
              if (!result) {
                toast.error("Error submitting test");
                return;
              }
              toast.success("Test submitted successfully");
              router.push("/");
            } catch (e) {
              console.log(e);
            }
          }}
          className="py-2 px-4 bg-mantle hover:bg-crust text-white font-bold rounded"
        >
          Submit Test
        </button>
      </div>
      {questionAnswers && questionAnswers[currentQuestionIndex] ? (
        <div className="flex flex-col gap-4">
          <h3>
            {currentQuestionIndex + 1} .{" "}
            {questionAnswers[currentQuestionIndex]?.q?.question}
          </h3>

          <div className="flex flex-col gap-2 ">
            {(
              questionAnswers[currentQuestionIndex]?.q?.options as string[]
            )?.map((option) => (
              <div className="flex  gap-2  items-center ">
                <input
                  className="h-4 w-4"
                  type="radio"
                  name="option"
                  value={option}
                  checked={option === questionAnswers[currentQuestionIndex]?.a}
                  onChange={(e) => {
                    const newQuestionAnswers = [...questionAnswers];
                    newQuestionAnswers[currentQuestionIndex].a = e.target.value;
                    setQuestionAnswers(newQuestionAnswers);
                  }}
                />
                {option}
              </div>
            ))}
          </div>
          <div className="flex gap-4">
            <button
              disabled={currentQuestionIndex === 0}
              onClick={() => {
                if (currentQuestionIndex > 0) {
                  setCurrentQuestionIndex(currentQuestionIndex - 1);
                }
              }}
              className="bg-mantle hover:bg-crust text-white font-bold py-2 px-4 rounded disabled:opacity-50"
            >
              Prev{" "}
            </button>
            <button
              disabled={currentQuestionIndex === questionAnswers.length - 1}
              onClick={() => {
                if (currentQuestionIndex < questionAnswers.length - 1) {
                  setCurrentQuestionIndex(currentQuestionIndex + 1);
                }
              }}
              className="bg-mantle hover:bg-crust text-white font-bold py-2 px-4 rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      ) : (
        <div>NO QUESTION</div>
      )}
    </div>
  );
}
