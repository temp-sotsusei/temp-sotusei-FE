import { useDroppable } from "@dnd-kit/core";
import { FC } from "react";

type Props = {
  children: React.ReactNode;
  className: string;
  onClick: () => void;
};
const DroppableBox: FC<Props> = ({ className, children, onClick }) => {
  const { setNodeRef } = useDroppable({
    id: `droppable-box`,
  });

  return (
    <div ref={setNodeRef} className={className} onClick={onClick}>
      {children}
    </div>
  );
};

export default DroppableBox;
