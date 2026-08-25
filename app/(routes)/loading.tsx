import { Spinner } from "@/components/ui/spinner";

export default async function Loading() {
  return (
    <div className="flex items-center justify-center w-full h-full">
      <Spinner className="w-7 h-7" />
    </div>
  );
}
