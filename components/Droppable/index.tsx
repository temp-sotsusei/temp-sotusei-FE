import { useDroppable } from "@dnd-kit/core";
import { FC } from "react";

type Props = {
  children: React.ReactNode;
  id: number;
};
const Droppable: FC<Props> = ({ children, id }) => {
  const { isOver, setNodeRef } = useDroppable({
    id: `droppable-${id}`,
    data: {
      position: id,
    },
  });
  const style = {
    color: isOver ? "green" : undefined,
  };
  return (
    <span ref={setNodeRef} style={style}>
      {children}
    </span>
  );
};

export default Droppable;
