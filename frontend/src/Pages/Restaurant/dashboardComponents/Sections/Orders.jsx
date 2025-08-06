import { useEffect, useState } from 'react';
import { FaCheck, FaTimes, FaSpinner, FaFilter } from 'react-icons/fa';
import axios from 'axios';
import './Orders.css';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [restaurantId, setRestaurantId] = useState(null);
  const [statusUpdates, setStatusUpdates] = useState({});
  const [userCache, setUserCache] = useState({}); // Cache for userId -> name

  const excludedStatuses = ['ready-to-checkout', 'rejected', 'cancelled', 'completed'];

  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:8000/restaurants/my-restaurants', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.data.restaurants.length > 0) {
          setRestaurantId(res.data.restaurants[0]._id);
        }
      } catch (err) {
        console.error('Failed to fetch restaurant');
      }
    };
    fetchRestaurant();
  }, []);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!restaurantId) return;
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        const res = await axios.get(`http://localhost:8000/orders/orders-by-restaurant/${restaurantId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
    
        const validOrders = res.data
          .filter(order => !excludedStatuses.includes(order.orderStatus))
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); // ✅ sorted here
    
        setOrders(validOrders);
    
        // Preload user names
        const userIds = [...new Set(validOrders.map(order => order.userId))];
        const userMap = { ...userCache };
    
        await Promise.all(
          userIds.map(async userId => {
            if (!userMap[userId]) {
              try {
                const userRes = await axios.get(`http://localhost:8000/users/get-user/${userId}`);
                userMap[userId] = userRes.data?.name || 'Unknown User';
              } catch {
                userMap[userId] = 'Unknown User';
              }
            }
          })
        );
    
        setUserCache(userMap);
      } catch (err) {
        console.error('Error fetching orders');
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrders();
  }, [restaurantId]);

  const handleFilterChange = (status) => setFilter(status);

  const filteredOrders = filter === 'all'
    ? orders
    : orders.filter(order => order.orderStatus === filter);

  const handleDropdownChange = (orderId, newStatus) => {
    setStatusUpdates(prev => ({ ...prev, [orderId]: newStatus }));
  };

  const handleUpdateStatus = async (orderId) => {
    const newStatus = statusUpdates[orderId];
    if (!newStatus) return;

    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `http://localhost:8000/orders/updateStatus/${orderId}`,
        { orderId, newStatus },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setOrders(prev =>
        prev.map(order =>
          order._id === orderId ? { ...order, orderStatus: newStatus } : order
        )
      );
      alert('Order status updated!');
    } catch (err) {
      console.error("Status update failed", err.message);
      alert('Failed to update status.');
    }
  };

  const formatDate = (date) =>
    new Date(date).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return <FaCheck className="status-icon completed" />;
      case 'in-progress': return <FaSpinner className="status-icon in-progress" />;
      case 'pending': return <FaSpinner className="status-icon pending" />;
      case 'cancelled': return <FaTimes className="status-icon cancelled" />;
      default: return null;
    }
  };

  return (
    <div className="orders-container">
      <div className="orders-header">
        <h2>Order Management</h2>
        <div className="filter-dropdown">
          <button className="filter-btn">
            <FaFilter /> Filter <span className="current-filter">{filter}</span>
          </button>
          <div className="filter-options">
            {['all', 'pending', 'confirmed', 'preparing'].map(status => (
              <button
                key={status}
                className={`filter-option ${filter === status ? 'active' : ''}`}
                onClick={() => handleFilterChange(status)}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
      </div>

      {loading ? (
        <div className="loading">Loading orders...</div>
      ) : (
        <div className="orders-list">
          {filteredOrders.map(order => (
            <div key={order._id} className={`order-card ${order.orderStatus}`}>
              <div className="order-header">
                <div className="order-id-date">
                  <h3 className="order-id">#{order._id.slice(0, 8).toUpperCase()}</h3>
                  <p className="order-date">{formatDate(order.createdAt)}</p>
                </div>
                <div className="order-status">
                  {getStatusIcon(order.orderStatus)}
                  <span className="status-text">{order.orderStatus}</span>
                </div>
              </div>

              <div className="order-customer">
                <p><strong>Customer:</strong> {userCache[order.userId] || order.userId}</p>
                <p><strong>Payment:</strong> {order.paymentMethod}</p>
                <p><strong>Payment Status:</strong> {order.paymentStatus}</p>
              </div>

              <div className="order-items">
                <h4>Items</h4>
                <ul className="item-list">
                  {order.items.map((item, i) => (
                    <li key={i} className="order-item">
                      <span className="item-quantity">{item.quantity}x</span>
                      <span className="item-name">{item.name}</span>
                      <span className="item-price">${(item.price * item.quantity).toFixed(2)}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="order-footer">
                <p className="order-total">
                  <strong>Total:</strong> ${order.totalAmount}
                </p>
                <div className="order-actions">
                  <select
                    className="status-dropdown"
                    value={statusUpdates[order._id] || order.orderStatus}
                    onChange={(e) => handleDropdownChange(order._id, e.target.value)}
                  >
                    <option value="confirmed">Confirmed</option>
                    <option value="preparing">Preparing</option>
                    <option value="rejected">Rejected</option>
                  </select>
                  <button
                    className="update-status-btn"
                    onClick={() => handleUpdateStatus(order._id)}
                  >
                    Update Status
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
