"use client";
import { IoHome } from "react-icons/io5";
import { IoCalendarClear } from "react-icons/io5";
import { IoLayers } from "react-icons/io5";
import { IoMdSettings } from "react-icons/io";
import { useState } from "react";
import Link from "next/link";

const list = [
  {
    icon: <IoHome className={`w-5 h-5`} strokeWidth={2} />,
    label: "Home",
    key: "home",
  },
  {
    icon: <IoCalendarClear className="w-5 h-5" strokeWidth={2} />,
    label: "Calendar",
    key: "calendar",
  },
  {
    icon: <IoLayers className="w-5 h-5" strokeWidth={2} />,
    label: "Domains",
    key: "domains",
  },
  {
    icon: <IoMdSettings className="w-5 h-5" strokeWidth={2} />,
    label: "Settings",
    key: "settings",
  },
];

export const MenuBar = ({ className }: { className?: string }) => {
  const [menu, setMenu] = useState<string>("home");
  return (
    <div
      className={`${className} flex items-center bg-white/10 backdrop-blur-xl shadow-lg border border-white/10 w-[90vw] rounded-full p-1`}
    >
      <div className="w-full h-full grid grid-cols-4 items-center">
        {list.map((item) => (
          <Link key={item.key} href={`/${item.key}`}>
            <button
              onClick={() => setMenu(item.key)}
              className={`flex flex-col items-center gap-0.5 w-full h-full rounded-full py-2 ${menu === item.key ? "bg-white/30 text-[#70e000] border border-white/20" : "text-white"} z-99`}
            >
              {item.icon}
              <p className="text-xs font-medium">{item.label}</p>
            </button>
          </Link>
        ))}
      </div>
    </div>
  );
};
