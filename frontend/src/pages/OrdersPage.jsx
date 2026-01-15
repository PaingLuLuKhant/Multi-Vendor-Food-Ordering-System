import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './OrdersPage.css';

const OrdersPage = ({ loggedInUser }) => {
    const navigate = useNavigate();
    const { user, loading: authLoading } = useAuth();

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchOrders();

    }, []);

    const fetchOrders = async () => {
        setLoading(true);

        try {
            const token = localStorage.getItem("token");
            if (!token) throw new Error("No token, not logged in");

            const res = await fetch("http://127.0.0.1:8000/api/orders", {
                method: "GET",
                headers: {
                    "Accept": "application/json",
                    "Authorization": "Bearer " + token
                }
            });

            if (!res.ok) throw new Error("Unauthorized or failed");

            const data = await res.json();
            console.log("✅ ORDERS RECEIVED:", data);

            setOrders(data);
        } catch (err) {
            console.error("Failed to fetch orders:", err);
            navigate("/login"); // if token invalid → back to login
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'delivered': return '#10b981';
            case 'preparing': return '#f59e0b';
            case 'on-the-way': return '#3b82f6';
            case 'cancelled': return '#ef4444';
            default: return '#6b7280';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'delivered': return '✓';
            case 'preparing': return '👨‍🍳';
            case 'on-the-way': return '🚚';
            case 'cancelled': return '✕';
            default: return '⏳';
        }
    };

    return (
        <div className="orders-page">
            <div className="orders-container">
                <div className="orders-header">
                    <h1>My Orders</h1>
                    <p>Track and manage all your orders in one place</p>
                </div>

                {loading ? (
                    <div className="loading-orders">
                        <div className="spinner"></div>
                        <p>Loading your orders...</p>
                    </div>
                ) : orders.length === 0 ? (
                    <div className="no-orders">
                        <div className="no-orders-icon">📦</div>
                        <h3>No orders yet</h3>
                        <p>Start shopping to see your orders here</p>
                        <button onClick={() => navigate('/')} className="start-shopping-btn">
                            Start Shopping
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="orders-stats">
                            <div className="stat-card">
                                <span className="stat-number">{orders.length}</span>
                                <span className="stat-label">Total Orders</span>
                            </div>
                            <div className="stat-card">
                                <span className="stat-number">
                                    {orders.filter(o => o.status === 'delivered').length}
                                </span>
                                <span className="stat-label">Delivered</span>
                            </div>
                            <div className="stat-card">
                                <span className="stat-number">
                                    {orders.filter(o => o.status === 'preparing').length}
                                </span>
                                <span className="stat-label">In Progress</span>
                            </div>
                        </div>

                        <div className="orders-list">
                            {orders.map(order => (
                                <div key={order.id} className="order-card">
                                    <div className="order-header">
                                        <div className="order-info">
                                            <h3>Order #{order.id}</h3>
                                            <p>Status: {order.status}</p>
                                            {/* <p className="order-date">Ordered on {order.date}</p>
                                            <p className="order-shop">From: {order.shopName}</p> */}
                                        </div>
                                        <div
                                            className="order-status"
                                            style={{ backgroundColor: getStatusColor(order.status) }}
                                        >
                                            <span className="status-icon">{getStatusIcon(order.status)}</span>
                                            <span className="status-text">
                                                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="order-items">
                                        <h4>Items Ordered:</h4>
                                        {order.items?.map((item, index) => (
                                            <div key={index} className="order-item-row">
                                                <span className="item-name">{item.name} × {item.quantity}</span>
                                                <span className="item-price">${(item.price * item.quantity).toFixed(2)}</span>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="order-footer">
                                        <div className="order-total">
                                            <span>Total:</span>
                                            {/* <span className="total-amount">${order.total.toFixed(2)}</span> */}
                                            <span className="total-amount">${Number(order.total_amount).toFixed(2)}</span>

                                        </div>
                                        <div className="order-actions">
                                            <button
                                                onClick={() => navigate(`/order/${order.id}`)}
                                                className="view-order-btn"
                                            >
                                                View Details
                                            </button>
                                            {order.status === 'delivered' && (
                                                <button className="reorder-btn">
                                                    Reorder
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default OrdersPage;