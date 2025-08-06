import { useState, useEffect } from 'react';
import { FaEdit, FaTrash, FaPlus, FaSearch, FaTimes, FaSave } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Menu.css';

const Menu = () => {
  const navigate = useNavigate();
  const [restaurant, setRestaurant] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentEditItem, setCurrentEditItem] = useState(null);
  const [editFormData, setEditFormData] = useState({
    name: '',
    description: '',
    price: 0,
    category: '',
    isAvailable: true,
    images: []
  });

  useEffect(() => {
    const fetchRestaurantAndMenu = async () => {
      try {
        setLoading(true);
        setError('');
        
        const restaurantResponse = await axios.get(
          'http://localhost:8000/restaurants/my-restaurants',
          {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          }
        );

        if (!restaurantResponse.data.restaurants || restaurantResponse.data.restaurants.length === 0) {
          throw new Error('No restaurants found for this account');
        }

        const currentRestaurant = restaurantResponse.data.restaurants[0];
        setRestaurant(currentRestaurant);

        const menuResponse = await axios.get(
          `http://localhost:8000/menus/menu/${currentRestaurant._id}`,
          {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          }
        );
        
        setMenuItems(menuResponse.data);
        
        const uniqueCategories = [...new Set(
          menuResponse.data.map(item => item.category).filter(Boolean)
        )];
        setCategories(uniqueCategories);
        
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'Failed to fetch data');
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurantAndMenu();
  }, []);

  const handleCategoryChange = (category) => {
    setActiveCategory(category);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleEditItem = (item) => {
    setCurrentEditItem(item);
    setEditFormData({
      name: item.name,
      description: item.description,
      price: item.price,
      category: item.category,
      isAvailable: item.isAvailable,
      images: item.images || []
    });
    setIsEditDialogOpen(true);
  };

  const handleEditChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');
      
      await axios.put(
        `http://localhost:8000/menus/update-menu/${currentEditItem._id}`,
        editFormData,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      
      setMenuItems(prevItems => 
        prevItems.map(item => 
          item._id === currentEditItem._id ? { ...item, ...editFormData } : item
        )
      );
      
      if (!categories.includes(editFormData.category)) {
        setCategories([...categories, editFormData.category]);
      }
      
      setIsEditDialogOpen(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update menu item');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteItem = async (itemId) => {
    if (window.confirm('Are you sure you want to delete this menu item?')) {
      try {
        await axios.delete(
          `http://localhost:8000/menus/delete-menu/${itemId}`,
          {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          }
        );
        
        setMenuItems(prevItems => prevItems.filter(item => item._id !== itemId));
        
        const remainingCategories = [...new Set(
          menuItems.filter(item => item._id !== itemId).map(item => item.category)
        )];
        setCategories(remainingCategories);
        
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to delete menu item');
        console.error('Error deleting menu item:', err);
      }
    }
  };

  const filteredItems = menuItems.filter(item => {
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  if (loading) {
    return <div className="loading">Loading restaurant and menu data...</div>;
  }

  if (error) {
    return (
      <div className="error-container">
        <h3>Error Loading Data</h3>
        <p>{error}</p>
        <button 
          className="retry-btn"
          onClick={() => window.location.reload()}
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="no-data-container">
        <h3>No Restaurant Found</h3>
        <p>You haven't registered any restaurants yet.</p>
        <button 
          className="add-restaurant-btn"
          onClick={() => navigate('/add-restaurant')}
        >
          Register a Restaurant
        </button>
      </div>
    );
  }

  return (
    <div className="menu-container">
      <div className="menu-header">
        <h2>Menu Management - {restaurant.name}</h2>
        <button 
          className="add-item-btn"
          onClick={() => navigate(`/restaurant/add-menu`)}
        >
          <FaPlus /> Add New Item
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}
      
      <div className="menu-filters">
        <div className="search-box">
          <FaSearch className="search-icon" />
          <input 
            type="text" 
            placeholder="Search menu items..." 
            value={searchTerm} 
            onChange={handleSearchChange}
          />
        </div>
        
        <div className="category-filters">
          <button 
            className={`category-btn ${activeCategory === 'all' ? 'active' : ''}`} 
            onClick={() => handleCategoryChange('all')}
          >
            All
          </button>
          {categories.map(category => (
            <button 
              key={category} 
              className={`category-btn ${activeCategory === category ? 'active' : ''}`}
              onClick={() => handleCategoryChange(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </div>
      
      {loading ? (
        <div className="loading">Loading menu items...</div>
      ) : (
        <div className="menu-items-grid">
          {filteredItems.length > 0 ? (
            filteredItems.map(item => (
              <div key={item._id} className={`menu-item-card ${!item.isAvailable ? 'unavailable' : ''}`}>
                <div className="menu-item-image">
                  {item.images && item.images.length > 0 ? (
                    <img src={item.images[0].url} alt={item.name} />
                  ) : (
                    <div className="no-image">No Image</div>
                  )}
                  {!item.isAvailable && (
                    <div className="unavailable-badge">Unavailable</div>
                  )}
                </div>
                <div className="menu-item-content">
                  <h3 className="menu-item-name">{item.name}</h3>
                  <p className="menu-item-category">{item.category}</p>
                  <p className="menu-item-description">{item.description || 'No description available'}</p>
                  <div className="menu-item-footer">
                    <p className="menu-item-price">Rs.{item.price.toFixed(2)}</p>
                    <div className="menu-item-actions">
                      <button 
                        className="action-icon edit" 
                        aria-label="Edit item"
                        onClick={() => handleEditItem(item)}
                      >
                        <FaEdit />
                      </button>
                      <button 
                        className="action-icon delete" 
                        aria-label="Delete item"
                        onClick={() => handleDeleteItem(item._id)}
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="no-items">No menu items found matching your criteria.</div>
          )}
        </div>
      )}

      {/* Edit Dialog */}
      {isEditDialogOpen && (
        <div className="dialog-overlay">
          <div className="edit-dialog">
            <div className="dialog-header">
              <h3>Edit Menu Item</h3>
              <button 
                className="close-btn"
                onClick={() => setIsEditDialogOpen(false)}
              >
                <FaTimes />
              </button>
            </div>
            
            {error && <div className="error-message">{error}</div>}
            
            <form onSubmit={handleEditSubmit}>
              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  name="name"
                  value={editFormData.name}
                  onChange={handleEditChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Description</label>
                <textarea
                  name="description"
                  value={editFormData.description}
                  onChange={handleEditChange}
                  rows="3"
                />
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Price ($)</label>
                  <input
                    type="number"
                    name="price"
                    value={editFormData.price}
                    onChange={handleEditChange}
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>Category</label>
                  <input
                    type="text"
                    name="category"
                    value={editFormData.category}
                    onChange={handleEditChange}
                    required
                  />
                </div>
              </div>
              
              <div className="form-group checkbox-group">
                <label>
                  <input
                    type="checkbox"
                    name="isAvailable"
                    checked={editFormData.isAvailable}
                    onChange={handleEditChange}
                  />
                  Available
                </label>
              </div>
              
              <div className="dialog-actions">
                <button 
                  type="button" 
                  className="cancel-btn"
                  onClick={() => setIsEditDialogOpen(false)}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="save-btn"
                  disabled={loading}
                >
                  {loading ? 'Saving...' : <><FaSave /> Save Changes</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Menu;