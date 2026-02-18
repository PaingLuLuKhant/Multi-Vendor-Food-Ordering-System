import React from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import './OrderConfirmation.css';

const OrderConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { orderDetails } = location.state || {};

  // Generate a random order number (fallback if not from API)
  const generateOrderNumber = () => {
    return `ORD-${Date.now().toString().slice(-6)}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`;
  };

  // Safely get order number from different sources
  const getOrderNumber = () => {
    if (orderDetails?.orderNumber) return orderDetails.orderNumber;
    if (orderDetails?.orderId) return `ORD-${orderDetails.orderId}`;
    return generateOrderNumber();
  };

  const orderNumber = getOrderNumber();

  if (!orderDetails) {
    return (
      <div className="order-confirmation">
        <div className="confirmation-container">
          <div className="empty-state">
            <div className="empty-icon">😕</div>
            <h2>No Order Found</h2>
            <p>It seems you haven't placed an order yet.</p>
            <Link to="/" className="back-to-home-btn">
              Browse Shops
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Extract data with safe defaults
  const {
    name = '',
    email = '',
    address = '',
    phone = '',
    paymentMethod = 'cash',
    items = [],
    quantities = {},
    subtotal = '0.00',
    deliveryFee = '0.00',
    // serviceFee = '1.49',
    total = '0.00'
  } = orderDetails;

  return (
    <div className="order-confirmation">
      <div className="confirmation-container">
        {/* Success Header */}
        <div className="success-header">
          <div className="success-icon">
            <div className="checkmark">✓</div>
          </div>
          <h1>Order Confirmed!</h1>
          <p className="confirmation-text">
            Thank you for your order. We're preparing it now.
          </p>
          <div className="order-number">
            Order Number: <strong>{orderNumber}</strong>
          </div>
          {phone && (
            <div className="customer-phone">
              We'll contact you at: <strong>+95 {phone}</strong>
            </div>
          )}
        </div>

        <div className="confirmation-content">
          {/* Order Details */}
          <div className="order-details-section">
            <h2>Order Details</h2>
            
            <div className="customer-info">
              <h3>Customer Information</h3>
              <div className="info-grid">
                <div className="info-item">
                  <span className="info-label">Name:</span>
                  <span className="info-value">{name}</span>
                </div>
                {email && (
                  <div className="info-item">
                    <span className="info-label">Email:</span>
                    <span className="info-value">{email}</span>
                  </div>
                )}
                {phone && (
                  <div className="info-item">
                    <span className="info-label">Phone:</span>
                    <span className="info-value">+95 {phone}</span>
                  </div>
                )}
                <div className="info-item">
                  <span className="info-label">Address:</span>
                  <span className="info-value">{address}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Payment Method:</span>
                  <span className="info-value">
                    {paymentMethod === 'credit' && '💳 Credit/Debit Card'}
                    {paymentMethod === 'cash' && '💵 Cash on Delivery'}
                    {paymentMethod === 'digital' && '📱 Digital Wallet'}
                    {paymentMethod === 'card' && '💳 Card'}
                  </span>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="order-items-section">
              <h3>Items Ordered</h3>
              {items.length === 0 ? (
                <div className="no-items">No items in this order</div>
              ) : (
                <div className="items-table">
                  <div className="table-header">
                    <div className="table-cell">Item</div>
                    <div className="table-cell">Quantity</div>
                    <div className="table-cell">Price</div>
                    <div className="table-cell">Total</div>
                  </div>
                  {items.map((item, index) => {
                    // Get quantity from quantities object or default to 1
                    const qty = quantities[item.id] || 1;
                    const itemPrice = parseFloat(item.price) || 0;
                    const itemTotal = itemPrice * qty;
                    
                    return (
                      <div key={index} className="table-row">
                        <div className="table-cell">
                          <div className="item-info">
                            <span className="item-name">{item.name || 'Unnamed Item'}</span>
                            <span className="item-shop">{item.shopName || 'Unknown Shop'}</span>
                          </div>
                        </div>
                        <div className="table-cell">×{qty}</div>
                        <div className="table-cell">MMK {itemPrice.toFixed(2)}</div>
                        <div className="table-cell">MMK {itemTotal.toFixed(2)}</div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Order Summary */}
            <div className="order-summary">
              <h3>Order Summary</h3>
              <div className="summary-grid">
                <div className="summary-row">
                  <span>Subtotal</span>
                  <span>MMK {parseFloat(subtotal).toFixed(2)}</span>
                </div>
                <div className="summary-row">
                  <span>Delivery Fee</span>
                  <span>MMK {parseFloat(deliveryFee).toFixed(2)}</span>
                </div>
                {/* <div className="summary-row">
                  <span>Service Fee</span>
                  <span>MMK {parseFloat(serviceFee).toFixed(2)}</span>
                </div> */}
                <div className="summary-row total">
                  <span>Total</span>
                  <span>MMK {parseFloat(total).toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Delivery Information */}
          <div className="delivery-section">
            <div className="delivery-card">
              <div className="delivery-icon">🚚</div>
              <h3>Delivery Information</h3>
              <div className="delivery-details">
                <div className="delivery-item">
                  <span className="delivery-label">Estimated Delivery:</span>
                  <span className="delivery-value">20-30 minutes</span>
                </div>
                <div className="delivery-item">
                  <span className="delivery-label">Delivery Address:</span>
                  <span className="delivery-value">{address}</span>
                </div>
                <div className="delivery-item">
                  <span className="delivery-label">Status:</span>
                  <span className="delivery-value status-preparing">Preparing your order</span>
                </div>
              </div>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: '25%' }}></div>
              </div>
              <div className="progress-steps">
                <div className="step active">
                  <div className="step-dot"></div>
                  <span>Order Placed</span>
                </div>
                <div className="step">
                  <div className="step-dot"></div>
                  <span>Preparing</span>
                </div>
                <div className="step">
                  <div className="step-dot"></div>
                  <span>On the way</span>
                </div>
                <div className="step">
                  <div className="step-dot"></div>
                  <span>Delivered</span>
                </div>
              </div>
            </div>

            <div className="support-card">
              <h3>Need Help?</h3>
              <p>If you have any questions about your order, contact our support team.</p>
              <div className="support-contacts">
                <div className="contact-item">
                  <span className="contact-icon">📞</span>
                  <span>(+959) 542-9118</span>
                </div>
                <div className="contact-item">
                  <span className="contact-icon">✉️</span>
                  <span>support@posmarketplace.com</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="confirmation-actions">
          <button 
            onClick={() => navigate('/')} 
            className="continue-shopping-btn"
          >
            Continue Shopping
          </button>
          <button 
            onClick={() => window.print()} 
            className="print-receipt-btn"
          >
            Print Receipt
          </button>
          <Link 
            to="/orders" 
            className="view-orders-btn"
          >
            View All Orders
          </Link>
        </div>

        <div className="confirmation-footer">
          {email && (
            <p>A confirmation email has been sent to <strong>{email}</strong></p>
          )}
          <p>We'll notify you when your order is ready for delivery.</p>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;