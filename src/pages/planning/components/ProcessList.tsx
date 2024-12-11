import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';
// import { useAuth } from '../../../hooks/useAuth';
import { addProcess, deleteProcess, updateProcess, updateProcessesOrder, updateProcessOrder } from '../../../modules/plan';

const ProcessWrapper = styled.div`
  margin-top: 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  overflow: hidden;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  border: 1px solid #e0e0e0;
  background: white;
`;

const TableHeader = styled.th<{ isVisible?: boolean }>`
  background-color: #fff3e0;
  padding: 8px;
  text-align: center;
  cursor: pointer;
  border-bottom: 2px solid #ffb74d;
  font-weight: 500;
  transition: background-color 0.2s ease;
  font-size: 13px;
  
  &:hover {
    background-color: #ffe0b2;
  }
`;

const TableCell = styled.td<{ isEditing?: boolean }>`
  padding: 5px;
  text-align: center;
  border-bottom: 1px solid #e0e0e0;
  background-color: ${props => props.isEditing ? '#fff3e0' : 'transparent'};
  cursor: ${props => props.isEditing ? 'text' : 'default'};
  transition: background-color 0.2s ease;
  font-size: 12px;
  
  &:hover {
    background-color: ${props => props.isEditing ? '#fff3e0' : '#f5f5f5'};
  }
`;

const AddButton = styled.button`
  width: 20px;
  height: 20px;
  padding: 0;
  margin-bottom: 0.25rem;
  background-color: #ff9800;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: #f57c00;
    transform: scale(1.05);
  }
  
  &:disabled {
    background-color: #e0e0e0;
    cursor: not-allowed;
    transform: none;
  }
`;

const DeleteButton = styled.button`
  padding: 2px 6px;
  background-color: #ff5252;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: #ff1744;
    transform: scale(1.05);
  }
  
  &:disabled {
    background-color: #e0e0e0;
    cursor: not-allowed;
    transform: none;
  }
`;

const Input = styled.input`
  width: 100%;
  border: 2px solid #ffb74d;
  border-radius: 4px;
  font-size: 12px;
  transition: border-color 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: #ff9800;
    box-shadow: 0 0 0 2px rgba(255, 152, 0, 0.1);
  }
`;

const MoveButton = styled.button`
  border: none;
  background: none;
  padding: 2px 6px;
  cursor: pointer;
  font-size: 14px;
  color: #666;
  
  &:disabled {
    color: #ccc;
    cursor: not-allowed;
  }
`;

const TableHeaderCell = styled.th`
  padding: 5px;
  text-align: center;
  font-weight: 500;
  font-size: 13px;
`;

interface ProcessListProps {
  selectedPlanBomState: string;
}

interface Process {
  id: string;
  name: string;
  order: number;
  note: string;
}

