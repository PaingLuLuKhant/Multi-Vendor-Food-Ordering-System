import React from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import './OrderConfirmation.css';

const OrderConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { orderDetails } = location.state || {};

  // Generate a random order number
  const generateOrderNumber = () => {
    // eslint-disable-next-line react-hooks/purity
    return `ORD-${Date.now().toString().slice(-6)}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`;
  };

  const orderNumber = generateOrderNumber();

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
                  <span className="info-value">{orderDetails.name}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Email:</span>
                  <span className="info-value">{orderDetails.email}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Address:</span>
                  <span className="info-value">{orderDetails.address}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Payment Method:</span>
                  <span className="info-value">
                    {orderDetails.paymentMethod === 'credit' && '💳 Credit/Debit Card'}
                    {orderDetails.paymentMethod === 'cash' && '💵 Cash on Delivery'}
                    {orderDetails.paymentMethod === 'digital' && '📱 Digital Wallet'}
                  </span>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="order-items-section">
              <h3>Items Ordered</h3>
              <div className="items-table">
                <div className="table-header">
                  <div className="table-cell">Item</div>
                  <div className="table-cell">Quantity</div>
                  <div className="table-cell">Price</div>
                  <div className="table-cell">Total</div>
                </div>
                {orderDetails.items?.map((item, index) => {
                  const qty = orderDetails.quantities?.[item.id] || 1;
                  return (
                    <div key={index} className="table-row">
                      <div className="table-cell">
                        <div className="item-info">
                          <span className="item-name">{item.name}</span>
                          <span className="item-shop">{item.shopName}</span>
                        </div>
                      </div>
                      <div className="table-cell">×{qty}</div>
                      <div className="table-cell">MMK {item.price.toFixed(2)}</div>
                      <div className="table-cell">MMK {(item.price * qty).toFixed(2)}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Order Summary */}
            <div className="order-summary">
              <h3>Order Summary</h3>
              <div className="summary-grid">
                <div className="summary-row">
                  <span>Subtotal</span>
                  <span>MMK {orderDetails.subtotal || '0.00'}</span>
                </div>
                {/* <div className="summary-row">
                  <span>Delivery Fee</span>
                  <span>${orderDetails.deliveryFee || '2.99'}</span>
                </div> */}
                <div className="summary-row">
                  <span>Service Fee</span>
                  <span>MMK {orderDetails.serviceFee || '1.49'}</span>
                </div>
                <div className="summary-row total">
                  <span>Total</span>
                  <span>MMK {orderDetails.total || '0.00'}</span>
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
                  <span className="delivery-value">{orderDetails.address}</span>
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
            to="/profile/orders" 
            className="view-orders-btn"
          >
            View All Orders
          </Link>
        </div>

        <div className="confirmation-footer">
          <p>A confirmation email has been sent to <strong>{orderDetails.email}</strong></p>
          <p>We'll notify you when your order is ready for delivery.</p>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;