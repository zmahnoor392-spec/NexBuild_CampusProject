import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        role: 'student'
    });
    const [error, setError] = useState('');
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await register(formData.name, formData.email, formData.password, formData.password_confirmation, formData.role);
            if (formData.role === 'organizer') navigate('/organizer');
            else navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-lg">
                <h2 className="text-center text-3xl font-extrabold text-gray-900">Create your account</h2>
                <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
                    {error && <div className="text-red-500 text-sm text-center">{error}</div>}
                    <input
                        type="text"
                        required
                        placeholder="Full Name"
                        className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                    />
                    <input
                        type="email"
                        required
                        placeholder="Email address"
                        className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                    />
                    <input
                        type="password"
                        required
                        placeholder="Password"
                        className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        value={formData.password}
                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                    />
                    <input
                        type="password"
                        required
                        placeholder="Confirm Password"
                        className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        value={formData.password_confirmation}
                        onChange={(e) => setFormData({...formData, password_confirmation: e.target.value})}
                    />
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">I am a:</label>
                        <select
                            className="block w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            value={formData.role}
                            onChange={(e) => setFormData({...formData, role: e.target.value})}
                        >
                            <option value="student">Student</option>
                            <option value="organizer">Organizer</option>
                        </select>
                    </div>
                    <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                        Register
                    </button>
                    <div className="text-center text-sm">
                        <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">Already have an account? Sign in</Link>
                    </div>
                </form>
            </div>
        </div>
    );
}
