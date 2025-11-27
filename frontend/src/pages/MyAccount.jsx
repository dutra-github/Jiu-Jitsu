import { useContext, useState } from 'react'
import { AuthContext } from '../context/AuthContext'
import './MyAccount.css'

function MyAccount() {
  const { user } = useContext(AuthContext)
  const [editMode, setEditMode] = useState(false)
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
    plan: user?.plan || 'Mensal'
  })

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // TODO: Implementar atualização dos dados
    setEditMode(false)
  }

  return (
    <div className="my-account-container">
      <h1>Minha Conta</h1>
      
      <div className="account-info">
        {!editMode ? (
          <>
            <div className="info-item">
              <label>Nome:</label>
              <p>{formData.name}</p>
            </div>
            
            <div className="info-item">
              <label>Email:</label>
              <p>{formData.email}</p>
            </div>
            
            <div className="info-item">
              <label>Telefone:</label>
              <p>{formData.phone || 'Não informado'}</p>
            </div>
            
            <div className="info-item">
              <label>Endereço:</label>
              <p>{formData.address || 'Não informado'}</p>
            </div>
            
            <div className="info-item">
              <label>Plano:</label>
              <p>{formData.plan}</p>
            </div>
            
            <button 
              className="edit-btn"
              onClick={() => setEditMode(true)}
            >
              Editar Dados
            </button>
          </>
        ) : (
          <form onSubmit={handleSubmit} className="edit-form">
            <div className="form-group">
              <label>Nome:</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label>Email:</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label>Telefone:</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>
            
            <div className="form-group">
              <label>Endereço:</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
              />
            </div>
            
            <div className="form-group">
              <label>Plano:</label>
              <select
                name="plan"
                value={formData.plan}
                onChange={handleChange}
              >
                <option value="Mensal">Mensal</option>
                <option value="Trimestral">Trimestral</option>
                <option value="Semestral">Semestral</option>
                <option value="Anual">Anual</option>
              </select>
            </div>
            
            <div className="form-actions">
              <button
                type="button"
                className="cancel-btn"
                onClick={() => setEditMode(false)}
              >
                Cancelar
              </button>
              <button type="submit" className="save-btn">
                Salvar Alterações
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

export default MyAccount
