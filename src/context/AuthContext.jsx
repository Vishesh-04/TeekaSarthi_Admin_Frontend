import React, { createContext, useContext, useState, useEffect } from 'react';
import authApi from '../api/authApi';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check for saved user in localStorage on mount
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
            setUser(JSON.parse(savedUser));
            setIsAuthenticated(true);
        }
        setLoading(false);
    }, []);

    const login = async (userData) => {
        try {
            const response = await authApi.login(userData);

            // Validate response
            if (!response) {
                throw new Error("No response from server");
            }

            // If backend returns 200 OK but with an error message string
            if (typeof response === 'string') {
                // If it's a JSON string, try to parse it
                try {
                    const parsed = JSON.parse(response);
                    if (typeof parsed === 'object') {
                        // It was a JSON string, continue with parsed object
                        // But wait, axios usually parses JSON automatically.
                        // If it's still a string, it's likely a plain text error message.
                    }
                } catch (e) {
                    // Not JSON, so it's a plain string error message
                    throw new Error(response);
                }
            }

            // Assuming response contains user data. Adjust if it has a specific structure like response.user
            const userToSave = response;
            setUser(userToSave);
            setIsAuthenticated(true);
            localStorage.setItem('user', JSON.stringify(userToSave));
            return { success: true };
        } catch (error) {
            console.error("Login failed:", error);
            return { success: false, error: error.response?.data?.message || error.message || "Login failed" };
        }
    };

    const logout = () => {
        setUser(null);
        setIsAuthenticated(false);
        localStorage.removeItem('user');
    };

    return (
        <AuthContext.Provider value={{ user, isAuthenticated, login, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
