import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { FaPlus, FaTimes } from 'react-icons/fa'
import axios from 'axios'
import './Add-Menu.css'

const AddMenu = () => {
  const { restaurantId } = useParams()
  const navigate = useNavigate()
  const [restaurant, setRestaurant] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    isAvailable: true
  })
  const [imagePreviews, setImagePreviews] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        const response = await axios.get(
          'http://localhost:8000/restaurants/my-restaurants',
          {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          }
        )
        
        if (response.data.restaurants && response.data.restaurants.length > 0) {
          // Use the restaurant from params if available, otherwise use the first one from the response
          const targetRestaurant = restaurantId 
            ? response.data.restaurants.find(r => r._id === restaurantId)
            : response.data.restaurants[0]
          
          if (targetRestaurant) {
            setRestaurant(targetRestaurant)
          } else {
            setError('Restaurant not found')
          }
        } else {
          setError('No restaurants found for this account')
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch restaurant data')
      }
    }

    fetchRestaurant()
  }, [restaurantId])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    })
  }
  
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files)
    
    if (files.length + imagePreviews.length > 4) {
      setError('You can upload a maximum of 4 images')
      return
    }
    
    const previews = files.map(file => ({
      file,
      preview: URL.createObjectURL(file)
    }))
    
    setImagePreviews([...imagePreviews, ...previews])
    setError('')
  }
  
  const removeImage = (index) => {
    const newPreviews = [...imagePreviews]
    newPreviews.splice(index, 1)
    setImagePreviews(newPreviews)
  }
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!restaurant?._id) {
      setError('Restaurant ID is missing')
      return
    }
    
    setIsLoading(true)
    setError('')
    
    try {
      const formDataToSend = new FormData()
      formDataToSend.append('name', formData.name)
      formDataToSend.append('description', formData.description)
      formDataToSend.append('price', formData.price)
      formDataToSend.append('category', formData.category)
      formDataToSend.append('isAvailable', formData.isAvailable)
      
      imagePreviews.forEach((preview) => {
        formDataToSend.append('images', preview.file)
      })
      
      const response = await axios.post(
        `http://localhost:8000/menus/add-menu/${restaurant._id}`,
        formDataToSend,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      )
      
      if (response.status === 201) {
        navigate(`/restaurant/menu`)
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add menu item')
      console.error('Error adding menu item:', err)
    } finally {
      setIsLoading(false)
    }
  }

  if (!restaurant) {
    return (
      <div className="loading-container">
        {error ? (
          <div className="error-message">{error}</div>
        ) : (
          <p>Loading restaurant data...</p>
        )}
      </div>
    )
  }
  
  return (
    <div className="add-menu-container">
      <div className="add-menu-header">
        <h2>Add New Menu Item to {restaurant.name}</h2>
        <button 
          className="back-button"
          onClick={() => navigate(`/dashboard/menu`)}
        >
          Back to Menu
        </button>
      </div>
      
      <form onSubmit={handleSubmit} className="add-menu-form">
        {error && <div className="error-message">{error}</div>}
        
        <div className="form-group">
          <label htmlFor="name">Item Name*</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="3"
          />
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="price">Price*</label>
            <input
              type="number"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleChange}
              min="0"
              step="0.01"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="category">Category*</label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
            >
              <option value="">Select a category</option>
              <option value="Appetizers">Appetizers</option>
              <option value="Main Course">Main Course</option>
              <option value="Desserts">Desserts</option>
              <option value="Beverages">Beverages</option>
              <option value="Sides">Sides</option>
              <option value="Specials">Specials</option>
            </select>
          </div>
        </div>
        
        <div className="form-group availability">
          <label htmlFor="isAvailable">Availability</label>
          <input
            type="checkbox"
            id="isAvailable"
            name="isAvailable"
            checked={formData.isAvailable}
            onChange={handleChange}
          />
          <span>{formData.isAvailable ? 'Available' : 'Unavailable'}</span>
        </div>
        
        <div className="form-group">
          <label>Images (Max 4)</label>
          <div className="image-upload-container">
            {imagePreviews.length < 4 && (
              <div className="image-upload-box">
                <input
                  type="file"
                  id="images"
                  name="images"
                  accept="image/*"
                  onChange={handleImageChange}
                  multiple
                  style={{ display: 'none' }}
                />
                <label htmlFor="images" className="upload-label">
                  <FaPlus className="upload-icon" />
                  <span>Add Image</span>
                </label>
              </div>
            )}
            
            <div className="image-previews">
              {imagePreviews.map((preview, index) => (
                <div key={index} className="image-preview">
                  <img src={preview.preview} alt={`Preview ${index}`} />
                  <button
                    type="button"
                    className="remove-image"
                    onClick={() => removeImage(index)}
                  >
                    <FaTimes />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="form-actions">
          <button
            type="submit"
            className="submit-button"
            disabled={isLoading}
          >
            {isLoading ? 'Adding...' : 'Add Menu Item'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default AddMenu