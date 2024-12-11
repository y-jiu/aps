import React from 'react';
import styled from 'styled-components';
import DateHeader from './components/DateHeader';
import PlanTable from './components/PlanTable';
import BOM from './components/BOM';
import Gantt from './components/Gantt';

const DetailWrapper = styled.div`
  padding-top: 1rem;
  display: flex;
  justify-content: center;
  margin-bottom: 4rem;
`;

const ContentWrapper = styled.div`
  padding: 0.5rem;
  margin-right: 0.5rem;
  border: 1px solid #ddd;
`;

const FlexContainer = styled.div`
  display: flex;
  margin-top: 0.5rem;
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

  return (
    <DetailWrapper>
      <ContentWrapper>
        <DateHeader />
        <FlexContainer>
          <PlanTable onFindEvent={findEventHandler} />
          <BOMWrapper>
            <BOM />
          </BOMWrapper>
        </FlexContainer>
      </ContentWrapper>

      <Gantt onEventAchievementUpdated={eventAchievementUpdatedHandler} />
    </DetailWrapper>
  );
};

export default Planning;