<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('event_registrations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('event_id')->constrained('events')->onDelete('cascade');
            $table->enum('status', ['active', 'cancelled'])->default('active');
            $table->timestamps();

            // Unique index for active registrations
            // Note: In MySQL, conditional unique indexes require raw expressions or application-level handling,
            // but we can enforce active/cancelled uniqueness with application logic or a unique index on user_id + event_id + status
        });

        // Add a unique composite index or constraint to prevent duplicate active registrations
        Schema::table('event_registrations', function (Blueprint $table) {
            $table->unique(['user_id', 'event_id'], 'user_event_unique');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('event_registrations');
    }
};
