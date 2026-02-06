<?php

namespace App\Filament\Widgets;

use Filament\Widgets\StatsOverviewWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;
use App\Models\User;

class UserInsights extends StatsOverviewWidget
{
    protected function getStats(): array
    {
        return [
            Stat::make('Total Users', User::count())
                ->icon('heroicon-o-users')
                ->description('Total Users Registered')
                ->color('primary'),

            Stat::make('New Users', User::whereMonth('created_at', now()->month)->count())
                ->icon('heroicon-o-user-plus')
                ->description('This Month')
                ->color('success'),

            Stat::make('Active Users', User::whereHas('orders')->count())
                ->icon('heroicon-o-bolt')
                ->description('User with at least 1 order')
                ->color('info'),
        ];
    }
    public static function canView(): bool
{
    return false;
}
}
