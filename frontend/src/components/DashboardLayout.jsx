import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import './DashboardLayout.css';
import './FixLayout.css'; // Arquivo de correção de estilos

const DashboardLayout = () => {
  return (
    <div className="dashboard-layout">
      <Sidebar />
      <div className="main-content">
        <Header />
        <div className="content-wrapper dashboard-container">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
