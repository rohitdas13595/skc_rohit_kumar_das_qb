import { listChildren } from "@/lib/actions/child.action";
import { listTests } from "@/lib/actions/test.action";
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";
import { ColumnDef, PaginationState } from "@tanstack/react-table";
import dayjs from "dayjs";
import { Eye, Trash, Trash2 } from "lucide-react";
import Link from "next/link";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { AddChild } from "./addChild";
import { cn } from "@/lib/utils";

export function ChildList({
  userId,
  activeChild,
  setActiveChild,
}: {
  userId: string;
  activeChild?: string;
  setActiveChild: Dispatch<SetStateAction<string | undefined>>;
}) {
  const [pagination, setpagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const [query, setQuery] = useState<string | undefined>();

  const columns: ColumnDef<any | undefined>[] = [
    {
      accessorKey: "id",
      header: "Chat Bot",
      cell: ({ row }) => (
        <div className="flex gap-2 items-center">
          <img
            src={row.original?.avatar ?? "https://github.com/shadcn.png"}
            alt=""
            width={30}
            height={30}
            className="w-10 h-10 rounded-full"
          />
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
        return <>{row.original?.status === "active" ? "Active" : "Inactive"}</>;
      },
    },
    {
      accessorKey: "actions",
      header: "Actions",
      cell: ({ row }) => {
        return (
          <div className="flex gap-2 items-center">
            <Link
              href={`/user/test/${row.original?.id}`}
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
    data: children,
    isLoading: isLoading,
    refetch,
  } = useQuery({
    queryKey: ["children", pagination.pageIndex, pagination.pageSize, query],
    queryFn: async () => {
      const res = listChildren({
        limit: pagination.pageSize,
        offset: pagination.pageIndex * pagination.pageSize,
        query,
        parentId: userId,
      });
      return res;
    },
    enabled: !!userId,
    staleTime: 1000,
  });

  console.log("children", children);

  useEffect(() => {
    const localChildId = localStorage.getItem("childId");
    if (
      localChildId &&
      localChildId !== children?.data[0]?.id &&
      localChildId !== "undefined"
    ) {
      setActiveChild(localChildId);
      return;
    }
    if (children?.data && children?.data?.length > 0) {
      localStorage.setItem("childId", children?.data[0]?.id);
      setActiveChild(children?.data[0]?.id);
    } else {
      localStorage.removeItem("childId");
    }
  }, [children]);

  return (
    <div className="flex flex-col w-full bg-mantle p-4 rounded-xl w-full">
      <h4 className="text-2xl font-bold">Children</h4>

      <div className="flex my-2">
        <AddChild userId={userId} refetch={refetch} />
      </div>
      {/* <div className="flex flex-col w-full hidden lg:flex">
            <DataTable
              columns={columns}
              data={children?.data || []}
              pagination={pagination}
              setPagination={setpagination}
              rowCount={children?.total ?? 0}
            />
          </div> */}
      <div className="flex flex-col w-full ">
        {children?.data?.length === 0 ? (
          <div className="flex flex-col w-full items-center justify-center gap-4">
            <p className="text-2xl font-bold">No Child</p>
          </div>
        ) : (
          <div className="flex wrap gap-4 flex-wrap gap-2 w-full">
            {children?.data?.map((child: any) => (
              <div
                key={child.id}
                className={cn(
                  "flex flex-col w-fit items-center justify-center gap-4 bg-crust p-4 rounded-xl",
                  activeChild === child.id ? "bg-surface2" : ""
                )}
              >
                <div className="flex flex-row items-center justify-end w-full gap-2">
                  {activeChild !== child.id && (
                    <button
                      onClick={() => {
                        localStorage.setItem("childId", child.id);
                        setActiveChild(child.id);
                      }}
                      className="flex gap-2 bg-surface0 py-1 px-2 rounded"
                    >
                      Select
                    </button>
                  )}
                  <Trash2 className="text-red cursor-pointer" />
                </div>
                <div className="flex flex-col  items-center justify-between w-full">
                  <div className="flex flex-col items-center gap-2">
                    <img
                      className="w-12 h-12 rounded-full"
                      src={child?.avatar ?? "https://github.com/shadcn.png"}
                      alt=""
                    />
                    <p className="text-xl font-bold">{child?.name}</p>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <p className="text-xl font-bold">
                      {dayjs(child?.createdAt).format("MMM DD, YYYY, hh:mm A")}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
