<?php

// namespace Database\Factories;

// use Illuminate\Database\Eloquent\Factories\Factory;

// /**
//  * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Product>
//  */
// class ProductFactory extends Factory
// {
//     /**
//      * Define the model's default state.
//      *
//      * @return array<string, mixed>
//      */
//     public function definition(): array
//     {
//         $shop = \App\Models\Shop::inRandomOrder()->first();

//         $categories = [
//             'Electronics' => ['Laptop', 'Smartphone', 'Headphones'],
//             'Clothing'    => ['Shirt', 'Jeans', 'Jacket'],
//             'Groceries'   => ['Fruits', 'Vegetables', 'Snacks'],
//             'Books'       => ['Novel', 'Magazine', 'Comic'],
//             'Beauty'      => ['Lipstick', 'Perfume', 'Skincare'],
//         ];

//         $productNames = $categories[$shop->category] ?? ['Generic Product'];

//         return [
//             'name' => fake()->randomElement($productNames),
//             'price' => fake()->numberBetween(10, 500),
//             'shop_id' => $shop->id,
//         ];
//     }
// }

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Shop;
use App\Models\Product;

class ProductFactory extends Factory
{
    protected $model = Product::class;

    public function definition(): array
    {
        // Default values
        return [
            'name' => 'Generic Product',
            'price' => fake()->numberBetween(5, 100),
            'shop_id' => null,
        ];
    }

    /**
     * Create products for a specific shop.
     */
    public function forShop(Shop $shop)
    {
        $productsByCategory = [
            'Myanmar Food'   => ['Pork Curry', 'Chicken Curry', 'LatPhatThoke'],
            'Chinese Food'   => ['Dumplings', 'Spring Rolls', 'Spicy Chicken'],
            'Thai Cuisine'   => ['Pad Thai', 'Green Curry', 'Tom Yum Soup'],
            'Fast Foods'     => ['Burger', 'Fries', 'Hotdog'],
            'Italian Food'  => ['Margherita Pizza', 'Spaghetti Carbonara', 'Lasagna'],
            'Seafood'        => ['Grilled Salmon', 'Shrimp Fried Rice', 'Lobster Bisque'],
            'Japanese Food'  => ['Sushi', 'Ramen', 'Tempura'],
            'Vegan'          => ['Vegan Burger', 'Quinoa Salad', 'Smoothie Bowl'],

        ];

        $productNames = $productsByCategory[$shop->category] ?? ['Generic Product'];

        // Return a state for factory
        return $this->state(function() use ($shop, $productNames) {
            return [
                'shop_id' => $shop->id,
                'name' => fake()->randomElement($productNames),
                'price' => fake()->numberBetween(5, 100),
            ];
        });
    }
}

