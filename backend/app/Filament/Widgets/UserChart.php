<?php

// namespace App\Filament\Widgets;
// use App\Models\User;
// use Filament\Widgets\ChartWidget;
// use Carbon\Carbon;

// class UserChart extends ChartWidget
// {
//     protected ?string $heading = 'User Chart';
// protected static ?int $sort = 2;
//     protected function getData(): array
//     {   
//         $start = Carbon::now()->subMonths(11)->startOfMonth(); // 12 months ago
//         $end = Carbon::now()->endOfMonth();
//         // Get user count per month (for current year)
//         $users = User::selectRaw('MONTH(created_at) as month, COUNT(*) as total')
//             ->whereBetween('created_at', [$start, $end])
//             ->groupBy('month')
//             ->orderBy('month')
//             ->get();

//         // All months Jan-Dec
//         $months = collect(range(1, 12));
//         $labels = $months->map(fn($m) => Carbon::create()->month($m)->format('M'));

//         // Map user totals to each month, default 0
//         $data = $months->map(fn($m) => $users->firstWhere('month', $m)?->total ?? 0);

//         return [
//             'labels' => $labels,
//             'datasets' => [
//                 [
//                     'label' => 'Users',
//                     'data' => $data,
//                 ],
//             ],
//         ];
//     }   
//     public static function canView(): bool
// {
//     return auth()->user()?->isAdmin();
// }


//     protected function getType(): string
//     {
//         return 'line';
//     }
// }
