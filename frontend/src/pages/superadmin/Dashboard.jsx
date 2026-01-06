import { useEffect, useState } from "react";
import api from "../../api/axios";

export default function Dashboard() {
  const [summary, setSummary] = useState({ branches: 0, admins: 0, products: 0 });

  useEffect(() => {
    api.get("/superadmin/summary").then(res => setSummary(res.data));
  }, []);

  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-white shadow rounded-lg p-4 text-center">
        <h2 className="text-xl font-bold">{summary.branches}</h2>
        <p>Branches</p>
      </div>
      <div className="bg-white shadow rounded-lg p-4 text-center">
        <h2 className="text-xl font-bold">{summary.admins}</h2>
        <p>Admins</p>
      </div>
      <div className="bg-white shadow rounded-lg p-4 text-center">
        <h2 className="text-xl font-bold">{summary.products}</h2>
        <p>Products</p>
      </div>
    </div>
  );
}
// export default function Dashboard() {
//   return (
//     <div className="p-6">
//       <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//         <div className="bg-white shadow rounded-lg p-4 text-center">Branches: 3</div>
//         <div className="bg-white shadow rounded-lg p-4 text-center">Admins: 5</div>
//         <div className="bg-white shadow rounded-lg p-4 text-center">Products: 120</div>
//       </div>
//     </div>
//   );
// }
