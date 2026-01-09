import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load user from localStorage on initial render
  useEffect(() => {
    const loadUser = async () => {
      try {
        const savedUser = localStorage.getItem('pos-user');
        const savedToken = localStorage.getItem('pos-token');
        
        if (savedUser && savedToken) {
          setUser(JSON.parse(savedUser));
        }
      } catch (error) {
        console.error('Error loading user:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  const login = async (email, password) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check registered users first
      const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
      const registeredUser = registeredUsers.find(u => u.email === email && u.password === password);
      
      if (registeredUser) {
        const userData = {
          id: registeredUser.id,
          email: registeredUser.email,
          name: registeredUser.name,
          role: registeredUser.role,
          phone: registeredUser.phone || '',
          address: registeredUser.address || '',
          joinedDate: registeredUser.joinedDate,
          avatar: registeredUser.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(registeredUser.name)}&background=667eea&color=fff&bold=true`
        };
        
        const token = 'mock-jwt-token-' + Date.now();
        
        setUser(userData);
        localStorage.setItem('pos-user', JSON.stringify(userData));
        localStorage.setItem('pos-token', token);
        
        return true;
      }
      
      // Fallback to mock users for demo accounts
      const mockUsers = [
        { 
          id: 1, 
          email: 'customer@demo.com', 
          name: 'John Doe', 
          role: 'customer',
          phone: '+1 (555) 123-4567',
          address: '123 Main St, New York, NY 10001',
          joinedDate: '2024-01-15',
          password: 'demo123'  // Add password field
        },
        { 
          id: 2, 
          email: 'vendor@demo.com', 
          name: 'Jane Smith', 
          role: 'vendor',
          shopName: 'Burger Palace',
          phone: '+1 (555) 987-6543',
          joinedDate: '2024-02-20',
          password: 'demo123'  // Add password field
        },
        { 
          id: 3, 
          email: 'admin@demo.com', 
          name: 'Admin User', 
          role: 'admin',
          phone: '+1 (555) 456-7890',
          joinedDate: '2024-01-01',
          password: 'demo123'  // Add password field
        }
      ];
      
      const mockUser = mockUsers.find(u => u.email === email && u.password === password);
      
      if (mockUser) {
        const userData = {
          id: mockUser.id,
          email: mockUser.email,
          name: mockUser.name,
          role: mockUser.role,
          phone: mockUser.phone,
          address: mockUser.address,
          shopName: mockUser.shopName,
          joinedDate: mockUser.joinedDate,
          avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(mockUser.name)}&background=667eea&color=fff&bold=true`
        };
        
        const token = 'mock-jwt-token-' + Date.now();
        
        setUser(userData);
        localStorage.setItem('pos-user', JSON.stringify(userData));
        localStorage.setItem('pos-token', token);
        
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('pos-user');
    localStorage.removeItem('pos-token');
    localStorage.removeItem('rememberMe');
  };

  const register = async (userData) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Get existing registered users
      const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
      
      // Check if email already exists
      if (registeredUsers.some(u => u.email === userData.email)) {
        return { success: false, error: 'Email already registered' };
      }
      
      const newUser = {
        id: Date.now(),
        email: userData.email,
        name: userData.name,
        role: userData.role || 'customer',
        phone: userData.phone || '',
        address: userData.address || '',
        joinedDate: new Date().toISOString().split('T')[0],
        avatar: userData.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.name)}&background=667eea&color=fff&bold=true`,
        // IMPORTANT: Save the password for login verification
        password: userData.password
      };
      
      // Save to registered users list
      registeredUsers.push(newUser);
      localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
      
      // Also save as current user and login automatically
      const token = 'mock-jwt-token-' + Date.now();
      
      setUser(newUser);
      localStorage.setItem('pos-user', JSON.stringify(newUser));
      localStorage.setItem('pos-token', token);
      
      return { success: true, user: newUser };
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, error: 'Registration failed' };
    }
  };

  const updateProfile = async (userData) => {
    try {
      // Update registered users list if needed
      const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
      const userIndex = registeredUsers.findIndex(u => u.id === user.id);
      
      if (userIndex !== -1) {
        // Don't include password in profile updates
        const {  ...userDataWithoutPassword } = userData;
        registeredUsers[userIndex] = { 
          ...registeredUsers[userIndex], 
          ...userDataWithoutPassword,
          updatedAt: new Date().toISOString()
        };
        localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
      }
      
      // Update current user (without password)
      const {  ...userDataWithoutPassword } = userData;
      const updatedUser = { ...user, ...userDataWithoutPassword };
      setUser(updatedUser);
      localStorage.setItem('pos-user', JSON.stringify(updatedUser));
      
      return { success: true, user: updatedUser };
    } catch (error) {
      console.error('Update profile error:', error);
      return { success: false, error: 'Update failed' };
    }
  };

  // ADD THIS NEW FUNCTION for changing password
  const changePassword = async (currentPassword, newPassword) => {
    try {
      if (!user) {
        return { success: false, error: 'No user logged in' };
      }

      // Get registered users
      const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
      const userIndex = registeredUsers.findIndex(u => u.id === user.id);
      
      if (userIndex === -1) {
        return { success: false, error: 'User not found in registered users' };
      }
      
      // Verify current password
      const currentUser = registeredUsers[userIndex];
      if (currentUser.password !== currentPassword) {
        return { success: false, error: 'Current password is incorrect' };
      }
      
      // Validate new password
      if (newPassword.length < 6) {
        return { success: false, error: 'New password must be at least 6 characters' };
      }
      
      // Update password
      registeredUsers[userIndex] = {
        ...currentUser,
        password: newPassword,
        updatedAt: new Date().toISOString()
      };
      
      localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
      
      return { success: true, message: 'Password changed successfully' };
    } catch (error) {
      console.error('Change password error:', error);
      return { success: false, error: 'Failed to change password' };
    }
  };

  const value = {
    user,
    isLoading,
    login,
    logout,
    register,
    updateProfile,
    changePassword, // Add this to the context value
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};