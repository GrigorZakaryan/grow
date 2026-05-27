"use client"; // Required because BlockNote uses client-side hooks

import { useEffect, useMemo, useState } from "react";
import { Block, BlockNoteEditor, PartialBlock } from "@blocknote/core";
import { useDebouncedCallback } from "use-debounce"; // Highly recommended for saving

import "@blocknote/core/fonts/inter.css";
import "@blocknote/mantine/style.css";
import { useCreateBlockNote } from "@blocknote/react";

import {
  BlockNoteView,
  lightDefaultTheme,
  darkDefaultTheme,
  Theme,
} from "@blocknote/mantine";

// 1. Create a transparent light theme
const transparentLightTheme = {
  ...lightDefaultTheme,
  colors: {
    ...lightDefaultTheme.colors,
    editor: {
      text: "#222222",
      background: "transparent", // <-- Set to transparent
    },
  },
} satisfies Theme;

// 2. Create a transparent dark theme
const transparentDarkTheme = {
  ...darkDefaultTheme,
  colors: {
    ...darkDefaultTheme.colors,
    editor: {
      text: "#ffffff",
      background: "transparent", // <-- Set to transparent
    },
  },
} satisfies Theme;

// 3. Combine them
const transparentTheme = {
  light: transparentLightTheme,
  dark: transparentDarkTheme,
};

// --- Mock API Functions (Replace with your actual database/fetch logic) ---
async function saveToDatabase(jsonBlocks: Block[]) {
  // Example Next.js API call or Server Action:
  // await fetch('/api/document/save', {
  //    method: 'POST',
  //    body: JSON.stringify({ content: jsonBlocks })
  // });
  console.log("Saved to database:", jsonBlocks);
}

async function loadFromDatabase() {
  // Example Next.js API call:
  // const res = await fetch('/api/document/load');
  // const data = await res.json();
  // return data.content as PartialBlock[];

  // Returning undefined tells BlockNote to start with an empty document
  return undefined;
}
// --------------------------------------------------------------------------

export default function DocumentEditor() {
  // 1. Manage the loading state of the document
  const [initialContent, setInitialContent] = useState<
    PartialBlock[] | undefined | "loading"
  >("loading");

  // 2. Fetch the document content from the DB on mount
  useEffect(() => {
    loadFromDatabase().then((content) => {
      setInitialContent(content);
    });
  }, []);

  // 3. Create the editor instance ONLY after the content has been fetched.
  // We use useMemo + createBlockNoteEditor instead of the standard useCreateBlockNote hook
  const defaultInitialContent: PartialBlock[] = [
    {
      type: "heading",
      props: { level: 2 },
      content: "Untitled",
    },
    {
      type: "paragraph",
      content: "", // Empty paragraph below the heading for good UX
    },
  ];
  const editor = useMemo(() => {
    if (initialContent === "loading") {
      return undefined; // Do not create the editor yet
    }
    return BlockNoteEditor.create({
      initialContent: initialContent || defaultInitialContent,
    });
  }, [initialContent]);

  // 4. Debounce the saving function (e.g., wait 1000ms after the user stops typing)
  const debouncedSave = useDebouncedCallback((editor: BlockNoteEditor) => {
    saveToDatabase(editor.document);
  }, 1000);

  // 5. Render a loading state until the DB fetch finishes
  if (editor === undefined) {
    return <div>Loading document from database...</div>;
  }

  // 6. Render the editor
  return (
    <div className="min-w-full min-h-full">
      <BlockNoteView
        editor={editor}
        theme={transparentTheme}
        onChange={() => {
          // Pass the editor instance to your debounced save function
          debouncedSave(editor);
        }}
      />
    </div>
  );
}
