// import React from 'react';
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import { CartProvider } from './context/CartContext';
// import { AuthProvider } from './context/AuthContext';
// import PrivateRoute from './components/common/PrivateRoute';
// import Header from './components/common/Header';
// import FloatingCart from './components/common/FloatingCart';
// import CartToggleButton from './components/common/CartToggleButton';
// import CustomerDashboard from './components/customer/CustomerDashboard';
// import ShopPage from './components/customer/ShopPage';
// import CartPage from './components/customer/CartPage';
// import UserProfile from './components/customer/UserProfile';
// import CheckoutPage from './pages/CheckoutPage';
// import OrderConfirmation from './pages/OrderConfirmation';
// import LoginPage from './pages/LoginPage';
// import RegisterPage from './pages/RegisterPage';
// import ForgotPasswordPage from './pages/ForgotPasswordPage';
// import OrdersPage from './pages/OrdersPage'; // Create this
// import './styles/App.css';

// function App() {   
//   return (
//     <AuthProvider>
//       <CartProvider>
//         <Router>
//           <div className="App">
//             <Header />
//             <FloatingCart />
//             <CartToggleButton /> 
//             <Routes>
//               {/* Public Routes */}
//               <Route path="/login" element={<LoginPage />} />
//               <Route path="/register" element={<RegisterPage />} />
//               <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              
//               {/* Protected Routes */}
//               <Route path="/" element={
//                 <PrivateRoute>
//                   <CustomerDashboard />
//                 </PrivateRoute>
//               } />
//               <Route path="/shops" element={
//                 <PrivateRoute>
//                   <CustomerDashboard /> {/* Or create ShopsPage */}
//                 </PrivateRoute>
//               } />
//               <Route path="/shop/:id" element={
//                 <PrivateRoute>
//                   <ShopPage />
//                 </PrivateRoute>
//               } />
//               <Route path="/orders" element={
//                 <PrivateRoute>
//                   <OrdersPage /> {/* Create this component */}
//                 </PrivateRoute>
//               } />
//               <Route path="/cart" element={
//                 <PrivateRoute>
//                   <CartPage />
//                 </PrivateRoute>
//               } />
//               <Route path="/checkout" element={
//                 <PrivateRoute>
//                   <CheckoutPage />
//                 </PrivateRoute>
//               } />
//               <Route path="/order-confirmation" element={
//                 <PrivateRoute>
//                   <OrderConfirmation />
//                 </PrivateRoute>
//               } />
//               <Route path="/profile" element={
//                 <PrivateRoute>
//                   <UserProfile />
//                 </PrivateRoute>
//               } />
//             </Routes>
//           </div>
//         </Router>
//       </CartProvider>
//     </AuthProvider>
//   );
// }

// export default App;

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/common/PrivateRoute';
import Header from './components/common/Header';
import CustomerDashboard from './components/customer/CustomerDashboard';
import ShopPage from './components/customer/ShopPage';
import CartPage from './components/customer/CartPage';
import UserProfile from './components/customer/UserProfile';
import CheckoutPage from './pages/CheckoutPage';
import OrderConfirmation from './pages/OrderConfirmation';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import OrdersPage from './pages/OrdersPage';
import './styles/App.css';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <div className="App">
            <Header />
            <Routes>
              {/* 🌍 PUBLIC ROUTES - No login required */}
              <Route path="/" element={<CustomerDashboard />} />
              <Route path="/shop/:id" element={<ShopPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />

              {/* 🔒 PROTECTED ROUTES - Login required */}
              <Route path="/orders" element={
                <PrivateRoute>
                  <OrdersPage />
                </PrivateRoute>
              } />
              <Route path="/checkout" element={
                <PrivateRoute>
                  <CheckoutPage />
                </PrivateRoute>
              } />
              <Route path="/order-confirmation" element={
                <PrivateRoute>
                  <OrderConfirmation />
                </PrivateRoute>
              } />
              <Route path="/profile" element={
                <PrivateRoute>
                  <UserProfile />
                </PrivateRoute>
              } />
            </Routes>
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;                                                                                                                                                                                                                                                                                                   