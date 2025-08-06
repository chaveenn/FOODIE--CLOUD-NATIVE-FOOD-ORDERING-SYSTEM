import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaBars, FaSignOutAlt, FaTimes } from 'react-icons/fa';
import './Header.css';

const Header = ({ toggleSidebar, sidebarOpen }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [pageTitle, setPageTitle] = useState('Overview');

  useEffect(() => {
    const pathSegments = location.pathname.split('/');
    const currentPath = pathSegments.length > 2 ? pathSegments[2] : 'overview';

    const formatTitle = (str) => {
      if (!str) return 'Overview';
      return str
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    };

    setPageTitle(formatTitle(currentPath));
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/merchants');
  };

  return (
    <header className="dashboard-header">
      <div className="header-left">
        <button 
          className="sidebar-toggle" 
          onClick={toggleSidebar}
          aria-label={sidebarOpen ? 'Close sidebar' : 'Open sidebar'}
        >
          {sidebarOpen ? <FaTimes /> : <FaBars />}
        </button>
        <h1 className="page-title">{pageTitle}</h1>
      </div>

      <div className="header-right">
        <button 
          className="logout-btn" 
          onClick={handleLogout}
          aria-label="Log out"
        >
          <FaSignOutAlt />
          <span className="logout-text">Logout</span>
        </button>
      </div>
    </header>
  );
};

export default Header;
