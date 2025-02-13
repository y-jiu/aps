import { Link, useLocation } from 'react-router-dom'
import styled from 'styled-components'
import { useTranslation } from 'react-i18next'
import { useState } from 'react'

const Sidebar: React.FC<{ children: React.ReactNode }>  = ({ children }) => {
  // @ts-ignore
  const { t, i18n } = useTranslation()
  const location = useLocation()

  const [language, setLanguage] = useState('ko')
  const [isCollapsed, setIsCollapsed] = useState(false)
  const navigation = [
    { name: t('sidebar.information'), href: '/information' },
    { name: t('sidebar.processManagement'), href: '/process-management' },
    { name: t('sidebar.sales'), href: '/sales' },
    { name: t('sidebar.delivery'), href: '/delivery' },
    { name: t('sidebar.planning'), href: '/planning' },
    { name: t('sidebar.performance'), href: '/performance' },
    { name: t('sidebar.monitoring'), href: '/monitoring' },
    { name: t('sidebar.system'), href: '/system' },
  ]

  const lang = {
    ko: '한국어',
    en: 'English',
  }

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLanguage(e.target.value)
    i18n.changeLanguage(e.target.value)
  }

  return (
    <SidebarContainer>
      <SidebarNav $isCollapsed={isCollapsed}>
        <ToggleButton onClick={() => setIsCollapsed(!isCollapsed)}>
          {isCollapsed ? '→' : '←'}
        </ToggleButton>
        {navigation.map((item) => (
          <SidebarNavItem key={item.name}>
            <SidebarNavLink 
              to={item.href} 
              className={location.pathname.startsWith(item.href) ? 'active' : ''}
              $isCollapsed={isCollapsed}
            >
              {!isCollapsed && item.name}
            </SidebarNavLink>
          </SidebarNavItem>
        ))}
        {!isCollapsed && (
          <SidebarNavItem>
            <LangSelect onChange={handleLanguageChange} value={language}>
              {Object.entries(lang).map(([key, value]: [string, string]) => (
                <option key={key} value={key}>{value}</option>
              ))}
            </LangSelect>
          </SidebarNavItem>
        )}
      </SidebarNav>
      <ChildrenContainer>
      {children}
      </ChildrenContainer>
    </SidebarContainer>
  )
}

export default Sidebar

const SidebarContainer = styled.div`
  display: flex;
  height: 100vh;
  width: 100%;
`

const SidebarNav = styled.ul<{ $isCollapsed: boolean }>`
  display: flex;
  flex-direction: column;
  background-color: #2c3e50;
  width: ${props => props.$isCollapsed ? '20px' : '200px'};
  margin: 0;
  padding: 20px 0;
  gap: 8px;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
  transition: width 0.3s ease;
  position: relative;
`

const SidebarNavItem = styled.li`
  list-style: none;
  padding: 0 20px;
`

const SidebarNavLink = styled(Link)<{ $isCollapsed: boolean }>`
  display: block;
  text-decoration: none;
  color: #ecf0f1;
  font-size: 14px;
  font-weight: 500;
  padding: 12px 16px;
  border-radius: 6px;
  transition: all 0.2s ease;
  text-align: ${props => props.$isCollapsed ? 'center' : 'left'};

  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
    color: #fff;
  }

  &.active {
    background-color: rgba(255, 255, 255, 0.2);
    color: #fff;
  }
`

const ChildrenContainer = styled.div`
  flex: 1;
  height: 100%;
  overflow-y: auto;
  padding: 24px;
  background-color: #f8f9fa;
`

const LangSelect = styled.select`
  width: 100%;
  padding: 8px 12px;
  border-radius: 6px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background-color: rgba(255, 255, 255, 0.1);
  color: #fff;
  font-size: 14px;
  cursor: pointer;
  margin-top: 16px;

  option {
    background-color: #2c3e50;
    color: #fff;
  }
`

const ToggleButton = styled.button`
  position: absolute;
  right: -12px;
  top: 20px;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: #2c3e50;
  border: none;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
  z-index: 1;

  &:hover {
    background-color: #34495e;
  }
`
  