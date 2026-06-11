import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col justify-end w-full h-dvh p-7">
      <Link className="text-white" href={"/home"}>
        <button className="w-full py-2 bg-white text-black rounded-full text-center">
          Get started
        </button>
      </Link>
    </div>
  );
}
