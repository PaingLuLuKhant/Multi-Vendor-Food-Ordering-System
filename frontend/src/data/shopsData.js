export const shops = [
  {
    id: 1,
    name: "Fresh Groceries",
    description: "Your neighborhood grocery store with fresh produce, dairy, and baked goods",
    category: "grocery",
    rating: 4.5,
    deliveryTime: "30-45 min",
    image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop",
    products: [
      { id: 1, name: "Organic Apples", price: 4.99, category: "fruits" },
      { id: 2, name: "Whole Wheat Bread", price: 3.49, category: "bakery" },
      { id: 3, name: "Fresh Milk", price: 2.99, category: "dairy" },
      { id: 4, name: "Free Range Eggs", price: 5.99, category: "dairy" },
      { id: 5, name: "Organic Spinach", price: 3.99, category: "vegetables" }
    ]
  },
  {
    id: 2,
    name: "Burger Palace",
    description: "Best burgers in town with crispy fries and milkshakes",
    category: "restaurant",
    rating: 4.7,
    deliveryTime: "20-30 min",
    image: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400&h=300&fit=crop",
    products: [
      { id: 6, name: "Classic Cheeseburger", price: 8.99, category: "burgers" },
      { id: 7, name: "Crispy Chicken Burger", price: 9.99, category: "burgers" },
      { id: 8, name: "Loaded Cheese Fries", price: 5.99, category: "sides" },
      { id: 9, name: "Chicken Wings (6pc)", price: 10.99, category: "sides" },
      { id: 10, name: "Chocolate Milkshake", price: 4.99, category: "drinks" }
    ]
  },
  {
    id: 3,
    name: "Tech Gadgets Store",
    description: "Latest electronics, smartphones, and accessories",
    category: "electronics",
    rating: 4.3,
    deliveryTime: "45-60 min",
    image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&h=300&fit=crop",
    products: [
      { id: 11, name: "Wireless Bluetooth Earbuds", price: 79.99, category: "audio" },
      { id: 12, name: "Premium Phone Case", price: 24.99, category: "accessories" },
      { id: 13, name: "Fast Charging Power Bank", price: 39.99, category: "accessories" },
      { id: 14, name: "Smart Watch", price: 199.99, category: "wearables" },
      { id: 15, name: "USB-C Cable (3ft)", price: 12.99, category: "cables" }
    ]
  },
  {
    id: 4,
    name: "MediCare Pharmacy",
    description: "24/7 pharmacy with medicines and health products",
    category: "pharmacy",
    rating: 4.6,
    deliveryTime: "25-40 min",
    image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=300&fit=crop",
    products: [
      { id: 16, name: "Pain Relief Tablets", price: 8.99, category: "medicines" },
      { id: 17, name: "Vitamin C Supplements", price: 15.99, category: "vitamins" },
      { id: 18, name: "First Aid Kit", price: 24.99, category: "first-aid" },
      { id: 19, name: "Hand Sanitizer", price: 4.99, category: "hygiene" },
      { id: 20, name: "Digital Thermometer", price: 12.99, category: "devices" }
    ]
  },
  {
    id: 5,
    name: "Urban Fashion",
    description: "Trendy clothing and accessories for all ages",
    category: "clothing",
    rating: 4.4,
    deliveryTime: "2-3 days",
    image: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=400&h=300&fit=crop",
    products: [
      { id: 21, name: "Cotton T-Shirt", price: 19.99, category: "tops" },
      { id: 22, name: "Denim Jeans", price: 49.99, category: "bottoms" },
      { id: 23, name: "Winter Jacket", price: 89.99, category: "outerwear" },
      { id: 24, name: "Running Shoes", price: 69.99, category: "footwear" },
      { id: 25, name: "Casual Backpack", price: 39.99, category: "accessories" }
    ]
  },
  {
    id: 6,
    name: "Pizza Heaven",
    description: "Authentic Italian pizzas with fresh ingredients",
    category: "restaurant",
    rating: 4.8,
    deliveryTime: "25-35 min",
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=300&fit=crop",
    products: [
      { id: 26, name: "Margherita Pizza", price: 12.99, category: "pizza" },
      { id: 27, name: "Pepperoni Pizza", price: 14.99, category: "pizza" },
      { id: 28, name: "Garlic Breadsticks", price: 5.99, category: "sides" },
      { id: 29, name: "Caesar Salad", price: 8.99, category: "salads" },
      { id: 30, name: "Chocolate Lava Cake", price: 6.99, category: "desserts" }
    ]
  }
];

export const categories = [
  { id: "all", name: "All Shops", icon: "🏪" },
  { id: "grocery", name: "Grocery", icon: "🛒" },
  { id: "restaurant", name: "Restaurant", icon: "🍽️" },
  { id: "electronics", name: "Electronics", icon: "📱" },
  { id: "pharmacy", name: "Pharmacy", icon: "💊" },
  { id: "clothing", name: "Clothing", icon: "👕" }
];