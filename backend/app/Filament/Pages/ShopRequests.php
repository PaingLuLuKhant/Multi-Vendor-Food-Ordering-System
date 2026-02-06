<?php

namespace App\Filament\Pages;

use Filament\Pages\Page;
use App\Models\Shop;
use Filament\Tables;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Actions\ButtonAction;
use Filament\Notifications\Notification;
use BackedEnum; 
use UnitEnum;   
use Filament\Notifications\Concerns\InteractsWithNotifications;

class ShopRequests extends Page
{   
    
    // Navigation
    protected static string|UnitEnum|null $navigationGroup = 'Shop';
    protected static ?string $navigationLabel = 'Shop Requests';
    protected static ?int $navigationSort = 2;
    protected static string|BackedEnum|null $navigationIcon = 'heroicon-o-bell';

    // Blade view
    protected string $view = 'filament.pages.shop-requests';

    public $pendingShops = [];

    // Only admin can see this page
    public static function shouldRegisterNavigation(): bool
    {
        return auth()->user()?->role === 'admin';
    }

    // Pass pending shops to Blade
    public function getPendingShopsProperty()
    {
        return Shop::where('status', 'pending')->with('owner')->get();
    }

    // Approve shop
    public function mount()
    {
        $this->loadPendingShops();
    }

    public function loadPendingShops()
    {
        $this->pendingShops = Shop::where('status', 'pending')->with('owner')->get();
    }

    public function approveShop($shopId)
    {
        $shop = Shop::findOrFail($shopId);
        $shop->update(['status' => 'approved']);

        Notification::make()
            ->title('Shop approved!')
            ->success()
            ->send();

        $this->loadPendingShops(); // ✅ reload table
    }

    public function denyShop($shopId)
    {
        $shop = Shop::findOrFail($shopId);
        $shop->update(['status' => 'denied']);

        Notification::make()
            ->title('Shop denied!')
            ->danger()
            ->send();

        $this->loadPendingShops(); // ✅ reload table
    }
}
