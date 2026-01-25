<?php

namespace App\Filament\Pages;

use Filament\Pages\Page;
use App\Models\Shop;
use Carbon\Carbon;
use BackedEnum;
use UnitEnum;

class ShopAnalysis extends Page
{
    // Navigation group under Shop
    protected static string|UnitEnum|null $navigationGroup = 'Shop';

    // Navigation label
    protected static ?string $navigationLabel = 'Shop Analysis';
    protected static ?int $navigationSort = 2;

    // Navigation icon
    protected static string|BackedEnum|null $navigationIcon = 'heroicon-o-chart-bar';

    // Navigation sort (after Shops list)

    // Blade view
    protected string $view = 'filament.pages.shop-analysis';

    // Admin-only
    // public static function canView(): bool
    // {
    //     return auth()->user()?->isAdmin();
    // }
    public static function shouldRegisterNavigation(): bool
{
    return auth()->user()?->role === 'admin';
}


    // Line chart data (Shops created per month)
    public function getShopChartData(): array
    {
        $start = Carbon::now()->subMonths(11)->startOfMonth();
        $end = Carbon::now()->endOfMonth();

        $shops = Shop::selectRaw('MONTH(created_at) as month, COUNT(*) as total')
            ->whereBetween('created_at', [$start, $end])
            ->groupBy('month')
            ->orderBy('month')
            ->get();

        $months = collect(range(1, 12));
        $labels = $months->map(fn($m) => Carbon::create()->month($m)->format('M'))->toArray();
        $data = $months->map(fn($m) => $shops->firstWhere('month', $m)?->total ?? 0)->toArray();

        return [
            'labels' => $labels,
            'datasets' => [
                [
                    'label' => 'Shops',
                    'data' => $data,
                ]
            ]
        ];
    }
}
