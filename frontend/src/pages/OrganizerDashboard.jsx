import React, { useState, useEffect } from 'react';
import api from '../api/axios';

export default function OrganizerDashboard() {
    const [events, setEvents] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [registrations, setRegistrations] = useState([]);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        location: '',
        category_id: '',
        starts_at: '',
        registration_cutoff: '',
        capacity: ''
    });

    useEffect(() => {
        fetchEvents();
        api.get('/events/categories').then(res => setCategories(res.data));
    }, []);

    const fetchEvents = async () => {
        try {
            const res = await api.get('/organizer/events');
            setEvents(res.data);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateOrUpdate = async (e) => {
        e.preventDefault();
        try {
            if (formData.id) {
                await api.put(`/organizer/events/${formData.id}`, formData);
            } else {
                await api.post('/organizer/events', formData);
            }
            setShowForm(false);
            setFormData({ title: '', description: '', location: '', category_id: '', starts_at: '', registration_cutoff: '', capacity: '' });
            fetchEvents();
        } catch (err) {
            alert('Operation failed');
        }
    };

    const handlePublish = async (id) => {
        await api.post(`/organizer/events/${id}/publish`);
        fetchEvents();
    };

    const handleCancel = async (id) => {
        if (window.confirm('Cancel this event?')) {
            await api.post(`/organizer/events/${id}/cancel`);
            fetchEvents();
        }
    };

    const viewRegistrations = async (event) => {
        setSelectedEvent(event);
        const res = await api.get(`/organizer/events/${event.id}/registrations`);
        setRegistrations(res.data);
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Organizer Dashboard</h1>
                <button
                    onClick={() => { setShowForm(true); setFormData({ title: '', description: '', location: '', category_id: '', starts_at: '', registration_cutoff: '', capacity: '' }); }}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium"
                >
                    Create New Event
                </button>
            </div>

            {showForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <h2 className="text-2xl font-bold mb-4">{formData.id ? 'Edit Event' : 'Create New Event'}</h2>
                        <form onSubmit={handleCreateOrUpdate} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium">Title</label>
                                <input type="text" required className="w-full border p-2 rounded" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium">Category</label>
                                    <select required className="w-full border p-2 rounded" value={formData.category_id} onChange={e => setFormData({...formData, category_id: e.target.value})}>
                                        <option value="">Select Category</option>
                                        {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium">Capacity</label>
                                    <input type="number" required className="w-full border p-2 rounded" value={formData.capacity} onChange={e => setFormData({...formData, capacity: e.target.value})} />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium">Location</label>
                                <input type="text" required className="w-full border p-2 rounded" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium">Starts At</label>
                                    <input type="datetime-local" required className="w-full border p-2 rounded" value={formData.starts_at} onChange={e => setFormData({...formData, starts_at: e.target.value})} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium">Registration Cutoff</label>
                                    <input type="datetime-local" required className="w-full border p-2 rounded" value={formData.registration_cutoff} onChange={e => setFormData({...formData, registration_cutoff: e.target.value})} />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium">Description</label>
                                <textarea required className="w-full border p-2 rounded h-32" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}></textarea>
                            </div>
                            <div className="flex justify-end gap-4 mt-6">
                                <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 text-gray-600">Cancel</button>
                                <button type="submit" className="bg-indigo-600 text-white px-6 py-2 rounded">Save Event</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {selectedEvent && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg p-8 max-w-2xl w-full">
                        <div className="flex justify-between mb-4">
                            <h2 className="text-2xl font-bold">Registrations: {selectedEvent.title}</h2>
                            <button onClick={() => setSelectedEvent(null)} className="text-gray-500 text-xl">&times;</button>
                        </div>
                        <div className="max-h-64 overflow-y-auto border rounded">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Student</th>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {registrations.map(reg => (
                                        <tr key={reg.id}>
                                            <td className="px-4 py-2 text-sm">{reg.user.name}</td>
                                            <td className="px-4 py-2 text-sm text-gray-500">{reg.user.email}</td>
                                            <td className="px-4 py-2 text-sm">
                                                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${reg.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                    {reg.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                    {registrations.length === 0 && <tr><td colSpan="3" className="text-center py-4 text-gray-500">No registrations yet.</td></tr>}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            <div className="bg-white shadow rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Event</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Registration</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {events.map(event => (
                            <tr key={event.id}>
                                <td className="px-6 py-4">
                                    <div className="text-sm font-medium text-gray-900">{event.title}</div>
                                    <div className="text-xs text-gray-500">{new Date(event.starts_at).toLocaleDateString()}</div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                                        ${event.status === 'published' ? 'bg-green-100 text-green-800' :
                                          event.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
                                          'bg-red-100 text-red-800'}`}>
                                        {event.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-500">
                                    {event.seats_taken} / {event.capacity}
                                </td>
                                <td className="px-6 py-4 text-right text-sm font-medium space-x-3">
                                    <button onClick={() => viewRegistrations(event)} className="text-indigo-600 hover:text-indigo-900">View Users</button>
                                    {event.status === 'draft' && (
                                        <>
                                            <button onClick={() => { setFormData({...event, category_id: event.category_id.toString()}); setShowForm(true); }} className="text-gray-600 hover:text-gray-900">Edit</button>
                                            <button onClick={() => handlePublish(event.id)} className="text-green-600 hover:text-green-900">Publish</button>
                                        </>
                                    )}
                                    {event.status !== 'cancelled' && (
                                        <button onClick={() => handleCancel(event.id)} className="text-red-600 hover:text-red-900">Cancel</button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
