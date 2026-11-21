<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Event extends Model
{
    protected $fillable = [
        'organizer_id',
        'category_id',
        'title',
        'description',
        'location',
        'starts_at',
        'registration_cutoff',
        'capacity',
        'seats_taken',
        'status',
    ];

    protected $casts = [
        'starts_at' => 'datetime',
        'registration_cutoff' => 'datetime',
    ];

    public function organizer()
    {
        return $this->belongsTo(User::class, 'organizer_id');
    }

    public function category()
    {
        return $this->belongsTo(EventCategory::class, 'category_id');
    }

    public function registrations()
    {
        return $this->hasMany(EventRegistration::class);
    }
}
