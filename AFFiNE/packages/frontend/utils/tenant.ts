export async function fetchTenantConfig(): Promise<any | null> {
  const params = new URLSearchParams(window.location.search);
  const tenantId = params.get("tenant") || "acme";

  if (!tenantId) return null;

  try {
    const response = await fetch(
      `http://localhost:4000/api/tenant/${tenantId}`
    );
    if (!response.ok) return null;
    return await response.json();
  } catch (err) {
    console.error("Failed to load tenant:", err);
    return null;
  }
}
