<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\EventController;
use App\Http\Controllers\Api\OrganizerEventController;
use App\Http\Controllers\Api\RegistrationController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// Public routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::get('/events', [EventController::class, 'index']);
Route::get('/events/categories', [EventController::class, 'categories']);
Route::get('/events/{id}', [EventController::class, 'show']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);

    // Student only routes
    Route::middleware('role:student')->group(function () {
        Route::post('/events/{id}/register', [RegistrationController::class, 'register']);
        Route::delete('/events/{id}/register', [RegistrationController::class, 'cancel']);
        Route::get('/my-registrations', [RegistrationController::class, 'myRegistrations']);
    });

    // Organizer only routes
    Route::middleware('role:organizer')->group(function () {
        Route::get('/organizer/events', [OrganizerEventController::class, 'index']);
        Route::post('/organizer/events', [OrganizerEventController::class, 'store']);
        Route::put('/organizer/events/{event}', [OrganizerEventController::class, 'update']);
        Route::post('/organizer/events/{event}/publish', [OrganizerEventController::class, 'publish']);
        Route::post('/organizer/events/{event}/cancel', [OrganizerEventController::class, 'cancel']);
        Route::get('/organizer/events/{event}/registrations', [OrganizerEventController::class, 'registrations']);
    });
});
