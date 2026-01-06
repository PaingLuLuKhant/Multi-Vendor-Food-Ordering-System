import { useEffect, useState } from "react";
import api from "../../api/axios";

export default function Branches() {
  const [branches, setBranches] = useState([]);

  useEffect(() => {
    api.get("/superadmin/branches").then(res => setBranches(res.data));
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Branches</h1>
      <table className="w-full bg-white shadow rounded-lg overflow-hidden">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-2 text-left">#</th>
            <th className="p-2 text-left">Name</th>
            <th className="p-2 text-left">Address</th>
          </tr>
        </thead>
        <tbody>
          {branches.map((b) => (
            <tr key={b.id} className="border-b hover:bg-gray-50">
              <td className="p-2">{b.id}</td>
              <td className="p-2">{b.name}</td>
              <td className="p-2">{b.address}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
