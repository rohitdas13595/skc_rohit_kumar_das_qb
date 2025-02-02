"use client";

// import { Button } from "@/components/ui/button";
import Link from "next/link";

import { ColumnDef, PaginationState } from "@tanstack/react-table";
import { useState } from "react";

// import AddDoctorForm from "@/components/forms/AddDoctor";
import {
  Query,
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";
// import { getDoctorList } from "@/lib/actions/submission.actions";
import dayjs from "dayjs";
import { getInitials } from "@/lib/utils";

import { Edit, Eye } from "lucide-react";
import { listTestSubmissions } from "@/lib/actions/test.submission";
import { DataTable } from "../user/dataTable";

export const Submission = ({ testId }: { testId: string }) => {
  const [pagination, setpagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const [query, setQuery] = useState<string | undefined>();

  const columns: ColumnDef<any | undefined>[] = [
    {
      accessorKey: "id",
      header: "Test Name",
      cell: ({ row }) => (
        <div className="flex gap-2 items-center">
          <p>{row.original?.name}</p>
        </div>
      ),
    },
    {
      accessorKey: "createdAt",
      header: "Date",

      cell: ({ row }) => {
        return (
          <>{dayjs(row.original?.createdAt).format("MMM DD, YYYY, hh:mm A")}</>
        );
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        return (
          <>
            {
              {
                pending: "Pending",
                "in-progress": "In Progress",
                completed: "Completed",
              }[row.original?.status as string]
            }
          </>
        );
      },
    },
    {
      accessorKey: "actions",
      header: "Actions",
      cell: ({ row }) => {
        return (
          <div className="flex gap-2 items-center">
            <Link
              href={`/user/submission/${row.original?.id}`}
              className="flex gap-2 text-black bg-crust py-1 px-4  font-bold text-white  rounded-2xl text-white shadow-xl border border-white hover:bg-mantle"
            >
              <Eye />
              View
            </Link>
          </div>
        );
      },
    },
  ];

  const {
    data: submissions,
    isLoading: isLoading,
    refetch,
  } = useQuery({
    queryKey: ["submissions", pagination.pageIndex, pagination.pageSize, query],
    queryFn: async () => {
      const res = listTestSubmissions({
        limit: pagination.pageSize,
        offset: pagination.pageIndex * pagination.pageSize,
        query,
        testId: testId,
      });

      return res;
    },
    enabled: !!testId,
    staleTime: 1000,
  });

  console.log("submissions", submissions);

  return (
    <div className="flex flex-col w-full bg-mantle p-4 rounded-xl">
      <h4 className="text-2xl font-bold">Submission History</h4>

      {/* <div className="flex flex-col-reverse  lg:flex-row w-full   justify-between gap-4 my-4">
        <div>
          <input
            type="text"
            className="w-full p-2 rounded-xl bg-mantle border"
            placeholder="Search"
            onChange={(e) => setQuery(e.target.value)}
            value={query}
          />
        </div>
      </div> */}
      <div className="flex flex-col w-full hidden lg:flex">
        <DataTable
          columns={columns}
          data={submissions?.data || []}
          pagination={pagination}
          setPagination={setpagination}
          rowCount={submissions?.total ?? 0}
        />
      </div>
      <div className="flex flex-col w-full lg:hidden">
        {submissions?.data?.length === 0 ? (
          <div className="flex flex-col w-full items-center justify-center gap-4">
            <p className="text-2xl font-bold">No Tests</p>
          </div>
        ) : (
          <div>
            {submissions?.data?.map((submission: any) => (
              <Link
                href={`/user/submission/${submission?.id}`}
                key={submission.id}
                className="flex flex-col w-full items-center justify-center gap-4 bg-crust p-4 rounded-xl"
              >
                <div className="flex flex-col  items-center justify-between w-full">
                  <div className="flex flex-col items-center gap-2">
                    <img
                      className="w-12 h-12 rounded-full"
                      src={
                        submission?.avatar ?? "https://github.com/shadcn.png"
                      }
                      alt=""
                    />
                    <p className="text-xl font-bold">{submission?.name}</p>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <p className="text-xl font-bold">
                      {dayjs(submission?.createdAt).format(
                        "MMM DD, YYYY, hh:mm A"
                      )}
                    </p>
                    <p className="text-xl font-bold">
                      {submission?.status === "active" ? "Active" : "Inactive"}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
