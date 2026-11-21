<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EventAttendance extends Model
{
    protected $table = 'event_attendance';

    protected $fillable = [
        'registration_id',
        'checked_in_at',
    ];

    protected $casts = [
        'checked_in_at' => 'datetime',
    ];

    public function registration()
    {
        return $this->belongsTo(EventRegistration::class);
    }
}
