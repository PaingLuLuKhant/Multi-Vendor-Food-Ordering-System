<?php

namespace App\Filament\Pages;

use Filament\Pages\Page;
use BackedEnum;
use UnitEnum;

class ShopRequests extends Page
{
    protected static string|UnitEnum|null $navigationGroup = 'Shop';

    // Navigation label
    protected static ?string $navigationLabel = 'Shop Requests';
    protected static ?int $navigationSort = 2;
    // Navigation icon
    protected static string|BackedEnum|null $navigationIcon = 'heroicon-o-bell';
            public static function shouldRegisterNavigation(): bool
{
    return auth()->user()?->role === 'admin';
}
    protected string $view = 'filament.pages.shop-requests';
}
