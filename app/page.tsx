import Link from "next/link";
import { redirect } from "next/navigation";

export default function Home() {
  return (
    <div>
      <Link href={"/home"}>
        <button>Get Started</button>
      </Link>
    </div>
  );
}
