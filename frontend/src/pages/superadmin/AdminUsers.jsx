import { useEffect, useState } from "react";
import api from "../../api/axios";

export default function AdminUsers() {
  const [admins, setAdmins] = useState([]);

  useEffect(() => {
    api.get("/superadmin/admin-users").then(res => setAdmins(res.data));
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Admin Users</h1>
      <table className="w-full bg-white shadow rounded-lg overflow-hidden">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-2 text-left">#</th>
            <th className="p-2 text-left">Name</th>
            <th className="p-2 text-left">Email</th>
            <th className="p-2 text-left">Role</th>
          </tr>
        </thead>
        <tbody>
          {admins.map((a) => (
            <tr key={a.id} className="border-b hover:bg-gray-50">
              <td className="p-2">{a.id}</td>
              <td className="p-2">{a.name}</td>
              <td className="p-2">{a.email}</td>
              <td className="p-2">{a.role}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
