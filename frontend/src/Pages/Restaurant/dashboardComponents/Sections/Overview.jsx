import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUtensils, FaShoppingCart, FaBolt, FaExclamationCircle } from 'react-icons/fa';
import axios from 'axios';
import './Overview.css';
import StatusCard from '../UI/StatusCard';

const Overview = () => {
  const [restaurant, setRestaurant] = useState({ name: 'Loading...' });
  const [menuItems, setMenuItems] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };

      // Get restaurant info
      const res = await axios.get("http://localhost:8000/restaurants/my-restaurants", { headers });
      const resData = res.data.restaurants[0];
      setRestaurant(resData);

      // Get menu items
      const menuRes = await axios.get(`http://localhost:8000/menus/menu/${resData._id}`, { headers });
      setMenuItems(menuRes.data);

      // Get orders
      const orderRes = await axios.get(`http://localhost:8000/orders/orders-by-restaurant/${resData._id}`, { headers });
      setOrders(orderRes.data);

    } catch (err) {
      console.error("Error loading data:", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const totalOrders = orders.length;
  const ongoingOrders = orders.filter(order =>
    !['ready-to-checkout', 'rejected', 'cancelled', 'completed'].includes(order.orderStatus)
  ).length;
  const newOrderRequests = orders.filter(order => order.orderStatus === 'order-placed');

  const cards = [
    {
      title: 'Menu Items',
      value: menuItems.length,
      icon: <FaUtensils />,
      color: 'var(--hover)',
      onClick: () => navigate('/restaurant/menu')
    },
    {
      title: 'Total Orders',
      value: totalOrders,
      icon: <FaShoppingCart />,
      color: 'var(--button)'

    },
    {
      title: 'Ongoing Orders',
      value: ongoingOrders,
      icon: <FaBolt />,
      color: 'var(--button-hover)',
      onClick: () => navigate('/restaurant/orders')
    },
    {
      title: 'New Order Requests',
      value: newOrderRequests.length,
      icon: <FaExclamationCircle />,
      color: 'red',
      onClick: () => navigate('/restaurant/orders')
    }
  ];

  const handleOrderClick = () => {
    navigate('/restaurant/orders');
  };

  return (
    <div className="overview-container">
      <div className="welcome-section">
        <h2>Welcome to {restaurant.name}</h2>
        <p className="subtitle">Here’s what’s happening with your restaurant today</p>
      </div>

      <div className="stats-cards">
        {cards.map((card, index) => (
          <StatusCard
            key={index}
            title={card.title}
            value={card.value}
            icon={card.icon}
            color={card.color}
          />
        ))}
      </div>

      <div className="recent-orders">
        <h3>New Order Requests</h3>
        {loading ? (
          <p>Loading orders...</p>
        ) : newOrderRequests.length > 0 ? (
          <div className="orders-table-container">
            <table className="orders-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>User ID</th>
                  <th>Items</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {newOrderRequests.map(order => (
                  <tr key={order._id} onClick={() => navigate(`/restaurant/orders/${order._id}`)}>
                    <td>#{order._id.slice(0, 8).toUpperCase()}</td>
                    <td>{order.userId}</td>
                    <td>{order.items.length}</td>
                    <td>${order.totalAmount.toFixed(2)}</td>
                    <td className="status-badge red">Order Placed</td>
                    <td>{new Date(order.createdAt).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p>No new order requests at this time.</p>
        )}

        <button className="view-all-btn" onClick={handleOrderClick}>
          View All Orders
        </button>
      </div>
    </div>
  );
};

export default Overview;
