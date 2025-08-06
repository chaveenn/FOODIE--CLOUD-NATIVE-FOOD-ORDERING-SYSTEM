import React, { useState, useEffect } from 'react';
import { Star, Clock, MapPin, Search, X } from 'lucide-react';
import FoodItemCard from './FoodItemCard';
import axios from 'axios';
import './Dashboard.css';

const MenuList = ({ restaurant, onBackClick, onAddToCart }) => {
  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showInfo, setShowInfo] = useState(false);

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:8000/menus/menu/${restaurant._id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        });

        setMenuItems(response.data);
        const uniqueCategories = [...new Set(response.data.map(item => item.category))];
        setCategories(uniqueCategories);
      } catch (err) {
        console.error("Failed to load menu items:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMenuItems();
  }, []);

  const handleCategoryChange = (category) => {
    setActiveCategory(category);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredItems = menuItems.filter(item => {
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const groupedItems = filteredItems.reduce((acc, item) => {
    const category = activeCategory === 'all' ? item.category : activeCategory;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(item);
    return acc;
  }, {});

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading menu...</p>
      </div>
    );
  }

  return (
    <div className="menu-list-container">
      
        <div className="restaurant-banner">
          <div className="banner-content">
            <h1>{restaurant.name}</h1>
            <div className="restaurant-details">
              <span className="restaurant-category">{restaurant.category}</span>
              <span className="restaurant-rating"><Star size={16} className="star-icon" />{restaurant.rating}</span>
              <span className="restaurant-delivery-time"><Clock size={16} />{restaurant.deliveryTime}</span>
            </div>
            <p className="restaurant-address"><MapPin size={16} />{restaurant.address}</p>
            

            {showInfo && (
              <div className="restaurant-info-popup">
                <div className="info-header">
                  <h3>Restaurant Information</h3>
                  <button onClick={() => setShowInfo(false)}><X size={18} /></button>
                </div>
                <div className="info-content">
                  <div className="info-row"><span>Delivery Fee:</span><span>${restaurant.deliveryFee.toFixed(2)}</span></div>
                  <div className="info-row"><span>Minimum Order:</span><span>${restaurant.minOrder.toFixed(2)}</span></div>
                  <div className="info-row"><span>Rating:</span><span>{restaurant.rating} / 5</span></div>
                  <div className="info-row"><span>Delivery Time:</span><span>{restaurant.deliveryTime}</span></div>
                  <div className="info-row"><span>Address:</span><span>{restaurant.address}</span></div>
                </div>
              </div>
            )}
          </div>
        
      </div>

      <div className="menu-filters">
        <div className="search-box">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Search menu items..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
          {searchTerm && (
            <button className="clear-search" onClick={() => setSearchTerm('')}>
              <X size={16} />
            </button>
          )}
        </div>

        <div className="category-filters">
          <button className={`category-button ${activeCategory === 'all' ? 'active' : ''}`}
            onClick={() => handleCategoryChange('all')}>
            All
          </button>
          {categories.map(category => (
            <button key={category}
              className={`category-button ${activeCategory === category ? 'active' : ''}`}
              onClick={() => handleCategoryChange(category)}>
              {category}
            </button>
          ))}
        </div>
      </div>

      {filteredItems.length > 0 ? (
        <div className="menu-sections">
          {activeCategory === 'all' ? (
            Object.entries(groupedItems).map(([category, items]) => (
              <div key={category} className="menu-section">
                <h2 className="category-title">{category}</h2>
                <div className="food-items-grid">
                  {items.map(item => (
                    <FoodItemCard key={item._id} item={item} onAddToCart={onAddToCart} />
                  ))}
                </div>
              </div>
            ))
          ) : (
            <div className="menu-section">
              <div className="food-items-grid">
                {filteredItems.map(item => (
                  <FoodItemCard key={item._id} item={item} onAddToCart={onAddToCart} />
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="no-results">
          <p>No items found matching your search</p>
          <button className="reset-search" onClick={() => {
            setSearchTerm('');
            setActiveCategory('all');
          }}>
            Clear Search
          </button>
        </div>
      )}
    </div>
  );
};

export default MenuList;
