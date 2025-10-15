"use client";

import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { FC } from "react";

const TipTap: FC = () => {
  const editor = useEditor({
    extensions: [StarterKit],
    content: "tiptapがアクティブな状態",
    immediatelyRender: false,
    autofocus: "start",
  });

  return (
    <div>
      <EditorContent editor={editor} className="border mx-8" />
    </div>
  );
};

export default TipTap;
