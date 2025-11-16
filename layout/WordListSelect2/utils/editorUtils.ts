// 変更: エディター関連のユーティリティ関数を分離

import { Editor, NodeType, TextType } from "@tiptap/react";
import { DragEndEvent } from "@dnd-kit/core";
import { CharItem } from "../types";
import { DROP_POSITION_OFFSET } from "../constants";

/**
 * TiptapエディターのコンテンツをCharItemの配列に変換
 * 各文字がドロップ可能かどうか、改行かどうかなどの情報を含む
 */
export const getTiptapHTML = (editor: Editor): CharItem[] => {
  const editorContent = editor.getJSON();
  const contentsArray = editorContent.content.map((content) => content.content);
  const result: CharItem[] = [];
  let currentParagraphIndex = 0;

  contentsArray.forEach((contents, index) => {
    // 段落が変わったら改行を追加
    if (currentParagraphIndex !== index) {
      currentParagraphIndex = index;
      result.push({
        char: "",
        isDroppable: false,
        isEmpty: false,
        isNewLine: true,
      });
    }
    
    // 空の段落の場合
    if (!contents) {
      return result.push({
        char: "",
        isDroppable: false,
        isEmpty: true,
        isNewLine: false,
      });
    }
    
    contents.forEach((content) => {
      if (content.type === "text") {
        // 通常のテキスト（ドロップ可能）
        const textObject = content as TextType;
        textObject.text.split("").forEach((char) => {
          result.push({
            char,
            isDroppable: true,
            isEmpty: false,
            isNewLine: false,
          });
        });
      } else if (content.type === "customWord") {
        // カスタムワード（ドロップされた単語、ドロップ不可）
        const customWordObject = content as NodeType;
        // 変更前: split(".") - ドットで分割する理由が不明確
        // 変更後: コメントで意図を明確化（実装は保持）
        // TODO: なぜドットで分割しているのか確認が必要
        customWordObject.attrs.text.split(".").forEach((char) => {
          result.push({
            char,
            isDroppable: false,
            isEmpty: false,
            isNewLine: false,
          });
        });
      }
    });
  });

  return result;
};

/**
 * ドラッグ終了時のドロップ位置を計算
 * droppable-boxの場合は末尾、それ以外はカーソル位置の後
 */
export const calculateDropPosition = (
  event: DragEndEvent,
  editor: Editor
): number => {
  const { over } = event;
  
  if (over.id === "droppable-box") {
    // 末尾にドロップ
    return editor.state.doc.content.size - 1;
  } else if (over) {
    // 変更: マジックナンバー(+2)を定数化
    // カーソル位置の後にドロップ
    return over.data.current.position + DROP_POSITION_OFFSET;
  }
  
  return -1; // ドロップ不可
};