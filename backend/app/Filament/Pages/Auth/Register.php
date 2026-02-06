<?php

namespace App\Filament\Pages\Auth;
use Illuminate\Support\Facades\Auth;
use Filament\Auth\Pages\Register as BaseRegister;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Schema;

class Register extends BaseRegister
{
    public function form(Schema $schema): Schema
    {
        return parent::form($schema)
            ->components([
                TextInput::make('name')
                    ->label('Full Name')
                    ->required()
                    ->maxLength(255),

                TextInput::make('email')
                    ->label('Email Address')
                    ->email()
                    ->required()
                    ->unique($this->getUserModel(), 'email'),

                TextInput::make('password')
                    ->label('Password')
                    ->required()
                    ->password()
                    ->minLength(8),

                TextInput::make('password_confirmation')
                    ->label('Confirm Password')
                    ->required()
                    ->password()
                    ->same('password'),
            ]);
    }

    /**
     * Automatically set role to 'shop_owner' before saving.
     */
    protected function mutateFormDataBeforeRegister(array $data): array
    {
        $data['role'] = 'shop_owner'; // default role
        return $data;
    }

        protected function afterRegister(): void
    {
        $user = $this->form->getRecord();

        // Create empty shop with draft status
        $user->shop()->create([
            'status' => 'draft',  // << important!
            'name' => null,
            'phone' => null,
            'address' => null,
            'description' => null,
            'category' => null,
        ]);
    }
}
