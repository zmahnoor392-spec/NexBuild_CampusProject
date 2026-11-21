<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\EventCategory;
use App\Models\Event;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Carbon\Carbon;

fn () => null; // placeholder for syntax validity

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Create 2 organizers
        $organizer1 = User::create([
            'name' => 'Prof. Sarah Jenkins',
            'email' => 'organizer1@campus.edu',
            'password' => Hash::make('password'),
            'role' => 'organizer',
        ]);

        $organizer2 = User::create([
            'name' => 'Student Union Admin',
            'email' => 'organizer2@campus.edu',
            'password' => Hash::make('password'),
            'role' => 'organizer',
        ]);

        // Create 3 students
        $student1 = User::create([
            'name' => 'Alice Smith',
            'email' => 'student1@campus.edu',
            'password' => Hash::make('password'),
            'role' => 'student',
        ]);

        $student2 = User::create([
            'name' => 'Bob Jones',
            'email' => 'student2@campus.edu',
            'password' => Hash::make('password'),
            'role' => 'student',
        ]);

        $student3 = User::create([
            'name' => 'Charlie Brown',
            'email' => 'student3@campus.edu',
            'password' => Hash::make('password'),
            'role' => 'student',
        ]);

        // Create 3 categories
        $cat1 = EventCategory::create(['name' => 'Technology']);
        $cat2 = EventCategory::create(['name' => 'Arts & Culture']);
        $cat3 = EventCategory::create(['name' => 'Sports & Fitness']);

        // Create 5 sample events
        Event::create([
            'organizer_id' => $organizer1->id,
            'category_id' => $cat1->id,
            'title' => 'AI and the Future of Software Engineering',
            'description' => 'A comprehensive seminar exploring modern AI trends and LLMs in production software systems.',
            'location' => 'Science Hall 101',
            'starts_at' => Carbon::now()->addDays(5),
            'registration_cutoff' => Carbon::now()->addDays(4),
            'capacity' => 50,
            'seats_taken' => 0,
            'status' => 'published',
        ]);

        Event::create([
            'organizer_id' => $organizer1->id,
            'category_id' => $cat1->id,
            'title' => 'Introductory Cybersecurity Workshop',
            'description' => 'Learn basic web vulnerability scanning and defense strategies in a hands-on lab.',
            'location' => 'Computer Lab B',
            'starts_at' => Carbon::now()->addDays(10),
            'registration_cutoff' => Carbon::now()->addDays(9),
            'capacity' => 2, // Small capacity for testing last seat / race condition
            'seats_taken' => 0,
            'status' => 'published',
        ]);

        Event::create([
            'organizer_id' => $organizer2->id,
            'category_id' => $cat2->id,
            'title' => 'Campus Annual Art Exhibition',
            'description' => 'Showcase of paintings, sculptures, and digital art created by university students.',
            'location' => 'University Gallery',
            'starts_at' => Carbon::now()->addDays(3),
            'registration_cutoff' => Carbon::now()->addDays(2),
            'capacity' => 100,
            'seats_taken' => 0,
            'status' => 'published',
        ]);

        Event::create([
            'organizer_id' => $organizer2->id,
            'category_id' => $cat3->id,
            'title' => 'Inter-Departmental Football Tournament',
            'description' => 'Annual football cup for all departments. Come support your peers!',
            'location' => 'Main Sports Arena',
            'starts_at' => Carbon::now()->addDays(7),
            'registration_cutoff' => Carbon::now()->addDays(6),
            'capacity' => 200,
            'seats_taken' => 0,
            'status' => 'published',
        ]);

        Event::create([
            'organizer_id' => $organizer1->id,
            'category_id' => $cat2->id,
            'title' => 'Symphony Orchestra Spring Concert',
            'description' => 'An evening of classical masterpieces performed by the student symphony orchestra.',
            'location' => 'Main Auditorium',
            'starts_at' => Carbon::now()->addDays(14),
            'registration_cutoff' => Carbon::now()->addDays(13),
            'capacity' => 150,
            'seats_taken' => 0,
            'status' => 'draft', // Draft event for organizer testing
        ]);
    }
}
