<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Shop;
use App\Models\Product;
use App\Models\Order;
use App\Models\OrderItem;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // 1️⃣ Users
        User::factory()->count(50)->create(['role' => 'customer']);
        User::factory()->count(50)->create(['role' => 'shop_owner']);
        User::factory()->create(['role' => 'admin']);

        // 2️⃣ Shops
        Shop::factory()->count(8)->create();

        // 3️⃣ Products
        Product::factory()->count(20)->create();

        // 4️⃣ Orders + OrderItems
        Order::factory()->count(10)->create()->each(function($order){
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
