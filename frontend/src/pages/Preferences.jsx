import { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../context/AuthContext'
import './Preferences.css'

function Preferences() {
  const { user } = useContext(AuthContext)
  const [activities, setActivities] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // TODO: Implementar chamada à API para buscar histórico
    const mockData = [
      {
        id: 1,
        type: 'login',
        date: '2025-03-16T22:00:00',
        description: 'Login realizado com sucesso'
      },
      {
        id: 2,
        type: 'password_change',
        date: '2025-03-15T10:30:00',
        description: 'Senha alterada com sucesso'
      },
      {
        id: 3,
        type: 'profile_update',
        date: '2025-03-14T15:45:00',
        description: 'Dados pessoais atualizados'
      }
    ]
    
    setActivities(mockData)
    setLoading(false)
  }, [])

  return (
    <div className="preferences-container">
      <h1>Preferências</h1>
      
      <div className="activity-history">
        <h2>Histórico de Atividades</h2>
        
        {loading ? (
          <p>Carregando histórico...</p>
        ) : (
          <ul className="activity-list">
            {activities.map(activity => (
              <li key={activity.id} className="activity-item">
                <div className="activity-icon">
                  {activity.type === 'login' && '🔑'}
                  {activity.type === 'password_change' && '🔒'}
                  {activity.type === 'profile_update' && '📝'}
                </div>
                <div className="activity-content">
                  <p className="activity-description">
                    {activity.description}
                  </p>
                  <p className="activity-date">
                    {new Date(activity.date).toLocaleString()}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

export default Preferences
