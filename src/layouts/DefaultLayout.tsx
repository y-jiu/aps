import { Outlet, Navigate } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import styled from 'styled-components'

const DefaultLayout: React.FC = () => {
  // Add authentication check
  const isAuthenticated = localStorage.getItem('authToken') 

  if (!isAuthenticated) {
    console.log('not authenticated')
    return <Navigate to="/login" replace />
  }
  
  return (
    <Container>
      <Sidebar>
        <Outlet />
      </Sidebar>
    </Container>
  )
}

export default DefaultLayout

const Container = styled.div`
  display: flex;
  width: 100%;
  overflow-y: hidden;
`
