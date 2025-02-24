import { signIn } from "@/auth";
import { SignInForm } from "@/components/sign/signInForm";
import { SignUpForm } from "@/components/sign/signUpForm";
import Image from "next/image";
import Link from "next/link";

export default function Signin() {
  return (
    <div className="flex max-w-[1280px] mx-auto  w-full h-screen justify-center items-center  ">
      <div className="bg-white p-8 flex flex-col gap-16 lg:flex-row justify-center items-center rounded-2xl">
        <div className="flex flex-col items-center gap-4 justify-between w-fit h-full">
          <h3 className="text-2xl font-bold text-black italic">
            Explore Possiblities
          </h3>
          <h3 className="text-2xl font-bold text-black italic">
            {" "}
            Beyond Imagination
          </h3>
          <Image
            src="/illustrations/login.png"
            alt="logo"
            width={300}
            height={500}
          />
        </div>
        <div className="flex  flex-col bg-mantle items-center gap-4 justify-center w-fit h-fit p-8 rounded shadow-xl">
          <div className="flex items-center gap-2 shadow-xl rounded-2xl ">
            <Image src="/images/logo.png" alt="logo" width={30} height={30} />
            <h2 className="text-xl font-bold">Skool Of Code</h2>
          </div>

          <SignUpForm />
          <div className="flex items-center gap-4 mt-4 justify-center">
            {/* <div className="bg-white h-[1px] w-full flex rounded"></div> */}
            OR
            {/* <div className="bg-white h-1 w-full flex rounded"></div> */}
          </div>
          <button
            onClick={async () => {
              "use server";
              const res = await signIn("google");
              console.log(
                res,
                "res..............................................................................................."
              );
            }}
            className="flex items-center justify-center bg-white py-2 gap-2 text-crust px-4 rounded w-fit cursor-pointer hover:bg-crust hover:text-white "
          >
            <p className="text-sm ">Sign in with </p>
            <Image
              className=""
              src="/images/google.svg"
              alt="google"
              width={24}
              height={24}
            />
          </button>
          <div className="flex items-center gap-2 mt-4">
            Already have an account ?{" "}
            <Link href="/signin">
              <span className="text-teal-500">Sign in</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
