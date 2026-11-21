import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

export default function EventList() {
    const [events, setEvents] = useState([]);
    const [categories, setCategories] = useState([]);
    const [search, setSearch] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        api.get('/events/categories')
            .then(res => setCategories(res.data))
            .catch(err => console.error(err));
    }, []);

    useEffect(() => {
        setLoading(true);
        const params = {};
        if (search) params.search = search;
        if (categoryId) params.category_id = categoryId;

        api.get('/events', { params })
            .then(res => {
                setEvents(res.data);
                setError(null);
            })
            .catch(err => {
                setError('Failed to load events.');
                console.error(err);
            })
            .finally(() => setLoading(false));
    }, [search, categoryId]);

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                <h1 className="text-3xl font-bold text-gray-900">Upcoming Campus Events</h1>
                <div className="flex gap-4 w-full md:w-auto">
                    <input
                        type="text"
                        placeholder="Search events..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="border border-gray-300 rounded-lg px-4 py-2 w-full md:w-64 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                    <select
                        value={categoryId}
                        onChange={(e) => setCategoryId(e.target.value)}
                        className="border border-gray-300 rounded-lg px-4 py-2 bg-white focus:ring-indigo-500 focus:border-indigo-500"
                    >
                        <option value="">All Categories</option>
                        {categories.map(cat => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                    </select>
                </div>
            </div>

            {loading ? (
                <div className="text-center py-12 text-gray-500">Loading events...</div>
            ) : error ? (
                <div className="text-center py-12 text-red-500">{error}</div>
            ) : events.length === 0 ? (
                <div className="text-center py-12 text-gray-500 bg-white rounded-lg shadow">No events found.</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {events.map(event => {
                        const seatsLeft = event.capacity - event.seats_taken;
                        const isSoldOut = seatsLeft <= 0;
                        return (
                            <div key={event.id} className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col justify-between">
                                <div className="p-6">
                                    <div className="flex justify-between items-start mb-2">
                                        <span className="text-xs font-semibold uppercase tracking-wider bg-indigo-100 text-indigo-800 px-2 py-1 rounded">
                                            {event.category?.name}
                                        </span>
                                        <span className={`text-xs font-semibold px-2 py-1 rounded ${isSoldOut ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                                            {isSoldOut ? 'Sold Out' : `${seatsLeft} seats left`}
                                        </span>
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">{event.title}</h3>
                                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{event.description}</p>
                                    <div className="text-sm text-gray-500 space-y-1">
                                        <p>📍 {event.location}</p>
                                        <p>📅 {new Date(event.starts_at).toLocaleString()}</p>
                                    </div>
                                </div>
                                <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
                                    <span className="text-xs text-gray-500">By {event.organizer?.name}</span>
                                    <Link
                                        to={`/events/${event.id}`}
                                        className="text-indigo-600 hover:text-indigo-800 font-medium text-sm"
                                    >
                                        View Details &rarr;
                                    </Link>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
