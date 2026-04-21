<?php

namespace App\Filament\Resources\Products\Schemas;

use Filament\Forms\Components\TextInput;
use Filament\Schemas\Schema;
use Filament\Forms\Components\Hidden;
use Filament\Forms\Components\FileUpload;



class ProductForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Hidden::make('shop_id')
                    ->default(fn () => auth()->user()->shop->id)
                    ->required(),
                TextInput::make('name')
                    ->required(),
                TextInput::make('price')
                    ->required()
                    ->numeric()
                    ->prefix('MMK'),
                FileUpload::make('image')
                    ->label('Menu Photo')
                    ->image()
                    ->directory('products')
                    ->disk('public')
            ]);

    }

}
