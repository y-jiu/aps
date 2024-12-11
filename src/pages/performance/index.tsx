import React, { useState } from "react";
import styled from "styled-components";
import { useNavigate, useLocation, Routes, Route, Navigate } from "react-router-dom";
import ProductionPerformance from "./components/productionPerformance";
import { useTranslation } from "react-i18next";
import ProductionHistory from "./components/productionHistory";

const Performance = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  const tabs = [
    { 
      name: t('performance.production'), 
      path: '/performance/production',
      component: ProductionPerformance 
    },
    { 
      name: t('performance.quality'), 
      path: '/performance/quality',
      component: () => <div>Quality</div> 
    },
    // 생산 이력 관리
    { 
      name: t('performance.productionHistory'), 
      path: '/performance/productionHistory',
      component: ProductionHistory 
    },
  ];

  const handleTabClick = (path: string) => {
    navigate(path);
  };

  return (
    <Container>
      <TabContainer>
        {tabs.map((tab) => (
          <Tab
            key={tab.path}
            isActive={location.pathname === tab.path}
            onClick={() => handleTabClick(tab.path)}
          >
            {tab.name}
          </Tab>
        ))}
      </TabContainer>
      <ContentContainer>
        <Routes>
          {tabs.map((tab) => (
            <Route
              key={tab.path}
              path={tab.path.replace('/performance', '')}
              element={<tab.component />}
            />
          ))}
          {/* Redirect to first tab by default */}
          <Route
            path="*"
            element={<Navigate to="/performance/production" replace />}
          />
        </Routes>
      </ContentContainer>
    </Container>
  );
};

export default Performance;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
`;

const TabContainer = styled.div`
  display: flex;
  border-bottom: 1px solid #e0e0e0;
  // background: white;
  padding: 0 20px;
`;

interface TabProps {
  isActive: boolean;
}

const Tab = styled.div<TabProps>`
  padding: 16px 24px;
  cursor: pointer;
  font-weight: ${props => props.isActive ? '600' : '400'};
  color: ${props => props.isActive ? '#00CCC0' : '#666'};
  // background-color: ${props => props.isActive ? 'white' : 'transparent'};
  border-bottom: 2px solid ${props => props.isActive ? '#00CCC0' : 'transparent'};
  transition: all 0.2s ease;

  &:hover {
    color: #00CCC0;
    background-color: ${props => props.isActive ? 'transparent' : '#f5f5f5'};
  }
`;

const ContentContainer = styled.div`
  flex: 1;
  padding: 20px;
  background-color: #f8f9fa;
  overflow-y: auto;
`;
