<?php

namespace App\Filament\Pages;

use Filament\Pages\Page;
use App\Models\Shop;
use Carbon\Carbon;
use BackedEnum;
use UnitEnum;

class ShopAnalysis extends Page
{
    protected static string|UnitEnum|null $navigationGroup = 'Shop';

    protected static ?string $navigationLabel = 'Shop Analysis';
    protected static ?int $navigationSort = 4;
    protected static string|BackedEnum|null $navigationIcon = 'heroicon-o-chart-bar';

    protected string $view = 'filament.pages.shop-analysis';

    public static function shouldRegisterNavigation(): bool
    {
        return auth()->user()?->role === 'admin';
    }

    /**
     * 📈 Shop chart data (last 12 months)
     */
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

        return [
            'labels' => $months->map(fn ($m) =>
                Carbon::create()->month($m)->format('M')
            ),
            'datasets' => [
                [
                    'label' => 'Shops',
                    'data' => $months->map(fn ($m) =>
                        $shops->firstWhere('month', $m)?->total ?? 0
                    ),
                ],
            ],
        ];
    }
}
