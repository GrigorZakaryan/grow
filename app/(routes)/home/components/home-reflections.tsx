import axios from "axios";
import { useEffect, useState } from "react";
import { ReflectionCard } from "../../individual/[domainId]/components/reflections/reflection-card";
import { Relfection } from "@/lib/generated/prisma/client";

export const HomeReflections = () => {
  const [loading, setLoading] = useState(false);
  const [reflections, setReflections] = useState<Relfection[]>([]);

  useEffect(() => {
    fetchReflections();
  }, []);

  const fetchReflections = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`/home/api/reflections`);
      setReflections(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full mt-3">
      <div className="flex items-center gap-3 mt-4 w-full h-full overflow-y-hidden overflow-x-auto px-5">
        {reflections.map((r) => (
          <ReflectionCard key={r.id} r={r} />
        ))}
      </div>
    </div>
  );
};
