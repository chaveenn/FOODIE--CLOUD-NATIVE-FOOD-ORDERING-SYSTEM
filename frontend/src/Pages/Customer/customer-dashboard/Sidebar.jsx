import React from 'react';
import { 
  Home,
  UtensilsCrossed,
  ShoppingBag,
  User,
  ChevronLeft,
  ChevronRight,
  LogOut,
  History
} from 'lucide-react';
import './Dashboard.css';
import logo from '../../../assets/FoodieLogo.png';

const Sidebar = ({ open, onToggle, setActiveView, activeView }) => {
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/';
  };

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const userName = user.name || 'Foodie';
  
  const menuItems = [
    { id: 'restaurants', label: 'Restaurants', icon: <Home size={20} /> },
    
    { id: 'orders', label: 'My Orders', icon: <ShoppingBag size={20} /> },
    
    { id: 'profile', label: 'My Profile', icon: <User size={20} /> },

    { id: 'order-history', label: 'Order History', icon: <History size={20} /> }

  ];

  return (
    <aside className={`client-sidebar ${open ? 'open' : 'closed'}`}>
      <div className="sidebar-header">
        <div className="logo-container">
          <UtensilsCrossed size={24} className="logo-icon" />
          {open && logo && <img src={logo} alt="Logo" className="logofoodie" />}
        </div>
        <button 
          className="toggle-sidebar" 
          onClick={onToggle}
          aria-label={open ? "Close sidebar" : "Open sidebar"}
        >
          {open ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
        </button>
      </div>

      {open && (
        <div className="user-profile">
          <div className="user-avatar">
            {userName.charAt(0).toUpperCase()}
          </div>
          <div className="user-info">
            <h3>{userName}</h3>
            <p>Foodie Member</p>
          </div>
        </div>
      )}

      <nav className="sidebar-nav">
        <ul>
          {menuItems.map(item => (
            <li 
              key={item.id}
              className={activeView === item.id ? 'active' : ''}
            >
              <button onClick={() => setActiveView(item.id)}>
                <span className="menu-icon">{item.icon}</span>
                {open && <span className="menu-label">{item.label}</span>}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <div className="sidebar-footer">
        <button onClick={handleLogout} className="logout-button">
          <LogOut size={20} />
          {open && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;