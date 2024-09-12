import React, { useMemo } from 'react';
import { Droppable, DroppableProps } from 'react-beautiful-dnd';

const CustomDroppable: React.FC<DroppableProps> = ({ children, ...props }) => {
  // Memoize the Droppable component to avoid unnecessary re-renders
  const MemoizedDroppable = useMemo(
    () => React.memo(({ children }: { children: DroppableProps['children'] }) => (
      <Droppable {...props}>{children}</Droppable>
    )),
    [props]
  );

  return <MemoizedDroppable>{children}</MemoizedDroppable>;
};

export default CustomDroppable;