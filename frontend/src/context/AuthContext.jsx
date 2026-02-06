import React, { createContext, useState, useEffect, useContext } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    // Clear cart data from localStorage
    const clearCartData = () => {
        // Clear generic cart data
        localStorage.removeItem("pos-cart");
        localStorage.removeItem("pos-cart-quantities");
        
        // Clear any user-specific cart data
        const allKeys = Object.keys(localStorage);
        allKeys.forEach(key => {
            if (key.startsWith("cart_")) {
                localStorage.removeItem(key);
            }
        });
    };

    // Restore auth on refresh
    useEffect(() => {
        const savedUser = localStorage.getItem("user");
        const savedToken = localStorage.getItem("token");

        if (savedUser && savedToken) {
            setUser(JSON.parse(savedUser));
            setToken(savedToken);
        }

        setIsLoading(false);
    }, []);

    // ✅ REGISTER
    const register = async (userData) => {
        try {
            const response = await fetch('http://localhost:8000/api/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: userData.name,
                    email: userData.email,
                    password: userData.password,
                    password_confirmation: userData.confirmPassword,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                return { success: false, error: data.message || 'Registration failed' };
            }

            return { success: true };
        } catch (err) {
            console.error('Register error:', err);
            return { success: false, error: 'Registration failed' };
        }
    };

    const login = async (email, password) => {
        try {
            const res = await fetch("http://127.0.0.1:8000/api/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Login failed");
            }

            // ✅ Clear any existing guest cart before logging in
            localStorage.removeItem("pos-cart");
            localStorage.removeItem("pos-cart-quantities");

            // ✅ STORE BOTH
            setUser(data.user);
            setToken(data.token);

            localStorage.setItem("user", JSON.stringify(data.user));
            localStorage.setItem("token", data.token);

            return data;
        } catch (err) {
            console.error("Login failed:", err.message);
            return null;
        }
    };

    const logout = () => {
        // Clear cart data
        clearCartData();
        
        // Clear auth data
        setUser(null);
        setToken(null);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                register,
                isAuthenticated: !!user,
                isLoading,
                login,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);