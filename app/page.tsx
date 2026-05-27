import Link from "next/link";
import { redirect } from "next/navigation";

export default function Home() {
  return (
    <div className="relative w-full h-dvh">
      <Link className="text-white" href={"/home"}>
        Continue
      </Link>
    </div>
  );
}
