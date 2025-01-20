import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { getProcessList } from '../../../modules/information';
import { useDispatch, useSelector } from 'react-redux';
import { ThunkDispatch } from 'redux-thunk';
import { AnyAction } from 'redux';

interface AddProcessModalProps {
  isOpen: boolean;
  onClose: () => void;
  nodes: Array<{ node_id: number; process_name: string; }>;
  edges: Array<{ from_node_id: number; to_node_id: number }>;
  onSubmit: (data: {
    nodes: Array<{ node_id: number | null; process_name: string }>;
    edges: Array<{ from_node_id: number; to_node_id: number }>;
  }) => void;
  editMode?: boolean;
  initialData?: {
    node_id: number;
    process_name: string;
    prev_node_id?: number;
    next_node_id?: number;
  };
  onDelete?: (nodeId: number) => void;
}
const AddProcessModal = ({ 
  isOpen, 
  onClose, 
  nodes, 
  edges,
  onSubmit, 
  onDelete,
  editMode = false,
  initialData
}: AddProcessModalProps) => {
  const processList = useSelector((state: any) => state.information.processList);
  const [selectedProcess, setSelectedProcess] = useState("");
  const [selectedPrevProcesses, setSelectedPrevProcesses] = useState<string[]>([]);
  const [selectedNextProcesses, setSelectedNextProcesses] = useState<string[]>([]);
  
  useEffect(() => {
    console.log(initialData);
    if (editMode && initialData) {
      const process = processList.find((p: any) => p.process_name === initialData.process_name);
      setSelectedProcess(process?.process_id || "");
      setSelectedPrevProcesses(initialData.prev_node_id ? [initialData.prev_node_id.toString()] : []);
      setSelectedNextProcesses(initialData.next_node_id ? [initialData.next_node_id.toString()] : []);
    }
  }, [editMode, initialData, processList]);

  if (!isOpen) return null;

  const handleSubmit = () => {
    console.log('Selected Process:', selectedProcess);
    
    if (selectedProcess === "") {
      alert('공정을 선택해주세요.');
      return;
    }

    let nodeId = editMode && initialData ? initialData.node_id : null;
    

    if (nodeId === null) {
      const maxExistingId = Math.max(
        0,
        ...nodes.map((n: any) => n.node_id),
        ...nodes.filter(n => n.node_id !== null).map(n => n.node_id!)
      );

      nodeId = maxExistingId + 1;
    }

      const updatedNodes = [
      ...(editMode ? nodes.filter(n => n.node_id !== initialData?.node_id) : nodes),
      {
        node_id: nodeId,
        process_name: selectedProcess
      }
    ];

    const existingEdges = editMode ? 
      edges.filter(edge => 
        edge.from_node_id !== initialData?.node_id && 
        edge.to_node_id !== initialData?.node_id
      ) : edges;

    const newEdges = [
      ...existingEdges,
      ...selectedPrevProcesses.map(prevId => ({
        from_node_id: parseInt(prevId),
        to_node_id: nodeId || 0
      })),
      ...selectedNextProcesses.map(nextId => ({
        from_node_id: nodeId || 0,
        to_node_id: parseInt(nextId)
      }))
    ];
    
    onSubmit({
      nodes: updatedNodes,
      edges: newEdges
    });

    setSelectedProcess("");
    setSelectedPrevProcesses([]);
    setSelectedNextProcesses([]);

    handleClose();
  };

  const handleClose = () => {
    setSelectedProcess("");
    setSelectedPrevProcesses([]);
    setSelectedNextProcesses([]);
    onClose();
  };

  const handleDelete = () => {
    if (editMode && initialData && onDelete) {
      onDelete(initialData.node_id);
      handleClose();
    }
  };

  return (
    <ModalOverlay>
      <ModalContent>
        <ModalHeader>
          <h3>{editMode ? '공정 수정' : '공정 추가'}</h3>
          <CloseButton onClick={handleClose}>×</CloseButton>
        </ModalHeader>
        <ModalForm>
          <FormGroup>
            <label>공정</label>
            <select value={selectedProcess} onChange={(e) => setSelectedProcess(e.target.value)}>
              <option value="">공정 선택</option>
              {processList.map((process: any) => (
                <option key={process.process_id} value={process.process_id}>
                  {process.process_name}
                </option>
              ))}
            </select>

            <label>이전 공정 (여러개 선택 가능)</label>
            <select 
              multiple
              value={selectedPrevProcesses}
              onChange={(e) => setSelectedPrevProcesses(
                Array.from(e.target.selectedOptions, option => option.value)
              )}
              style={{ height: '100px' }}
            >
              {nodes.map((node) => (
                <option key={node.node_id} value={node.node_id}>
                  [{node.node_id}] {node.process_name}
                </option>
              ))}
            </select>

            <label>이후 공정 (여러개 선택 가능)</label>
            <select
              multiple
              value={selectedNextProcesses}
              onChange={(e) => setSelectedNextProcesses(
                Array.from(e.target.selectedOptions, option => option.value)
              )}
              style={{ height: '100px' }}
            >
              {nodes.map((node) => (
                <option key={node.node_id} value={node.node_id}>
                  [{node.node_id}] {node.process_name}
                </option>
              ))}
            </select>
          </FormGroup>
          <ButtonGroup>
            {editMode && (
              <DeleteButton onClick={handleDelete}>삭제</DeleteButton>
            )}
            <CancelButton onClick={onClose}>취소</CancelButton>
            <SubmitButton onClick={handleSubmit}>{editMode ? '수정' : '추가'}</SubmitButton>
          </ButtonGroup>
        </ModalForm>
      </ModalContent>
    </ModalOverlay>
  );
};

export default AddProcessModal;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
`;

const ModalContent = styled.div`
  background: white;
  padding: 20px;
  border-radius: 8px;
  width: 400px;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  
  h3 {
    margin: 0;
  }
`;

const ModalForm = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
  
  label {
    font-size: 14px;
    font-weight: 500;
  }
  
  input, select {
    padding: 8px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 14px;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  padding: 0;
  color: #666;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    color: #000;
  }
`;

const CancelButton = styled.button`
  padding: 8px 16px;
  border: 1px solid #ddd;
  background: white;
  border-radius: 4px;
  cursor: pointer;
  
  &:hover {
    background: #f5f5f5;
  }
`;

const SubmitButton = styled.button`
  padding: 8px 16px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  
  &:hover {
    background: #0056b3;
  }
`;

const DeleteButton = styled.button`
  padding: 8px 16px;
  background: #dc3545;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-right: auto;
  
  &:hover {
    background: #c82333;
  }
`; 