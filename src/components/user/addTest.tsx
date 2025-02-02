"use client";
import { useState } from "react";
import { Modal } from "../modal/modal";
import { CirclePlus } from "lucide-react";
import { set, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { number, z } from "zod";
import { InputFieldSign, SelectFieldSign } from "../sign/signFormFilelds";
import { Infer } from "next/dist/compiled/superstruct";
import { Spinner } from "../loader/spinner";
// import { createTest, fetchTitle } from "@/lib/actions/child.action";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { createTest } from "@/lib/actions/test.action";
import { desc } from "drizzle-orm";

export const AddTestSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  description: z.string().min(1, { message: "Description is required" }),
  status: z.enum(["pending", "in-progress", "completed"]),
  numberOfQuestions: z.coerce
    .number()
    .min(1, { message: "Number is required" })
    .max(30, {
      message: "Number must be less  than or equal to 30",
    }),
  level: z.enum(["beginner", "intermediate", "advanced"]),
  language: z.enum(["python", "java", "c++", "c", "javascript", "html", "css"]),
});

export function AddTest({
  userId,
  childId,
  refetch,
}: {
  userId: string;
  childId: string;
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
    resolver: zodResolver(AddTestSchema),
    values: {
      name: "",
      description: "",
      language: "python",
      status: "pending",
      numberOfQuestions: 5,
      level: "beginner",
    },
  });

  const onSubmit = async (data: Infer<typeof AddTestSchema>) => {
    setLoading(true);
    try {
      console.log(data);

      if (!childId) {
        toast.error("No child Selected");
        return;
      }

      const created = await createTest(
        {
          name: data.name,
          description: data.description,
          status: data.status,
          childId: childId,
          language: data.language,
        },
        data.numberOfQuestions,
        data.level
      );
      if (created) {
        toast.success("Test created successfully");
        refetch();
        setOpen(false);
        return created;
      }
      toast.error("Error creating test");
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
        Add Test
      </button>
      <Modal open={open} setOpen={closeModal} title="Add Test">
        <div className="flex flex-col gap-4 p-8">
          <form
            onSubmit={handleSubmit(onSubmit, (error) => {
              console.error(error);
            })}
            className="flex flex-col gap-4 max-w-[800px] w-full justify-center items-center"
          >
            <InputFieldSign
              register={register}
              name="language"
              type="text"
              label="Language *"
              error={errors.language}
              disabled
            />
            <SelectFieldSign
              register={register}
              name="level"
              type="text"
              label="Level *"
              error={errors.level}
              options={[
                { value: "beginner", label: "Beginner" },
                { value: "intermediate", label: "Intermediate" },
                { value: "advanced", label: "Advanced" },
              ]}
            />
            <InputFieldSign
              register={register}
              name="numberOfQuestions"
              type="number"
              label="Number of Questions *"
            />
            <InputFieldSign
              register={register}
              name="name"
              type="text"
              label="Name *"
              error={errors.name}
            />
            <InputFieldSign
              register={register}
              name="description"
              type="text"
              label="Description"
              error={errors.description}
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
                "Create Test"
              )}
            </button>
          </form>
        </div>
      </Modal>
    </div>
  );
}
