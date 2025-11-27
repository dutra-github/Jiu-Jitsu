import { NavLink } from 'react-router-dom'
import { useState } from 'react'
import './Sidebar.css'

function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [openSubmenus, setOpenSubmenus] = useState({})

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed)
    // Fechar todos os submenus quando recolher
    if (!isCollapsed) {
      setOpenSubmenus({})
    }
  }

  const toggleSubmenu = (menu) => {
    if (!isCollapsed) {
      setOpenSubmenus(prev => ({
        ...prev,
        [menu]: !prev[menu]
      }))
    }
  }

  return (
    <aside className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        <h2>
          <i className="fas fa-fist-raised"></i> 
          {!isCollapsed && <span>Jiu-Jitsu</span>}
        </h2>
        <button className="collapse-toggle" onClick={toggleSidebar} title={isCollapsed ? 'Expandir menu' : 'Recolher menu'}>
          <i className={`fas fa-${isCollapsed ? 'angle-double-right' : 'angle-double-left'}`}></i>
        </button>
      </div>

      <nav>
        <ul className="sidebar-menu">
          {/* VISÃO GERAL */}
          <li className="menu-section">
            <span>VISÃO GERAL</span>
          </li>
          <li>
            <NavLink to="/dashboard" className={({ isActive }) => 
              isActive ? 'active' : ''
            } title="Dashboard">
              <i className="fas fa-chart-pie"></i>
              {!isCollapsed && <span>Dashboard</span>}
            </NavLink>
          </li>
          <li>
            <NavLink to="/indicadores" className={({ isActive }) => 
              isActive ? 'active' : ''
            } title="Analytics BI">
              <i className="fas fa-chart-line"></i>
              {!isCollapsed && <span>Analytics BI</span>}
              {!isCollapsed && <span className="badge">AI</span>}
            </NavLink>
          </li>
          
          {/* GESTÃO DE ALUNOS */}
          <li className="menu-section">
            <span>GESTÃO DE ALUNOS</span>
          </li>
          {!isCollapsed ? (
            <li className="menu-item">
              <div 
                className="menu-header" 
                onClick={() => toggleSubmenu('alunos')}
              >
                <i className="fas fa-users"></i>
                <span>Alunos</span>
                <i className={`fas fa-chevron-${openSubmenus.alunos ? 'down' : 'right'}`}></i>
              </div>
              <ul className={`submenu ${openSubmenus.alunos ? 'open' : ''}`}>
                <li>
                  <NavLink to="/alunos/lista">
                    <i className="fas fa-list"></i> Lista Completa
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/alunos/novo">
                    <i className="fas fa-user-plus"></i> Novo Aluno
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/alunos/graduacoes">
                    <i className="fas fa-medal"></i> Graduações
                  </NavLink>
                </li>
              </ul>
            </li>
          ) : (
            <li>
              <NavLink to="/alunos/lista" title="Alunos">
                <i className="fas fa-users"></i>
              </NavLink>
            </li>
          )}
          
          {/* AULAS E TREINOS */}
          <li className="menu-section">
            <span>AULAS & TREINOS</span>
          </li>
          <li>
            <NavLink to="/grade-aulas" className={({ isActive }) => 
              isActive ? 'active' : ''
            } title="Grade de Aulas">
              <i className="fas fa-calendar-week"></i>
              {!isCollapsed && <span>Grade de Aulas</span>}
            </NavLink>
          </li>
          <li>
            <NavLink to="/agenda" className={({ isActive }) => 
              isActive ? 'active' : ''
            } title="Presença">
              <i className="fas fa-calendar-check"></i>
              {!isCollapsed && <span>Presença</span>}
            </NavLink>
          </li>
          <li>
            <NavLink to="/exames" className={({ isActive }) => 
              isActive ? 'active' : ''
            } title="Exames">
              <i className="fas fa-graduation-cap"></i>
              {!isCollapsed && <span>Exames</span>}
            </NavLink>
          </li>
          
          {/* GESTÃO DE PROFESSORES */}
          <li className="menu-section">
            <span>PROFESSORES</span>
          </li>
          {!isCollapsed ? (
            <li className="menu-item">
              <div 
                className="menu-header" 
                onClick={() => toggleSubmenu('professores')}
              >
                <i className="fas fa-chalkboard-teacher"></i>
                <span>Gestão de Professores</span>
                <i className={`fas fa-chevron-${openSubmenus.professores ? 'down' : 'right'}`}></i>
              </div>
              <ul className={`submenu ${openSubmenus.professores ? 'open' : ''}`}>
                <li>
                  <NavLink to="/professores/lista">
                    <i className="fas fa-list"></i> Lista Completa
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/professores/novo">
                    <i className="fas fa-user-plus"></i> Novo Professor
                  </NavLink>
                </li>
              </ul>
            </li>
          ) : (
            <li>
              <NavLink to="/professores/lista" title="Professores">
                <i className="fas fa-chalkboard-teacher"></i>
              </NavLink>
            </li>
          )}
          
          {/* CONFIGURAÇÕES */}
          <li className="menu-section">
            <span>CONFIGURAÇÕES</span>
          </li>
          {!isCollapsed ? (
            <li className="menu-item">
              <div 
                className="menu-header" 
                onClick={() => toggleSubmenu('configuracoes')}
              >
                <i className="fas fa-cog"></i>
                <span>Configurações</span>
                <i className={`fas fa-chevron-${openSubmenus.configuracoes ? 'down' : 'right'}`}></i>
              </div>
              <ul className={`submenu ${openSubmenus.configuracoes ? 'open' : ''}`}>
                <li>
                  <NavLink to="/configuracoes/tipos-aulas">
                    <i className="fas fa-list-ul"></i> Tipos de Aulas
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/configuracoes/artes-marciais">
                    <i className="fas fa-fist-raised"></i> Artes Marciais
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/configuracoes/usuarios">
                    <i className="fas fa-users-cog"></i> Gestão de Usuários
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/configuracoes/niveis-acesso">
                    <i className="fas fa-shield-alt"></i> Níveis de Acesso
                  </NavLink>
                </li>
              </ul>
            </li>
          ) : (
            <li>
              <NavLink to="/configuracoes/tipos-aulas" title="Configurações">
                <i className="fas fa-cog"></i>
              </NavLink>
            </li>
          )}
          
          {/* FINANCEIRO */}
          <li className="menu-section">
            <span>FINANCEIRO</span>
          </li>
          {!isCollapsed ? (
            <li className="menu-item">
              <div 
                className="menu-header" 
                onClick={() => toggleSubmenu('financeiro')}
              >
                <i className="fas fa-dollar-sign"></i>
                <span>Gestão Financeira</span>
                <i className={`fas fa-chevron-${openSubmenus.financeiro ? 'down' : 'right'}`}></i>
              </div>
              <ul className={`submenu ${openSubmenus.financeiro ? 'open' : ''}`}>
                <li>
                  <NavLink to="/mensalidades">
                    <i className="fas fa-money-bill-wave"></i> Mensalidades
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/financeiro">
                    <i className="fas fa-chart-bar"></i> Relatórios
                  </NavLink>
                </li>
              </ul>
            </li>
          ) : (
            <li>
              <NavLink to="/financeiro" title="Financeiro">
                <i className="fas fa-dollar-sign"></i>
              </NavLink>
            </li>
          )}
        </ul>
      </nav>
    </aside>
  )
}

export default Sidebar
