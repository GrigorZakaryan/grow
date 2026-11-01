"use client";

import { useProjectForm } from "@/app/(routes)/individual/[domainId]/stores/use-project-form";
import { Domain } from "@/lib/generated/prisma/client";
import axios from "axios";
import { ChevronDown, Search, Check, X } from "lucide-react";
import { AnimatePresence, motion, useDragControls } from "motion/react";
import { useEffect, useState } from "react";

type ProjectModalProps = {
  domains: Domain[];
  onCreate?: (data: { label: string; domainId: string }) => void;
};

export const ProjectModal = ({ domains, onCreate }: ProjectModalProps) => {
  const { openProject, setClose } = useProjectForm();

  const [content, setContent] = useState<"main" | "domain">("main");
  const [label, setLabel] = useState("");
  const [domain, setDomain] = useState<Domain | null>(null);

  const dragControls = useDragControls();

  // Reset the form whenever the modal opens.
  useEffect(() => {
    if (openProject) {
      setContent("main");
      setLabel("");
      setDomain(null);
    }
  }, [openProject]);

  const handleCreate = async () => {
    if (!label.trim() || !domain) return;

    try {
      await axios.post(`/individual/${domain.id}/api/projects`, { label });
    } catch (err) {
      console.error(err);
    }

    setClose();
  };

  return (
    <AnimatePresence>
      {openProject && (
        <motion.div
          key="project-backdrop"
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
                {content === "main" ? (
                  <motion.div
                    key="main"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <MainContent
                      label={label}
                      setLabel={setLabel}
                      domain={domain}
                      setContent={setContent}
                    />
                  </motion.div>
                ) : (
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
              </AnimatePresence>

              {/* Footer */}
              <footer className="flex justify-end items-center w-full border-t border-white/10 p-5">
                {content === "main" ? (
                  <button
                    disabled={!label.trim() || !domain}
                    onClick={handleCreate}
                    className="px-5 py-2 rounded-xl bg-white text-black font-medium disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    Create
                  </button>
                ) : (
                  <button
                    onClick={() => setContent("main")}
                    className="px-4 py-2 rounded-xl bg-white/10 text-white"
                  >
                    Cancel
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
  setContent,
}: {
  label: string;
  setLabel: (label: string) => void;
  domain: Domain | null;
  setContent: (content: "main" | "domain") => void;
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
        placeholder="Untitled Project"
      />
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
  domains: Domain[];
  selectedDomain: Domain | null;
  setDomain: (domain: Domain) => void;
  setContent: (content: "main" | "domain") => void;
}) => {
  const [search, setSearch] = useState("");

  const filteredDomains = domains.filter((domain) =>
    domain.label.toLowerCase().includes(search.toLowerCase().trim()),
  );

  const handleSelect = (domain: Domain) => {
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
