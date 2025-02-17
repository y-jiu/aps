import React from "react";
import { Handle, Node, NodeProps, Position } from "@xyflow/react";
import styled from "styled-components";

interface BaseNodeProps extends React.HTMLAttributes<HTMLDivElement> {
  selected?: boolean;
}

const StyledBaseNode = styled.div<{ $selected?: boolean }>`
  position: relative;
  padding: 8px 14px;
  font-size: 12px;
  border-radius: 5px;
  border: 1px solid #ccc;
  background: white;

  &:focus {
    outline: none;
    border-color: #aaa;
  }

  &:hover {
    box-shadow: 0 0 0 1px currentColor;
  }
`;

const BaseNode = React.forwardRef<HTMLDivElement, BaseNodeProps>(
  ({ selected, ...props }, ref) => {
    return (
      <StyledBaseNode
        ref={ref}
        $selected={selected}
        tabIndex={0}
        {...props}
      />
    );
  }
);

export default function CustomNode({ selected, data }: NodeProps<Node<{ label: string }>>) {
  return (
    <BaseNode selected={selected} draggable>
      <>
        {data.label}
        <Handle type="source" position={Position.Right} />
        <Handle type="target" position={Position.Left} />
      </>
    </BaseNode>
  );
}
