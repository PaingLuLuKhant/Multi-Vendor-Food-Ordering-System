<?php

namespace App\Filament\Widgets;

use Filament\Widgets\StatsOverviewWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;
use App\Models\Product;
use App\Models\OrderItem;
use App\Models\Shop;

class ShopOwnerStatsOverview extends StatsOverviewWidget
{
    protected static ?int $sort = 2;

    protected function getStats(): array
    {
        $user = auth()->user();

        // Only get approved shops
        $shop = Shop::where('user_id', $user->id)
            ->where('status', 'approved')
            ->first();

        // If no approved shop, return empty array (hides the widget completely)
        if (!$shop) {
            return [];
        }

        // Get all product IDs for this shop
        $shopProductIds = $shop->products()->pluck('id');

        // Count UNIQUE orders (not order items)
        $totalOrders = OrderItem::whereIn('product_id', $shopProductIds)
            ->distinct('order_id')
            ->count('order_id');

        // Count UNIQUE completed orders
        $completedOrders = OrderItem::whereIn('product_id', $shopProductIds)
            ->where('delivery_status', 'completed')
            ->distinct('order_id')
            ->count('order_id');

        // Count UNIQUE pending orders
        $pendingOrders = OrderItem::whereIn('product_id', $shopProductIds)
            ->where('delivery_status', 'pending')
            ->distinct('order_id')
            ->count('order_id');

        $totalProducts = $shopProductIds->count();

        return [
            Stat::make('Total Products', $totalProducts)
                ->description('in your shop')
                ->icon('heroicon-o-cube')
                ->color('primary')
                ->extraAttributes(['class' => 'whitespace-nowrap']),

            Stat::make('Completed Orders', $completedOrders)
                ->description('Finished orders')
                ->icon('heroicon-o-check-circle')
                ->color('success')
                ->extraAttributes(['class' => 'whitespace-nowrap']),

            Stat::make('Pending Orders', $pendingOrders)
                ->description('Orders Waiting')
                ->icon('heroicon-o-clock')
                ->color('warning')
                ->extraAttributes(['class' => 'whitespace-nowrap']),

            Stat::make('Total Orders', $totalOrders)
                ->description('All Shops Orders')
                ->icon('heroicon-o-shopping-bag')
                ->color('info')
                ->extraAttributes(['class' => 'whitespace-nowrap']),
        ];
    }

    public static function canView(): bool
    {
        $user = auth()->user();

        if (!$user || !$user->isShopOwner()) {
            return false;
        }

        // Only allow viewing if user has an approved shop
        return Shop::where('user_id', $user->id)
            ->where('status', 'approved')
            ->exists();
    }
}
