import React from "react";
import { Handle, Node, NodeProps, Position } from "@xyflow/react";
import styled from "styled-components";

interface BaseNodeProps extends React.HTMLAttributes<HTMLDivElement> {
  selected?: boolean;
  processed?: boolean;
}

const StyledBaseNode = styled.div<{ $selected?: boolean, $processed?: boolean }>`
  position: relative;
  padding: 8px 14px;
  font-size: 11px;
  border-radius: 5px;
  border: 1.5px solid ${props => props.$processed ? '#008000' : '#ff0000'};
  background: white;

  &:focus {
    outline: none;
  }

  &:hover {
  }
`;

const BaseNode = React.forwardRef<HTMLDivElement, BaseNodeProps>(
  ({ selected, processed, ...props }, ref) => {
    return (
      <StyledBaseNode
        ref={ref}
        $selected={selected}
        $processed={processed}
        tabIndex={0}
        {...props}
      />
    );
  }
);

export default function CustomNode({ selected, data }: NodeProps<Node<{ label: string, processed: boolean }>>) {
  return (
    <BaseNode selected={selected} processed={data.processed} draggable>
      <>
        {data.label}
        <Handle type="source" position={Position.Right} />
        <Handle type="target" position={Position.Left} />
      </>
    </BaseNode>
  );
}
