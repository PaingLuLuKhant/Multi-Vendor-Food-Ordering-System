<?php

namespace App\Filament\Pages;

use Filament\Pages\Page;
use App\Models\Shop;
use BackedEnum;
use UnitEnum;

class ViewShop extends Page
{
    protected static string|UnitEnum|null $navigationGroup = 'Shop';
<<<<<<< HEAD
    protected static ?string $navigationLabel = 'View Shop';
    protected static string|BackedEnum|null $navigationIcon = 'heroicon-o-building-storefront';
    protected static ?int $navigationSort = 1;
=======
    protected static ?string $navigationLabel = 'View Your Shop';
    protected static string|BackedEnum|null $navigationIcon = 'heroicon-o-building-storefront';
    protected static ?int $navigationSort = 3;
>>>>>>> pllkdev

    protected string $view = 'filament.pages.view-shop';

    public Shop $shop;

    public static function shouldRegisterNavigation(): bool
    {
        return auth()->check() && auth()->user()->role === 'shop_owner';
    }

    public function mount(): void
    {
        $this->shop = Shop::where('user_id', auth()->id())->firstOrFail();
    }
    public static function canAccess(): bool
    {
        // return auth()->user()->shopApproved();
        return auth()->user()->shop?->status === 'approved';
    }
}