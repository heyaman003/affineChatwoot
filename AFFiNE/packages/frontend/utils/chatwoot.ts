export function loadChatwoot(token: string, baseUrl: string) {
  const normalizedBaseUrl = baseUrl.replace(/\/$/, '');
  
  if (!token || !normalizedBaseUrl) {
    console.error('Chatwoot token or base URL is missing');
    return;
  }

  if ((window as any).chatwootSDK) {
    console.log('Chatwoot already loaded');
    return;
  }
console.log("the base url is ",normalizedBaseUrl,normalizedBaseUrl.startsWith('http'))
  const sanitizedBaseUrl = normalizedBaseUrl.includes('0.0.0.0')
  ? normalizedBaseUrl.replace('0.0.0.0', 'localhost') // or replace with actual hostname
  : normalizedBaseUrl;

console.log("the base url is ",normalizedBaseUrl,normalizedBaseUrl.startsWith('http'),sanitizedBaseUrl)

  const fullBaseUrl = sanitizedBaseUrl.startsWith('http') 
    ? sanitizedBaseUrl 
    : `https://${normalizedBaseUrl}`;

  (function (d, t) {
    const g = d.createElement(t) as HTMLScriptElement;
    const s = d.getElementsByTagName(t)[0];
    g.src = `${fullBaseUrl}/packs/js/sdk.js`;
    g.defer = true;
    g.async = true;
    g.onload = () => {
      (window as any).chatwootSDK.run({
        websiteToken:  'x9FcjxafeuyECSr38rhQM92F',
        baseUrl: fullBaseUrl,
      });
    };
    g.onerror = () => {
      console.error('Failed to load Chatwoot SDK');
    };
    s.parentNode!.insertBefore(g, s);
  })(document, "script");
}