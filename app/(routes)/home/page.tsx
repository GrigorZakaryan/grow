import { Header } from "./components/header";
import { HomeTasks } from "./components/tasks";

export default function Home() {
  return (
    <div className="w-full h-full px-5 py-2">
      <Header />
      <div className="w-full h-full">
        <HomeTasks />
      </div>
    </div>
  );
}
