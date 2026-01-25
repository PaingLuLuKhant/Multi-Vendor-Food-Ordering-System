<?php

namespace App\Filament\Pages;

use Filament\Pages\Page;
use App\Models\Shop;
use BackedEnum;
use UnitEnum;
class ShopCategories extends Page
{
    protected static string|UnitEnum|null $navigationGroup = 'Shop'; // puts it under Shop
    protected static ?string $navigationLabel = 'Shop Categories';

    

    // Navigation label

    protected static ?int $navigationSort = 3; // after Shop Analysis
    protected static string|BackedEnum|null $navigationIcon = 'heroicon-o-cube';

    protected string $view = 'filament.pages.shop-categories';
        public static function shouldRegisterNavigation(): bool
{
    return auth()->user()?->role === 'admin';
}

    public function getCategoryChartData(): array
    {
        $categories = Shop::select('category')
            ->selectRaw('COUNT(*) as total')
            ->groupBy('category')
            ->orderBy('category')
            ->get();

        return [
            'labels' => $categories->pluck('category'),
            'data' => $categories->pluck('total'),
        ];
    }
}
