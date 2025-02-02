"use client";
import { deleteTokens, getIdentity } from "@/lib/actions/auth.action";
import { getUser } from "@/lib/actions/user.action";
import {
  Query,
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";
import { Uses } from "./uses";
import { CirclePower } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { TestList } from "./testList";
import { useState } from "react";
import { ChildList } from "./childList";

export function Profile({ userId }: { userId: string }) {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <ProfileComponent userId={userId} />
    </QueryClientProvider>
  );
}

export function ProfileComponent({ userId }: { userId: string }) {
  const [activeChild, setActiveChild] = useState<string | undefined>();
  const { data, isLoading } = useQuery({
    queryKey: ["profile", userId],
    queryFn: async () => {
      const response = await getUser(userId);
      return response?.data ?? null;
    },
  });

  const router = useRouter();
  return (
    <div className="flex flex-col items-center justify-center w-full gap-4">
      <div className="flex flex-col w-full p-4 items-center justify-center   rounded-xl bg-mantle">
        <div className="flex flex-row items-center justify-between w-full">
          <h1 className="text-2xl font-bold">Profile</h1>
          <button
            onClick={async () => {
              // "use server";
              await deleteTokens();
              router.push("/signin");
            }}
          >
            <CirclePower />
          </button>
        </div>
        <hr className="w-full h-px my-4 " />
        <div className="flex flex-col lg:flex-row  items-center justify-between w-full gap-4">
          <div className="flex flex-col items-center bg-surface0 p-4 rounded h-full ">
            <img
              className="w-12 h-12 rounded-full"
              src={
                data?.logo ??
                "https://images.unsplash.com/photo-1499714608240-22fc6ad53fb2?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=76&q=80"
              }
              alt="profile"
            />
            {data?.name && (
              <p className="font-bold text-lg">{data?.name ?? "User"}</p>
            )}
            {data?.email && (
              <p className="text-sm italic">
                {data?.email ?? "zK7r2@example.com"}
              </p>
            )}
          </div>
          <div>
            <ChildList
              activeChild={activeChild}
              setActiveChild={setActiveChild}
              userId={userId}
            />
          </div>
          <div className="flex flex-col items-center bg-surface0 p-4 rounded mb-4">
            <p className="text-lg font-bold">Uses</p>
            <Uses />
          </div>
        </div>
        <div></div>
      </div>

      <section className="flex flex-col w-full mt-8">
        {activeChild ? (
          <TestList userId={userId} childId={activeChild} />
        ) : (
          <div className="flex w-full bg-crust p-4 rounded">
            No child selected, please select a child or create a new child
          </div>
        )}
      </section>
    </div>
  );
}
