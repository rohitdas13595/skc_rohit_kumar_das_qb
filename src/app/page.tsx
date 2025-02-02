import { InteractiveHoverButton } from "@/components/ui/button/interactiveButton";
import dynamic from "next/dynamic";
import Link from "next/link";

const DynamicGlobe = dynamic(() =>
  import("@/components/ui/globe").then((mod) => mod.Globe)
);
export default function Home() {
  return (
    <div className="flex flex-col w-full max-w-[1280px] mx-auto gap-4 h-screen px-12 lg:px-8">
      <section className="flex  flex-col-reverse lg:flex-row  pt:4  lg:pt-8 gap-4  lg:gap-8 justify-between">
        <div className="flex flex-col p-4 gap-4  justify-center items-center lg:items-start">
          <h3 className="text-4xl font-bold">
            Make your child&apos;s dream come true
          </h3>
          <p className="italic">
            Use of our AI generated tests that best suits your child&apos;s
            needs.
          </p>
          <div className="flex items-center gap-4">
            Powered By:
            <img
              src="/images/gemini.jpg"
              alt=""
              className="w-[100px] rounded"
            />
          </div>
          <Link href="/signup">
            <InteractiveHoverButton className="w-fit my-12">
              Create Account
            </InteractiveHoverButton>
          </Link>
        </div>
        <div className="w-full flex items-center  justify-center">
          <img src="/illustrations/home.svg" alt="" />
        </div>
      </section>
      <div className="flex pb-12">
        <div className="relative flex flex-col size-full  items-center justify-center overflow-visible rounded-lg w-full  pt-8 md:shadow-xl">
          <span className="pointer-events-none whitespace-pre-wrap bg-gradient-to-b from-peach to-yellow bg-clip-text text-center text-4xl font-semibold leading-none text-transparent dark:from-white dark:to-slate-900/10">
            We are present everywhere.
          </span>
          <DynamicGlobe className="top-0" />
          <div className="pointer-events-none absolute inset-0 h-full bg-[radial-gradient(circle_at_50%_200%,rgba(0,0,0,0.2),rgba(255,255,255,0))]" />
        </div>
      </div>

      <div className=" flex flex-col items-center justify-center text-sm bg-crust p-4  rounded-lg mb-4">
        <h2 className="text-2xl font-bold mb-4">About The Project</h2>
        <p className="mb-4">
          This project is built using Drizzle, PG , NextJS, TailwindCSS,
          Typescript, Gemini AI, and Deployed on Vercel.
        </p>
      </div>
      <div className="mb-4"></div>
    </div>
  );
}
