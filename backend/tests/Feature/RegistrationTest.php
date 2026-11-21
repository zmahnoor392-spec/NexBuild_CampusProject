<?php

namespace Tests\Feature;

use App\Models\Event;
use App\Models\EventCategory;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use Carbon\Carbon;

class RegistrationTest extends TestCase
{
    use RefreshDatabase;

    public function test_student_can_register_for_event()
    {
        $student = User::factory()->create(['role' => 'student']);
        $category = EventCategory::create(['name' => 'Tech']);
        $event = Event::create([
            'organizer_id' => User::factory()->create(['role' => 'organizer'])->id,
            'category_id' => $category->id,
            'title' => 'Test Event',
            'description' => 'Test',
            'location' => 'Test',
            'starts_at' => Carbon::now()->addDays(2),
            'registration_cutoff' => Carbon::now()->addDay(),
            'capacity' => 10,
            'status' => 'published'
        ]);

        $response = $this->actingAs($student)
            ->postJson("/api/events/{$event->id}/register");

        $response->assertStatus(201);
        $this->assertEquals(1, $event->fresh()->seats_taken);
    }

    public function test_registration_blocked_after_cutoff()
    {
        $student = User::factory()->create(['role' => 'student']);
        $category = EventCategory::create(['name' => 'Tech']);
        $event = Event::create([
            'organizer_id' => User::factory()->create(['role' => 'organizer'])->id,
            'category_id' => $category->id,
            'title' => 'Past Cutoff',
            'description' => 'Test',
            'location' => 'Test',
            'starts_at' => Carbon::now()->addDays(2),
            'registration_cutoff' => Carbon::now()->subDay(),
            'capacity' => 10,
            'status' => 'published'
        ]);

        $response = $this->actingAs($student)
            ->postJson("/api/events/{$event->id}/register");

        $response->assertStatus(422);
        $response->assertJsonFragment(['message' => 'Registration period has ended.']);
    }

    public function test_registration_blocked_when_full()
    {
        $student = User::factory()->create(['role' => 'student']);
        $category = EventCategory::create(['name' => 'Tech']);
        $event = Event::create([
            'organizer_id' => User::factory()->create(['role' => 'organizer'])->id,
            'category_id' => $category->id,
            'title' => 'Full Event',
            'description' => 'Test',
            'location' => 'Test',
            'starts_at' => Carbon::now()->addDays(2),
            'registration_cutoff' => Carbon::now()->addDay(),
            'capacity' => 1,
            'seats_taken' => 1,
            'status' => 'published'
        ]);

        $response = $this->actingAs($student)
            ->postJson("/api/events/{$event->id}/register");

        $response->assertStatus(422);
        $response->assertJsonFragment(['message' => 'Event is full.']);
    }

    public function test_cancellation_frees_seat()
    {
        $student = User::factory()->create(['role' => 'student']);
        $category = EventCategory::create(['name' => 'Tech']);
        $event = Event::create([
            'organizer_id' => User::factory()->create(['role' => 'organizer'])->id,
            'category_id' => $category->id,
            'title' => 'Cancel Test',
            'description' => 'Test',
            'location' => 'Test',
            'starts_at' => Carbon::now()->addDays(2),
            'registration_cutoff' => Carbon::now()->addDay(),
            'capacity' => 10,
            'seats_taken' => 1,
            'status' => 'published'
        ]);

        // Create active registration
        $event->registrations()->create([
            'user_id' => $student->id,
            'status' => 'active'
        ]);

        $response = $this->actingAs($student)
            ->deleteJson("/api/events/{$event->id}/register");

        $response->assertStatus(200);
        $this->assertEquals(0, $event->fresh()->seats_taken);
    }
}
