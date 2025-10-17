"use client";

import { FC } from "react";
import { useDraggable } from "@dnd-kit/core";

type Props = {
  children: React.ReactNode;
  id: number;
  draggedText: string;
};
const Draggable: FC<Props> = ({ children, id, draggedText }) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: `draggable-${id}`,
    data: {
      draggedText,
    },
  });
  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;
  return (
    <button ref={setNodeRef} style={style} {...listeners} {...attributes}>
      {children}
    </button>
  );
};

export default Draggable;
