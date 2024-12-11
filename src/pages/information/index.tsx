import React from "react";
import { useNavigate, useLocation, Routes, Route, Navigate } from "react-router-dom";
import styled from 'styled-components';
import Product from "./components/Product";
import Client from "./components/Client";
import ProcessList from "./components/ProcessList";
import ProcessManagement from "./components/ProcessManagement";
import Equipment from "./components/Equipment";

const Information = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const tabs = [
    { 
      name: '제품 정보', 
      path: '/information/product',
      component: Product 
    },
    { 
      name: '거래처 정보', 
      path: '/information/client',
      component: Client 
    },
    { 
      name: '공정 목록', 
      path: '/information/process-list',
      component: ProcessList 
    },
    { 
      name: '공정 관리', 
      path: '/information/process-management',
      component: ProcessManagement 
    },
    { 
      name: '설비 목록', 
      path: '/information/equipment',
      component: Equipment 
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
              path={tab.path.replace('/information', '')}
              element={<tab.component />}
            />
          ))}
          <Route
            path="*"
            element={<Navigate to="/information/product" replace />}
          />
        </Routes>
      </ContentContainer>
    </Container>
  );
};

export default Information;

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

interface TabProps {
  isActive: boolean;
}

const Tab = styled.div<TabProps>`
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