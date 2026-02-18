import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import './CheckoutPage.css';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { cart, quantities, getCartTotal, clearCart } = useCart();
  const { user, token } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    phone: '',
    paymentMethod: 'cash'
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Auto-fill user data when component mounts or user changes
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || ''
      }));
    }
  }, [user]);

  const deliveryFee = 2.99;
  const subtotal = parseFloat(getCartTotal());
  const total = subtotal + deliveryFee;

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    
    if (name === 'phone') {
      // Just allow digits, no auto-formatting
      const phoneNumber = value.replace(/\D/g, '');
      setFormData(prev => ({
        ...prev,
        [name]: phoneNumber
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  // Validate Myanmar phone number
  const validateMyanmarPhone = (phone) => {
    const cleanPhone = phone.replace(/\D/g, '');
    
    if (!cleanPhone.trim()) {
      return 'Phone number is required';
    }
    
    if (!cleanPhone.startsWith('09')) {
      return 'Phone number must start with 09';
    }
    
    const length = cleanPhone.length;
    if (length < 9) {
      return `Phone number too short (${length} digits). Need 9-11 digits`;
    }
    
    if (length > 11) {
      return `Phone number too long (${length} digits). Maximum 11 digits`;
    }
    
    if (!/^09\d+$/.test(cleanPhone)) {
      return 'Invalid phone number format';
    }
    
    return '';
  };

  // Format phone for display
  const formatPhoneForDisplay = (phone) => {
    const cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.length === 0) return '';
    
    if (cleanPhone.length === 11) {
      return cleanPhone.replace(/(\d{3})(\d{3})(\d{4})/, '$1 $2 $3');
    } else if (cleanPhone.length === 10) {
      return cleanPhone.replace(/(\d{3})(\d{3})(\d{3})/, '$1 $2 $3');
    } else if (cleanPhone.length === 9) {
      return cleanPhone.replace(/(\d{3})(\d{3})(\d{3})/, '$1 $2 $3');
    }
    
    return cleanPhone;
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Please enter your name';
    }
    
    const phoneError = validateMyanmarPhone(formData.phone);
    if (phoneError) {
      newErrors.phone = phoneError;
    }
    
    if (!formData.address.trim()) {
      newErrors.address = 'Please enter your delivery address';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle order submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!validateForm()) {
      return;
    }
    
    // Check if user is logged in
    if (!user) {
      alert('Please log in to place an order');
      navigate('/login', { state: { from: '/checkout' } });
      return;
    }
    
    setLoading(true);

    try {
      // Clean phone number (digits only)
      const cleanPhone = formData.phone.replace(/\D/g, '');

      // Prepare API payload
      const orderItems = cart.map(item => ({
        product_id: item.id,
        quantity: quantities[item.id] || 1,
        price: item.price
      }));

      const data = {
        total_amount: parseFloat(total.toFixed(2)),
        items: orderItems,
        customer_name: formData.name,
        customer_email: formData.email,
        customer_phone: cleanPhone,
        customer_address: formData.address,
        payment_method: formData.paymentMethod,
        user_id: user.id
      };

      // Send order to backend API
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

      // Prepare confirmation data from both cart and form data
      const confirmationData = {
        // From the form
        name: formData.name,
        email: formData.email,
        address: formData.address,
        phone: cleanPhone,
        paymentMethod: formData.paymentMethod,
        
        // From cart
        items: cart.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          shopName: item.shopName || 'Unknown Shop'
        })),
        quantities: { ...quantities },
        
        // Calculated totals
        subtotal: subtotal.toFixed(2),
        deliveryFee: deliveryFee.toFixed(2),
        serviceFee: '1.49',
        total: total.toFixed(2),
        
        // From API response
        orderId: result.id || result.order_id,
        orderNumber: result.order_number,
        createdAt: result.created_at,
        status: result.status
      };

      // Clear cart
      clearCart();

      // Navigate to confirmation page with complete data
      navigate('/order-confirmation', {
        state: { 
          orderDetails: confirmationData
        }
      });

    } catch (error) {
      console.error('Order submission failed:', error.message);
      alert(`Order submission failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/cart');
  };

  // If user is not logged in, show message
  if (!user) {
    return (
      <div className="checkout-page">
        <div className="checkout-container">
          <div className="login-required">
            <h2>Please Log In</h2>
            <p>You need to be logged in to proceed to checkout.</p>
            <button 
              onClick={() => navigate('/login', { state: { from: '/checkout' } })}
              className="login-btn"
            >
              Go to Login
            </button>
            <button 
              onClick={() => navigate('/cart')}
              className="cancel-btn"
            >
              Back to Cart
            </button>
          </div>
        </div>
      </div>
    );
  }

  const displayPhone = formatPhoneForDisplay(formData.phone);

  return (
    <div className="checkout-page">
      <div className="checkout-container">
        <h1>Checkout</h1>
        <div className="checkout-content">

          {/* Delivery Form */}
          <form onSubmit={handleSubmit} className="checkout-form">
            <h2>Delivery Information</h2>

            <div className="form-group">
              <label htmlFor="name">Full Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                placeholder="John Doe"
                className={errors.name ? 'error' : ''}
              />
              {errors.name && <div className="error-message">{errors.name}</div>}
              <small className="field-note">Auto-filled from your account</small>
            </div>

            <div className="form-group">
              <label htmlFor="phone">Phone Number *</label>
              <div className="phone-input-wrapper">
                <span className="phone-prefix">+95</span>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  placeholder="09XXXXXXXXX"
                  className={errors.phone ? 'error' : ''}
                />
              </div>
              
              {errors.phone ? (
                <div className="error-message">{errors.phone}</div>
              ) : (
                <small className="phone-hint">Format: 09XXXXXXXXX (9-11 digits)</small>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="john@example.com"
              />
              <small className="field-note">Auto-filled from your account</small>
            </div>

            <div className="form-group">
              <label htmlFor="address">Delivery Address *</label>
              <textarea
                id="address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                required
                placeholder="House/Street number, Street name, Township, City"
                rows="3"
                className={errors.address ? 'error' : ''}
              />
              {errors.address && <div className="error-message">{errors.address}</div>}
            </div>

            <h2>Payment Method</h2>
            <div className="payment-methods">
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
            </div>

            <div className="form-actions">
              <button type="button" onClick={handleCancel} className="cancel-btn">
                Cancel
              </button>
              <button type="submit" className="submit-order-btn" disabled={loading}>
                {loading ? 'Placing Order...' : `Place Order - MMK ${total.toFixed(2)}`}
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
                    <span className="item-price">MMK {(item.price * qty).toFixed(2)}</span>
                  </div>
                );
              })}
            </div>

            <div className="price-breakdown">
              <div className="price-row">
                <span>Subtotal</span>
                <span>MMK {subtotal.toFixed(2)}</span>
              </div>
              <div className="price-row">
                <span>Delivery Fee</span>
                <span>MMK {deliveryFee.toFixed(2)}</span>
              </div>
              
              <div className="price-row total">
                <span>Total</span>
                <span>MMK {total.toFixed(2)}</span>
              </div>
            </div>

            <div className="customer-info-summary">
              <h3>👤 Customer Information</h3>
              <p><strong>Name:</strong> {formData.name || 'Not provided'}</p>
              <p><strong>Phone:</strong> {displayPhone || 'Not provided'}</p>
              <p><strong>Email:</strong> {formData.email || 'Not provided'}</p>
            </div>

            <div className="phone-note">
              <p>📞 We'll call you at {displayPhone || 'your number'} for delivery confirmation</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;