<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Event;
use App\Models\EventRegistration;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class RegistrationController extends Controller
{
    public function register(Request $request, $eventId)
    {
        return DB::transaction(function () use ($eventId) {
            // STEP 6: PROTECT THE LAST SEAT
            // Lock the event row for update to prevent race conditions
            $event = Event::where('id', $eventId)
                ->lockForUpdate()
                ->firstOrFail();

            // 1. Check if event is published
            if ($event->status !== 'published') {
                return response()->json(['message' => 'This event is not open for registration.'], 422);
            }

            // 2. Check registration cutoff
            if (Carbon::now()->isAfter($event->registration_cutoff)) {
                return response()->json(['message' => 'Registration period has ended.'], 422);
            }

            // 3. Check capacity
            if ($event->seats_taken >= $event->capacity) {
                return response()->json(['message' => 'Event is full.'], 422);
            }

            // 4. Check for duplicate active registration
            $existing = EventRegistration::where('user_id', Auth::id())
                ->where('event_id', $eventId)
                ->where('status', 'active')
                ->first();

            if ($existing) {
                return response()->json(['message' => 'You are already registered for this event.'], 422);
            }

            // 5. Create registration
            $registration = EventRegistration::create([
                'user_id' => Auth::id(),
                'event_id' => $eventId,
                'status' => 'active',
            ]);

            // 6. Increment seats_taken
            $event->increment('seats_taken');

            return response()->json([
                'message' => 'Successfully registered for the event.',
                'registration' => $registration
            ], 201);
        });
    }

    public function cancel($eventId)
    {
        return DB::transaction(function () use ($eventId) {
            $registration = EventRegistration::where('user_id', Auth::id())
                ->where('event_id', $eventId)
                ->where('status', 'active')
                ->firstOrFail();

            $event = Event::where('id', $eventId)->lockForUpdate()->firstOrFail();

            // Update registration status
            $registration->update(['status' => 'cancelled']);

            // Decrement seats_taken
            if ($event->seats_taken > 0) {
                $event->decrement('seats_taken');
            }

            // Optional: Actually delete if you don't want to keep cancelled history
            // $registration->delete();

            return response()->json(['message' => 'Registration cancelled successfully.']);
        });
    }

    public function myRegistrations()
    {
        $registrations = EventRegistration::with('event.category', 'event.organizer')
            ->where('user_id', Auth::id())
            ->where('status', 'active')
            ->latest()
            ->get();

        return response()->json($registrations);
    }
}
