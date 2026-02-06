<?php

namespace App\Filament\Resources\ShopOrders\Pages;

use App\Filament\Resources\ShopOrders\ShopOrderResource;
use Filament\Resources\Pages\ListRecords;
use Filament\Actions\CreateAction;

class ListShopOrders extends ListRecords
{
    protected static string $resource = ShopOrderResource::class;

    protected function getHeaderActions(): array
    {
        return [
            // Shop owners cannot create orders
            // CreateAction::make(),
        ];
    }
}
