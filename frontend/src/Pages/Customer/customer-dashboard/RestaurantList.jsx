import React, { useState, useEffect } from 'react';
import { MapPin, Star, Search, X } from 'lucide-react';
import axios from 'axios';
import './Dashboard.css';

const RestaurantList = ({ onSelectRestaurant }) => {
  const [restaurants, setRestaurants] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters] = useState(false);
  const [filters, setFilters] = useState({
    rating: 0,
    priceRange: 'all',
    distance: 'all'
  });



  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:8000/restaurants/all-restaurants`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        });

        const restaurantData = response.data.restaurants || response.data;

        setRestaurants(restaurantData);
        const uniqueCategories = [...new Set(restaurantData.map(r => r.category || r.cuisineType))];
        setCategories(uniqueCategories);
      } catch (error) {
        console.error("Failed to fetch restaurants:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, []);

  const handleCategoryChange = (category) => {
    setActiveCategory(category);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterChange = (filterName, value) => {
    setFilters({ ...filters, [filterName]: value });
  };

  const resetFilters = () => {
    setFilters({
      rating: 0,
      priceRange: 'all',
      distance: 'all'
    });
  };

  const filteredRestaurants = restaurants.filter(restaurant => {
    const matchesCategory = activeCategory === 'all' || (restaurant.category || restaurant.cuisineType) === activeCategory;
    const matchesSearch = restaurant.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRating = restaurant.rating >= filters.rating;
    return matchesCategory && matchesSearch && matchesRating;
  });

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading restaurants...</p>
      </div>
    );
  }

  return (
    <div className="restaurant-list-container">
      <section className="restaurants-section">
        <div className="section-header">
          <h2>Restaurants</h2>
          
          <div className="restaurant-actions">
            <div className="search-box">
              <Search size={18} className="search-icon" />
              <input
                type="text"
                placeholder="Search restaurants..."
                value={searchTerm}
                onChange={handleSearchChange}
              />
              {searchTerm && (
                <button className="clear-search" onClick={() => setSearchTerm('')}>
                  <X size={16} />
                </button>
              )}
            </div>
            
          </div>
        </div>

        {showFilters && (
          <div className="filter-options">
            <div className="filter-group">
              <label>Minimum Rating</label>
              <div className="rating-filter">
                {[4, 3, 2, 0].map(rating => (
                  <button
                    key={rating}
                    className={filters.rating === rating ? 'active' : ''}
                    onClick={() => handleFilterChange('rating', rating)}
                  >
                    {rating > 0 ? `${rating}+` : 'Any'}{rating > 0 && <Star size={14} />}
                  </button>
                ))}
              </div>
            </div>
            <button className="reset-filters" onClick={resetFilters}>
              Reset Filters
            </button>
          </div>
        )}

        <div className="category-filters">
          <button className={`category-button ${activeCategory === 'all' ? 'active' : ''}`} onClick={() => handleCategoryChange('all')}>
            All
          </button>
          {categories.map(category => (
            <button
              key={category}
              className={`category-button ${activeCategory === category ? 'active' : ''}`}
              onClick={() => handleCategoryChange(category)}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="restaurants-grid">
          {filteredRestaurants.length > 0 ? (
            filteredRestaurants.map(restaurant => (
              <div
                key={restaurant._id}
                className="restaurant-card"
                onClick={() => onSelectRestaurant(restaurant)}
              >
                <div className="restaurant-image">
                <img
                    src={restaurant.images?.[0]?.url || "https://via.placeholder.com/300x200"}
                    alt={restaurant.name}
                  />
                </div>
                <div className="restaurant-info">
                  <h3>{restaurant.name}</h3>
                  <p className="restaurant-category">{restaurant.category || restaurant.cuisineType}</p>
                  <div className="restaurant-meta">
                    <span className="restaurant-rating">
                      <Star size={16} className="star-icon" />{restaurant.rating}
                    </span>
                    
                  </div>
                  <div className="restaurant-location">
                    <MapPin size={16} /><span>{restaurant.address}</span>
                  </div>
                  
                </div>
              </div>
            ))
          ) : (
            <div className="no-results">
              <p>No restaurants found matching your criteria</p>
              <button className="reset-search" onClick={() => {
                setSearchTerm('');
                setActiveCategory('all');
                resetFilters();
              }}>
                Reset Filters
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default RestaurantList;
