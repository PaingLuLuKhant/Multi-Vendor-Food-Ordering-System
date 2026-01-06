import { useEffect, useState } from "react";
import api from "../../api/axios";

export default function SystemSettings() {
  const [settings, setSettings] = useState({ siteName: "", enableNotifications: false });

  useEffect(() => {
    api.get("/superadmin/system-settings").then(res => setSettings(res.data));
  }, []);

  return (
    <div className="p-6 max-w-md">
      <h1 className="text-2xl font-bold mb-4">System Settings</h1>
      <div className="mb-4">
        <label className="block mb-1 font-semibold">Site Name</label>
        <input
          type="text"
          className="w-full p-2 border rounded"
          value={settings.siteName}
          onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
        />
      </div>
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={settings.enableNotifications}
          onChange={(e) => setSettings({ ...settings, enableNotifications: e.target.checked })}
        />
        <label>Enable Notifications</label>
      </div>
      <button className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
        Save Settings
      </button>
    </div>
  );
}
