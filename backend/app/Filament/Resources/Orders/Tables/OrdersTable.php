<?php

namespace App\Filament\Resources\Orders\Tables;

use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Actions\ForceDeleteBulkAction;
use Filament\Actions\RestoreBulkAction;
use Filament\Actions\ViewAction;
use Filament\Tables\Filters\TrashedFilter;
use Filament\Tables\Table;
use Filament\Tables\Columns\TextColumn;


class OrdersTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('id')->label('Order ID')->sortable(),
                TextColumn::make('user.name')->label('Customer')->sortable()->searchable(),
                // TextColumn::make('total_amount')->sortable(),
                TextColumn::make('total_amount')
                    ->money('MMK'),
                TextColumn::make('status')->sortable(),
                TextColumn::make('created_at')
                    ->label('Ordered at')
                    ->formatStateUsing(
                        fn($state) =>
                        \Carbon\Carbon::parse($state)->diffForHumans([
                            'short' => true,
                        ])
                    )
                    ->sortable(),
            ])
            ->filters([
                // TrashedFilter::make(),
            ])
            ->recordActions([
                ViewAction::make(),
                // EditAction::make(),
            ]);
            // ->toolbarActions([
            //     BulkActionGroup::make([
            //         DeleteBulkAction::make(),
            //         ForceDeleteBulkAction::make(),
            //         RestoreBulkAction::make(),
            //     ]),
            // ]);
    }
}
