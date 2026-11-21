<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Event;
use App\Models\EventCategory;
use Illuminate\Http\Request;

class EventController extends Controller
{
    public function index(Request $request)
    {
        $query = Event::with('category', 'organizer')
            ->where('status', 'published');

        if ($request->has('search')) {
            $query->where('title', 'like', '%' . $request->search . '%');
        }

        if ($request->has('category_id')) {
            $query->where('category_id', $request->category_id);
        }

        return response()->json($query->latest()->get());
    }

    public function show($id)
    {
        $event = Event::with('category', 'organizer')
            ->where('status', 'published')
            ->findOrFail($id);

        return response()->json($event);
    }

    public function categories()
    {
        return response()->json(EventCategory::all());
    }
}
