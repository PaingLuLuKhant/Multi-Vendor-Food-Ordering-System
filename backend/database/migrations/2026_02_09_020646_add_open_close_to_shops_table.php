<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('shops', function (Blueprint $table) {
            $table->string('open_time')->nullable()->after('category');
            $table->string('close_time')->nullable()->after('open_time');
            $table->boolean('is_closed_today')->default(false)->after('close_time');
        });
    }

    public function down(): void
    {
        Schema::table('shops', function (Blueprint $table) {
            $table->dropColumn(['open_time', 'close_time', 'is_closed_today']);
        });
    }
};