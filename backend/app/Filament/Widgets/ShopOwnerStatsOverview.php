<?php

namespace App\Filament\Widgets;

use Filament\Widgets\StatsOverviewWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;
use App\Models\Product;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Shop;

class ShopOwnerStatsOverview extends StatsOverviewWidget
{
    protected static ?int $sort = 2;

    protected function getStats(): array
    {
        $user = auth()->user();

        $shop = Shop::where('user_id', $user->id)
            ->where('status', 'approved')
            ->first();

        if (!$shop) {
            return [];
        }

        $shopProductIds = $shop->products()->pluck('id');

        // Get all order IDs that contain this shop's products
        $orderIds = OrderItem::whereIn('product_id', $shopProductIds)
            ->distinct()
            ->pluck('order_id');

        // ✅ Total Orders (from orders table)
        $totalOrders = Order::whereIn('id', $orderIds)->count();

        // ✅ Completed Orders (check orders table, not order_items)
        $completedOrders = Order::whereIn('id', $orderIds)
            ->where('delivery_status', 'completed')
            ->count();

        // ✅ Pending Orders (check orders table)
        $pendingOrders = Order::whereIn('id', $orderIds)
            ->whereIn('delivery_status', ['pending', 'assigned', 'partial'])
            ->count();

        $totalProducts = $shopProductIds->count();

        return [
            Stat::make('Total Products', $totalProducts)
                ->description('in your shop')
                ->icon('heroicon-o-cube')
                ->color('primary'),

            Stat::make('Completed Orders', $completedOrders)
                ->description('Finished orders')
                ->icon('heroicon-o-check-circle')
                ->color('success'),

            Stat::make('Pending Orders', $pendingOrders)
                ->description('Orders Waiting')
                ->icon('heroicon-o-clock')
                ->color('warning'),

            Stat::make('Total Orders', $totalOrders)
                ->description('All Shops Orders')
                ->icon('heroicon-o-shopping-bag')
                ->color('info'),
        ];
    }

    public static function canView(): bool
    {
        $user = auth()->user();

        if (!$user || !$user->isShopOwner()) {
            return false;
        }

        return Shop::where('user_id', $user->id)
            ->where('status', 'approved')
            ->exists();
    }
}