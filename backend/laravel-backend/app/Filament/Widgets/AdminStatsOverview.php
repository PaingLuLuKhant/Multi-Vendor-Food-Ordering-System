<?php

namespace App\Filament\Widgets;

use App\Models\User;
use App\Models\Shop;
use App\Models\Product;
use App\Models\Order;
use Filament\Widgets\StatsOverviewWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;
use Illuminate\Support\Facades\DB;


class AdminStatsOverview extends StatsOverviewWidget
{
    protected static ?int $sort = 1;

    protected function getStats(): array
    {
        $rate = config('platform.commission_rate');

        $platformRevenue = Order::where('status', 'completed')
            ->sum(DB::raw("total_amount * $rate"));

        // return [
        //     Stat::make('Total Users', User::count()),
        //     Stat::make('Total Shops', Shop::count()),
        //     Stat::make('Total Products', Product::count()),
        //     Stat::make('Total Orders', Order::count()),
        //     Stat::make('Total Revenue', number_format($platformRevenue, 2))
        //     ->description('15% platform commission')
        //     ->icon('heroicon-o-banknotes')
        //     ->color('success'),
        // ];

        return [
        Stat::make('Total Users', User::count())
            ->description('All registered users')
            ->icon('heroicon-o-users')
            ->color('primary'),

        Stat::make('Total Shops', Shop::count())
            ->description('Active shops on platform')
            ->icon('heroicon-o-building-storefront')
            ->color('info'),

        Stat::make('Total Products', Product::count())
            ->description('Products listed by shops')
            ->icon('heroicon-o-cube')
            ->color('warning'),

        Stat::make('Total Orders', Order::count())
            ->description('Orders placed by customers')
            ->icon('heroicon-o-shopping-bag')
            ->color('gray'),

        Stat::make('Platform Revenue', number_format($platformRevenue, 2))
            ->description('15% commission from completed orders')
            ->icon('heroicon-o-banknotes')
            ->color('success'),
    ];
    }

    public static function canView(): bool
    {
        return auth()->user()?->isAdmin();
    }
}
