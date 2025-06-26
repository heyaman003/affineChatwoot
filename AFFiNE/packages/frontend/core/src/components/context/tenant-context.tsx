import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { getTenantId, fetchTenantConfig } from './tenant-utils';

export interface TenantConfig {
  id: string;
  name: string;
  logo: string;
  theme: string;
  chatwootWidgetId?: string;
  chatwootBaseUrl?: string;
}

interface TenantContextType {
  tenant: TenantConfig | null;
  loading: boolean;
  error: string | null;
}

const TenantContext = createContext<TenantContextType>({
  tenant: null,
  loading: true,
  error: null,
});
export const useTenant = () => useContext(TenantContext);
declare global {
  interface Window {
    chatwootSDK?: {
      run: (config: { websiteToken: string; baseUrl: string }) => void;
    };
  }
}

export function TenantProvider({ children }: { children: ReactNode }) {
  const [tenant, setTenant] = useState<TenantConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const tenantId = getTenantId();
    console.log('Detected tenant ID:', tenantId);
    // console.log(tenant);
    if (tenantId) {
      fetchTenantConfig(tenantId)
        .then(t => {
          console.log('Fetched tenant config:', t);
          setTenant(t);
          setLoading(false);
          setError(null);
        })
        .catch(() => {
          setError('Tenant not found');
          setLoading(false);
        });
    } else {
      setError('No tenant specified');
      setLoading(false);
    }
    // if (tenant?.theme) {
    //   document.documentElement.setAttribute('data-theme', tenant.theme);
    //   console.log('Setting theme:', tenant.theme);
    // }
  }, []);

  // Set CSS variable for theme color
  useEffect(() => {
    // if (tenant?.theme) {
    //   // document.documentElement.style.setProperty('--affine-text-primary-color', '#000000');
    //   document.documentElement.setAttribute('data-theme', tenant?.theme);
    //   console.log('Applied theme:', tenant?.theme);
    // }

    // Inject Chatwoot script if chat config is available
    if (tenant?.chatwootWidgetId && tenant?.chatwootBaseUrl) {
      console.log("inside widget script")
      const script = document.createElement('script');
      script.src = `${tenant.chatwootBaseUrl}/packs/js/sdk.js`;
      console.log('URL called');
      script.defer = true;
      script.async = true;
      script.onload = () => {
        if (window.chatwootSDK) {
          window.chatwootSDK.run({
            websiteToken: tenant.chatwootWidgetId!,
            baseUrl: tenant.chatwootBaseUrl!,
          });
          console.log('Chatwoot widget loaded for:', tenant.id);
        }
      };
      document.head.appendChild(script);
    }
  }, [tenant]);

  return (
    <TenantContext.Provider value={{ tenant, loading, error }}>
      {children}
    </TenantContext.Provider>
  );
}
