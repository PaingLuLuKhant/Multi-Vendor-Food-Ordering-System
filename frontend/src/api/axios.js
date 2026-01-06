// Mock Axios for frontend testing
const api = {
  get: (url) => {
    switch (url) {
      case "/superadmin/summary":
        return Promise.resolve({ data: { branches: 3, admins: 5, products: 120 } });
      case "/superadmin/branches":
        return Promise.resolve({
          data: [
            { id: 1, name: "MDY Store", address: "110 Main St" },
            { id: 2, name: "YGN Store", address: "Airport Rd" },
            { id: 3, name: "Taunggyi Store", address: "Mall Blvd" }
          ]
        });
      case "/superadmin/admin-users":
        return Promise.resolve({
          data: [
            { id: 1, name: "Alice", email: "alice@example.com", role: "Admin" },
            { id: 2, name: "Bob", email: "bob@example.com", role: "Admin" },
            { id: 3, name: "Charlie", email: "charlie@example.com", role: "Admin" }
          ]
        });
      case "/superadmin/inventory-report":
        return Promise.resolve({
          data: [
            { id: 1, item: "Product A", quantity: 50, price: 10 },
            { id: 2, item: "Product B", quantity: 30, price: 20 },
            { id: 3, item: "Product C", quantity: 40, price: 15 }
          ]
        });
      case "/superadmin/system-settings":
        return Promise.resolve({
          data: { siteName: "My POS System", enableNotifications: true }
        });
      default:
        return Promise.resolve({ data: [] });
    }
  }
};

export default api;
