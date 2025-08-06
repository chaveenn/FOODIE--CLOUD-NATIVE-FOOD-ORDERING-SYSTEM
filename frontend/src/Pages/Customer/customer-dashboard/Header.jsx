import React from 'react';
import { 
  Menu, 
  ShoppingCart,

} from 'lucide-react';
import './Dashboard.css';

const Header = ({ toggleSidebar, sidebarOpen, cartCount, toggleCart }) => {
  
  return (
    <header className="client-header">
      <div className="header-left">
        <button 
          className="menu-toggle" 
          onClick={toggleSidebar}
          aria-label={sidebarOpen ? "Close menu" : "Open menu"}
        >
          <Menu size={24} />
        </button>

        
      </div>

      <div className="header-right">
        <button 
          className="cart-btn" 
          onClick={toggleCart}
          aria-label="Shopping cart"
        >
          <ShoppingCart size={24} />
          {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
        </button>
      </div>
    </header>
  );
};

export default Header;