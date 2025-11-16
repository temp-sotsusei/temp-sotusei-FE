// 変更: エディター関連の状態とロジックをカスタムフックに分離

import { useCallback, useState } from "react";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import CustomWord from "@/components/CustomWord";
import { stripHtml } from "string-strip-html";
import { UniqueIdentifier } from "@dnd-kit/core";
import { MAX_CHAPTER_CHARS } from "../constants";

export const useChapterEditor = (
  onRemoveDroppedStr: (id: UniqueIdentifier) => void
) => {
  const [isTextEditorActive, setIsTextEditorActive] = useState(false);
  const [isOverChapterText, setIsOverChapterText] = useState(false);
  const [contentLength, setContentLength] = useState(0);

  const deactivateTextEditor = useCallback(() => {
    setIsTextEditorActive(false);
  }, []);

  const editor = useEditor({
    extensions: [StarterKit, CustomWord],
    content:
      "<p>あなたは<span>ぞう</span>ですが、<span>まほうつかい</span>でもありますし、<span>からあげ</span>が好きな<span>あり</span>です。</p>",
    immediatelyRender: false,
    onBlur: () => {
      deactivateTextEditor();
    },
    onUpdate: ({ editor }) => {
      const currentChapterText = stripHtml(editor.getHTML()).result;
      setContentLength(currentChapterText.length);
      setIsOverChapterText(currentChapterText.length > MAX_CHAPTER_CHARS);
    },
    onDelete: (deleteEvent) => {
      if (deleteEvent.type === "node" && deleteEvent.node.attrs.droppedId) {
        const droppedId = deleteEvent.node.attrs.droppedId;
        onRemoveDroppedStr(droppedId);
      }
    },
  });

  const activateTextEditor = useCallback(() => {
    setIsTextEditorActive(true);
    editor.commands.focus();
  }, [editor]);

  // 変更: エディターのコンテンツをクリア
  const clearEditor = useCallback(() => {
    editor.commands.clearContent();
  }, [editor]);

  // 変更: 現在のエディターの内容をテキストとして取得
  const getEditorText = useCallback(() => {
    return stripHtml(editor.getHTML()).result;
  }, [editor]);

  return {
    editor,
    isTextEditorActive,
    isOverChapterText,
    contentLength,
    activateTextEditor,
    clearEditor,
    getEditorText,
  };
};