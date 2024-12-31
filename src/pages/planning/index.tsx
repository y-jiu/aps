import React from 'react';
import styled from 'styled-components';
import DateHeader from './components/DateHeader';
import PlanTable from './components/PlanTable';
import BOM from './components/BOM';
import Gantt from './components/Gantt';
import { useSelector } from 'react-redux';
import { IAppState } from '../../types';
import ProcessManagement from './components/ProcessManagement';
import { ReactFlowProvider } from '@xyflow/react';


const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const DetailWrapper = styled.div`
  padding-top: 1rem;
  display: flex;
  justify-content: center;
  margin-bottom: 4rem;
`;

const ContentWrapper = styled.div<{ isExpanded: boolean }>`
  padding: ${props => props.isExpanded ? '0.5rem' : '0px'};
  margin-right: 0.5rem;
  border: 1px solid #ddd;
  width: ${props => props.isExpanded ? '500px' : '0px'};
`;

const FlexContainer = styled.div`
  display: flex;
  margin-top: 0.5rem;
  padding: 10px;
  justify-content: center;
`;

const BOMWrapper = styled.div`
  margin-left: 0.5rem;
`;

const Planning: React.FC = () => {
  const findEventHandler = (event: any) => {
    // Implement event handling logic
  };

  const eventAchievementUpdatedHandler = () => {
    // Implement achievement update logic
  };

  const isExpanded = useSelector((state: IAppState) => state.plan.isExpanded);

  return (
    <Container>
      <ReactFlowProvider>
        <ProcessManagement />
      </ReactFlowProvider>
      <DetailWrapper>
        <ContentWrapper isExpanded={isExpanded}>
          <DateHeader />

        {isExpanded && 
          <FlexContainer>
            <PlanTable onFindEvent={findEventHandler} />
            {/* <BOMWrapper>
              <BOM />
            </BOMWrapper> */}
          </FlexContainer>
        }
        </ContentWrapper>

          <Gantt onEventAchievementUpdated={eventAchievementUpdatedHandler} />
        </DetailWrapper>
    </Container>
  );
};

export default Planning;