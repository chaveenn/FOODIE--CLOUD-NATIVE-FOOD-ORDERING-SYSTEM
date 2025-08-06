import Order from "../models/Order.js";
import dotenv from 'dotenv';
dotenv.config();
import sendEmail from "../utils/emailService.js";

const USER_SERVICE_URL = process.env.USER_SERVICE_URL;
const RESTAURANT_SERVICE_URL = process.env.RESTAURANT_SERVICE_URL;

console.log("Using user service at:", USER_SERVICE_URL);
console.log("Using restaurant service at:", RESTAURANT_SERVICE_URL);

// Create order directly from frontend cart data
export const createOrder = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { restaurantId, items, totalAmount } = req.body;

    if (!restaurantId || !items || items.length === 0 || !totalAmount) {
      return res.status(400).json({ message: "Incomplete order data" });
    }

    const newOrder = new Order({
      userId,
      restaurantId,
      items,
      totalAmount,
      paymentMethod: "cash",         
      paymentStatus: "pending",
      orderStatus: "ready-to-checkout"
    });

    await newOrder.save();

    res.status(201).json({
      message: "Order is ready to checkout successfully",
      order: newOrder
    });

  } catch (error) {
    console.error("Order creation error:", error);
    res.status(500).json({
      message: "Failed to create order",
      error: error.message
    });
  }
};

export const getOrdersByUser = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.userId });
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch orders", error: err.message });
  }
};

export const getOrdersByRestaurant = async (req, res) => {
  try {
    const orders = await Order.find({ restaurantId: req.params.restaurantId });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch orders", error: err.message });
  }
};

//Update order status
export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId, newStatus } = req.body;
    const updatedOrder = await Order.findByIdAndUpdate(orderId, { orderStatus: newStatus }, { new: true });

    res.json(updatedOrder);
  } catch (err) {
    res.status(500).json({ message: "Failed to update order status", error: err.message });
  }
};


import axios from 'axios';

export const updateStatus = async (req, res) => {
  try {
    const { newStatus } = req.body;
    const orderId = req.params.id;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found." });
    }

    const USER_SERVICE_URL = process.env.USER_SERVICE_URL || 'http://localhost:8000/users';
    const userRes = await axios.get(`${USER_SERVICE_URL}/get-user/${order.userId}`);
    const userEmail = userRes.data?.email;

    
    order.orderStatus = newStatus;
    await order.save();

   
    const statusMessages = {
      "order-placed": "Your order has been placed successfully. Thank you for choosing Foodie!",
      "confirmed": "Good news! Your order has been confirmed by the restaurant.",
      "preparing": "Your food is now being freshly prepared. Hang tight!",
      "picked-up": "Your order has been picked up by our delivery partner.",
      "on-the-way": "Your delicious meal is on its way!",
      "rejected": "We're sorry. Your order was rejected. Please try another restaurant.",
      "cancelled": "Your order has been cancelled. If this was a mistake, please reorder.",
      "completed": "Enjoy your meal! Your order has been successfully completed."
    };

    const emailSubject = `Foodie Order Status Update - #${order._id.toString().slice(0, 8)}`;
    const emailBody = statusMessages[newStatus] || `${newStatus}`;

    
    if (userEmail) {
      await sendEmail(userEmail, emailSubject, emailBody);
    }

    res.status(200).json(order);
  } catch (err) {
    console.error("Order status update error:", err.message);
    res.status(500).json({ message: "Failed to update order status", error: err.message });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.status(200).json(order);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch order", error: err.message });
  }
};
