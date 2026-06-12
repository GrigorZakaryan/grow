"use client";
import { FaHouse } from "react-icons/fa6";
import { IoCalendarClear } from "react-icons/io5";
import { IoLayers } from "react-icons/io5";
import { IoMdSettings } from "react-icons/io";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, useMotionValue, useAnimationControls } from "framer-motion";
import { usePathname, useRouter } from "next/navigation";

const list = [
  {
    icon: <FaHouse className="w-6 h-6" />,
    label: "Home",
    key: "home",
    index: 0,
  },
  {
    icon: <IoCalendarClear className="w-6 h-6" />,
    label: "Calendar",
    key: "calendar",
    index: 1,
  },
  {
    icon: <IoLayers className="w-6 h-6" />,
    label: "Domains",
    key: "domains",
    index: 2,
  },
  {
    icon: <IoMdSettings className="w-6 h-6" />,
    label: "Settings",
    key: "settings",
    index: 3,
  },
];

export const MenuBar = ({ className }: { className?: string }) => {
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
      className={`${className} flex items-center justify-center bg-white/10 border-b border-b-white/20 border-l border-l-white/15 border-t border-r border-t-white/10 border-r-white/10 backdrop-blur-xl shadow-lg w-[90vw] rounded-full p-1`}
    >
      <div
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
            backgroundColor: "rgba(255, 255, 255, 0.25)",
          }}
          // Uses inset positioning layout to match grid row heights perfectly
          className="absolute top-0 bottom-0 left-0 w-1/4 bg-white/20 rounded-full cursor-grab active:cursor-grabbing origin-center"
        />
      </div>
    </div>
  );
};
