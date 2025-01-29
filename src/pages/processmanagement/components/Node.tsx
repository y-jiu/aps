import { Handle, Position } from '@xyflow/react';
import styled from 'styled-components';
import '@xyflow/react/dist/style.css';
import { useSelector } from 'react-redux';

const DeleteButton = styled.button`
  position: absolute;
  top: -10px;
  right: -10px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: #ff4d4f;
  color: white;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  padding: 0;
  line-height: 1;
  
  &:hover {
    background-color: #ff7875;
  }
`;

const NodeWrapper = styled.div`
  padding: 10px;
  border-radius: 5px;
  background: white;
  border: 1px solid #ddd;
  min-width: 150px;
  position: relative;
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

const LabelWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const NodeId = styled.div`
  margin-right: 5px;
  height: 25px;
`;

const Node = ({ data, id }: any) => {
  const processList = useSelector((state: any) => state.information.processList);

  const onDeleteClick = (event: React.MouseEvent) => {
    event.stopPropagation();  // 이벤트 버블링 방지
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
    <NodeWrapper>
      <DeleteButton onClick={onDeleteClick} className="nodrag">
        ×
      </DeleteButton>
      <Handle 
        type="source" 
        position={Position.Left}
        style={{ background: '#555' }}
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
        style={{ background: '#555' }}
        id="right-handle"
      />
    </NodeWrapper>
  );
};

export default Node;

