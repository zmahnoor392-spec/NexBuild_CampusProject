import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    return (
        <nav className="bg-indigo-600 text-white shadow-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center space-x-8">
                        <Link to="/" className="text-xl font-bold">Campus Events</Link>
                        {user?.role === 'organizer' && (
                            <Link to="/organizer" className="hover:text-indigo-200">Organizer Dashboard</Link>
                        )}
                        {user?.role === 'student' && (
                            <Link to="/my-registrations" className="hover:text-indigo-200">My Registrations</Link>
                        )}
                    </div>
                    <div className="flex items-center space-x-4">
                        {user ? (
                            <>
                                <span className="text-sm">Hello, {user.name} ({user.role})</span>
                                <button
                                    onClick={handleLogout}
                                    className="bg-indigo-700 hover:bg-indigo-800 px-3 py-1 rounded text-sm font-medium"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="hover:text-indigo-200 text-sm font-medium">Login</Link>
                                <Link to="/register" className="bg-indigo-500 hover:bg-indigo-600 px-3 py-1 rounded text-sm font-medium">Register</Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
