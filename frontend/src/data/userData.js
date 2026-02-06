export const currentUser = {
  id: 1,
  name: "John Doe",
  email: "john@example.com",
  phone: "+1 (555) 123-4567",
  address: "123 Main St, City, State 12345",
  avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop",
  joinDate: "2024-01-15",
  loyaltyPoints: 1250,
  favoriteShops: [1, 2],
  orderHistory: [
    {
      id: 1001,
      shopId: 1,
      shopName: "Fresh Groceries",
      date: "2024-02-15",
      total: 45.99,
      status: "delivered",
      items: 5
    },
    {
      id: 1002,
      shopId: 2,
      shopName: "Burger Palace",
      date: "2024-02-10",
      total: 32.50,
      status: "delivered",
      items: 3
    }
  ]
};