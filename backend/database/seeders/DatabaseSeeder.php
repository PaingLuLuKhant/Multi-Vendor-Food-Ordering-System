<?php

namespace Database\Seeders;
use Illuminate\Database\Seeder;

use App\Models\User;
use App\Models\Shop;
use App\Models\Product;
use App\Models\Order;
use App\Models\OrderItem;

// class DatabaseSeeder extends Seeder
// {
//     public function run(): void
//     {
//         // 1️⃣ Users
//         User::factory()->count(50)->create(['role' => 'customer']);
//         User::factory()->count(50)->create(['role' => 'shop_owner']);
//         User::factory()->create(['role' => 'admin']);

//         // 2️⃣ Shops
//         Shop::factory()->count(9)->create();

//         // 3️⃣ Products
//         Product::factory()->count(20)->create();

//         // 4️⃣ Orders + OrderItems
//         Order::factory()->count(300)->create()->each(function($order){
//             $products = Product::inRandomOrder()->take(fake()->numberBetween(1,3))->get();
//             foreach($products as $product){
//                 OrderItem::create([
//                     'order_id' => $order->id,
//                     'product_id' => $product->id,
//                     'quantity' => fake()->numberBetween(1,5),
//                     'price' => $product->price,
//                     // 'shop_id' => $product->shop_id // optional
//                 ]);
//             }

//             // Update total_amount
//             $order->update([
//                 'total_amount' => $order->orderItems->sum(fn($item) => $item->quantity * $item->price),
//             ]);
//         });
//     }
// }




class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // 1️⃣ Users
        User::factory()->count(50)->create(['role' => 'customer']);
        User::factory()->count(50)->create(['role' => 'shop_owner']);
        User::factory()->create(['role' => 'admin']);

        // 2️⃣ Shops
        $shopNames = [
            'Sir Lumos', 'APN Restaurant', 'Final Fantasy', 'Los Pollos Hermanos',
            '89 Joint', 'Aurora Corner', 'Food House', 'Capulus',
            'Nova Palace', 'Jupiter', 'Eighteen', 'Pioneer',
            'Brolly', 'Fresh', 'Top Choice', 'Micky',
            'Golden Dragon', 'Paw Oo', 'The Brothers'
        ];

        $categories = [
            'Myanmar Food', 'Chinese Food', 'Thai Cuisine', 'Fast Food',
            'Italian Food', 'Seafood', 'Japanese Food', 'Vegan'
        ];

        // pick 8 shop owners for first 8 shops
        $shopOwners = User::where('role', 'shop_owner')->inRandomOrder()->take(count($shopNames))->get();

        $shops = [];

        // First 8 shops → assign 1-to-1 categories
        for ($i = 0; $i < 8; $i++) {
            $shops[] = Shop::create([
                'user_id' => $shopOwners[$i]->id,
                'name' => $shopNames[$i],
                'phone' => fake()->phoneNumber(),
                'address' => fake()->address(),
                'description' => fake()->sentence(10),
                'category' => $categories[$i],
                'created_at' => fake()->dateTimeBetween('-12 months', 'now'),
                'updated_at' => now(),
            ]);
        }

        // Remaining shops → assign randomly to any category
        for ($i = 8; $i < count($shopNames); $i++) {
            $shops[] = Shop::create([
                'user_id' => $shopOwners[$i]->id,
                'name' => $shopNames[$i],
                'phone' => fake()->phoneNumber(),
                'address' => fake()->address(),
                'description' => fake()->sentence(10),
                'category' => fake()->randomElement($categories),
                'created_at' => fake()->dateTimeBetween('-12 months', 'now'),
                'updated_at' => now(),
            ]);
        }

        // 3️⃣ Products → create all products per shop category (no duplicates)
        $productsByCategory = [
            'Myanmar Food'   => ['Pork Curry', 'Chicken Curry', 'LatPhatThoke'],
            'Chinese Food'   => ['Dumplings', 'Spring Rolls', 'Spicy Chicken'],
            'Thai Cuisine'   => ['Pad Thai', 'Green Curry', 'Tom Yum Soup'],
            'Fast Food'     => ['Burger', 'Fries', 'Hotdog'],
            'Italian Food'  => ['Margherita Pizza', 'Spaghetti Carbonara', 'Lasagna'],
            'Seafood'        => ['Grilled Salmon', 'Shrimp Fried Rice', 'Lobster Bisque'],
            'Japanese Food'  => ['Sushi', 'Ramen', 'Tempura'],
            'Vegan'          => ['Vegan Burger', 'Quinoa Salad', 'Smoothie Bowl'],
        ];

        foreach ($shops as $shop) {
            $productNames = $productsByCategory[$shop->category] ?? ['Generic Product'];

            foreach ($productNames as $productName) {
                Product::create([
                    'name' => $productName,
                    'price' => fake()->numberBetween(1500, 10000),
                    'shop_id' => $shop->id,
                ]);
            }
        }
        //  4️⃣ Orders + OrderItems
        Order::factory()->count(300)->create()->each(function($order){
            $products = Product::inRandomOrder()->take(fake()->numberBetween(1,3))->get();
            foreach($products as $product){
                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $product->id,
                    'quantity' => fake()->numberBetween(1,5),
                    'price' => $product->price,
                    // 'shop_id' => $product->shop_id // optional
                ]);
            }

            // Update total_amount
            $order->update([
                'total_amount' => $order->orderItems->sum(fn($item) => $item->quantity * $item->price),
            ]);
        });
    }
}
