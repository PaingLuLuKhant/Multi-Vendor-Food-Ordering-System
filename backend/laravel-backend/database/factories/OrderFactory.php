<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\User;
use App\Models\Order;

class OrderFactory extends Factory
{
    protected $model = Order::class;

    public function definition(): array
    {
        // Pick a random customer
        $customer = User::where('role', 'customer')->inRandomOrder()->first();

        return [
            'user_id' => $customer?->id ?? 1,
            'total_amount' => 0, // will update later after order items
            // 'status' => fake()->randomElement(['pending','completed','cancelled']),
            'status' =>'completed'
        ];
    }
}
