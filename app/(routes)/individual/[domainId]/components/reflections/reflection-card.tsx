"use client";
import { StarterKit } from "@tiptap/starter-kit";
import { Image } from "@tiptap/extension-image";
import { TaskItem, TaskList } from "@tiptap/extension-list";
import { TextAlign } from "@tiptap/extension-text-align";
import { Typography } from "@tiptap/extension-typography";
import { Highlight } from "@tiptap/extension-highlight";
import { Subscript } from "@tiptap/extension-subscript";
import { Superscript } from "@tiptap/extension-superscript";
import { Selection } from "@tiptap/extensions";
import { Relfection } from "@/lib/generated/prisma/client";
import { EditorContent, useEditor } from "@tiptap/react";

import { ImageUploadNode } from "@/components/tiptap-node/image-upload-node/image-upload-node-extension";
import { HorizontalRule } from "@/components/tiptap-node/horizontal-rule-node/horizontal-rule-node-extension";
import "@/components/tiptap-node/blockquote-node/blockquote-node.scss";
import "@/components/tiptap-node/code-block-node/code-block-node.scss";
import "@/components/tiptap-node/horizontal-rule-node/horizontal-rule-node.scss";
import "@/components/tiptap-node/list-node/list-node.scss";
import "@/components/tiptap-node/image-node/image-node.scss";
import "@/components/tiptap-node/heading-node/heading-node.scss";
import "@/components/tiptap-node/paragraph-node/paragraph-node.scss";
import { handleImageUpload, MAX_FILE_SIZE } from "@/lib/tiptap-utils";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import { MoreHorizontal, Trash } from "lucide-react";
import { useEditorStore } from "../../stores/use-editor";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import axios from "axios";
import { useRouter } from "next/navigation";

export const ReflectionCard = ({ r }: { r: Relfection }) => {
  const { setContent, setOpen, setDocId } = useEditorStore();
  const router = useRouter();

  const onDelete = async () => {
    try {
      await axios.delete(`/individual/${r.domainId}/api/reflections/${r.id}`);
      router.refresh();
    } catch (err) {
      console.error(err);
    }
  };

  const editor = useEditor({
    immediatelyRender: false,
    editorProps: {
      attributes: {
        autocomplete: "off",
        autocorrect: "off",
        autocapitalize: "off",
        "aria-label": "Main content area, start typing to enter text.",
        class: "simple-editor",
      },
    },
    extensions: [
      StarterKit.configure({
        horizontalRule: false,
        link: {
          openOnClick: false,
          enableClickSelection: true,
        },
      }),
      HorizontalRule,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      TaskList,
      TaskItem.configure({ nested: true }),
      Highlight.configure({ multicolor: true }),
      Image,
      Typography,
      Superscript,
      Subscript,
      Selection,
      ImageUploadNode.configure({
        accept: "image/*",
        maxSize: MAX_FILE_SIZE,
        limit: 3,
        upload: handleImageUpload,
        onError: (error) => console.error("Upload failed:", error),
      }),
    ],
    content: JSON.parse(JSON.stringify(r.content)),
  });

  return (
    <div
      onClick={() => {
        setDocId(r.id);
        setContent(JSON.parse(JSON.stringify(r.content)));
        setOpen();
      }}
      className="w-full rounded-2xl bg-[#1e1e1e] text-white p-4 border border-white/5"
    >
      <div className="w-full">
        <div className="flex flex-col items-center gap-2 w-full">
          <div className="flex flex-col w-full max-w-xs max-h-45 overflow-y-hidden relative ">
            <EditorContent disabled={true} editor={editor} />
            <div className="w-full h-full absolute inset-0 bg-transparent z-10" />
            <div className="absolute w-full h-10 bg-linear-to-b from-transparent to-[#1e1e1e] bottom-0 z-20" />
          </div>
          <Separator className="opacity-5 my-1" />
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2">
              <p className="text-xs text-white/60">
                {format(r.updatedAt, "eeee, dd MMM")}
              </p>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <MoreHorizontal className="w-4 h-4 text-white/60 relative z-20" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete();
                  }}
                  variant="destructive"
                >
                  <Trash /> Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </div>
  );
};
