<?php

namespace App\Filament\Widgets;

use Filament\Widgets\StatsOverviewWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;
use App\Models\Shop;

class ShopInsights extends StatsOverviewWidget
{
    protected function getStats(): array
    {
        return [
            Stat::make('Total Shops', Shop::count())
                ->description('All registered shops')
                ->icon('heroicon-o-building-storefront')
                ->color('primary'),

            Stat::make('New Shops', Shop::whereMonth('created_at', now()->month)->count())
                ->description('This month')
                ->icon('heroicon-o-plus-circle')
                ->color('success'),

            Stat::make('Active Shops', Shop::whereHas('products')->count())
                ->description('Shops with products')
                ->icon('heroicon-o-bolt')
                ->color('info'),
        ];
    }
    public static function canView(): bool
{
    return false;
}
}
