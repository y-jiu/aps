import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import ProcessList from './ProcessList';
import FacilityList from './FacilityList';
// import { useAuth } from '../../../hooks/useAuth';

const Table = styled.table`
  width: 360px;
`;

const TableHeader = styled.th`
  padding-bottom: 0.5rem;
`;

const HeaderText = styled.p`
  text-align: center;
  margin: 0.5rem 0;
  font-size: 13px;
  font-weight: 600;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
`;



const FileDownloadButton = styled.button`
  background-color: white;
  color: #FF4858;
  padding: 10px 20px;
  border: none;
  cursor: pointer;
  border-radius: 5px;
  margin-right: 10px;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
  &:hover {
    background-color: #FF4858;
    color: white;
  }
`;

const UpdateRowButton = styled.button`
  background-color: white;
  color: #747F7F;
  padding: 10px 20px;
  border: none;
  cursor: pointer;
  border-radius: 5px;
  margin-right: 10px;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
  &:hover {
    background-color: #747F7F;
    color: white;
  }
`;

const SaveButton = styled.button`
  background-color: white;
  color: #1B7F79;
  padding: 10px 20px;
  border: none;
  cursor: pointer;
  border-radius: 5px;
  margin-right: 10px;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
  &:hover {
    background-color: #1B7F79;
    color: white;
  }
`;
const ActionButton = styled.button<{ variant?: 'save' }>`
  font-size: 13px;
  padding: 5px 10px;
  border-radius: 5px;
  margin-right: 10px;
  box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.2);
  // margin-left: ${props => props.variant === 'save' ? '0.25rem' : '0'};
  // background-color: ${props => props.variant === 'save' ? '#1B7F79' : '#FF4858'};
  color: ${props => props.variant === 'save' ? '#1B7F79' : '#FF4858'};
  // border: 1px solid ${props => props.variant === 'save' ? '#1B7F79' : '#FF4858'};
  // border: 1px solid ${props => props.variant === 'save' ? '#1B7F79' : '#FF4858'};
  border: none;
  cursor: pointer;

  &:disabled {
    background-color: #eee;
    color: #aaa;
    cursor: default;
  }
    
  &:not(:disabled):hover {
    background-color: ${props => props.variant === 'save' ? '#1B7F79' : '#FF4858'};
    color: white;
  }

`;

const RadioGroup = styled.div`
  text-align: center;
  padding: 0.25rem 0;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const RadioLabel = styled.label`
  margin-right: 5px;
  font-size: 13px;
  color: #333;
  font-weight: 500;
`;

const RadioInput = styled.input`
  margin: 0 5px;
  &:first-of-type {
    margin-left: 0;
  }
  cursor: pointer;
`;

const BOM: React.FC = () => {
  const [planBomState, setPlanBomState] = useState('');
  const [bomData, setBomData] = useState([]);
  // const { role } = useAuth();

  const handleDeleteAll = async () => {
    if (window.confirm('정말로 삭제하시겠습니까?')) {
      // Implement delete logic
    }
  };

  const handleSave = async () => {
    // Implement save logic
  };

  const isDisabled = (action: 'delete' | 'save') => {
    if (action === 'delete') {
      return planBomState === '' || planBomState === 'Undone' || planBomState === 'Done';
    }
    return planBomState === '' || planBomState === 'Undone';
  };

  return (
    <div>
      <Table>
        <thead>
          <tr>
            <TableHeader colSpan={5}>
              <HeaderText>공정 관리</HeaderText>
              <ButtonContainer>
                <ActionButton 
                  onClick={handleDeleteAll}
                  disabled={isDisabled('delete')}
                >
                  전체삭제
                </ActionButton>
                <ActionButton 
                  variant="save"
                  onClick={handleSave}
                  disabled={isDisabled('save')}
                >
                  저장
                </ActionButton>
              </ButtonContainer>
            </TableHeader>
          </tr>
          <tr>
            <th colSpan={6}>
              <RadioGroup>
                <RadioInput
                  type="radio"
                  id="undone"
                  value="Undone"
                  name="bom"
                  checked={planBomState === 'Undone'}
                  onChange={e => setPlanBomState(e.target.value)}
                />
                <RadioLabel htmlFor="undone">미완</RadioLabel>

                <RadioInput
                  type="radio"
                  id="editting"
                  value="Editting"
                  name="bom"
                  checked={planBomState === 'Editting'}
                  onChange={e => setPlanBomState(e.target.value)}
                />
                <RadioLabel htmlFor="editting">작성중</RadioLabel>

                <RadioInput
                  type="radio"
                  id="done"
                  value="Done"
                  name="bom"
                  checked={planBomState === 'Done'}
                  onChange={e => setPlanBomState(e.target.value)}
                />
                <RadioLabel htmlFor="done">작성완료</RadioLabel>
              </RadioGroup>
            </th>
          </tr>
        </thead>
        {/* BOM data table body implementation */}
      </Table>

      <ProcessList selectedPlanBomState={planBomState} />
      <FacilityList selectedPlanBomState={planBomState} />
    </div>
  );
};

export default BOM;