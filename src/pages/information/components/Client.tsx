import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';
import { getCompanyList, createCompany, updateCompany, deleteCompany } from '../../../modules/information';
import { ThunkDispatch } from 'redux-thunk';
import { AnyAction } from 'redux';

// import { receiveCompanyList } from '../../../modules/information';

// import { useAuth } from '../../../hooks/useAuth';
import { 
  addFacility,
  deleteFacility,
  updateFacility,
  setLoading,
  setError
} from '../../../modules/plan';

interface FacilityListProps {
  selectedPlanBomState: string;
}

interface Facility {
  id: string;
  name: string;
  note: string;
}

const Client = () => {
  const dispatch = useDispatch<ThunkDispatch<any, any, AnyAction>>();
  // const { role } = useAuth();
  const [isTableVisible, setIsTableVisible] = useState(true);
  const [editMode, setEditMode] = useState<Record<string, boolean>>({});
  const [editedValues, setEditedValues] = useState<Record<string, string>>({});
  const [addMode, setAddMode] = useState(false);

  // mock data of facilities
  const facilities = [
    { id: '1', company_name: 'Facility 1', company_note: 'Note 1', company_number: '123-456-7890', company_telephone: '123-456-7890', company_address: '123 Main St, Anytown, USA', company_email: 'facility1@example.com' },
    { id: '2', company_name: 'Facility 2', company_note: 'Note 2', company_number: '123-456-7890', company_telephone: '123-456-7890', company_address: '123 Main St, Anytown, USA', company_email: 'facility2@example.com' }
  ];

  const selectedPlanId = useSelector((state: any) => state.plan.selectedPlanId);
  const companyList = useSelector((state: any) => state.information.companyList);

  useEffect(() => {
    dispatch(getCompanyList());
  }, []);

  useEffect(() => {
    setEditMode({});
    setEditedValues({});
    setAddMode(false);
  }, [companyList]);

  
  const isEditable = () => {
    return true;
  };

  const handleAddFacility = async () => {
    setAddMode(true);
  };

  const handleDeleteFacility = async (facilityId: string) => {
    if (!window.confirm('정말로 삭제하시겠습니까?')) return;

    try {
      await dispatch(deleteCompany(Number(facilityId)));
    } catch (error) {
      console.error('Failed to delete company:', error);
    }
  };

  const handleEditStart = (companyId: string, field: string, value: string) => {
    setEditMode(prev => ({ ...prev, [`${companyId}-${field}`]: true }));
    setEditedValues(prev => ({ ...prev, [`${companyId}-${field}`]: value }));
  };

  const handleEditSave = async (companyId: string, field: string) => {
    const newValue: any = {
      company_name: '',
      company_number: '',
      company_telephone: '',
      company_address: '',
      company_email: '',
      company_note: ''
    };

    // Get existing values from companyList
    const company = companyList.find((c: any) => c.id === companyId);
    if (company) {
      Object.keys(newValue).forEach(key => {
        newValue[key] = company[key];
      });
    }

    // Update with edited values
    for (const key in editedValues) {
      if (key.includes(companyId)) {
        newValue[key.split('-')[1]] = editedValues[key];
      }
    }
    
    try {
      await dispatch(updateCompany(Number(companyId), newValue));
      setEditMode(prev => ({ ...prev, [`${companyId}-${field}`]: false }));
    } catch (error) {
      console.error('Failed to update company:', error);
    }
  };

  const handleEditCancel = (facilityId: string, field: string) => {
    setEditMode(prev => ({ ...prev, [`${facilityId}-${field}`]: false }));
    setEditedValues(prev => ({ ...prev, [`${facilityId}-${field}`]: '' }));
  };

  const handleAddSave = async () => {
    try {
      const newCompanyData = {
        company_name: editedValues['new-company_name'],
        company_number: editedValues['new-company_number'],
        company_telephone: editedValues['new-company_telephone'],
        company_address: editedValues['new-company_address'],
        company_email: editedValues['new-company_email'],
        company_note: editedValues['new-company_note']
      };
      
      await dispatch(createCompany(newCompanyData));
      setAddMode(false);
      setEditedValues({});
    } catch (error) {
      console.error('Failed to create company:', error);
    }
  };

  return (
    <FacilityWrapper>
      <TableContainer>
        <Table>
          <thead>
            <tr>
              <TableHeader 
                colSpan={7}
                onClick={() => setIsTableVisible(!isTableVisible)}
              >
                거래처 목록
                {/* Add icon based on visibility state */}
              </TableHeader>
            </tr>
          </thead>
          {isTableVisible && (
            <tbody>
              <tr>
                <TableHeaderCell>거래처명</TableHeaderCell>
                <TableHeaderCell>법인 번호</TableHeaderCell>
                <TableHeaderCell>전화번호</TableHeaderCell>
                <TableHeaderCell>주소</TableHeaderCell>
                <TableHeaderCell>이메일</TableHeaderCell>
                <TableHeaderCell>비고</TableHeaderCell>
                <TableHeaderCell>삭제</TableHeaderCell>
              </tr>
              {companyList.map((company: any) => (
                <tr key={company.id}>
                  <TableCell 
                    isEditing={editMode[`${company.id}-company_name`]}
                    onClick={() => isEditable() && handleEditStart(company.id, 'company_name', company.company_name)}
                  >
                    {editMode[`${company.id}-company_name`] ? (
                      <Input
                        value={editedValues[`${company.id}-company_name`] || ''}
                        onChange={e => setEditedValues(prev => ({
                          ...prev,
                          [`${company.id}-company_name`]: e.target.value
                        }))}
                        onBlur={() => handleEditSave(company.id, 'company_name')}
                        onKeyPress={e => e.key === 'Enter' && handleEditSave(company.id, 'company_name')}
                        onKeyDown={e => e.key === 'Escape' && handleEditCancel(company.id, 'company_name')}
                        autoFocus
                      />
                    ) : company.company_name}
                  </TableCell>
                  <TableCell
                    isEditing={editMode[`${company.id}-company_number`]}
                    onClick={() => isEditable() && handleEditStart(company.id, 'company_number', company.company_number)}
                  >
                    {editMode[`${company.id}-company_number`] ? (
                      <Input
                        value={editedValues[`${company.id}-company_number`] || ''}
                        onChange={e => setEditedValues(prev => ({
                          ...prev,
                          [`${company.id}-company_number`]: e.target.value
                        }))}
                        onBlur={() => handleEditSave(company.id, 'company_number')}
                        onKeyPress={e => e.key === 'Enter' && handleEditSave(company.id, 'company_number')}
                        onKeyDown={e => e.key === 'Escape' && handleEditCancel(company.id, 'company_number')}
                        autoFocus
                      />
                    ) : company.company_number}
                  </TableCell>
                  <TableCell
                    isEditing={editMode[`${company.id}-company_telephone`]}
                    onClick={() => isEditable() && handleEditStart(company.id, 'company_telephone', company.company_telephone)}
                  >
                    {editMode[`${company.id}-company_telephone`] ? (
                      <Input
                        value={editedValues[`${company.id}-company_telephone`] || ''}
                        onChange={e => setEditedValues(prev => ({
                          ...prev,
                          [`${company.id}-company_telephone`]: e.target.value
                        }))}
                        onBlur={() => handleEditSave(company.id, 'company_telephone')}
                        onKeyPress={e => e.key === 'Enter' && handleEditSave(company.id, 'company_telephone')}
                        onKeyDown={e => e.key === 'Escape' && handleEditCancel(company.id, 'company_telephone')}
                        autoFocus
                      />
                    ) : company.company_telephone}

                  </TableCell>
                  <TableCell
                    isEditing={editMode[`${company.id}-company_address`]}
                    onClick={() => isEditable() && handleEditStart(company.id, 'company_address', company.company_address)}
                  >
                    {editMode[`${company.id}-company_address`] ? (
                      <Input
                        value={editedValues[`${company.id}-company_address`] || ''}
                        onChange={e => setEditedValues(prev => ({
                          ...prev,
                          [`${company.id}-company_address`]: e.target.value
                        }))}
                      onBlur={() => handleEditSave(company.id, 'company_address')}
                      onKeyPress={e => e.key === 'Enter' && handleEditSave(company.id, 'company_address')}
                      onKeyDown={e => e.key === 'Escape' && handleEditCancel(company.id, 'company_address')}
                      autoFocus
                      />
                    ) : company.company_address}
                  </TableCell>
                  <TableCell
                    isEditing={editMode[`${company.id}-company_email`]}
                    onClick={() => isEditable() && handleEditStart(company.id, 'company_email', company.company_email)}
                  >
                    {editMode[`${company.id}-company_email`] ? (
                      <Input
                        value={editedValues[`${company.id}-company_email`] || ''}
                        onChange={e => setEditedValues(prev => ({
                          ...prev,
                          [`${company.id}-company_email`]: e.target.value
                        }))}
                        onBlur={() => handleEditSave(company.id, 'company_email')}
                        onKeyPress={e => e.key === 'Enter' && handleEditSave(company.id, 'company_email')}
                        onKeyDown={e => e.key === 'Escape' && handleEditCancel(company.id, 'company_email')}
                        autoFocus
                      />
                    ) : company.company_email}
                  </TableCell>
                  <TableCell 
                    isEditing={editMode[`${company.id}-company_note`]}
                    onClick={() => isEditable() && handleEditStart(company.id, 'company_note', company.company_note)}
                  >
                    {editMode[`${company.id}-company_note`] ? (
                      <>
                        <Input
                          value={editedValues[`${company.id}-company_note`] || ''}
                          onChange={e => setEditedValues(prev => ({
                            ...prev,
                            [`${company.id}-company_note`]: e.target.value
                          }))}
                          onBlur={() => handleEditSave(company.id, 'company_note')}
                          onKeyPress={e => e.key === 'Enter' && handleEditSave(company.id, 'company_note')}
                          onKeyDown={e => e.key === 'Escape' && handleEditCancel(company.id, 'company_note')}
                          autoFocus
                        />
                        <ActionCell>
                          <SaveButton onClick={() => handleEditSave(company.id, 'company_note')}>저장</SaveButton>
                          <CancelButton onClick={() => handleEditCancel(company.id, 'company_note')}>취소</CancelButton>
                        </ActionCell>
                      </>
                    ) : company.company_note}
                  </TableCell>
                  <TableCell>
                    <DeleteButton
                      onClick={() => handleDeleteFacility(company.id)}
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
                      value={editedValues[`new-company_name`] || ''}
                      onChange={e => setEditedValues(prev => ({
                        ...prev,
                        [`new-company_name`]: e.target.value
                      }))}
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      value={editedValues[`new-company_number`] || ''}
                      onChange={e => setEditedValues(prev => ({
                        ...prev,
                        [`new-company_number`]: e.target.value
                      }))}
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      value={editedValues[`new-company_telephone`] || ''}
                      onChange={e => setEditedValues(prev => ({
                        ...prev,
                        [`new-company_telephone`]: e.target.value
                      }))}
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      value={editedValues[`new-company_address`] || ''}
                      onChange={e => setEditedValues(prev => ({
                        ...prev,
                        [`new-company_address`]: e.target.value
                      }))}
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      value={editedValues[`new-company_email`] || ''}
                      onChange={e => setEditedValues(prev => ({
                        ...prev,
                        [`new-company_email`]: e.target.value
                      }))}
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      value={editedValues[`new-company_note`] || ''}
                      onChange={e => setEditedValues(prev => ({
                        ...prev,
                        [`new-company_note`]: e.target.value
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

export default Client;


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
