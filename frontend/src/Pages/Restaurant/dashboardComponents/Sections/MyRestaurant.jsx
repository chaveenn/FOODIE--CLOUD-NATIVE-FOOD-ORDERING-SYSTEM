import { useState, useEffect } from 'react'
import { FaEdit, FaSave, FaTimes } from 'react-icons/fa'
import './MyRestaurant.css'
import axios from 'axios'
import { jwtDecode } from 'jwt-decode';

const MyRestaurant = () => {
  const [restaurant, setRestaurant] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [editing, setEditing] = useState(false)
  const [formData, setFormData] = useState(null)
  
  useEffect(() => {
    const fetchRestaurantData = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const token = localStorage.getItem('token')
        
        if (!token) {
          setLoading(false)
          setError('User not logged in')
          return    
        }
        
        const decodedToken = jwtDecode(token);
        const userId = decodedToken.userId
        const ownerName = decodedToken.name || '';
    
        if (!userId) {
          setLoading(false)
          setError('User ID not found in token')
          return
        } 
        const response = await axios.get('http://localhost:8000/restaurants/my-restaurants', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        
        if (response.data.restaurants && response.data.restaurants.length > 0) {
          const apiData = response.data.restaurants[0]
          
          const transformedData = {
            id: apiData._id,
            name: apiData.name,
            description: apiData.description,
            cuisineType: apiData.cuisineType,
            openingHours:  apiData.openingHours || 'Not specified',
              
            closingHours: apiData.closingHours || 'Not specified',
            contactInfo: {
              email: apiData.email,
              phone: apiData.phone,
              website: apiData.website || ''
            },
            address: {
              street: apiData.address,
            },
            logo: apiData.images?.[0]?.url || 'https://via.placeholder.com/150',
            established: apiData.established || '',
            owner: ownerName || '',
            status: apiData.status
          }
          
          setRestaurant(transformedData)
          setFormData(transformedData)
        } else {
          setError('No restaurants found for this account')
        }
      } catch (err) {
        console.error('Error fetching restaurant data:', err)
        setError(err.response?.data?.message || 'Failed to load restaurant data')
      } finally {
        setLoading(false)
      }
    }
    
    fetchRestaurantData()
  }, [])
  
  const handleEdit = () => {
    setEditing(true)
  }
  
  const handleCancel = () => {
    setFormData(restaurant)
    setEditing(false)
  }
  
  const handleSave = async () => {
    try {
      const token = localStorage.getItem('token')
      
      const apiData = {
        name: formData.name,
        description: formData.description,
        cuisineType: formData.cuisineType,
        openingHours: formData.openingHours.monday,

        email: formData.contactInfo.email,
        phone: formData.contactInfo.phone,
        website: formData.contactInfo.website,
        address: formData.address.street,
        established: formData.established,
        ownerName: formData.owner
      }
      
      await axios.put(
        `http://localhost:8000/restaurants/update-restaurant/${restaurant.id}`,
        apiData,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
      
      setRestaurant(formData)
      setEditing(false)
    } catch (err) {
      console.error('Error updating restaurant:', err)
      setError(err.response?.data?.message || 'Failed to update restaurant data')
    }
  }
  
  const handleChange = (e) => {
    const { name, value } = e.target
    
    if (name.includes('.')) {
      const [section, field] = name.split('.')
      setFormData({
        ...formData,
        [section]: {
          ...formData[section],
          [field]: value
        }
      })
    } else {
      setFormData({
        ...formData,
        [name]: value
      })
    }
  }

  if (loading) {
    return <div className="loading">Loading restaurant information...</div>
  }

  if (error) {
    return <div className="error">{error}</div>
  }

  if (!restaurant || !formData) {
    return <div className="no-data">No restaurant data available</div>
  }

  return (
    <div className="my-restaurant-container">
      <div className="restaurant-header">
        <h2>Restaurant Details</h2>
        {editing ? (
          <div className="edit-actions">
            <button className="cancel-btn" onClick={handleCancel}>
              <FaTimes /> Cancel
            </button>
            <button className="save-btn" onClick={handleSave}>
              <FaSave /> Save
            </button>
            
          </div>
        ) : (
          <button className="edit-btn" onClick={handleEdit}>
            <FaEdit /> Edit Information
          </button>
        )}
      </div>
      
      <div className="restaurant-details">
        <div className="restaurant-logo">
          <img src={restaurant.logo} alt={restaurant.name} />
          {editing && (
            <button className="change-logo-btn">Change Logo</button>
          )}
        </div>
        
        <div className="restaurant-info">
          <div className="info-section">
            <h3>Basic Information</h3>
            <div className="info-grid">
              <div className="info-field">
                <label>Restaurant Name</label>
                {editing ? (
                  <input 
                    type="text" 
                    name="name" 
                    value={formData.name || ''} 
                    onChange={handleChange} 
                  />
                ) : (
                  <p>{restaurant.name}</p>
                )}
              </div>
              
              <div className="info-field">
                <label>Cuisine Type</label>
                {editing ? (
                  <input 
                    type="text" 
                    name="cuisineType" 
                    value={formData.cuisineType || ''} 
                    onChange={handleChange} 
                  />
                ) : (
                  <p>{restaurant.cuisineType}</p>
                )}
              </div>
              
              <div className="info-field">
                <label>Established</label>
                {editing ? (
                  <input 
                    type="text" 
                    name="established" 
                    value={formData.established || ''} 
                    onChange={handleChange} 
                  />
                ) : (
                  <p>{restaurant.established}</p>
                )}
              </div>
              
              <div className="info-field">
                <label>Owner</label>
                {editing ? (
                  <input 
                    type="text" 
                    name="owner" 
                    value={formData.owner || ''} 
                    onChange={handleChange} 
                  />
                ) : (
                  <p>{restaurant.owner}</p>
                )}
              </div>
              
              <div className="info-field full-width">
                <label>Description</label>
                {editing ? (
                  <textarea 
                    name="description" 
                    value={formData.description || ''} 
                    onChange={handleChange} 
                  />
                ) : (
                  <p>{restaurant.description}</p>
                )}
              </div>
            </div>
          </div>
          
          <div className="info-section">
            <h3>Contact Information</h3>
            <div className="info-grid">
              <div className="info-field">
                <label>Email</label>
                {editing ? (
                  <input 
                    type="email" 
                    name="contactInfo.email" 
                    value={formData.contactInfo?.email || ''} 
                    onChange={handleChange} 
                  />
                ) : (
                  <p>{restaurant.contactInfo.email}</p>
                )}
              </div>
              
              <div className="info-field">
                <label>Phone</label>
                {editing ? (
                  <input 
                    type="text" 
                    name="contactInfo.phone" 
                    value={formData.contactInfo?.phone || ''} 
                    onChange={handleChange} 
                  />
                ) : (
                  <p>{restaurant.contactInfo.phone}</p>
                )}
              </div>
              
              
            </div>
          </div>
          
          <div className="info-section">
            <h3>Address</h3>
            <div className="info-grid">
              <div className="info-field full-width">
                <label>Street</label>
                {editing ? (
                  <input 
                    type="text" 
                    name="address.street" 
                    value={formData.address?.street || ''} 
                    onChange={handleChange} 
                  />
                ) : (
                  <p>{restaurant.address.street}</p>
                )}
              </div>
              
              
            </div>
          </div>
          
          <div className="info-section">
            <h3>Opening Hours</h3>
            <div className="info-grid">
              
                
                <div className="info-field">
                  <label>{restaurant.openingHours} - {restaurant.closingHours}</label>

                  {editing ? (
                    <input 
                      type="text" 
                      name="openingHours"
                      value={formData.openingHours || ''} 
                      onChange={handleChange} 
                    />
                  ) : (
                    <p></p>
                  )}
                </div>
              
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MyRestaurant