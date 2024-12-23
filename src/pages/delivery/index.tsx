import { Route, Navigate, Routes, useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar'
import styled from 'styled-components'
import Product from './components/Product'
import SemiProduct from './components/SemiProduct'
import RawMaterial from './components/RawMaterial'

const Delivery = () => {
  const navigate = useNavigate();
  const location = useLocation();


  const handleTabClick = (path: string) => {
    navigate(path);
  };

  const tabs = [
    { 
      name: '완제품', 
      path: '/delivery/product',
      component: Product 
    },
    { 
      name: '반제품', 
      path: '/delivery/semi-product',
      component: SemiProduct 
    },
    { 
      name: '자재', 
      path: '/delivery/raw-material',
      component: RawMaterial 
    },
  ];
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
              path={tab.path.replace('/delivery', '')}
              element={<tab.component />}
            />
          ))}
          <Route
            path="*"
            element={<Navigate to="/delivery/product" replace />}
          />
        </Routes>
      </ContentContainer>
    </Container>
  );
}

export default Delivery

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