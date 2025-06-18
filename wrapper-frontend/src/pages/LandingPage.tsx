
import { useEffect, useState } from "react";
import { fetchTenantConfig } from "../utils/tenant";
import { loadChatwoot } from "../utils/chatwoot";

function LandingPage() {
  const [tenant, setTenant] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const config = await fetchTenantConfig();
      if (config) {
        setTenant(config);
        console.log(config,config.chatwootBaseUrl)
        document.documentElement.style.setProperty("--primary-color", config.primaryColor);
        loadChatwoot(config.chatwootInboxKey,config.chatwootBaseUrl);
      }
      setLoading(false);
    })();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (!tenant) return <div>Tenant not found or missing</div>;

  return (
    <div style={{ height: "100vh",background:"#141414" }}>
      <header style={{ padding: "1rem", background: tenant.primaryColor }}>
        <img style={{height:"40px"}} src={tenant.logo} alt="Logo" height="40" />
      </header>

      <iframe
        src="http://localhost:3010"
        style={{ width: "100%", height: "calc(100% - 60px)", border: "none" }}
        title="Affine"
      />
    </div>
  );
}

export default LandingPage;
