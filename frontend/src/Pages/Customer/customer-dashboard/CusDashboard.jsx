import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import RestaurantList from './RestaurantList';
import MenuList from './MenuList';
import Cart from './Cart';
import Orders from './CusOrders';
import Profile from './CusProfile';
import OrderHistory from './CusOrderHistory';
import './Dashboard.css';

const ClientDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeView, setActiveView] = useState('restaurants');
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [cartCount, setCartCount] = useState(0);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  const toggleCart = () => {
    setCartOpen(!cartOpen);
  };

  const handleRestaurantSelect = (restaurant) => {
    setSelectedRestaurant(restaurant);
    setActiveView('menu');
  };

  const handleBackToRestaurants = () => {
    setActiveView('restaurants');
    setSelectedRestaurant(null);
  };

  const handleAddToCart = (item, quantity) => {
    // Check if item is already in cart
    const existingItemIndex = cartItems.findIndex(
      cartItem => cartItem._id === item._id
    );

    if (existingItemIndex > -1) {
      // Update existing item
      const updatedCartItems = [...cartItems];
      updatedCartItems[existingItemIndex].quantity += quantity;
      setCartItems(updatedCartItems);
    } else {
      // Add new item
      const newItem = {
        ...item,
        quantity: quantity
      };
      setCartItems([...cartItems, newItem]);
    }

    // Update cart count
    setCartCount(prevCount => prevCount + quantity);
    
    // Show cart briefly
    setCartOpen(true);
    setTimeout(() => {
      setCartOpen(false);
    }, 5000);
  };

  const handleRemoveFromCart = (itemId) => {
    const removedItem = cartItems.find(item => item._id === itemId);
    const removedQuantity = removedItem ? removedItem.quantity : 0;
    
    setCartItems(cartItems.filter(item => item._id !== itemId));
    setCartCount(prevCount => Math.max(0, prevCount - removedQuantity));
  };

  const handleUpdateCartItemQuantity = (itemId, newQuantity) => {
    const existingItem = cartItems.find(item => item._id === itemId);
    const oldQuantity = existingItem ? existingItem.quantity : 0;
    
    if (newQuantity <= 0) {
      handleRemoveFromCart(itemId);
      return;
    }
    
    setCartItems(cartItems.map(item => 
      item._id === itemId ? { ...item, quantity: newQuantity } : item
    ));
    
    setCartCount(prevCount => prevCount - oldQuantity + newQuantity);
  };

  const handleClearCart = () => {
    setCartItems([]);
    setCartCount(0);
  };

  return (
    <div className="dashboard-container">
      <Sidebar 
        open={sidebarOpen} 
        onToggle={toggleSidebar} 
        setActiveView={setActiveView}
        activeView={activeView}
      />
      <div className={`dashboard-main ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
        <Header 
          toggleSidebar={toggleSidebar} 
          sidebarOpen={sidebarOpen}
          cartCount={cartCount}
          toggleCart={toggleCart} 
        />
        <main className="dashboard-content">
          {activeView === 'restaurants' && (
            <RestaurantList onSelectRestaurant={handleRestaurantSelect} />
          )}
          
          {activeView === 'menu' && selectedRestaurant && (
            <MenuList 
              restaurant={selectedRestaurant} 
              onBackClick={handleBackToRestaurants}
              onAddToCart={handleAddToCart}
            />
          )}

          {activeView === 'orders' && (
            <Orders />
          )}

          {activeView === 'profile' && (
            <Profile />
          )}

          {activeView === 'order-history' && (
            <OrderHistory />
          )}
        </main>
        
        <Cart 
          isOpen={cartOpen} 
          onClose={() => setCartOpen(false)}
          items={cartItems}
          onRemoveItem={handleRemoveFromCart}
          onUpdateQuantity={handleUpdateCartItemQuantity}
          onClearCart={handleClearCart}
        />
      </div>
    </div>
  );
};

export default ClientDashboard;