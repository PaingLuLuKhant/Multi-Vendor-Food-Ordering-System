<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        $hasDeliveryId = Schema::hasColumn('orders', 'delivery_id');
        $hasDeliveryStatus = Schema::hasColumn('orders', 'delivery_status');

        Schema::table('orders', function (Blueprint $table) use ($hasDeliveryId, $hasDeliveryStatus) {
            if (! $hasDeliveryId) {
                $table->foreignId('delivery_id')->nullable()->constrained('deliveries')->nullOnDelete();
            }

            if (! $hasDeliveryStatus) {
                $table->string('delivery_status')->default('pending');
            }
        });

        if (! Schema::hasColumn('order_items', 'delivery_id') || ! Schema::hasColumn('order_items', 'delivery_status')) {
            return;
        }

        DB::table('orders')
            ->select('id')
            ->orderBy('id')
            ->chunkById(100, function (Collection $orders) {
                $itemsByOrder = DB::table('order_items')
                    ->whereIn('order_id', $orders->pluck('id'))
                    ->select('order_id', 'delivery_id', 'delivery_status')
                    ->orderBy('id')
                    ->get()
                    ->groupBy('order_id');

                foreach ($orders as $order) {
                    $items = $itemsByOrder->get($order->id, collect());

                    if ($items->isEmpty()) {
                        continue;
                    }

                    DB::table('orders')
                        ->where('id', $order->id)
                        ->update([
                            'delivery_id' => $this->resolveDeliveryId($items),
                            'delivery_status' => $this->resolveDeliveryStatus($items),
                        ]);
                }
            });
    }

    public function down(): void
    {
        $hasDeliveryId = Schema::hasColumn('orders', 'delivery_id');
        $hasDeliveryStatus = Schema::hasColumn('orders', 'delivery_status');

        Schema::table('orders', function (Blueprint $table) use ($hasDeliveryId, $hasDeliveryStatus) {
            if ($hasDeliveryId) {
                $table->dropForeign(['delivery_id']);
            }

            if ($hasDeliveryId && $hasDeliveryStatus) {
                $table->dropColumn(['delivery_id', 'delivery_status']);
            } elseif ($hasDeliveryId) {
                $table->dropColumn('delivery_id');
            } elseif ($hasDeliveryStatus) {
                $table->dropColumn('delivery_status');
            }
        });
    }

    private function resolveDeliveryId(Collection $items): ?int
    {
        $deliveryIds = $items->pluck('delivery_id')->filter();

        if ($deliveryIds->isEmpty()) {
            return null;
        }

        return (int) $deliveryIds
            ->countBy()
            ->sortDesc()
            ->keys()
            ->first();
    }

    private function resolveDeliveryStatus(Collection $items): string
    {
        $statuses = $items->pluck('delivery_status')->filter();

        if ($statuses->isEmpty()) {
            return 'pending';
        }

        if ($statuses->every(fn (string $status) => $status === 'completed')) {
            return 'completed';
        }

        if ($statuses->contains('pending') && $statuses->contains(fn (string $status) => in_array($status, ['assigned', 'completed'], true))) {
            return 'partial';
        }

        if ($statuses->every(fn (string $status) => in_array($status, ['assigned', 'completed'], true))) {
            return 'assigned';
        }

        return 'pending';
    }
};
