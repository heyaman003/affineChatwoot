import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

type Tenant = {
  id: string;
  name: string;
  logo: string;
};

export default function TenantLanding() {
  const navigate = useNavigate();
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTenants = async () => {
      try {
        const res = await fetch("http://localhost:4000/api/tenants");
        const data = await res.json();
        // Transforming object format to array if needed
        const tenantsArray = Object.entries(data).map(([id, tenant]: any) => ({
          id,
          name: tenant.name || id,
          logo: tenant.logo,
        }));
        setTenants(tenantsArray);
      } catch (err) {
        console.error("Failed to fetch tenants:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTenants();
  }, []);

  const handleSelect = (tenantId: string) => {
    navigate(`/app?tenant=${tenantId}`);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-100 to-slate-300 px-4 py-10">
      <h2 className="text-3xl font-bold text-slate-800 mb-8">Select Your Organization</h2>

      {loading ? (
        <p className="text-slate-600">Loading tenants...</p>
      ) : tenants.length === 0 ? (
        <p className="text-slate-600">No tenants found.</p>
      ) : (
        <div className="flex flex-wrap justify-center gap-8">
          {tenants.map((tenant) => (
            <div
              key={tenant.id}
              onClick={() => handleSelect(tenant.id)}
              className="cursor-pointer bg-white hover:bg-slate-50 border rounded-xl shadow p-4 w-40 flex flex-col items-center transition-all"
            >
              <img
                src={tenant.logo}
                alt={tenant.name}
                className="w-20 h-20 object-contain mb-2 rounded-full border"
              />
              <div className="text-center font-medium text-slate-700">{tenant.name}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
