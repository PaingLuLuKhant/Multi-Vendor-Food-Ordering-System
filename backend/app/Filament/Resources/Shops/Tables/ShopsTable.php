<?php

namespace App\Filament\Resources\Shops\Tables;

use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Actions\DeleteAction;
use Filament\Actions\ViewAction;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;
use PhpParser\Node\Stmt\Label;

class ShopsTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                // TextColumn::make('user_id')
                //     ->numeric()
                //     ->sortable(),
                TextColumn::make('row_number')
                ->rowIndex()
                ->label('#'),
                TextColumn::make('owner.name')
                    ->label('Owner')
                    ->searchable()
                    ->sortable(),
                TextColumn::make('name')
                ->label('Shop Name')
                    ->searchable(),
                TextColumn::make('category')
                    ->searchable(),
                TextColumn::make('phone')
                    ->label('Phone No')
                    ->searchable(),
                TextColumn::make('description')
                ->label('Shop Description')
                    ->searchable(),
                TextColumn::make('address')
                    ->searchable(),
                
                
                TextColumn::make('created_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
                TextColumn::make('updated_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])

            ->recordActions([
                ViewAction::make(),
                // EditAction::make(),
            ]);

            // bulk delete option

            // ->toolbarActions([
            //     BulkActionGroup::make([
            //         DeleteBulkAction::make(),
            //     ]),
            // ]);
    }
}
