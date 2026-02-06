<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\User;
use App\Models\Shop;

class ReviewFactory extends Factory
{
    protected $model = \App\Models\Review::class;

    public function definition(): array
    {
        $customer = User::where('role','customer')->inRandomOrder()->first();
        $shop = Shop::inRandomOrder()->first();

        return [
            'user_id' => $customer?->id ?? 1,
            'shop_id' => $shop->id,
            'rating' => fake()->numberBetween(1,5),
            'comment' => fake()->sentence(10),
        ];
    }
}