const ProcessList: React.FC<ProcessListProps> = ({ selectedPlanBomState }) => {
  const dispatch = useDispatch();
  // const { role } = useAuth();
  const [isTableVisible, setIsTableVisible] = useState(true);
  const [editMode, setEditMode] = useState<Record<string, boolean>>({});
  const [editedValues, setEditedValues] = useState<Record<string, string>>({});

  // const processes = useSelector((state: any) => state.process.processes);
  //processes mock data
  const processes = [
    { id: '1', name: 'Process 1', order: 1, note: 'Note 1' },
    { id: '2', name: 'Process 2', order: 2, note: 'Note 2' }
  ];
  const selectedPlanId = useSelector((state: any) => state.plan.selectedPlanId);

  const isEditable = () => {
    // return (role === 'Master' || role === 'Admin') && 
    //        selectedPlanBomState === 'Editting';
    return true;
  };

  const handleAddProcess = async () => {
    if (!selectedPlanId) return;
    
    try {
      await dispatch(addProcess(selectedPlanId));
    } catch (error) {
      console.error('Failed to add process:', error);
    }
  };

  const handleDeleteProcess = async (processId: string) => {
    if (!window.confirm('정말로 삭제하시겠습니까?')) return;

    try {
      await dispatch(deleteProcess(processId));
      
      // Reorder remaining processes
      const updatedProcesses = processes
        .filter((p: Process) => p.id !== processId)
        .map((p: Process, index: number) => ({
          ...p,
          order: index + 1
        }));
      
      dispatch(updateProcessOrder(updatedProcesses));
    } catch (error) {
      console.error('Failed to delete process:', error);
    }
  };

  const handleEditStart = (processId: string, field: string, value: string) => {
    if (!isEditable()) return;
    
    setEditMode(prev => ({ ...prev, [`${processId}-${field}`]: true }));
    setEditedValues(prev => ({ ...prev, [`${processId}-${field}`]: value }));
  };

  const handleEditSave = async (processId: string, field: string) => {
    const newValue = editedValues[`${processId}-${field}`];
    
    try {
      await dispatch(updateProcess({
        id: processId, [field]: newValue,
        name: '',
        order: 0,
        note: ''
      }));
      setEditMode(prev => ({ ...prev, [`${processId}-${field}`]: false }));
    } catch (error) {
      console.error('Failed to update process:', error);
    }
  };

  const handleMoveProcess = async (processId: string, direction: 'up' | 'down') => {
    const currentIndex = processes.findIndex((p: Process) => p.id === processId);
    if (
      (direction === 'up' && currentIndex === 0) || 
      (direction === 'down' && currentIndex === processes.length - 1)
    ) return;

    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    const updatedProcesses = [...processes];
    [updatedProcesses[currentIndex], updatedProcesses[newIndex]] = 
    [updatedProcesses[newIndex], updatedProcesses[currentIndex]];

    // Update order numbers
    const reorderedProcesses = updatedProcesses.map((p, index) => ({
      ...p,
      order: index + 1
    }));

    try {
      await dispatch(updateProcessOrder(reorderedProcesses));
    } catch (error) {
      console.error('Failed to update process order:', error);
    }
  };

  return (
    <ProcessWrapper>
      <Table>
        <thead>
          <tr>
            <TableHeader 
              colSpan={6}
              onClick={() => setIsTableVisible(!isTableVisible)}
            >
              공정 목록
              {/* Add collapse/expand icon */}
            </TableHeader>
          </tr>
        </thead>
        {isTableVisible && (
          <tbody>
            <tr>
              <TableHeaderCell>공정명</TableHeaderCell>
              <TableHeaderCell>순서</TableHeaderCell>
              <TableHeaderCell>비고</TableHeaderCell>
              <TableHeaderCell>삭제</TableHeaderCell>
              <TableHeaderCell colSpan={2}>이동</TableHeaderCell>
            </tr>
            {processes.map((process: Process, index: number) => (
              <tr key={process.id}>
                <TableCell 
                  isEditing={editMode[`${process.id}-name`]}
                  onClick={() => handleEditStart(process.id, 'name', process.name)}
                >
                  {editMode[`${process.id}-name`] ? (
                    <Input
                      value={editedValues[`${process.id}-name`] || ''}
                      onChange={e => setEditedValues(prev => ({
                        ...prev,
                        [`${process.id}-name`]: e.target.value
                      }))}
                      onBlur={() => handleEditSave(process.id, 'name')}
                      onKeyPress={e => e.key === 'Enter' && handleEditSave(process.id, 'name')}
                      autoFocus
                    />
                  ) : process.name}
                </TableCell>
                <TableCell>{process.order}</TableCell>
                <TableCell 
                  isEditing={editMode[`${process.id}-note`]}
                  onClick={() => handleEditStart(process.id, 'note', process.note)}
                >
                  {editMode[`${process.id}-note`] ? (
                    <Input
                      value={editedValues[`${process.id}-note`] || ''}
                      onChange={e => setEditedValues(prev => ({
                        ...prev,
                        [`${process.id}-note`]: e.target.value
                      }))}
                      onBlur={() => handleEditSave(process.id, 'note')}
                      onKeyPress={e => e.key === 'Enter' && handleEditSave(process.id, 'note')}
                      autoFocus
                    />
                  ) : process.note}
                </TableCell>
                <TableCell>
                  <DeleteButton
                    onClick={() => handleDeleteProcess(process.id)}
                    disabled={!isEditable()}
                  >
                    삭제
                  </DeleteButton>
                </TableCell>
                <TableCell>
                  <MoveButton
                    onClick={() => handleMoveProcess(process.id, 'up')}
                    disabled={!isEditable() || index === 0}
                  >
                    ▲
                  </MoveButton>
                </TableCell>
                <TableCell>
                  <MoveButton
                    onClick={() => handleMoveProcess(process.id, 'down')}
                    disabled={!isEditable() || index === processes.length - 1}
                  >
                    ▼
                  </MoveButton>
                </TableCell>
              </tr>
            ))}
            <tr>
              <TableCell colSpan={6} style={{ backgroundColor: '#FFF3E0' }}>
                <AddButton
                  onClick={handleAddProcess}
                  disabled={!isEditable()}
                >
                  +
                </AddButton>
              </TableCell>
            </tr>
          </tbody>
        )}
      </Table>
    </ProcessWrapper>
  );
};

export default ProcessList;