import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            api.get('/me')
                .then(res => {
                    setUser(res.data);
                })
                .catch(() => {
                    localStorage.removeItem('token');
                    setUser(null);
                })
                .finally(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, []);

    const login = async (email, password) => {
        const response = await api.post('/login', { email, password });
        localStorage.setItem('token', response.data.access_token);
        setUser(response.data.user);
        return response.data.user;
    };

    const register = async (name, email, password, password_confirmation, role) => {
        const response = await api.post('/register', {
            name, email, password, password_confirmation, role
        });
        localStorage.setItem('token', response.data.access_token);
        setUser(response.data.user);
        return response.data.user;
    };

    const logout = async () => {
        try {
            await api.post('/logout');
        } catch (e) {
            console.error(e);
        }
        localStorage.removeItem('token');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
