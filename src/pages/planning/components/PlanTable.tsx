import React, { useState } from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { ThunkDispatch } from 'redux-thunk';
import { AnyAction } from 'redux';
import dayjs from 'dayjs';
import { 
  setSelectedPlanId, 
  setSelectedPlanState, 
  setSelectedPlanBomState,
  getPlanList,
  planUpdateState 
} from '../../../modules/plan';
import { IAppState } from '../../../types';

const TableWrapper = styled.div`
  // display: flex;
  // flex-direction: row;
  flex-wrap: nowrap;
  width: 360px;
  overflow: auto;
  white-space: nowrap;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  line-height: 1;
`;

const TableRow = styled.tr<{ isSelected?: boolean }>`
  background-color: ${props => props.isSelected ? '#e6e6e6' : 'transparent'};
  cursor: pointer;
  height: 30px !important;
  max-height: 30px !important;
  line-height: 1 !important;
  padding: 0 !important;
  margin: 0 !important;
  
  &:hover {
    background-color: #f5f5f5;
  }
`;

const TableCell = styled.td<{ state?: string }>`
  padding: 0 5px !important;
  border: 1px solid #ddd;
  text-align: center;
  font-size: 11px;
  height: 30px !important;
  max-height: 30px !important;
  min-height: 30px !important;
  vertical-align: middle;
  line-height: 1 !important;
  box-sizing: border-box;
  margin: 0 !important;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  
  ${props => {
    switch (props.state) {
      case 'Undone':
        return 'background-color: #ffebee;';
      case 'Working':
        return 'background-color: #e3f2fd;';
      case 'Editting':
        return 'background-color: #fff3e0;';
      case 'Done':
        return 'background-color: #e8f5e9;';
      default:
        return '';
    }
  }}
`;

const TableHeader = styled.th`
  padding: 0.5rem;
  background-color: #f8f9fa;
  font-weight: 600;
  font-size: 13px;
  color: #495057;
  text-align: center;
  position: sticky;
  top: 0;
  z-index: 1;
`;

interface PlanData {
  id: string;
  state: string;
  company: string;
  product_name: string;
  product_unit: string;
  amount: string;
  bom_state: string;
  background_color: string;
  lot: string;
  madedate: string;
  material_amount: string;
}

interface PlanTableProps {
  onFindEvent: (event: any) => void;
}

// Add mock data
const mockPlanData: PlanData[] = [
  {
    id: '1',
    state: 'Working',
    company: '테스트 주식회사',
    product_name: '테스트 제품 A',
    product_unit: 'EA',
    amount: '100',
    bom_state: '완료',
    background_color: '',
    lot: 'LOT001',
    madedate: '20240320',
    material_amount: '500'
  },
  {
    id: '2',
    state: 'Done',
    company: '샘플 기업',
    product_name: '샘플 제품 B',
    product_unit: 'KG',
    amount: '50',
    bom_state: '대기',
    background_color: '',
    lot: 'LOT002',
    madedate: '20240321',
    material_amount: '250'
  },
  {
    id: '3',
    state: 'Pending',
    company: '제조산업 주식회사',
    product_name: '산업용 부품 C',
    product_unit: 'PCS',
    amount: '200',
    bom_state: '진행중',
    background_color: '',
    lot: 'LOT003', 
    madedate: '20240322',
    material_amount: '1000'
  },
  {
    id: '4',
    state: 'Working',
    company: '글로벌테크',
    product_name: '전자부품 D',
    product_unit: 'SET',
    amount: '75',
    bom_state: '완료',
    background_color: '',
    lot: 'LOT004',
    madedate: '20240323',
    material_amount: '300'
  },
  {
    id: '5',
    state: 'Done',
    company: '스마트솔루션',
    product_name: '센서모듈 E',
    product_unit: 'EA',
    amount: '150',
    bom_state: '완료',
    background_color: '',
    lot: 'LOT005',
    madedate: '20240324',
    material_amount: '750'
  }
];

const PlanTable: React.FC<PlanTableProps> = ({ onFindEvent }) => {
  const dispatch = useDispatch<ThunkDispatch<IAppState, unknown, AnyAction>>();
  const [selectedRow, setSelectedRow] = useState<string | null>(null);
  
  // Modify the useSelector to use mock data when Redux data is empty
  // const planData = useSelector((state: IAppState) => state.plan.planDatas) || mockPlanData;
  const planData = mockPlanData
  const day = useSelector((state: IAppState) => state.plan.day_planBOM);

  const handleRowClick = async (plan: PlanData) => {
    setSelectedRow(plan.id);
    dispatch(setSelectedPlanId(plan.id));
    dispatch(setSelectedPlanState(plan.state));
    dispatch(setSelectedPlanBomState(plan.bom_state));
    onFindEvent(plan);
  };

  const handleStateUpdate = async (index: number) => {
    const plan = planData[index];
    if (plan.state !== "Done") {
      await dispatch(planUpdateState({
        id: plan.id,
        state: plan.state
      }));
      
      // Refresh plan list
      const startDay = dayjs(day.startDay).format('YYYYMMDD');
      const endDay = dayjs(day.endDay).format('YYYYMMDD');
      dispatch(getPlanList({ 
        start: startDay, 
        end: endDay 
      }));
    }
  };

  return (
    <TableWrapper>
      <Table>
        <thead>
          <tr>
            <TableHeader>상태</TableHeader>
            <TableHeader>회사</TableHeader>
            <TableHeader>품명</TableHeader>
            <TableHeader>단위</TableHeader>
            <TableHeader>수량</TableHeader>
            <TableHeader>BOM상태</TableHeader>
          </tr>
        </thead>
        <tbody>
          {planData.map((plan: PlanData, index: number) => (
            <TableRow 
              key={plan.id}
              isSelected={selectedRow === plan.id}
              onClick={() => handleRowClick(plan)}
              onDoubleClick={() => handleStateUpdate(index)}
            >
              <TableCell state={plan.state}>{plan.state}</TableCell>
              <TableCell>{plan.company}</TableCell>
              <TableCell>{plan.product_name}</TableCell>
              <TableCell>{plan.product_unit}</TableCell>
              <TableCell>{plan.amount}</TableCell>
              <TableCell>{plan.bom_state}</TableCell>
            </TableRow>
          ))}
        </tbody>
      </Table>
    </TableWrapper>
  );
};

export default PlanTable;