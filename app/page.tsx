import Link from "next/link";
import { redirect } from "next/navigation";

export default function Home() {
  redirect("/home");
  return (
    <div className="flex flex-col justify-end w-full h-dvh p-7 bg-white dark:bg-black">
      <Link className="text-white" href={"/home"}>
        <button className="w-full py-2 bg-black text-white dark:bg-white dark:text-black rounded-full text-center">
          Get started
        </button>
      </Link>
    </div>
  );
}
