<?php

namespace App\Filament\Resources\ShopOrders\Schemas;

use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\DateTimePicker;
use Filament\Schemas\Schema;

class ShopOrderForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema->components([
            TextInput::make('id')
                ->label('Order ID')
                ->disabled(),

            TextInput::make('user.name')
                ->label('Customer Name')
                ->disabled(),

            TextInput::make('total_amount')
                ->numeric()
                ->prefix('$')
                ->disabled(),

            Select::make('status')
                ->options([
                    'pending' => 'Pending',
                    'processing' => 'Processing',
                    'completed' => 'Completed',
                    'cancelled' => 'Cancelled',
                ])
                ->required(),

            DateTimePicker::make('paid_time')
                ->label('Paid Time'),
        ]);
    }
}
