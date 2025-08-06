import React, { useState } from 'react';
import { X, Minus, Plus, ShoppingCart, Trash2, ExternalLink } from 'lucide-react';
import './Dashboard.css';
import axios from 'axios';

const Cart = ({ isOpen, onClose, items, onRemoveItem, onUpdateQuantity, onClearCart }) => {
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  
  // Calculate subtotal
  const subtotal = items.reduce((total, item) => {
    return total + (item.price * item.quantity);
  }, 0);
  
  const deliveryFee = subtotal > 0 ? 2.99 : 0;
  const tax = subtotal * 0.07; // 7% tax
  const total = subtotal + deliveryFee + tax;
  
  // Handle checkout
  const handleCheckout = async () => {
    setIsCheckingOut(true);
  
    try {
      const token = localStorage.getItem("token");
  
      if (!token) {
        alert("User not authenticated. Please Login again");
        setIsCheckingOut(false);
        return;
      }
  
      if (!items || items.length === 0) {
        alert("Cart is empty.");
        setIsCheckingOut(false);
        return;
      }
  
      
      const uniqueRestaurants = [...new Set(items.map(item => item.restaurantId))];
      if (uniqueRestaurants.length > 1) {
        alert("All items must be from the same restaurant to place an order.");
        setIsCheckingOut(false);
        return;
      }
  
      const restaurantId = uniqueRestaurants[0];
  
      const payload = {
        restaurantId,
        items: items.map(item => ({
          menuItemId: item._id,
          name: item.name,
          price: item.price,
          quantity: item.quantity
        })),
        totalAmount: (subtotal + deliveryFee + tax).toFixed(2)
      };
  
      await axios.post("http://localhost:8000/orders/create-order", payload, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
  
      alert("Continue to check out!");
      onClearCart();
      onClose();
    } catch (error) {
      console.error("Order failed:", error.response?.data || error.message);
      alert("Failed to place order.");
    } finally {
      setIsCheckingOut(false);
    }
  };
  
  
  // Prevent scrolling of background when cart is open
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);
  
  if (!isOpen) return null;
  
  return (
    <div className="cart-overlay" onClick={onClose}>
      <div className="cart-container" onClick={e => e.stopPropagation()}>
        <div className="cart-header">
          <div className="cart-title">
            <ShoppingCart size={24} />
            <h2>Your Cart</h2>
            <span className="item-count">{items.length} {items.length === 1 ? 'item' : 'items'}</span>
          </div>
          <button className="close-cart" onClick={onClose} aria-label="Close cart">
            <X size={24} />
          </button>
        </div>
        
        {items.length > 0 ? (
          <>
            <div className="cart-items">
              {items.map(item => (
                <div key={item._id} className="cart-item">
                  <div className="item-image">
                    {item.images && item.images.length > 0 ? (
                      <img src={item.images[0].url} alt={item.name} />
                    ) : (
                      <div className="placeholder-image">
                        <UtensilsCrossed size={24} />
                      </div>
                    )}
                  </div>
                  <div className="item-details">
                    <h3>{item.name}</h3>
                    <p className="item-price">${item.price.toFixed(2)}</p>
                  </div>
                  <div className="item-actions">
                    <div className="quantity-controls">
                      <button 
                        onClick={() => onUpdateQuantity(item._id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                        aria-label="Decrease quantity"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="quantity">{item.quantity}</span>
                      <button 
                        onClick={() => onUpdateQuantity(item._id, item.quantity + 1)}
                        aria-label="Increase quantity"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                    <button 
                      className="remove-item" 
                      onClick={() => onRemoveItem(item._id)}
                      aria-label="Remove item"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="cart-summary">
              <div className="summary-row">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="summary-row">
                <span>Delivery Fee</span>
                <span>${deliveryFee.toFixed(2)}</span>
              </div>
              <div className="summary-row">
                <span>Tax</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="summary-row total">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
            
            <div className="cart-footer">
              <button 
                className="clear-cart-btn"
                onClick={onClearCart}
                disabled={isCheckingOut}
              >
                Clear Cart
              </button>
              <button 
                className="checkout-btn"
                onClick={handleCheckout}
                disabled={isCheckingOut}
              >
                {isCheckingOut ? 'Processing...' : 'Checkout'}
                {!isCheckingOut && <ExternalLink size={16} />}
              </button>
            </div>
          </>
        ) : (
          <div className="empty-cart">
            <div className="empty-cart-icon">
              <ShoppingCart size={64} />
            </div>
            <h3>Your cart is empty</h3>
            <p>Add items from restaurants to get started</p>
            <button className="browse-btn" onClick={onClose}>
              Browse Restaurants
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// Add this to support the placeholder image
const UtensilsCrossed = ({ size }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <path d="m16 2-2.3 2.3a3 3 0 0 0 0 4.2l1.8 1.8a3 3 0 0 0 4.2 0L22 8" />
    <path d="M15 15 3.3 3.3a4.2 4.2 0 0 0 0 6l7.3 7.3c.7.7 2 .7 2.8 0L15 15Zm0 0 7 7" />
    <path d="m2.1 21.8 6.4-6.3" />
    <path d="m19 5-7 7" />
  </svg>
);

export default Cart;