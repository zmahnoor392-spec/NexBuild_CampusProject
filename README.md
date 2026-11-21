# Campus Event Registration Web App

A university-focused platform where students can discover and register for events, and organizers can manage them.

## Tech Stack
- **Backend:** Laravel 11 (PHP 8.2+), MySQL, Laravel Sanctum (Auth)
- **Frontend:** React (Vite), Tailwind CSS, Axios

## Features
- **Authentication:** Token-based login and registration with Student/Organizer roles.
- **Event Discovery:** Search by title and filter by category for published events.
- **Registration Logic:** 
    - Database transactions with `lockForUpdate()` to prevent over-selling seats.
    - Prevents duplicate active registrations.
    - Blocks registration after the cutoff date or when capacity is reached.
- **Organizer Tools:** Create, edit, publish, and cancel events; view participant lists.

## API Endpoints

### Public / Auth
- `POST /api/register` - Create new account
- `POST /api/login` - Get auth token
- `GET /api/events` - List published events (searchable)
- `GET /api/events/{id}` - Event details
- `GET /api/events/categories` - List categories

### Student (Requires `student` role)
- `POST /api/events/{id}/register` - Register for an event (locks seat)
- `DELETE /api/events/{id}/register` - Cancel registration (frees seat)
- `GET /api/my-registrations` - List current registrations

### Organizer (Requires `organizer` role)
- `GET /api/organizer/events` - List managed events
- `POST /api/organizer/events` - Create draft event
- `PUT /api/organizer/events/{event}` - Update event details
- `POST /api/organizer/events/{event}/publish` - Make event public
- `POST /api/organizer/events/{event}/cancel` - Cancel event
- `GET /api/organizer/events/{event}/registrations` - View attendee list

## Setup Instructions

### Backend
1. `cd backend`
2. `composer install`
3. Copy `.env.example` to `.env` and configure your MySQL database.
4. `php artisan key:generate`
5. `php artisan migrate --seed`
6. `php artisan serve`

### Frontend
1. `cd frontend`
2. `npm install`
3. `npm run dev`

## Database Schema
- `users`: id, name, email, password, role (student/organizer)
- `event_categories`: id, name
- `events`: id, organizer_id, category_id, title, description, location, starts_at, registration_cutoff, capacity, seats_taken, status (draft/published/cancelled)
- `event_registrations`: id, user_id, event_id, status (active/cancelled)
- `event_attendance`: id, registration_id, checked_in_at
- `notifications`: id, user_id, title, message, is_read
