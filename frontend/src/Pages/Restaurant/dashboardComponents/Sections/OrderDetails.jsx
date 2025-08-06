import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import './OrderDetails.css';

const OrderDetails = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newStatus, setNewStatus] = useState("");

  const fetchOrder = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`http://localhost:8000/orders/order/${orderId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setOrder(res.data);
      setNewStatus(res.data.orderStatus);
    } catch (err) {
      console.error('Failed to fetch order details:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [orderId]);

  const handleStatusUpdate = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `http://localhost:8000/orders/updateStatus/${orderId}`,
        { orderId, newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchOrder();
      alert("Order status updated!");
    } catch (err) {
      console.error("Failed to update status:", err);
      alert("Failed to update status.");
    }
  };

  if (loading) return <div className="order-details">Loading...</div>;
  if (!order) return <div className="order-details">Order not found.</div>;

  return (
    <div className="order-card">
      <div className="order-header">
        <div className="order-id-date">
          <h3 className="order-id">Order #{order._id.slice(0, 8).toUpperCase()}</h3>
          <p className="order-date">{new Date(order.createdAt).toLocaleString()}</p>
        </div>
        <div className="order-status">
          <span className="status-text">{order.orderStatus}</span>
        </div>
      </div>

      <div className="order-customer">
        <p><strong>User ID:</strong> {order.userId}</p>
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
          <strong>Total:</strong> ${order.totalAmount.toFixed(2)}
        </p>
        <div className="order-actions">
          <select
            className="status-dropdown"
            value={newStatus}
            onChange={(e) => setNewStatus(e.target.value)}
          >
            <option value="confirmed">Confirmed</option>
            <option value="preparing">Preparing</option>
            <option value="rejected">Rejected</option>
            <option value="picked-up">Picked Up</option>
            <option value="on-the-way">On the Way</option>
            <option value="completed">Completed</option>
          </select>
          <button
            className="update-status-btn"
            onClick={handleStatusUpdate}
          >
            Update Status
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
