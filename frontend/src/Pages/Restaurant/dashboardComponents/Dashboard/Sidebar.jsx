import { useEffect, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { 
  FaHome, 
  FaUtensils, 
  FaShoppingCart, 
  FaStore, 
  FaUser, 
  FaMapMarkerAlt,
  FaAngleRight,
  FaAngleLeft 
} from 'react-icons/fa'
import axios from 'axios'
import './Sidebar.css'

const Sidebar = ({ open }) => {
  const location = useLocation()
  const [activeItem, setActiveItem] = useState('')
  const [restaurantName, setRestaurantName] = useState('Loading...')

  useEffect(() => {
    const path = location.pathname.substring(1)
    setActiveItem(path || 'overview')

    const fetchRestaurantData = async () => {
      try {
        const token = localStorage.getItem('token')
        const response = await axios.get(`http://localhost:8000/restaurants/my-restaurants`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
    
        const restaurant = response.data.restaurants[0]
        if (restaurant) {
          setRestaurantName(restaurant.name)
        } else {
          setRestaurantName('No Restaurant')
        }
      } catch (error) {
        console.error('Error fetching restaurant data:', error)
        setRestaurantName('Error Loading')
      }
    }
    

    fetchRestaurantData()
  }, [location])

  const sidebarItems = [
    { id: 'overview', path: '/restaurant/overview', label: 'Overview', icon: <FaHome /> },
    { id: 'menu', path: '/restaurant/menu', label: 'Menu', icon: <FaUtensils /> },
    { id: 'orders', path: '/restaurant/orders', label: 'Orders', icon: <FaShoppingCart /> },
    { id: 'my-restaurant', path: '/restaurant/my-restaurant', label: 'My Restaurant', icon: <FaStore /> },
    { id: 'profile', path: '/restaurant/profile', label: 'My Profile', icon: <FaUser /> },
    { id: 'location', path: '/restaurant/location', label: 'Location', icon: <FaMapMarkerAlt /> }
  ]

  return (
    <aside className={`sidebar ${open ? 'open' : 'closed'}`}>
      <div className="sidebar-header">
        <h2 className="restaurant-name">{restaurantName}</h2>
        <div className="collapse-icon">
          {open ? <FaAngleLeft /> : <FaAngleRight />}
        </div>
      </div>
      <nav className="sidebar-nav">
        <ul>
          {sidebarItems.map((item) => (
            <li key={item.id} className={activeItem === item.id ? 'active' : ''}>
              <NavLink 
                to={item.path} 
                className={({ isActive }) => isActive ? 'active' : ''}
              >
                <span className="icon">{item.icon}</span>
                <span className="label">{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      <div className="sidebar-footer">
        <p>© 2025 Restaurant Dashboard</p>
      </div>
    </aside>
  )
}

export default Sidebar
