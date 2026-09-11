"use client";
import { useTimer } from "@/components/modals/stores/use-timer-store";
import { FilePlus, LayersPlus, Logs, NotebookPen, Timer } from "lucide-react";
import { useDomainForm } from "../../domains/stores/use-domain-form";
import { useTaskForm } from "../../individual/[domainId]/stores/use-task-form";
import { useActivity } from "../../individual/[domainId]/stores/use-activity-store";

export const QuickActions = () => {
  const { toggleOpen, open } = useTimer();
  const { setOpen } = useDomainForm();
  const { setOpenTask } = useTaskForm();
  const { setOpenActivity } = useActivity();

  const activeList = [
    {
      icon: <FilePlus className="w-5 h-5 text-green-300" />,
      label: "Add Task",
      key: "task",
      index: 2,
      action: () => setOpenTask(),
    },
    {
      icon: <Logs className="w-5 h-5 text-blue-300" />,
      label: "Log Activity",
      key: "activity",
      index: 4,
      action: () => setOpenActivity(),
    },
    {
      icon: <NotebookPen className="w-5 h-5 text-violet-300" />,
      label: "New Journal",
      key: "journal",
      index: 0,
    },
    {
      icon: <Timer className="w-5 h-5 text-yellow-300" />,
      label: "Start Timer",
      key: "timer",
      index: 3,
      action: () => toggleOpen(),
    },
    {
      icon: <LayersPlus className="w-5 h-5 text-red-300" />,
      label: "Add Domain",
      key: "domain",
      index: 1,
      action: () => setOpen(),
    },
  ];
  return (
    <div className="flex items-center gap-3 w-full overflow-x-auto px-5">
      {activeList.map((item) => (
        <div
          onClick={item.action}
          className="flex items-center w-full min-w-auto gap-2 px-6 py-2 text-md font-medium scrollbar-hide bg-white/10 hover:bg-white/20 duration-200 rounded-full"
          key={item.index}
        >
          <div className="w-full">{item.icon}</div>{" "}
          <span className="w-full text-nowrap">{item.label}</span>
        </div>
      ))}
    </div>
  );
};
