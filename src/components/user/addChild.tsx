"use client";
import { useState } from "react";
import { Modal } from "../modal/modal";
import { CirclePlus } from "lucide-react";
import { set, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { InputFieldSign } from "../sign/signFormFilelds";
import { Infer } from "next/dist/compiled/superstruct";
import { Spinner } from "../loader/spinner";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { desc } from "drizzle-orm";
import { createChild } from "@/lib/actions/child.action";

export const AddChildSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  age: z.coerce.number().min(1, { message: "Age is required" }),
});

export const wesiteRegex =
  /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/;

export function AddChild({
  userId,
  refetch,
}: {
  userId: string;
  refetch: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showName, setShowName] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(AddChildSchema),
    defaultValues: {
      name: "",
      age: 0,
    },
  });

  const onSubmit = async (data: Infer<typeof AddChildSchema>) => {
    setLoading(true);
    try {
      console.log(data);

      const created = await createChild({
        name: data.name,
        age: data.age,
        parentId: userId,
      });
      if (created) {
        refetch();
        toast.success("Child created successfully");
        return created;
      }
      toast.error("Error creating child");
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong, please try again later");
    } finally {
      setLoading(false);
    }
  };

  const closeModal = (state: boolean) => {
    setOpen(state);
    setShowName(false);
    reset();
  };

  return (
    <div>
      <button
        onClick={() => setOpen(true)}
        className="bg-crust py-1 px-4  font-bold text-white  rounded-xl py-2 px-4 text-white shadow-xl border border-white hover:bg-mantle flex items-center gap-2"
      >
        <CirclePlus />
        Add Child
      </button>
      <Modal open={open} setOpen={closeModal} title="Add Child">
        <div className="flex flex-col gap-4 p-8">
          <form
            onSubmit={handleSubmit(onSubmit, (error) => {
              console.error(error);
            })}
            className="flex flex-col gap-4 max-w-[800px] w-full justify-center items-center"
          >
            <InputFieldSign
              register={register}
              name="name"
              type="text"
              label="Name *"
              error={errors.name}
            />
            <InputFieldSign
              register={register}
              name="age"
              type="number"
              label="Age *"
              error={errors.age}
            />

            <button
              type="submit"
              disabled={loading}
              style={{ cursor: "pointer", width: "100%", marginTop: "1rem" }}
              className="text-white  bg-gradient-to-r from-teal-400 via-teal-500 to-teal-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-teal-300 dark:focus:ring-teal-800 shadow-lg shadow-teal-500/50 dark:shadow-lg dark:shadow-teal-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 flex gap-2 items-center justify-center"
            >
              {loading ? (
                <span className="flex gap-2 items-center">
                  <span>Creating</span>
                  <Spinner />
                </span>
              ) : (
                "Create Child"
              )}
            </button>
          </form>
        </div>
      </Modal>
    </div>
  );
}
