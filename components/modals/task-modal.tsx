"use client";

import { useTaskForm } from "@/app/(routes)/individual/[domainId]/stores/use-task-form";
import { Domain, Project } from "@/lib/generated/prisma/client";
import axios from "axios";
import {
  ChevronDown,
  Search,
  Check,
  X,
  Folder,
  Filter,
  Flag,
  Calendar,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";

type DomainProps = {
  id: string;
  label: string;
  projects: Project[];
  createdAt: Date;
  updatedAt: Date;
};

type TaskModalProps = {
  domains: DomainProps[];
};

type Content =
  | "main"
  | "domain"
  | "type"
  | "time"
  | "quantity"
  | "priority"
  | "project";

type TaskType = "QTY" | "TIME" | "CHECK" | null;

export const TaskModal = ({ domains }: TaskModalProps) => {
  const { openTask, setClose } = useTaskForm();

  const [content, setContent] = useState<Content>("main");
  const [label, setLabel] = useState("");
  const [domain, setDomain] = useState<DomainProps | null>(null);
  const [project, setProject] = useState<Project | null>(null);

  const [type, setType] = useState<TaskType | null>("CHECK");

  const [time, setTime] = useState(0); // Total minutes
  const [quantity, setQuantity] = useState<number | null>(null);

  const [priority, setPriority] = useState(0);

  // Reset the form whenever the modal opens.
  useEffect(() => {
    if (openTask) {
      setContent("main");
      setLabel("");
      setDomain(null);
      setType("CHECK");
      setTime(0);
      setQuantity(null);
      setPriority(0);
      setProject(null);
    }
  }, [openTask]);

  const handleCreate = async () => {
    if (!label.trim() || !domain || !type || type === null) return;

    try {
      await axios.post(`/individual/${domain.id}/api/projects`, { label });
    } catch (err) {
      console.error(err);
    }

    setClose();
  };

  return (
    <AnimatePresence>
      {openTask && (
        <motion.div
          key="task-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={setClose}
          className="fixed inset-0 z-50 bg-black/50 flex items-end"
        >
          <motion.div
            drag={"y"}
            dragConstraints={{ top: 5 }}
            dragElastic={{ top: 0.2, bottom: 0.5 }}
            onDragEnd={(_, info) => {
              if (info.offset.y > 150 || info.velocity.y > 100) {
                setClose();
              }
            }}
            onClick={(e) => e.stopPropagation()}
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{
              type: "spring",
              damping: 30,
              stiffness: 300,
            }}
            className="w-full h-auto max-h-[90dvh] bg-[#1e1e1e] rounded-t-4xl overflow-y-auto overscroll-contain"
          >
            <div className="flex flex-col w-full pb-5">
              {/* Drag handle */}
              <header className="relative flex justify-center items-center w-full py-5">
                <motion.div className="w-20 h-1.5 rounded-full bg-white/30 cursor-grab active:cursor-grabbing touch-none" />
              </header>

              <AnimatePresence mode="wait">
                {content === "main" && (
                  <motion.div
                    key="main"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <MainContent
                      type={type}
                      label={label}
                      setLabel={setLabel}
                      domain={domain}
                      setContent={setContent}
                      time={time}
                      quantity={quantity}
                    />
                  </motion.div>
                )}
                {content === "domain" && (
                  <motion.div
                    key="domain"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <DomainContent
                      domains={domains}
                      selectedDomain={domain}
                      setDomain={setDomain}
                      setContent={setContent}
                    />
                  </motion.div>
                )}
                {content === "type" && (
                  <motion.div
                    key="type"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <TypeContent
                      selectedType={type}
                      setType={setType}
                      setContent={setContent}
                    />
                  </motion.div>
                )}
                {content === "time" && (
                  <motion.div
                    key="time"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <TimeContent time={time} setTime={setTime} />
                  </motion.div>
                )}

                {content === "quantity" && (
                  <motion.div
                    key="quantity"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <QuantityContent
                      quantity={quantity}
                      setQuantity={setQuantity}
                    />
                  </motion.div>
                )}

                {content === "project" && (
                  <motion.div
                    key="project"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ProjectContent
                      selectedProject={project}
                      setContent={setContent}
                      setProject={setProject}
                      selectedDomain={domain}
                    />
                  </motion.div>
                )}

                {content === "priority" && (
                  <motion.div
                    key="priority"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <PriorityContent
                      setContent={setContent}
                      setPriority={setPriority}
                      priority={priority}
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Footer */}
              <footer className="flex justify-end items-center w-full border-t border-white/10 p-5">
                {content === "main" ? (
                  <div className="flex items-center gap-7">
                    <div
                      onClick={() => {
                        if (!domain) return;

                        setContent("project");
                      }}
                    >
                      <Folder
                        fill={
                          !project ? "transparent" : "oklch(71.2% 0.194 13.428)"
                        }
                        className={`${project ? "text-rose-400" : "text-white/60"}`}
                      />
                    </div>
                    <div>
                      <Calendar className="text-white/60" />
                    </div>
                    <div
                      onClick={() => {
                        setContent("priority");
                      }}
                    >
                      <Flag
                        fill={
                          priority === 1
                            ? "oklch(62.3% 0.214 259.815)"
                            : priority === 2
                              ? "oklch(79.5% 0.184 86.047)"
                              : priority === 3
                                ? "oklch(63.7% 0.237 25.331)"
                                : "transparent"
                        }
                        className={`${
                          priority === 1
                            ? "text-blue-500"
                            : priority === 2
                              ? "text-yellow-500"
                              : priority === 3
                                ? "text-red-500"
                                : "transparent text-white/60"
                        }`}
                      />
                    </div>
                    <button
                      disabled={!label.trim() || !domain || !type}
                      onClick={handleCreate}
                      className="px-5 py-2 rounded-xl bg-white text-black font-medium disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      Create
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setContent("main")}
                    className="px-4 py-2 rounded-xl bg-white/10 text-white"
                  >
                    Continue
                  </button>
                )}
              </footer>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// MAIN CONTENT

const MainContent = ({
  label,
  setLabel,
  domain,
  quantity,
  time,
  type,
  setContent,
}: {
  label: string;
  setLabel: (label: string) => void;
  domain: Domain | null;
  type: TaskType;
  time: number;
  quantity: number | null;
  setContent: (content: Content) => void;
}) => {
  return (
    <main className="pb-10 px-5">
      <button
        type="button"
        onClick={() => setContent("domain")}
        className="flex items-center gap-1"
      >
        <p className="text-white/50">
          In{" "}
          <span className="text-white/80 font-medium">
            {domain?.label ?? "Select Domain"}
          </span>
        </p>
        <ChevronDown className="text-white/80 w-4 h-4" />
      </button>

      <input
        value={label}
        onChange={(e) => setLabel(e.target.value)}
        className="w-full text-white font-medium text-3xl bg-transparent outline-none placeholder:text-white/40 placeholder:font-medium mt-4"
        type="text"
        placeholder="Untitled Task"
      />
      <div onClick={() => setContent("type")} className="flex flex-col mt-10">
        <div className="flex items-center gap-5">
          <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center">
            <Filter className="w-5 h-5 text-white/50" />
          </div>
          <div
            className={`border-t w-full flex-1 ${type === null ? "py-5" : "pt-2 pb-5"}`}
          >
            {type === null && <p className="text-white/50">Select Metric</p>}
            {type !== null && (
              <div className="flex flex-col items-start gap-0.5">
                <p className="text-white/50 text-xs">Select Metric</p>
                <h6 className="font-medium">
                  {type === "QTY" && (
                    <>
                      Quantity
                      {quantity !== null && ` · ${quantity}`}
                    </>
                  )}

                  {type === "TIME" && (
                    <>
                      Time
                      {time > 0 && ` · ${Math.floor(time / 60)}h ${time % 60}m`}
                    </>
                  )}

                  {type === "CHECK" && "Checkbox"}
                </h6>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

// DOMAIN CONTENT

const DomainContent = ({
  domains,
  selectedDomain,
  setDomain,
  setContent,
}: {
  domains: DomainProps[];
  selectedDomain: DomainProps | null;
  setDomain: (domain: DomainProps) => void;
  setContent: (content: "main" | "domain") => void;
}) => {
  const [search, setSearch] = useState("");

  const filteredDomains = domains.filter((domain) =>
    domain.label.toLowerCase().includes(search.toLowerCase().trim()),
  );

  const handleSelect = (domain: DomainProps) => {
    setDomain(domain);
    setContent("main");
  };

  return (
    <main className="pb-10 px-5">
      {/* Search */}
      <div className="flex items-center gap-2 w-full h-11 bg-white/10 rounded-xl px-3">
        <Search className="w-5 h-5 text-white/50 shrink-0" />

        <input
          autoFocus
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          type="text"
          className="w-full flex-1 bg-transparent text-white outline-none placeholder:text-white/40"
          placeholder="Search for domains..."
        />

        {search && (
          <button
            type="button"
            onClick={() => setSearch("")}
            className="text-white/50"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Domain list */}
      <div className="mt-6">
        <h1 className="text-sm font-medium text-white/50 mb-3">Domains</h1>

        <div className="flex flex-col">
          {filteredDomains.length > 0 ? (
            filteredDomains.map((item) => {
              const isSelected = selectedDomain?.id === item.id;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleSelect(item)}
                  className="flex items-center justify-between w-full py-3 border-b border-white/5 text-left"
                >
                  <span className="text-white/90 font-medium">
                    {item.label}
                  </span>

                  {isSelected && <Check className="w-5 h-5 text-white" />}
                </button>
              );
            })
          ) : (
            <p className="text-white/40 text-sm py-5 text-center">
              No domains found.
            </p>
          )}
        </div>
      </div>
    </main>
  );
};

// TYPE CONTENT

const TypeContent = ({
  selectedType,
  setType,
  setContent,
}: {
  selectedType: TaskType | null;
  setType: (type: TaskType | null) => void;
  setContent: (content: Content) => void;
}) => {
  const types: { label: string; value: TaskType }[] = [
    { label: "Quantity", value: "QTY" },
    { label: "Time", value: "TIME" },
    { label: "Checkbox", value: "CHECK" },
  ];
  const [search, setSearch] = useState("");

  const filteredMetrics = types.filter((type) =>
    type.label.toLowerCase().includes(search.toLowerCase().trim()),
  );

  const handleSelect = (type: TaskType | null) => {
    setType(type);

    if (type === "TIME") {
      setContent("time");
    } else if (type === "QTY") {
      setContent("quantity");
    } else {
      setContent("main");
    }
  };
  return (
    <main className="pb-10 px-5">
      {/* Search */}
      <div className="flex items-center gap-2 w-full h-11 bg-white/10 rounded-xl px-3">
        <Search className="w-5 h-5 text-white/50 shrink-0" />

        <input
          autoFocus
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          type="text"
          className="w-full flex-1 bg-transparent text-white outline-none placeholder:text-white/40"
          placeholder="Search for metrics..."
        />

        {search && (
          <button
            type="button"
            onClick={() => setSearch("")}
            className="text-white/50"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Domain list */}
      <div className="mt-6">
        <h1 className="text-sm font-medium text-white/50 mb-3">Metrics</h1>

        <div className="flex flex-col">
          {filteredMetrics.length > 0 ? (
            filteredMetrics.map((item) => {
              const isSelected = selectedType === item.value;

              return (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => handleSelect(item.value)}
                  className="flex items-center justify-between w-full py-3 border-b border-white/5 text-left"
                >
                  <span className="text-white/90 font-medium">
                    {item.label}
                  </span>

                  {isSelected && <Check className="w-5 h-5 text-white" />}
                </button>
              );
            })
          ) : (
            <p className="text-white/40 text-sm py-5 text-center">
              No metric found.
            </p>
          )}
        </div>
      </div>
    </main>
  );
};

// TIME CONTENT

const TimeContent = ({
  time,
  setTime,
}: {
  time: number;
  setTime: (time: number) => void;
}) => {
  const hours = Math.floor(time / 60);
  const minutes = time % 60;

  return (
    <main className="pb-10 px-5">
      <h1 className="text-sm font-medium text-white/50 mb-5">Duration</h1>

      <div className="flex items-center gap-4">
        <div className="flex-1">
          <label className="text-xs text-white/40 mb-2 block">Hours</label>

          <input
            type="number"
            min={0}
            value={hours}
            onChange={(e) => {
              const value = Math.max(0, Number(e.target.value) || 0);
              setTime(value * 60 + minutes);
            }}
            className="w-full h-14 bg-white/10 rounded-xl px-4 text-white text-xl outline-none"
          />
        </div>

        <div className="flex-1">
          <label className="text-xs text-white/40 mb-2 block">Minutes</label>

          <input
            type="number"
            min={0}
            max={59}
            value={minutes}
            onChange={(e) => {
              const value = Math.min(
                59,
                Math.max(0, Number(e.target.value) || 0),
              );

              setTime(hours * 60 + value);
            }}
            className="w-full h-14 bg-white/10 rounded-xl px-4 text-white text-xl outline-none"
          />
        </div>
      </div>

      <p className="text-white/40 text-xs mt-4">
        Selected duration: {hours}h {minutes}m
      </p>
    </main>
  );
};

// QUANTITY CONTENT
const QuantityContent = ({
  quantity,
  setQuantity,
}: {
  quantity: number | null;
  setQuantity: (quantity: number | null) => void;
}) => {
  return (
    <main className="pb-10 px-5">
      <h1 className="text-sm font-medium text-white/50 mb-5">Quantity</h1>

      <input
        autoFocus
        type="number"
        min={1}
        step={1}
        value={quantity ?? ""}
        onChange={(e) => {
          const value = e.target.value;
          setQuantity(value === "" ? null : Math.max(0, Number(value)));
        }}
        placeholder="Enter quantity..."
        className="w-full h-14 bg-white/10 rounded-xl px-4 text-white text-xl outline-none placeholder:text-white/30"
      />
    </main>
  );
};

// PROJECT CONTENT
const ProjectContent = ({
  selectedDomain,
  setProject,
  setContent,
  selectedProject,
}: {
  selectedProject: Project | null;
  selectedDomain: DomainProps | null;
  setProject: (project: Project) => void;
  setContent: (content: "main" | "domain") => void;
}) => {
  const [search, setSearch] = useState("");

  const filteredProjects = selectedDomain?.projects.filter((project) =>
    project.label.toLowerCase().includes(search.toLowerCase().trim()),
  );

  const handleSelect = (project: Project) => {
    setProject(project);
    setContent("main");
  };

  return (
    <main className="pb-10 px-5">
      {/* Search */}
      <div className="flex items-center gap-2 w-full h-11 bg-white/10 rounded-xl px-3">
        <Search className="w-5 h-5 text-white/50 shrink-0" />

        <input
          autoFocus
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          type="text"
          className="w-full flex-1 bg-transparent text-white outline-none placeholder:text-white/40"
          placeholder="Search for domains..."
        />

        {search && (
          <button
            type="button"
            onClick={() => setSearch("")}
            className="text-white/50"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Project list */}
      <div className="mt-6">
        <h1 className="text-sm font-medium text-white/50 mb-3">Projects</h1>

        <div className="flex flex-col">
          {filteredProjects && filteredProjects.length > 0 ? (
            filteredProjects.map((item) => {
              const isSelected = selectedProject?.id === item.id;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleSelect(item)}
                  className="flex items-center justify-between w-full py-3 border-b border-white/5 text-left"
                >
                  <span className="text-white/90 font-medium">
                    {item.label}
                  </span>

                  {isSelected && <Check className="w-5 h-5 text-white" />}
                </button>
              );
            })
          ) : (
            <p className="text-white/40 text-sm py-5 text-center">
              No projects found.
            </p>
          )}
        </div>
      </div>
    </main>
  );
};

const PriorityContent = ({
  setContent,
  setPriority,
  priority,
}: {
  priority: number;
  setPriority: (priority: number) => void;
  setContent: (content: "main" | "domain") => void;
}) => {
  const [search, setSearch] = useState("");

  const priorities = [
    {
      label: "High",
      value: 3,
      icon: <Flag fill="oklch(63.7% 0.237 25.331)" className="text-red-500" />,
    },
    {
      label: "Medium",
      value: 2,
      icon: (
        <Flag fill="oklch(79.5% 0.184 86.047)" className="text-yellow-500" />
      ),
    },
    {
      label: "Low",
      value: 1,
      icon: (
        <Flag fill="oklch(62.3% 0.214 259.815)" className="text-blue-500" />
      ),
    },
    {
      label: "None",
      value: 0,
      icon: <Flag fill="transparent" className="text-white/60" />,
    },
  ];
  const filteredPriorities = priorities.filter((priority) =>
    priority.label.toLowerCase().includes(search.toLowerCase().trim()),
  );

  const handleSelect = (priority: number) => {
    setPriority(priority);
    setContent("main");
  };

  return (
    <main className="pb-10 px-5">
      {/* Search */}
      <div className="flex items-center gap-2 w-full h-11 bg-white/10 rounded-xl px-3">
        <Search className="w-5 h-5 text-white/50 shrink-0" />

        <input
          autoFocus
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          type="text"
          className="w-full flex-1 bg-transparent text-white outline-none placeholder:text-white/40"
          placeholder="Search for domains..."
        />

        {search && (
          <button
            type="button"
            onClick={() => setSearch("")}
            className="text-white/50"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Project list */}
      <div className="mt-6">
        <h1 className="text-sm font-medium text-white/50 mb-3">Priority</h1>

        <div className="flex flex-col">
          {filteredPriorities && filteredPriorities.length > 0 ? (
            filteredPriorities.map((item) => {
              const isSelected = priority === item.value;

              return (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => handleSelect(item.value)}
                  className="flex items-center justify-between w-full py-3 border-b border-white/5 text-left"
                >
                  <div className="flex items-center gap-2">
                    {item.icon}
                    <span className="text-white/90 font-medium">
                      {item.label}
                    </span>
                  </div>

                  {isSelected && <Check className="w-5 h-5 text-white" />}
                </button>
              );
            })
          ) : (
            <p className="text-white/40 text-sm py-5 text-center">
              No priority found.
            </p>
          )}
        </div>
      </div>
    </main>
  );
};
