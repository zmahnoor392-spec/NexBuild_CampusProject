<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Event;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class OrganizerEventController extends Controller
{
    public function index()
    {
        $events = Event::with('category')
            ->where('organizer_id', Auth::id())
            ->latest()
            ->get();

        return response()->json($events);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'category_id' => 'required|exists:event_categories,id',
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'location' => 'required|string',
            'starts_at' => 'required|date|after:now',
            'registration_cutoff' => 'required|date|before:starts_at',
            'capacity' => 'required|integer|min:1',
        ]);

        $event = Event::create(array_merge($validated, [
            'organizer_id' => Auth::id(),
            'status' => 'draft',
            'seats_taken' => 0
        ]));

        return response()->json($event, 201);
    }

    public function update(Request $request, Event $event)
    {
        $this->authorizeOwner($event);

        $validated = $request->validate([
            'category_id' => 'sometimes|exists:event_categories,id',
            'title' => 'sometimes|string|max:255',
            'description' => 'sometimes|string',
            'location' => 'sometimes|string',
            'starts_at' => 'sometimes|date|after:now',
            'registration_cutoff' => 'sometimes|date|before:starts_at',
            'capacity' => 'sometimes|integer|min:1',
        ]);

        $event->update($validated);

        return response()->json($event);
    }

    public function publish(Event $event)
    {
        $this->authorizeOwner($event);

        $event->update(['status' => 'published']);

        return response()->json(['message' => 'Event published successfully', 'event' => $event]);
    }

    public function cancel(Event $event)
    {
        $this->authorizeOwner($event);

        $event->update(['status' => 'cancelled']);

        return response()->json(['message' => 'Event cancelled successfully', 'event' => $event]);
    }

    public function registrations(Event $event)
    {
        $this->authorizeOwner($event);

        $registrations = $event->registrations()
            ->with('user')
            ->latest()
            ->get();

        return response()->json($registrations);
    }

    protected function authorizeOwner(Event $event)
    {
        if ($event->organizer_id !== Auth::id()) {
            abort(403, 'Unauthorized action.');
        }
    }
}
