import { useDroppable } from "@dnd-kit/core";
import { FC } from "react";

type Props = {
  children: React.ReactNode;
};
const Dropabble: FC<Props> = ({ children }) => {
  const { isOver, setNodeRef } = useDroppable({
    id: "droppable",
  });
  const style = {
    color: isOver ? "green" : undefined,
  };
  return (
    <div ref={setNodeRef} style={style}>
      {children}
    </div>
  );
};

export default Dropabble;
