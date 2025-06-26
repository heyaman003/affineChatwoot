export function getTenantId(): string | null {
  // Try subdomain: acme.localhost or acme.yourdomain.com
  const host = window.location.hostname;
  const subdomain = host.split('.')[0];
  if (subdomain && subdomain !== 'localhost' && subdomain !== 'www') {
    return subdomain;
  }
  // Try query param: ?tenant=acme
  const params = new URLSearchParams(window.location.search);
  if (params.has('tenant')) {
    return params.get('tenant');
  }
  return null;
}

export async function fetchTenantConfig(tenantId: string) {
  // Assumes backend is running on port 3001
  const res = await fetch(`http://localhost:4000/api/tenants/${tenantId}`);
  // console.log(res);
  if (!res.ok) throw new Error('Tenant not found');
  return res.json();
}
