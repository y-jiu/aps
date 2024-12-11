import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const RouteToInformation: React.FC = () => {
  const navigate = useNavigate()

  useEffect(() => {
    navigate('/information')
  }, [])

  return <></>
}

export default RouteToInformation
