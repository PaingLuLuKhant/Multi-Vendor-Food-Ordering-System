<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('user_favorites', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')
                  ->constrained()
                  ->onDelete('cascade'); // If user is deleted, remove their favorites
            $table->foreignId('shop_id')
                  ->constrained()
                  ->onDelete('cascade'); // If shop is deleted, remove from favorites
            $table->timestamps(); // Adds created_at and updated_at

            // Prevent duplicate favorites for same user and shop
            $table->unique(['user_id', 'shop_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('user_favorites');
    }
};
