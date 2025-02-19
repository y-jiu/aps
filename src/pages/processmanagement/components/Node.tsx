import { Handle, NodeToolbar, Position } from "@xyflow/react";
import styled from "styled-components";
import "@xyflow/react/dist/style.css";
import { useSelector } from "react-redux";

const DeleteButton = styled.button`
  padding: 10px 15px;
  border-radius: 5px;
  background-color: #ff4d4f;
  color: white;
  border: none;
  cursor: pointer;
  font-size: 15px;
  font-weight: 800;
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);

  &:hover {
    background-color: #ff7875;
  }
`;

const NodeWrapper = styled.div<{ $selected?: boolean}>`
  position: relative;
  padding: 8px 14px;
  font-size: 11px;
  border-radius: 0.125rem;
  border-left: 2.5px solid #000000;
  background: white;
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
  ${props => props.$selected && 'border: 1.5px solid #ff4d4f;' }
`;

const NodeContent = styled.div`
  padding: 8px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const StyledSelect = styled.select`
  width: 100%;
  padding: 6px;
  border: 1px solid #ccc;
  border-radius: 4px;

  &:focus {
    outline: none;
    border-color: #aaa;
  }
`;

const NodeId = styled.div`
  margin-right: 5px;
  height: 25px;
`;

const Node = ({ data, id, selected }: any) => {
  const processList = useSelector(
    (state: any) => state.information.processList
  );

  const onDeleteClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    if (data.onDelete) {
      data.onDelete(id);
    }
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (data.onChange) {
      data.onChange(id, e.target.value);
    }
  };

  return (
    <NodeWrapper $selected={selected}>
      <NodeToolbar
        isVisible={selected}
        position={Position.Top}
      >
        <DeleteButton onClick={onDeleteClick} className="nodrag">
          공정 삭제하기
        </DeleteButton>
      </NodeToolbar>
      <Handle
        type="source"
        position={Position.Left}
        style={{ background: "#000" }}
        id="left-handle"
      />
      <NodeContent>
        <NodeId>{data?.label}</NodeId>
        <StyledSelect
          value={data?.value || ""}
          className="nodrag"
          onChange={handleSelectChange}
        >
          <option value="">선택</option>
          {processList.map((process: any) => (
            <option key={process.process_id} value={process.process_id}>
              {process.process_name}
            </option>
          ))}
        </StyledSelect>
      </NodeContent>
      <Handle
        type="source"
        position={Position.Right}
        style={{ background: "#000" }}
        id="right-handle"
      />
    </NodeWrapper>
  );
};

export default Node;
