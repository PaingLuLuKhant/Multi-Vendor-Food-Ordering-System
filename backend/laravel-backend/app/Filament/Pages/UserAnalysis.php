<?php

namespace App\Filament\Pages;

use Filament\Pages\Page;
use App\Models\User;
use Carbon\Carbon;
use BackedEnum;
use UnitEnum;
class UserAnalysis extends Page
{
    protected static string|UnitEnum|null $navigationGroup = 'User';

    // Navigation label
    protected static ?string $navigationLabel = 'User Analysis';
    protected static ?int $navigationSort = 2;
    // Navigation icon
    protected static string|BackedEnum|null $navigationIcon = 'heroicon-o-chart-bar';

    // Blade view (non-static!)
    protected string $view = 'filament.pages.user-analysis';
        public static function shouldRegisterNavigation(): bool
{
    return auth()->user()?->role === 'admin';
}

    public function getUserChartData(): array
    {
        $start = Carbon::now()->subMonths(11)->startOfMonth();
        $end = Carbon::now()->endOfMonth();

        $users = User::selectRaw('MONTH(created_at) as month, COUNT(*) as total')
            ->whereBetween('created_at', [$start, $end])
            ->groupBy('month')
            ->orderBy('month')
            ->get();

        $months = collect(range(1, 12));
        $labels = $months->map(fn($m) => Carbon::create()->month($m)->format('M'));
        $data = $months->map(fn($m) => $users->firstWhere('month', $m)?->total ?? 0);

        return [
            'labels' => $labels,
            'datasets' => [
                [
                    'label' => 'Users',
                    'data' => $data,
                ]
            ]
        ];
    }

    // User Growth chart (can be bar)
    // public function getUserGrowthData(): array
    // {
    //     $start = Carbon::now()->subMonths(11)->startOfMonth();
    //     $end = Carbon::now()->endOfMonth();

    //     $users = User::selectRaw('MONTH(created_at) as month, COUNT(*) as total')
    //         ->whereBetween('created_at', [$start, $end])
    //         ->groupBy('month')
    //         ->orderBy('month')
    //         ->get()
    //         ->keyBy('month');

    //     $months = collect(range(1, 12));
    //     $labels = $months->map(fn($m) => Carbon::create()->month($m)->format('M'))->toArray();

    //     $growth = [];
    //     $previous = null;

    //     foreach ($months as $m) {
    //         $current = $users->get($m)?->total ?? 0;
    //         if ($previous === null) {
    //             $growth[] = 0; // no growth for first month
    //         } else {
    //             $growth[] = $previous === 0 ? 100 : round((($current - $previous) / $previous) * 100, 1);
    //         }
    //         $previous = $current;
    //     }

    //     return [
    //         'labels' => $labels,
    //         'data' => $growth,
    //     ];
    // }



}
