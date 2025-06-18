import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Tenant = {
  logo: string;
  primaryColor: string;
  chatwootInboxKey: string;
  chatwootBaseUrl: string;
};

export default function TenantAdmin() {
  const [tenants, setTenants] = useState<{ [key: string]: Tenant }>({});
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Tenant>({
    logo: "",
    primaryColor: "",
    chatwootInboxKey: "",
    chatwootBaseUrl: "",
  });

  const fetchTenants = async () => {
    const res = await fetch("http://localhost:4000/api/tenants");
    const data = await res.json();
    setTenants(data);
  };

  useEffect(() => {
    fetchTenants();
  }, []);

  const handleEdit = (id: string) => {
    setSelectedId(id);
    setFormData(tenants[id]);
  };

  const handleDelete = async (id: string) => {
    await fetch(`http://localhost:4000/api/tenant/${id}`, { method: "DELETE" });
    fetchTenants();
  };

  const handleSave = async () => {
    if (!selectedId) return;
    const tenantId =
      selectedId === "newTenantId" ? prompt("Enter new tenant ID:") : selectedId;
    if (!tenantId) return;

    await fetch(`http://localhost:4000/api/tenant/${tenantId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    setSelectedId(null);
    setFormData({
      logo: "",
      primaryColor: "",
      chatwootInboxKey: "",
      chatwootBaseUrl: "",
    });
    fetchTenants();
  };

  const handleCreateNew = () => {
    setSelectedId("newTenantId");
    setFormData({
      logo: "",
      primaryColor: "",
      chatwootInboxKey: "",
      chatwootBaseUrl: "",
    });
  };

  const handleLogoUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const form = new FormData();
    form.append("file", file);

    try {
      const res = await fetch("http://localhost:4000/api/upload", {
        method: "POST",
        body: form,
      });

      const data = await res.json();
      if (data?.url) {
        setFormData((prev) => ({ ...prev, logo: data.url }));
      }
    } catch (err) {
      console.error("Logo upload failed:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-300 py-10 px-4 w-full ">
      <div className=" bg-white rounded-2xl shadow-xl p-8 w-[80%] m-auto">
        <h2 className="text-4xl font-bold mb-8 text-slate-800 flex items-center gap-3">
          <span>🏢</span> Tenant Admin Panel
        </h2>
        <div className="flex justify-end mb-6">
          <button
            onClick={handleCreateNew}
            className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow transition"
          >
            + Add New Tenant
          </button>
        </div>

        <ul className="space-y-4">
          {Object.entries(tenants).map(([id, tenant]) => (
            <motion.li
              key={id}
              className="flex items-center justify-between bg-slate-50 rounded-xl p-4 shadow hover:shadow-md transition group"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              layout
            >
              <div className="flex items-center gap-4">
                {tenant.logo ? (
                  <img
                    src={tenant.logo}
                    alt="logo"
                    className="h-12 w-12 rounded-full border-2 border-slate-300 object-cover"
                  />
                ) : (
                  <div className="h-12 w-12 bg-gray-200 rounded-full flex items-center justify-center text-sm text-slate-500 font-bold border">
                    No
                  </div>
                )}
                <div>
                  <div className="font-semibold text-lg">{id}</div>
                  <div className="flex items-center gap-2 mt-1">
                    <span
                      className="inline-block w-4 h-4 rounded-full border"
                      style={{ background: tenant.primaryColor }}
                    />
                    <span className="text-slate-500 text-sm">
                      {tenant.primaryColor}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(id)}
                  className="px-4 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-md text-sm"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(id)}
                  className="px-4 py-1.5 bg-rose-500 hover:bg-rose-600 text-white rounded-md text-sm"
                >
                  Delete
                </button>
              </div>
            </motion.li>
          ))}
        </ul>

        <AnimatePresence>
          {selectedId && (
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-lg relative"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
              >
                <button
                  onClick={() => setSelectedId(null)}
                  className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 text-2xl"
                  aria-label="Close"
                >
                  &times;
                </button>
                <h3 className="text-2xl font-semibold mb-5 text-slate-800">
                  {selectedId === "newTenantId"
                    ? "Create New Tenant"
                    : `Edit Tenant: ${selectedId}`}
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-1">
                      Tenant ID
                    </label>
                    <input
                      value={selectedId}
                      disabled={selectedId !== "newTenantId"}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-100 disabled:cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-1">
                      Upload Logo
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="block w-full text-sm text-slate-500"
                    />
                    {formData.logo && (
                      <img
                        src={formData.logo}
                        alt="Tenant Logo"
                        className="mt-3 max-h-16 rounded border"
                      />
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-1">
                      Primary Color
                    </label>
                    <input
                      type="color"
                      value={formData.primaryColor}
                      onChange={(e) =>
                        setFormData({ ...formData, primaryColor: e.target.value })
                      }
                      className="h-10 w-full rounded-md border px-2 py-1"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-1">
                      Chatwoot Inbox Key
                    </label>
                    <input
                      value={formData.chatwootInboxKey}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          chatwootInboxKey: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-1">
                      Chatwoot Base URL
                    </label>
                    <input
                      value={formData.chatwootBaseUrl}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          chatwootBaseUrl: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <button
                    onClick={handleSave}
                    className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition mt-4"
                  >
                    Save
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
