<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        // ✅ Add delivery_id ONLY if it doesn't exist
        Schema::table('order_items', function (Blueprint $table) {
            if (!Schema::hasColumn('order_items', 'delivery_id')) {
                $table->foreignId('delivery_id')
                    ->nullable()
                    ->constrained('deliveries')
                    ->nullOnDelete()
                    ->after('order_id');
            }
        });

        // ✅ Move data from orders → order_items (if applicable)
        if (
            Schema::hasColumn('orders', 'delivery_id') &&
            Schema::hasColumn('order_items', 'order_id')
        ) {
            DB::statement('
                UPDATE order_items oi
                JOIN orders o ON o.id = oi.order_id
                SET oi.delivery_id = o.delivery_id
                WHERE oi.delivery_id IS NULL
            ');
        }
    }

    public function down(): void
    {
        Schema::table('order_items', function (Blueprint $table) {
            if (Schema::hasColumn('order_items', 'delivery_id')) {
                $table->dropForeign(['delivery_id']);
                $table->dropColumn('delivery_id');
            }
        });
    }
};
