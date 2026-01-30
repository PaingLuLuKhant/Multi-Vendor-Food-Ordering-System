import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import './CheckoutPage.css';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { cart, quantities, getCartTotal, clearCart } = useCart();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    city: '',
    zipCode: '',
    paymentMethod: 'credit'
  });

  const [loading, setLoading] = useState(false);

  const deliveryFee = 2.99;
  const serviceFee = 1.49;
  const subtotal = parseFloat(getCartTotal());
  const total = subtotal + deliveryFee + serviceFee;

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle order submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const orderItems = cart.map(item => ({
        product_id: item.id,
        quantity: quantities[item.id] || 1,
        price: item.price
      }));

      const data = {
        total_amount: parseFloat(total.toFixed(2)),
        items: orderItems,
        ...formData
      };

      const token = localStorage.getItem('token'); // your auth token

      const response = await fetch('http://127.0.0.1:8000/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data)
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Order submission failed');
      }

      console.log('Order response:', result);

      // Clear cart
      clearCart();

      // Navigate to confirmation page
      navigate('/order-confirmation', {
        state: { orderDetails: result }
      });

    } catch (error) {
      console.error('Order submission failed:', error.message);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/cart'); // Go back to cart
  };

  return (
    <div className="checkout-page">
      <div className="checkout-container">
        <h1>Checkout</h1>
        <div className="checkout-content">

          {/* Billing Form */}
          <form onSubmit={handleSubmit} className="checkout-form">
            <h2>Billing Information</h2>

            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                placeholder="John Doe"
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                placeholder="john@example.com"
              />
            </div>

            <div className="form-group">
              <label htmlFor="address">Delivery Address</label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                required
                placeholder="123 Main St"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="city">City</label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  required
                  placeholder="New York"
                />
              </div>
              <div className="form-group">
                <label htmlFor="zipCode">ZIP Code</label>
                <input
                  type="text"
                  id="zipCode"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleInputChange}
                  required
                  placeholder="10001"
                />
              </div>
            </div>

            <h2>Payment Method</h2>
            <div className="payment-methods">
              <label className="payment-option">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="credit"
                  checked={formData.paymentMethod === 'credit'}
                  onChange={handleInputChange}
                />
                <span>💳 Credit/Debit Card</span>
              </label>

              <label className="payment-option">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="cash"
                  checked={formData.paymentMethod === 'cash'}
                  onChange={handleInputChange}
                />
                <span>💵 Cash on Delivery</span>
              </label>

              <label className="payment-option">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="digital"
                  checked={formData.paymentMethod === 'digital'}
                  onChange={handleInputChange}
                />
                <span>📱 Digital Wallet</span>
              </label>
            </div>

            <div className="form-actions">
              <button type="button" onClick={handleCancel} className="cancel-btn">
                Cancel
              </button>
              <button type="submit" className="submit-order-btn" disabled={loading}>
                {loading ? 'Placing Order...' : `Place Order - $${total.toFixed(2)}`}
              </button>
            </div>
          </form>

          {/* Order Summary */}
          <div className="order-summary-sidebar">
            <h2>Order Summary</h2>
            <div className="order-items">
              {cart.map(item => {
                const qty = quantities[item.id] || 1;
                return (
                  <div key={item.id} className="order-item">
                    <span className="item-name">{item.name} × {qty}</span>
                    <span className="item-price">${(item.price * qty).toFixed(2)}</span>
                  </div>
                );
              })}
            </div>

            <div className="price-breakdown">
              <div className="price-row">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="price-row">
                <span>Delivery Fee</span>
                <span>${deliveryFee.toFixed(2)}</span>
              </div>
              <div className="price-row">
                <span>Service Fee</span>
                <span>${serviceFee.toFixed(2)}</span>
              </div>
              <div className="price-row total">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>

            <div className="delivery-info">
              <h3>🚚 Delivery Information</h3>
              <p>Estimated delivery: 20-30 minutes</p>
              <p>Free delivery on orders over $20</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
