import React, { useState } from 'react';
import styled from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';
// import { useAuth } from '../../../hooks/useAuth';
import { 
  addFacility,
  deleteFacility,
  updateFacility,
  setLoading,
  setError
} from '../../../modules/plan';

const FacilityWrapper = styled.div`
  margin-top: 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  overflow: hidden;
`;

const TableContainer = styled.div`
  width: 100%;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  border: 1px solid #e0e0e0;
  background: white;
`;

const TableHeader = styled.th<{ isVisible?: boolean }>`
  background-color: #e8f5e9;
  padding: 0.5rem;
  text-align: center;
  cursor: pointer;
  border-bottom: 2px solid #4CAF50;
  font-weight: 500;
  transition: background-color 0.2s ease;
  font-size: 13px;
  
  &:hover {
    background-color: rgba(76, 175, 80, 0.5);
  }
`;

const TableCell = styled.td<{ isEditing?: boolean }>`
  padding: 5px;
  text-align: center;
  border-bottom: 1px solid #e0e0e0;
  background-color: ${props => props.isEditing ? '#e8f5e9' : 'transparent'};
  cursor: ${props => props.isEditing ? 'text' : 'default'};
  transition: background-color 0.2s ease;
  font-size: 12px;
`;

const AddButton = styled.button`
  width: 20px;
  height: 20px;
  padding: 0;
  margin-bottom: 0.25rem;
  background-color: #4CAF50;
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
  border: 2px solid #4CAF50;
  border-radius: 4px;
  font-size: 12px;
  transition: border-color 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: #4CAF50;
    box-shadow: 0 0 0 2px rgba(76, 175, 80, 0.1);
  }
`;


const TableHeaderCell = styled.th`
  padding: 5px;
  text-align: center;
  font-weight: 500;
  font-size: 13px;
`;


interface FacilityListProps {
  selectedPlanBomState: string;
}

interface Facility {
  id: string;
  name: string;
  note: string;
}

const FacilityList: React.FC<FacilityListProps> = ({ selectedPlanBomState }) => {
  const dispatch = useDispatch();
  // const { role } = useAuth();
  const [isTableVisible, setIsTableVisible] = useState(true);
  const [editMode, setEditMode] = useState<Record<string, boolean>>({});
  const [editedValues, setEditedValues] = useState<Record<string, string>>({});

  // const facilities = useSelector((state: any) => state.facility.facilities);
  // mock data of facilities
  const facilities = [
    { id: '1', name: 'Facility 1', note: 'Note 1' },
    { id: '2', name: 'Facility 2', note: 'Note 2' }
  ];

  const selectedPlanId = useSelector((state: any) => state.plan.selectedPlanId);

  const isEditable = () => {
    // return (role === 'Master' || role === 'Admin') && 
    //        selectedPlanBomState === 'Editting';
    return true;
  };

  const handleAddFacility = async () => {
    if (!selectedPlanId) return;
    
    try {
      await dispatch(addFacility(selectedPlanId));
    } catch (error) {
      console.error('Failed to add facility:', error);
    }
  };

  const handleDeleteFacility = async (facilityId: string) => {
    if (!window.confirm('정말로 삭제하시겠습니까?')) return;

    try {
      await dispatch(deleteFacility(facilityId));
    } catch (error) {
      console.error('Failed to delete facility:', error);
    }
  };

  const handleEditStart = (facilityId: string, field: string, value: string) => {
    setEditMode(prev => ({ ...prev, [`${facilityId}-${field}`]: true }));
    setEditedValues(prev => ({ ...prev, [`${facilityId}-${field}`]: value }));
  };

  const handleEditSave = async (facilityId: string, field: string) => {
    const newValue = editedValues[`${facilityId}-${field}`];
    
    try {
      await dispatch(updateFacility({
        id: facilityId,
        [field]: newValue,
        name: '',
        note: ''
      }));
      
      setEditMode(prev => ({ ...prev, [`${facilityId}-${field}`]: false }));
    } catch (error) {
      console.error('Failed to update facility:', error);
    }
  };

  const handleEditCancel = (facilityId: string, field: string) => {
    setEditMode(prev => ({ ...prev, [`${facilityId}-${field}`]: false }));
    setEditedValues(prev => ({ ...prev, [`${facilityId}-${field}`]: '' }));
  };

  return (
    <FacilityWrapper>
      <TableContainer>
        <Table>
          <thead>
            <tr>
              <TableHeader 
                colSpan={4}
                onClick={() => setIsTableVisible(!isTableVisible)}
              >
                설비 목록
                {/* Add icon based on visibility state */}
              </TableHeader>
            </tr>
          </thead>
          {isTableVisible && (
            <tbody>
              <tr>
                <TableHeaderCell>설비명</TableHeaderCell>
                <TableHeaderCell>비고</TableHeaderCell>
                <TableHeaderCell>삭제</TableHeaderCell>
              </tr>
              {facilities.map((facility: Facility) => (
                <tr key={facility.id}>
                  <TableCell 
                    isEditing={editMode[`${facility.id}-name`]}
                    onClick={() => isEditable() && handleEditStart(facility.id, 'name', facility.name)}
                  >
                    {editMode[`${facility.id}-name`] ? (
                      <Input
                        value={editedValues[`${facility.id}-name`] || ''}
                        onChange={e => setEditedValues(prev => ({
                          ...prev,
                          [`${facility.id}-name`]: e.target.value
                        }))}
                        onBlur={() => handleEditSave(facility.id, 'name')}
                        onKeyPress={e => e.key === 'Enter' && handleEditSave(facility.id, 'name')}
                        onKeyDown={e => e.key === 'Escape' && handleEditCancel(facility.id, 'name')}
                        autoFocus
                      />
                    ) : facility.name}
                  </TableCell>
                  <TableCell 
                    isEditing={editMode[`${facility.id}-note`]}
                    onClick={() => isEditable() && handleEditStart(facility.id, 'note', facility.note)}
                  >
                    {editMode[`${facility.id}-note`] ? (
                      <Input
                        value={editedValues[`${facility.id}-note`] || ''}
                        onChange={e => setEditedValues(prev => ({
                          ...prev,
                          [`${facility.id}-note`]: e.target.value
                        }))}
                        onBlur={() => handleEditSave(facility.id, 'note')}
                        onKeyPress={e => e.key === 'Enter' && handleEditSave(facility.id, 'note')}
                        onKeyDown={e => e.key === 'Escape' && handleEditCancel(facility.id, 'note')}
                        autoFocus
                      />
                    ) : facility.note}
                  </TableCell>
                  <TableCell>
                    <DeleteButton
                      onClick={() => handleDeleteFacility(facility.id)}
                      disabled={!isEditable()}
                    >
                      삭제
                    </DeleteButton>
                  </TableCell>
                </tr>
              ))}
              <tr>
                <TableCell colSpan={4} style={{ backgroundColor: '#E8F5E9' }}>
                  <AddButton
                    onClick={handleAddFacility}
                    disabled={!isEditable()}
                  >
                    +
                  </AddButton>
                </TableCell>
              </tr>
            </tbody>
          )}
        </Table>
      </TableContainer>
    </FacilityWrapper>
  );
};

export default FacilityList;