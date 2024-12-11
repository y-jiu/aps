import React from 'react';
import styled from 'styled-components';
import { useNavigate, useLocation, Routes, Route, Navigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import DoughnutChart from './components/DoughnutChart';
import LineChart from './components/LineChart';
import PerformanceMonitoring from './components/PerformanceMonitoring';
import EquipmentMonitoring from './components/EquipmentMonitoring';

const Monitoring = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  const tabs = [
    {
      name: t('monitoring.performanceMonitoring'),
      path: '/monitoring/performance',
      component: PerformanceMonitoring
    },
    {
      name: t('monitoring.equipmentMonitoring'),
      path: '/monitoring/equipment',
      component: EquipmentMonitoring
    },
    {
      name: t('monitoring.kpiMonitoring'),
      path: '/monitoring/kpi',
      component: () => (
        <div>
          <DoughnutChart title="Monthly Usage" type="monthly" />
          <LineChart title="Monthly Trend" type="monthly" />
        </div>
      )
    }
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
              path={tab.path.replace('/monitoring', '')}
              element={<tab.component />}
            />
          ))}
          <Route
            path="*"
            element={<Navigate to="/monitoring/performance" replace />}
          />
        </Routes>
      </ContentContainer>
    </Container>
  );
};

export default Monitoring;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
`;

const TabContainer = styled.div`
  display: flex;
  border-bottom: 1px solid #e0e0e0;
  padding: 0 20px;
`;

const Tab = styled.div<{ isActive: boolean }>`
  padding: 16px 24px;
  cursor: pointer;
  font-weight: ${props => props.isActive ? '600' : '400'};
  color: ${props => props.isActive ? '#00CCC0' : '#666'};
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