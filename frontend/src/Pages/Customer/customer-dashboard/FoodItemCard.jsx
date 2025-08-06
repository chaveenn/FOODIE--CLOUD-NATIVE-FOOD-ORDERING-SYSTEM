import React, { useState } from 'react';
import { Plus, Minus, ShoppingCart, Star, Award } from 'lucide-react';
import './Dashboard.css';


const FoodItemCard = ({ item, onAddToCart }) => {
  const [quantity, setQuantity] = useState(1);
  const [showQuantitySelector, setShowQuantitySelector] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);

  const handleAddClick = () => {
    setShowQuantitySelector(true);
  };

  const handleQuantityChange = (amount) => {
    const newQuantity = Math.max(1, quantity + amount);
    setQuantity(newQuantity);
  };

  const handleAddToCart = () => {
    onAddToCart(item, quantity);
    setAddedToCart(true);
    setShowQuantitySelector(false);
    
    // Reset UI after animation
    setTimeout(() => {
      setAddedToCart(false);
      setQuantity(1);
    }, 2000);
  };

  return (
    <div className="food-item-card">
      <div className="food-item-image">
        {item.images && item.images.length > 0 ? (
          <img src={item.images[0].url} alt={item.name} />
        ) : (
          <div className="no-image">No Image</div>
        )}
        {item.isPopular && (
          <div className="popular-badge">
            <Award size={14} />
            <span>Popular</span>
          </div>
        )}
        {item.isVegetarian && (
          <div className="veg-badge">
            <span>Veg</span>
          </div>
        )}
      </div>
      
      <div className="food-item-content">
        <h3 className="food-item-name">{item.name}</h3>
        <p className="food-item-description">{item.description}</p>
        
        <div className="food-item-footer">
          <span className="food-item-price">${item.price.toFixed(2)}</span>
          
          {!showQuantitySelector ? (
            <button 
              className={`add-to-cart-btn ${addedToCart ? 'added' : ''}`}
              onClick={handleAddClick}
              disabled={addedToCart}
            >
              {addedToCart ? (
                <>
                  <span className="added-text">Added</span>
                  <ShoppingCart size={16} />
                </>
              ) : (
                <>
                  <span>Add</span>
                  <Plus size={16} />
                </>
              )}
            </button>
          ) : (
            <div className="quantity-selector">
              <button 
                className="quantity-btn decrease"
                onClick={() => handleQuantityChange(-1)}
                disabled={quantity <= 1}
              >
                <Minus size={16} />
              </button>
              
              <span className="quantity">{quantity}</span>
              
              <button 
                className="quantity-btn increase"
                onClick={() => handleQuantityChange(1)}
              >
                <Plus size={16} />
              </button>
              
              <button 
                className="add-btn"
                onClick={handleAddToCart}
              >
                Add
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FoodItemCard;