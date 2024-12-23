import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';
import { getFacilityList, createFacility, deleteFacility } from '../../../modules/information';
import { ThunkDispatch } from 'redux-thunk';
import { AnyAction } from 'redux';

const FacilityList: React.FC<{selectedPlanBomState: string}> = ({selectedPlanBomState}) => {
  const dispatch = useDispatch<ThunkDispatch<any, any, AnyAction>>();
  // const { role } = useAuth();
  const [isTableVisible, setIsTableVisible] = useState(true);
  const [editMode, setEditMode] = useState<Record<string, boolean>>({});
  const [editedValues, setEditedValues] = useState<Record<string, string>>({});
  const [addMode, setAddMode] = useState(false);

  const facilityList = useSelector((state: any) => state.information.facilityList);

  const selectedPlanId = useSelector((state: any) => state.plan.selectedPlanId);
  // const companyList = useSelector((state: any) => state.information.companyList);

  useEffect(() => {
    dispatch(getFacilityList());
  }, []);

  useEffect(() => {
    setEditMode({});
    setEditedValues({});
    setAddMode(false);
  }, [facilityList]);

  
  const isEditable = () => {
    return true;
  };

  const handleAddFacility = async () => {
    setAddMode(true);
  };

  const handleDeleteFacility = async (facilityId: string) => {
    if (!window.confirm('정말로 삭제하시겠습니까?')) return;

    try {
      await dispatch(deleteFacility(Number(facilityId)));
    } catch (error) {
      console.error('Failed to delete facility:', error);
    }
  };

  const handleEditStart = (facilityId: string, field: string, value: string) => {
    setEditMode(prev => ({ ...prev, [`${facilityId}-${field}`]: true }));
    setEditedValues(prev => ({ ...prev, [`${facilityId}-${field}`]: value }));
  };

  const handleEditSaveOrder = async (facilityId: string, field: string) => {
    const newValue: any = {
      first_facility_name: '',
      second_facility_name: '',
    };
  }
  
  const handleEditSaveName = async (facilityId: string, field: string) => {
    const newValue: any = {
      old_facility_name: '',
      new_facility_name: '',
    };

    // Get existing values from companyList
    const facility = facilityList.find((c: any) => c.id === facilityId);
    if (facility) {
      Object.keys(newValue).forEach(key => {
        newValue[key] = facility[key];
      });
    }

    // Update with edited values
    for (const key in editedValues) {
      if (key.includes(facilityId)) {
        newValue[key.split('-')[1]] = editedValues[key];
      }
    }
    
    try {
      // await dispatch(updateFacility(Number(facilityId), newValue));
      setEditMode(prev => ({ ...prev, [`${facilityId}-${field}`]: false }));
    } catch (error) {
      console.error('Failed to update facility:', error);
    }
  };

  const handleEditCancel = (facilityId: string, field: string) => {
    setEditMode(prev => ({ ...prev, [`${facilityId}-${field}`]: false }));
    setEditedValues(prev => ({ ...prev, [`${facilityId}-${field}`]: '' }));
  };

  const handleAddSave = async () => {
    try {
      const newFacilityData = {
        facility_name: editedValues['new-facility_name'],
        // facility_order: editedValues['new-facility_order'],
      };
      
      await dispatch(createFacility(newFacilityData));
      setAddMode(false);
      setEditedValues({});
    } catch (error) {
      console.error('Failed to create facility:', error);
    }
  };

  return (
    <FacilityWrapper>
      <TableContainer>
        <Table>
          <thead>
            <tr>
              <TableHeader 
                colSpan={3}
                onClick={() => setIsTableVisible(!isTableVisible)}
              >
                제품 목록
                {/* Add icon based on visibility state */}
              </TableHeader>
            </tr>
          </thead>
          {isTableVisible && (
            <tbody>
              <tr>
                <TableHeaderCell>설비 이름</TableHeaderCell>
                <TableHeaderCell>설비 순서</TableHeaderCell>
                <TableHeaderCell>삭제</TableHeaderCell>
              </tr>
              {facilityList.map((facility: any) => (
                <tr key={facility.id}>
                  <TableCell 
                    isEditing={editMode[`${facility.id}-facility_name`]}
                    onClick={() => isEditable() && handleEditStart(facility.id, 'facility_name', facility.facility_name)}
                  >
                    {/* {editMode[`${facility.id}-facility_name`] ? (
                      <Input
                        value={editedValues[`${facility.id}-facility_name`] || ''}
                        onChange={e => setEditedValues(prev => ({
                          ...prev,
                          [`${facility.id}-facility_name`]: e.target.value
                        }))}
                        // onBlur={() => handleEditSave(facility.id, 'facility_name')}
                        // onKeyPress={e => e.key === 'Enter' && handleEditSave(facility.id, 'facility_name')}
                        // onKeyDown={e => e.key === 'Escape' && handleEditCancel(facility.id, 'facility_name')}
                        autoFocus
                      />
                    ) : facility.facility_name} */}
                    {facility.facility_name}
                  </TableCell>
                  <TableCell
                    isEditing={editMode[`${facility.id}-facility_order`]}
                    onClick={() => isEditable() && handleEditStart(facility.id, 'facility_order', facility.facility_order)}
                  >
                    {/* {editMode[`${facility.id}-facility_order`] ? (
                      <Input
                        value={editedValues[`${facility.id}-facility_order`] || ''}
                        onChange={e => setEditedValues(prev => ({
                          ...prev,
                          [`${facility.id}-facility_order`]: e.target.value
                        }))}
                        onBlur={() => handleEditSave(facility.id, 'facility_order')}
                        onKeyPress={e => e.key === 'Enter' && handleEditSave(facility.id, 'facility_order')}
                        onKeyDown={e => e.key === 'Escape' && handleEditCancel(facility.id, 'facility_order')}
                        autoFocus
                      />
                    ) : facility.facility_order} */}
                    {facility.facility_order}
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
              {addMode && (
                <tr>
                  <TableCell>
                    <Input
                      value={editedValues[`new-facility_name`] || ''}
                      onChange={e => setEditedValues(prev => ({
                        ...prev,
                        [`new-facility_name`]: e.target.value
                      }))}
                    />
                  </TableCell>
                  <TableCell>
                    {/* <Input
                      value={editedValues[`new-facility_order`] || ''}
                      onChange={e => setEditedValues(prev => ({
                        ...prev,
                        [`new-facility_order`]: e.target.value
                      }))}
                    /> */}
                  </TableCell>
                  <TableCell>
                      <SaveButton onClick={() => handleAddSave()}>저장</SaveButton>
                  </TableCell>
                </tr>
              )}

              <tr>
                <TableCell colSpan={3} style={{ backgroundColor: '#E8F5E9' }}>
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
    background-color: #4CAF50;
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

const ActionCell = styled.div`
  display: flex;
  gap: 4px;
  justify-content: center;
  margin-top: 4px;
`;

const SaveButton = styled.button`
  padding: 2px 6px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  
  &:hover {
    background-color: #45a049;
  }
`;

const CancelButton = styled.button`
  padding: 2px 6px;
  background-color: #9e9e9e;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  
  &:hover {
    background-color: #757575;
  }
`;
