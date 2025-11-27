import { NavLink } from 'react-router-dom'
import { useState } from 'react'
import './Sidebar.css'

function Sidebar() {
  const [isOpen, setIsOpen] = useState(false)
  const [openSubmenus, setOpenSubmenus] = useState({})

  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }

  const toggleSubmenu = (menu) => {
    setOpenSubmenus(prev => ({
      ...prev,
      [menu]: !prev[menu]
    }))
  }

  return (
    <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
      <button className="menu-toggle" onClick={toggleMenu}>
        <i className={`fas fa-${isOpen ? 'times' : 'bars'}`}></i>
      </button>
      
      <nav>
        <ul className="sidebar-menu">
          <li>
            <NavLink to="/dashboard" className={({ isActive }) => 
              isActive ? 'active' : ''
            }>
              <i className="fas fa-tachometer-alt"></i>
              <span>Painel</span>
            </NavLink>
          </li>
          
          <li className="menu-item">
            <div 
              className="menu-header" 
              onClick={() => toggleSubmenu('alunos')}
            >
              <i className="fas fa-users"></i>
              <span>Alunos</span>
              <i 
                className={`fas fa-chevron-${openSubmenus.alunos ? 'up' : 'down'}`}
                style={{
                  transform: openSubmenus.alunos ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.3s ease'
                }}
              ></i>
            </div>
            <ul className={`submenu ${openSubmenus.alunos ? 'open' : ''}`}>
              <li>
                <NavLink to="/alunos/lista">
                  Lista de Alunos
                </NavLink>
              </li>
              <li>
                <NavLink to="/alunos/novo">
                  Cadastrar Aluno
                </NavLink>
              </li>
              <li>
                <NavLink to="/alunos/graduacoes">
                  Graduações
                </NavLink>
              </li>
            </ul>
          </li>
          
          <li>
            <NavLink to="/aulas" className={({ isActive }) => 
              isActive ? 'active' : ''
            }>
              <i className="fas fa-calendar-alt"></i>
              <span>Grade de Aulas</span>
            </NavLink>
          </li>
          
          <li>
            <NavLink to="/agenda" className={({ isActive }) => 
              isActive ? 'active' : ''
            }>
              <i className="fas fa-clipboard-list"></i>
              <span>Agenda Semanal</span>
            </NavLink>
          </li>
          
          <li>
            <NavLink to="/exames" className={({ isActive }) => 
              isActive ? 'active' : ''
            }>
              <i className="fas fa-file-alt"></i>
              <span>Exames</span>
            </NavLink>
          </li>
          
          <li className="menu-item">
            <div 
              className="menu-header" 
              onClick={() => toggleSubmenu('financeiro')}
            >
              <i className="fas fa-coins"></i>
              <span>Financeiro</span>
              <i 
                className={`fas fa-chevron-${openSubmenus.financeiro ? 'up' : 'down'}`}
                style={{
                  transform: openSubmenus.financeiro ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.3s ease'
                }}
              ></i>
            </div>
            <ul className={`submenu ${openSubmenus.financeiro ? 'open' : ''}`}>
              <li>
                <NavLink to="/financeiro/mensalidades">
                  Mensalidades
                </NavLink>
              </li>
              <li>
                <NavLink to="/financeiro/planos">
                  Planos
                </NavLink>
              </li>
              <li>
                <NavLink to="/financeiro/relatorios">
                  Relatórios
                </NavLink>
              </li>
            </ul>
          </li>
          
          <li>
            <NavLink to="/indicadores" className={({ isActive }) => 
              isActive ? 'active' : ''
            }>
              <i className="fas fa-chart-line"></i>
              <span>Indicadores <i className="fas fa-robot" style={{ fontSize: '0.8em', color: '#1abc9c' }}></i></span>
            </NavLink>
          </li>
        </ul>
      </nav>
    </aside>
  )
}

export default Sidebar
