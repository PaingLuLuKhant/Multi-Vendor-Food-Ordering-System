<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Product;

class ProductStockFactory extends Factory
{
    protected $model = \App\Models\ProductStock::class;

    public function definition(): array
    {
        $product = Product::inRandomOrder()->first();

        return [
            'product_id' => $product->id,
            'quantity' => fake()->numberBetween(10, 100),
        ];
    }
}
