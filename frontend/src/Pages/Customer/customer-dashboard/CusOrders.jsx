import { useState, useEffect } from 'react'
import { FaFilter, FaCheck, FaTimes, FaSpinner } from 'react-icons/fa'
import axios from 'axios'


const Orders = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get('http://localhost:8000/orders/my-orders', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        })
        const pendingOrders = res.data.filter(order => order.orderStatus !== 'completed');
        setOrders(pendingOrders);
        setOrders(pendingOrders)
        setLoading(false)
      } catch (err) {
        console.error('Error loading orders:', err)
        setLoading(false)
      }
    }

    fetchOrders()
  }, [])



  const handleFilterChange = (newFilter) => setFilter(newFilter)

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const filteredOrders = filter === 'all' 
    ? orders 
    : orders.filter(order => order.orderStatus === filter)

  const getStatusIcon = (status) => {
    switch(status) {
      case 'completed': return <FaCheck className="status-icon completed" />
      case 'preparing':
      case 'delivering':
      case 'confirmed': return <FaSpinner className="status-icon in-progress" />
      case 'pending': return <FaSpinner className="status-icon pending" />
      case 'cancelled': return <FaTimes className="status-icon cancelled" />
      default: return null
    }
  }

  return (
    <div className="orders-container">
      <div className="orders-header">
        <h2>My Orders</h2>
        <div className="filter-dropdown">
          <button className="filter-btn"><FaFilter /> Filter <span className="current-filter">{filter}</span></button>
          <div className="filter-options">
            {['all', 'pending', 'confirmed', 'preparing', 'delivering', 'completed', 'cancelled'].map(status => (
              <button 
                key={status}
                className={`filter-option ${filter === status ? 'active' : ''}`}
                onClick={() => handleFilterChange(status)}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {loading ? (
        <div className="loading">Loading orders...</div>
      ) : (
        <div className="orders-list">
          {filteredOrders.length > 0 ? (
            filteredOrders.map(order => (
              <div key={order._id} className={`order-card ${order.orderStatus}`}>
                <div className="order-header">
                  <div className="order-id-date">
                    <h3 className="order-id">#{order._id.slice(-6).toUpperCase()}</h3>
                    <p className="order-date">{formatDate(order.createdAt)}</p>
                  </div>
                  <div className="order-status">
                    {getStatusIcon(order.orderStatus)}
                    <span className="status-text">{order.orderStatus}</span>
                  </div>
                </div>
                <div className="order-items">
                  <h4>Items</h4>
                  <ul className="item-list">
                    {order.items.map((item, index) => (
                      <li key={index} className="order-item">
                        <span className="item-quantity">{item.quantity}x</span>
                        <span className="item-name">{item.name}</span>
                        <span className="item-price">${(item.price * item.quantity).toFixed(2)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="order-footer">
                  <p className="order-total">
                    <strong>Total:</strong> ${parseFloat(order.totalAmount).toFixed(2)}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="no-orders">No orders found matching the selected filter.</div>
          )}
        </div>
      )}
    </div>
  )
}

export default Orders
