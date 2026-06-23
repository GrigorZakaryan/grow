"use client";
import { FaHouse } from "react-icons/fa6";
import { IoCalendarClear } from "react-icons/io5";
import { IoLayers } from "react-icons/io5";
import { IoMdSettings } from "react-icons/io";
import { act, useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  motion,
  useMotionValue,
  useAnimationControls,
  AnimatePresence,
} from "framer-motion";
import { usePathname, useRouter } from "next/navigation";
import {
  Calendar,
  FilePlus,
  Home,
  Layers,
  LayersPlus,
  NotebookPen,
  Plus,
  Settings,
} from "lucide-react";

const list = [
  {
    icon: <Home className="w-6 h-6" />,
    label: "Home",
    key: "home",
    index: 0,
  },
  {
    icon: <Calendar className="w-6 h-6" />,
    label: "Calendar",
    key: "calendar",
    index: 1,
  },
  {
    icon: <Layers className="w-6 h-6" />,
    label: "Domains",
    key: "domains",
    index: 2,
  },
  {
    icon: <Settings className="w-6 h-6" />,
    label: "Settings",
    key: "settings",
    index: 3,
  },
];

const activeList = [
  {
    icon: <NotebookPen className="w-6 h-6 text-black dark:text-white" />,
    label: "Journal",
    key: "journal",
    index: 0,
  },
  {
    icon: <LayersPlus className="w-6 h-6" />,
    label: "Domain",
    key: "domain",
    index: 2,
  },
  {
    icon: <FilePlus className="w-6 h-6" />,
    label: "Task",
    key: "task",
    index: 1,
  },
];

export const MenuBar = ({ className }: { className?: string }) => {
  const [active, setActive] = useState(false);

  const pathname = usePathname();
  const listIndex =
    list.find((item) => item.key === pathname.replace("/", ""))?.index ?? 0;
  const containerRef = useRef<HTMLDivElement>(null);
  const controls = useAnimationControls();

  const [activeIndex, setActiveIndex] = useState(listIndex);

  const dragX = useMotionValue(0);

  const router = useRouter();

  const handleDragEnd = (_event: any, info: any) => {
    if (!containerRef.current) return;

    const containerWidth = containerRef.current.offsetWidth;
    const colWidth = containerWidth / list.length;
    const currentX = dragX.get();
    const calculatedIndex = Math.round(currentX / colWidth);
    const nextIndex = Math.max(0, Math.min(list.length - 1, calculatedIndex));

    setActiveIndex(nextIndex);

    controls.start({
      x: nextIndex * colWidth,
      transition: { type: "spring", stiffness: 350, damping: 30 },
    });
  };

  useEffect(() => {
    router.push(`/${list[activeIndex].key}`);
  }, [activeIndex]);

  return (
    <div
      className={`${className} flex items-end justify-between gap-3 w-full ${active} px-5`}
    >
      <AnimatePresence>
        <motion.div
          layout
          transition={{ type: "spring", duration: 0.5 }}
          animate={{
            height: active ? 200 : 56,
            borderRadius: active ? 30 : 30,
          }}
          className={`flex-1 flex items-center justify-center w-full h-full bg-black/5 dark:bg-gray-300/10 border-b border-b-black/10 dark:border-b-white/10 border-l border-l-black/10 dark:border-l-white/10 border-t border-r border-t-black/10 dark:border-t-white/10 border-r-black/10 dark:border-r-white/10 backdrop-blur-2xl rounded-full shadow-lg ${active ? "p-3" : "p-1"}`}
        >
          {active ? (
            <div className="w-full h-full grid grid-cols-4 grid-rows-3 gap-3">
              {activeList.map((item, index) => (
                <Link
                  className="flex flex-col items-center w-full h-full"
                  key={item.key}
                  href={`/${item.key}`}
                  passHref
                >
                  <button
                    onClick={() => {
                      setActiveIndex(index);
                      if (containerRef.current) {
                        const colWidth =
                          containerRef.current.offsetWidth / list.length;
                        controls.start({ x: index * colWidth });
                      }
                    }}
                    // Removed py-2, added full flex layout centering adjustments
                    className="flex items-center justify-center w-full h-full rounded-2xl z-10 cursor-pointer bg-white/10"
                  >
                    {item.icon}
                  </button>
                </Link>
              ))}
            </div>
          ) : (
            <motion.div
              layout
              ref={containerRef}
              className="relative w-full grid grid-cols-4 items-center justify-items-center z-50 h-12"
            >
              {/* Navigation Buttons */}
              {list.map((item, index) => (
                <Link key={item.key} href={`/${item.key}`} passHref>
                  <button
                    onClick={() => {
                      setActiveIndex(index);
                      if (containerRef.current) {
                        const colWidth =
                          containerRef.current.offsetWidth / list.length;
                        controls.start({ x: index * colWidth });
                      }
                    }}
                    // Removed py-2, added full flex layout centering adjustments
                    className="flex items-center justify-center w-full h-full rounded-full z-10 cursor-pointer"
                  >
                    {item.icon}
                  </button>
                </Link>
              ))}

              {/* Snapping Pill Background */}
              <motion.div
                drag="x"
                animate={controls}
                style={{ x: dragX }}
                dragConstraints={containerRef}
                dragElastic={0.15}
                dragMomentum={false}
                onDragEnd={handleDragEnd}
                whileDrag={{
                  scale: 1.2,
                  backgroundColor: "rgba(255, 255, 255, 0.05)",
                }}
                // Uses inset positioning layout to match grid row heights perfectly
                className="absolute top-0 bottom-0 left-0 w-1/4 border border-white/10 bg-black/20 dark:bg-white/10 rounded-full cursor-grab active:cursor-grabbing origin-center"
              />
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>

      <AnimatePresence>
        <motion.div
          transition={{ type: "spring", duration: 0.5 }}
          animate={{ rotate: active ? "45deg" : "0deg" }}
          onClick={() => setActive(!active)}
          whileTap={{
            scale: 1.3,
            backgroundColor: "rgba(255, 255, 255, 0.25)",
          }}
          className="flex items-center justify-center w-14 h-14 rounded-full bg-black/5 dark:bg-gray-300/10 border-b border-b-black/10 dark:border-b-white/10 border-l border-l-black/10 dark:border-l-white/10 border-t border-r border-t-black/10 dark:border-t-white/10 border-r-black/10 dark:border-r-white/10 backdrop-blur-2xl shadow-lg"
        >
          <Plus />
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
