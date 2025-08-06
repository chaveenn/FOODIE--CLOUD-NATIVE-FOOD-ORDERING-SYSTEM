import React, { useEffect, useState } from 'react';
import axios from 'axios';


const CusOrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchCompletedOrders = async () => {
      try {
        const res = await axios.get('http://localhost:8000/orders/my-orders', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const completedOrders = res.data.filter(order => order.orderStatus === 'completed');
        setOrders(completedOrders);
      } catch (err) {
        console.error("Failed to fetch completed orders:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCompletedOrders();
  }, []);

  return (
    <div className="orders-container">
      <div className="orders-header">
        <h2>Order History</h2>
        <p>Only completed orders are shown here.</p>
      </div>

      {loading ? (
        <div className="loading">Loading order history...</div>
      ) : orders.length === 0 ? (
        <div className="no-orders" style={{ color: '#000000' }}>You have have no completed orders.</div>
      ) : (
        <div className="orders-list">
          {orders.map(order => (
            <div key={order._id} className="order-card completed">
              <div className="order-header">
                <div>
                  <h3 className="order-id">#{order._id.slice(-6)}</h3>
                  <p className="order-date">{new Date(order.createdAt).toLocaleString()}</p>
                </div>
                <div className="order-status">
                  <span className="status-text">Completed</span>
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
          ))}
        </div>
      )}
    </div>
  );
};

export default CusOrderHistory;
