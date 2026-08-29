import db from "@/lib/db";
import { Header } from "./components/header";
import { HomeTasks } from "./components/tasks";

export default async function Home() {
  return (
    <div className="w-full h-full px-5 py-2">
      <Header />
      <div className="w-full h-full overflow-y-scroll pb-40">
        <HomeTasks />
      </div>
    </div>
  );
}
