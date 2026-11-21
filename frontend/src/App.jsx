import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import EventList from './pages/EventList';
import EventDetail from './pages/EventDetail';
import Login from './pages/Login';
import Register from './pages/Register';
import OrganizerDashboard from './pages/OrganizerDashboard';

const ProtectedRoute = ({ children, role }) => {
    const { user, loading } = useAuth();
    if (loading) return null;
    if (!user) return <Navigate to="/login" />;
    if (role && user.role !== role) return <Navigate to="/" />;
    return children;
};

function AppRoutes() {
    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <Routes>
                <Route path="/" element={<EventList />} />
                <Route path="/events/:id" element={<EventDetail />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route
                    path="/organizer"
                    element={
                        <ProtectedRoute role="organizer">
                            <OrganizerDashboard />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/my-registrations"
                    element={
                        <ProtectedRoute role="student">
                            <div className="max-w-7xl mx-auto px-4 py-8">
                                <h1 className="text-3xl font-bold mb-6">My Registered Events</h1>
                                <p className="text-gray-500">Feature coming soon: View a list of all your active registrations here.</p>
                            </div>
                        </ProtectedRoute>
                    }
                />
            </Routes>
        </div>
    );
}

function App() {
    return (
        <Router>
            <AuthProvider>
                <AppRoutes />
            </AuthProvider>
        </Router>
    );
}

export default App;
