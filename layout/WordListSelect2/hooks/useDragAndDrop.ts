// 変更: ドラッグ&ドロップのロジックをカスタムフックに分離

import { useCallback, useReducer } from "react";
import { DragEndEvent, TouchSensor, useSensor, useSensors } from "@dnd-kit/core";
import { Editor } from "@tiptap/react";
import { UniqueIdentifier } from "@dnd-kit/core";
import { DroppedStrState } from "../types";
import { calculateDropPosition } from "../utils/editorUtils";

// 変更: useReducerで状態更新を集約し、複雑な状態管理を改善
type DroppedStrAction =
  | { type: "ADD"; payload: DroppedStrState }
  | { type: "REMOVE"; payload: UniqueIdentifier }
  | { type: "CLEAR" };

const droppedStrReducer = (
  state: DroppedStrState[],
  action: DroppedStrAction
): DroppedStrState[] => {
  switch (action.type) {
    case "ADD":
      // 既存のものを削除してから新しいものを追加
      return [
        ...state.filter((item) => item.id !== action.payload.id),
        action.payload,
      ];
    case "REMOVE":
      return state.filter((item) => item.id !== action.payload);
    case "CLEAR":
      return [];
    default:
      return state;
  }
};

export const useDragAndDrop = (editor: Editor) => {
  const [droppedStrState, dispatch] = useReducer(droppedStrReducer, []);

  const sensors = useSensors(useSensor(TouchSensor));

  const removeDroppedStr = useCallback((droppedId: UniqueIdentifier) => {
    dispatch({ type: "REMOVE", payload: droppedId });
  }, []);

  const clearDroppedStr = useCallback(() => {
    dispatch({ type: "CLEAR" });
  }, []);

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { over, active } = event;
      
      // 変更: ドロップ位置の計算をユーティリティ関数に委譲
      const dropPosition = calculateDropPosition(event, editor);
      
      if (dropPosition === -1) {
        console.log("drop範囲は入力文字内である必要があります");
        return;
      }

      // 変更: 状態更新をdispatchで行う
      dispatch({
        type: "ADD",
        payload: {
          id: active.id,
          droppedString: active.data.current.draggedText,
          droppedIndex: dropPosition,
        },
      });

      editor
        .chain()
        .focus()
        .insertCustomWord(
          active.data.current.draggedText,
          active.id,
          dropPosition
        )
        .run();
    },
    [editor]
  );

  return {
    droppedStrState,
    sensors,
    handleDragEnd,
    removeDroppedStr,
    clearDroppedStr,
  };
};