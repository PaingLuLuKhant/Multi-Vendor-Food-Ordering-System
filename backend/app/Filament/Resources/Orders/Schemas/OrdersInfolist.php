<?php

namespace App\Filament\Resources\Orders\Schemas;
use Filament\Infolists\Components\TextEntry;
use Filament\Schemas\Schema;

class OrdersInfolist
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextEntry::make('user.name')
                    ->label('Customer Name')
                    ->numeric(),
                TextEntry::make('total_amount'),
                TextEntry::make('status'),
                
                TextEntry::make('created_at')
                    ->dateTime()
                    ->placeholder('-'),
                TextEntry::make('updated_at')
                    ->dateTime()
                    ->placeholder('-'),
            ]);
    }
}
