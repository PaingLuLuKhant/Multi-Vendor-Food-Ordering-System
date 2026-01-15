// import React from 'react';
// import { Navigate, useLocation } from 'react-router-dom';
// import { useAuth } from '../../context/AuthContext';

// const PrivateRoute = ({ children }) => {
//   const { isAuthenticated, isLoading } = useAuth();
//   const location = useLocation();

// //   if (isLoading) {
// //     return (
// //       <div className="loading-screen">
// //         <div className="spinner"></div>
// //         <p>Loading...</p>
// //       </div>
// //     );
// //   }

//     if (isLoading) return <div> Loading ... </div>;

//   if (!isAuthenticated) {
//     // Redirect to login page, saving the location they tried to access
//     return <Navigate to="/login" state={{ from: location }} replace />;
//   }

//   return children;
// };

// export default PrivateRoute;

import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const PrivateRoute = ({ children }) => {
    const { user, loading } = useAuth();

    if (loading) return <p>Loading...</p>;

    return user ? children : <Navigate to="/login" replace />;
};

export default PrivateRoute;
