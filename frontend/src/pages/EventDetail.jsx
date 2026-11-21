import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function EventDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [event, setEvent] = useState(null);
    const [isRegistered, setIsRegistered] = useState(false);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const res = await api.get(`/events/${id}`);
                setEvent(res.data);

                // Check if user is registered if logged in
                if (user && user.role === 'student') {
                    const regRes = await api.get('/my-registrations');
                    const registered = regRes.data.some(r => r.event_id === parseInt(id));
                    setIsRegistered(registered);
                }
            } catch (err) {
                setError('Event not found.');
            } finally {
                setLoading(false);
            }
        };

        fetchEvent();
    }, [id, user]);

    const handleRegister = async () => {
        if (!user) {
            navigate('/login');
            return;
        }
        if (user.role !== 'student') return;

        setSubmitting(true);
        try {
            await api.post(`/events/${id}/register`);
            setIsRegistered(true);
            // Refresh event to get updated seats_taken
            const res = await api.get(`/events/${id}`);
            setEvent(res.data);
            alert('Successfully registered!');
        } catch (err) {
            alert(err.response?.data?.message || 'Registration failed.');
        } finally {
            setSubmitting(false);
        }
    };

    const handleCancel = async () => {
        if (!window.confirm('Are you sure you want to cancel your registration?')) return;

        setSubmitting(true);
        try {
            await api.delete(`/events/${id}/register`);
            setIsRegistered(false);
            // Refresh event
            const res = await api.get(`/events/${id}`);
            setEvent(res.data);
            alert('Registration cancelled.');
        } catch (err) {
            alert(err.response?.data?.message || 'Cancellation failed.');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div className="text-center py-12">Loading event details...</div>;
    if (error) return <div className="text-center py-12 text-red-500">{error}</div>;

    const seatsLeft = event.capacity - event.seats_taken;
    const isSoldOut = seatsLeft <= 0;
    const canRegister = user?.role === 'student' || !user;

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <div className="bg-white shadow-lg rounded-lg overflow-hidden">
                <div className="p-8">
                    <div className="flex justify-between items-center mb-6">
                        <span className="bg-indigo-100 text-indigo-800 text-sm font-semibold px-3 py-1 rounded">
                            {event.category?.name}
                        </span>
                        <span className={`text-sm font-bold px-3 py-1 rounded ${isSoldOut ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                            {isSoldOut ? 'SOLD OUT' : `${seatsLeft} seats remaining of ${event.capacity}`}
                        </span>
                    </div>

                    <h1 className="text-4xl font-extrabold text-gray-900 mb-4">{event.title}</h1>

                    <div className="flex flex-wrap gap-6 mb-8 text-gray-600 border-b border-gray-100 pb-6">
                        <div>
                            <p className="text-xs uppercase font-bold text-gray-400">Date & Time</p>
                            <p className="font-medium">{new Date(event.starts_at).toLocaleString()}</p>
                        </div>
                        <div>
                            <p className="text-xs uppercase font-bold text-gray-400">Location</p>
                            <p className="font-medium">{event.location}</p>
                        </div>
                        <div>
                            <p className="text-xs uppercase font-bold text-gray-400">Organizer</p>
                            <p className="font-medium">{event.organizer?.name}</p>
                        </div>
                    </div>

                    <div className="prose max-w-none text-gray-700 mb-10">
                        <h3 className="text-xl font-bold mb-2">About this event</h3>
                        <p className="whitespace-pre-line">{event.description}</p>
                    </div>

                    <div className="bg-gray-50 -mx-8 -mb-8 p-8 border-t border-gray-100">
                        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                            <div>
                                <p className="text-sm text-gray-500 font-medium italic">
                                    Registration closes on {new Date(event.registration_cutoff).toLocaleString()}
                                </p>
                            </div>

                            {canRegister && (
                                isRegistered ? (
                                    <button
                                        onClick={handleCancel}
                                        disabled={submitting}
                                        className="w-full md:w-auto bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-lg transition duration-200 disabled:opacity-50"
                                    >
                                        {submitting ? 'Processing...' : 'Cancel Registration'}
                                    </button>
                                ) : (
                                    <button
                                        onClick={handleRegister}
                                        disabled={submitting || isSoldOut}
                                        className={`w-full md:w-auto text-white font-bold py-3 px-8 rounded-lg transition duration-200 disabled:opacity-50 ${
                                            isSoldOut ? 'bg-gray-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'
                                        }`}
                                    >
                                        {submitting ? 'Processing...' : isSoldOut ? 'Waitlist Full' : 'Register Now'}
                                    </button>
                                )
                            )}

                            {user?.role === 'organizer' && (
                                <p className="text-indigo-600 font-medium">Logged in as organizer</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
