<?php

// namespace Database\Factories;

// use Illuminate\Database\Eloquent\Factories\Factory;

// /**
//  * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Shop>
//  */
// class ShopFactory extends Factory
// {
//     /**
//      * Define the model's default state.
//      *
//      * @return array<string, mixed>
//      */
//     public function definition(): array
//     {
//         $categories = [
//         'Myanmar Food' => ['Laptop', 'Smartphone', 'Headphones'],
//         'Chinese Food'    => ['Shirt', 'Jeans', 'Jacket'],
//         'Thai Cuisine'   => ['Fruits', 'Vegetables', 'Snacks'],
//         'Fast Foods'       => ['Novel', 'Magazine', 'Comic'],
//         'Italian Foods'      => ['Lipstick', 'Perfume', 'Skincare'],
//         'Seafood'      => ['Lipstick', 'Perfume', 'Skincare'],
//         'Japanese Food'      => ['Lipstick', 'Perfume', 'Skincare'],
//         'Vegan'      => ['Lipstick', 'Perfume', 'Skincare'],
//         ];

//         $shopNames = [
//             'Sir Lumos',
//             'APN restaurant',
//             'Final Fantasy',
//             'Los Pollos Hermanos',
//             '89 Joint',
//             'Aurora Corner',
//             'Food House',
//             'Capulus',
//             'Nova Palace',
//             'Food City',
//             'Station 27',

//         ];
        
//         $shopOwner = \App\Models\User::where('role', 'shop_owner')->inRandomOrder()->first();
//         $shopCategory = fake()->randomElement(array_keys($categories));

        
//         return [
//             'user_id' => $shopOwner?->id ?? 1,
//             // 'name' => fake()->company(),
//             'name' => $shopNames[array_rand($shopNames)],
//             'phone' => fake()->phoneNumber(),
//             'address' => fake()->address(),
//             'description' => fake()->sentence(10),
//             'category' => $shopCategory,

//         ];
//     }
// }


namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\User;
use App\Models\Shop;

class ShopFactory extends Factory
{
    protected $model = Shop::class;

    // Track used owners and names globally to avoid duplicates
    protected static array $usedOwners = [];
    protected static array $usedNames = [];

    public function definition(): array
    {
        // Unique shop names
        $shopNames = [
            'Sir Lumos',
            'APN Restaurant',
            'Final Fantasy',
            'Los Pollos Hermanos',
            '89 Joint',
            'Aurora Corner',
            'Food House',
            'Capulus',
            'Nova Palace',
            'Jupiter',
            'Eighteen',
            'Pioneer',
            'Brolly',
            'Fresh',
            'Top Choice',
            'Micky',
            'Golden Dragon',
            'Paw Oo',
            'The Brothers'

        ];

        // Unique owner selection
        $shopOwner = User::where('role', 'shop_owner')
                        ->whereNotIn('id', self::$usedOwners)
                        ->inRandomOrder()
                        ->first();

        if (!$shopOwner) {
            $shopOwner = User::where('role','shop_owner')->inRandomOrder()->first();
        }

        self::$usedOwners[] = $shopOwner->id;

        // Pick a unique shop name
        $availableNames = array_diff($shopNames, self::$usedNames);
        $shopName = $availableNames[array_rand($availableNames)];
        self::$usedNames[] = $shopName;

        // Shop categories
        $categories = [
            'Myanmar Food', 'Chinese Food', 'Thai Cuisine', 'Fast Foods', 
            'Italian Foods', 'Seafood', 'Japanese Food', 'Vegan'
        ];

        return [
            'user_id' => $shopOwner->id,
            'name' => $shopName,
            'phone' => fake()->phoneNumber(),
            'address' => fake()->address(),
            'description' => fake()->sentence(10),
            'category' => fake()->randomElement($categories),
        ];
    }
}
