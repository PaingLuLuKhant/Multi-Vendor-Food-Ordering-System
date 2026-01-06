import { useEffect, useState } from "react";
import api from "../../api/axios";

export default function InventoryReport() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    api.get("/superadmin/inventory-report").then(res => setItems(res.data));
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Inventory Report</h1>
      <table className="w-full bg-white shadow rounded-lg overflow-hidden">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-2 text-left">#</th>
            <th className="p-2 text-left">Item</th>
            <th className="p-2 text-left">Quantity</th>
            <th className="p-2 text-left">Price</th>
          </tr>
        </thead>
        <tbody>
          {items.map((i) => (
            <tr key={i.id} className="border-b hover:bg-gray-50">
              <td className="p-2">{i.id}</td>
              <td className="p-2">{i.item}</td>
              <td className="p-2">{i.quantity}</td>
              <td className="p-2">${i.price}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
