<?php

namespace App\Filament\Resources\ShopOrders;

use App\Filament\Resources\ShopOrders\Pages\ListShopOrders;
use App\Filament\Resources\ShopOrders\Pages\ViewShopOrder;
use App\Filament\Resources\ShopOrders\Pages\EditShopOrder;
use App\Filament\Resources\ShopOrders\Tables\ShopOrdersTable;
use App\Filament\Resources\ShopOrders\Schemas\ShopOrderForm;
use App\Filament\Resources\ShopOrders\Schemas\ShopOrderInfolist;
use App\Models\Order;
use Filament\Resources\Resource;
use Filament\Tables\Table;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\Auth;
use BackedEnum;
use UnitEnum;

class ShopOrderResource extends Resource
{
    protected static ?string $model = Order::class;

    // Sidebar navigation
    protected static string|UnitEnum|null $navigationGroup = 'Order';
    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedShoppingBag;

    protected static ?string $recordTitleAttribute = 'id';

    public static function getNavigationLabel(): string
    {
        return 'Completed Orders';
    }

    public static function shouldRegisterNavigation(): bool
    {
        return true;
    }

    /**
     * ✅ Query rules
     * - Admin → all orders
     * - Shop owner → only orders that include their shop products
     */
    public static function getEloquentQuery(): Builder
    {
        $user = Auth::user();

        $query = parent::getEloquentQuery()
            ->with([
                'user',
                'orderItems.product.shop.owner', // eager load everything needed
            ])
            ->where('status', 'completed');

        if (! $user) {
            return $query;
        }

        // Admin can see all orders
        if ($user->role === 'admin') {
            return $query;
        }

        // Shop owner: only orders containing their shop's products
        return $query->whereHas('orderItems.product.shop', function ($q) use ($user) {
            $q->where('user_id', $user->id);
        });
    }

    // Form (edit page)
    public static function form(Schema $schema): Schema
    {
        return ShopOrderForm::configure($schema);
    }

    // View page (infolist)
    public static function infolist(Schema $schema): Schema
    {
        return ShopOrderInfolist::configure($schema);
    }

    // Table (list page)
    public static function table(Table $table): Table
    {
        return ShopOrdersTable::configure($table);
    }

    // No relations needed here
    public static function getRelations(): array
    {
        return [];
    }

    // Pages
    public static function getPages(): array
    {
        return [
            'index' => ListShopOrders::route('/'),
            'view'  => ViewShopOrder::route('/{record}'),
            'edit'  => EditShopOrder::route('/{record}/edit'),
        ];
    }

    /**
     * ❌ Shop owners & admins cannot create orders manually
     */
    public static function canCreate(): bool
    {
        return false;
    }
    // public static function canViewAny(): bool
    // {
    //     return auth()->user()->isShopOwner();
    // }
            public static function canAccess(): bool
    {
        // return auth()->user()->shopApproved();
        return auth()->user()->shop?->status === 'approved';
    }

}
