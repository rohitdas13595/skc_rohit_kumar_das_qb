import { TestPage } from "@/components/test/main";
import { TakeTest } from "@/components/test/takeTest";
import { DefaultComponent } from "@/components/user/defaultComponent";
import { getIdentity } from "@/lib/actions/auth.action";
import { getChild } from "@/lib/actions/child.action";
import { getTest } from "@/lib/actions/test.action";
import { MoveLeft } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function SingleTestPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;
  const idendity = await getIdentity();
  if (!idendity?.data?.user?.id) {
    return <DefaultComponent />;
  }
  if (!id) {
    return redirect("/user");
  }
  const test = await getTest(id);
  if (!test) {
    return redirect("/user");
  }
  const child = await getChild(test.childId);
  if (!child) {
    return redirect("/user");
  }
  return (
    <div className="flex flex-col w-full max-w-[1280px] mx-auto gap-4 h-screen px-12 lg:px-8">
      <section className="flex flex-col w-full mt-8">
        <Link
          href="/user"
          className="flex flex-row items-center gap-2 bg-crust  w-fit py-1 px-2 rounded mb-4"
        >
          <MoveLeft /> Back To Account
        </Link>
        <TakeTest user={idendity?.data?.user} test={test} child={child} />
      </section>
    </div>
  );
}
