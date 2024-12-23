import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';
import { getMaterialList, updateMaterial, createMaterial, deleteMaterial } from '../../../modules/delivery';
import { ThunkDispatch } from 'redux-thunk';
import { AnyAction } from 'redux';

const RawMaterial = () => {
  const dispatch = useDispatch<ThunkDispatch<any, any, AnyAction>>();
  // const { role } = useAuth();
  const [isTableVisible, setIsTableVisible] = useState(true);
  const [editMode, setEditMode] = useState<Record<string, boolean>>({});
  const [editedValues, setEditedValues] = useState<Record<string, string>>({});
  const [addMode, setAddMode] = useState(false);

  const materialList = useSelector((state: any) => state.delivery.materialList);

  const selectedPlanId = useSelector((state: any) => state.plan.selectedPlanId);
  // const companyList = useSelector((state: any) => state.information.companyList);

  useEffect(() => {
    dispatch(getMaterialList());
  }, []);

  useEffect(() => {
    setEditMode({});
    setEditedValues({});
    setAddMode(false);
  }, [materialList]);

  
  const isEditable = () => {
    return true;
  };

  const handleAddMaterial = async () => {
    setAddMode(true);
  };

  const handleDeleteMaterial = async (materialId: string) => {
    if (!window.confirm('정말로 삭제하시겠습니까?')) return;

    try {
      await dispatch(deleteMaterial(Number(materialId)));
    } catch (error) {
      console.error('Failed to delete material:', error);
    }
  };

  const handleEditStart = (productId: string, field: string, value: string) => {
    setEditMode(prev => ({ ...prev, [`${productId}-${field}`]: true }));
    setEditedValues(prev => ({ ...prev, [`${productId}-${field}`]: value }));
  };

  const handleEditSave = async (materialId: string, field: string) => {
    const newValue: any = {
      id: materialId,
      material_name: '',
      material_amount: '',
      material_note: ''
    };

    // Get existing values from companyList
    const material = materialList.find((c: any) => c.id === materialId);
    if (material) {
      Object.keys(newValue).forEach(key => {
        newValue[key] = material[key];
      });
    }

    // Update with edited values
    for (const key in editedValues) {
      if (key.includes(materialId)) {
        newValue[key.split('-')[1]] = editedValues[key];
      }
    }

    newValue.material_amount = Number(newValue.material_amount);
    
    try {
      await dispatch(updateMaterial(newValue));
      setEditMode(prev => ({ ...prev, [`${materialId}-${field}`]: false }));
    } catch (error) {
      console.error('Failed to update material:', error);
    }
  };

  const handleEditCancel = (materialId: string, field: string) => {
    setEditMode(prev => ({ ...prev, [`${materialId}-${field}`]: false }));
    setEditedValues(prev => ({ ...prev, [`${materialId}-${field}`]: '' }));
  };

  const handleAddSave = async () => {
    try {
      const newMaterialData = {
        material_name: editedValues['new-material_name'],
        material_amount: Number(editedValues['new-material_amount']),
        material_note: editedValues['new-material_note']
      };
      
      await dispatch(createMaterial(newMaterialData));
      setAddMode(false);
      setEditedValues({});
    } catch (error) {
      console.error('Failed to create material:', error);
    }
  };

  return (
    <FacilityWrapper>
      <TableContainer>
        <Table>
          <thead>
            <tr>
              <TableHeader 
                colSpan={5}
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
                <TableHeaderCell>자재 이름</TableHeaderCell>
                <TableHeaderCell>자재 수량</TableHeaderCell>
                <TableHeaderCell>비고</TableHeaderCell>
              </tr>
              {materialList.map((material: any) => (
                <tr key={material.id}>
                  <TableCell 
                    isEditing={editMode[`${material.id}-material_name`]}
                    onClick={() => isEditable() && handleEditStart(material.id, 'material_name', material.material_name)}
                  >
                    {editMode[`${material.id}-material_name`] ? (
                      <Input
                        value={editedValues[`${material.id}-material_name`] || ''}
                        onChange={e => setEditedValues(prev => ({
                          ...prev,
                          [`${material.id}-material_name`]: e.target.value
                        }))}
                        onBlur={() => handleEditSave(material.id, 'material_name')}
                        onKeyPress={e => e.key === 'Enter' && handleEditSave(material.id, 'material_name')}
                        onKeyDown={e => e.key === 'Escape' && handleEditCancel(material.id, 'material_name')}
                        autoFocus
                      />
                    ) : material.material_name}
                  </TableCell>
                  <TableCell
                    isEditing={editMode[`${material.id}-material_amount`]}
                    onClick={() => isEditable() && handleEditStart(material.id, 'material_amount', material.material_amount)}
                  >
                    {editMode[`${material.id}-material_amount`] ? (
                      <Input
                        value={editedValues[`${material.id}-material_amount`] || ''}
                        onChange={e => setEditedValues(prev => ({
                          ...prev,
                          [`${material.id}-material_amount`]: e.target.value
                        }))}
                        onBlur={() => handleEditSave(material.id, 'material_amount')}
                        onKeyPress={e => e.key === 'Enter' && handleEditSave(material.id, 'material_amount')}
                        onKeyDown={e => e.key === 'Escape' && handleEditCancel(material.id, 'material_amount')}
                        autoFocus
                      />
                    ) : material.material_amount}
                  </TableCell>
                  <TableCell
                    isEditing={editMode[`${material.id}-material_note`]}
                    onClick={() => isEditable() && handleEditStart(material.id, 'material_note', material.material_note)}
                  >
                    {editMode[`${material.id}-material_note`] ? (
                      <Input
                        value={editedValues[`${material.id}-material_note`] || ''}
                        onChange={e => setEditedValues(prev => ({
                          ...prev,
                          [`${material.id}-material_note`]: e.target.value
                        }))}
                        onBlur={() => handleEditSave(material.id, 'material_note')}
                        onKeyPress={e => e.key === 'Enter' && handleEditSave(material.id, 'material_note')}
                        onKeyDown={e => e.key === 'Escape' && handleEditCancel(material.id, 'material_note')}
                        autoFocus
                      />
                    ) : material.material_note}

                  </TableCell>
                  <TableCell>
                    <DeleteButton
                      onClick={() => handleDeleteMaterial(material.id)}
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
                      value={editedValues[`new-material_name`] || ''}
                      onChange={e => setEditedValues(prev => ({
                        ...prev,
                        [`new-material_name`]: e.target.value
                      }))}
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      value={editedValues[`new-material_amount`] || ''}
                      onChange={e => setEditedValues(prev => ({
                        ...prev,
                        [`new-material_amount`]: e.target.value
                      }))}
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      value={editedValues[`new-material_note`] || ''}
                      onChange={e => setEditedValues(prev => ({
                        ...prev,
                        [`new-material_note`]: e.target.value
                      }))}
                    />
                  </TableCell>
                  <TableCell>
                      <SaveButton onClick={() => handleAddSave()}>저장</SaveButton>
                  </TableCell>
                </tr>
              )}

              <tr>
                <TableCell colSpan={7} style={{ backgroundColor: '#E8F5E9' }}>
                  <AddButton
                    onClick={handleAddMaterial}
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

export default RawMaterial;


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
