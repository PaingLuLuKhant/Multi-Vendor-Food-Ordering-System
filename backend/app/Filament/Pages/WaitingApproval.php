<?php

namespace App\Filament\Pages;

use Filament\Pages\Page;
use Illuminate\Support\Facades\Auth;
use BackedEnum;
class WaitingApproval extends Page
{
    protected static string|BackedEnum|null $navigationIcon = 'heroicon-o-clock';
    protected string $view = 'filament.pages.waiting-approval';
    protected static ?int $navigationSort = null;
    protected static ?string $navigationLabel = null;

    PUBLIC static function shouldRegisterNavigation(): bool
    {
        $shop = Auth::user()?->shop;

        return $shop?->status === 'pending';
    }
}
