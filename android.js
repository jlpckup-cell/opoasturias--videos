export function isAndroid(ua){return /Android/i.test(ua);}
export function braveIntent(address,fallbackAddress){
  const url=new URL(address),fallback=new URL(fallbackAddress);
  if(url.protocol!=='https:'||url.username||url.password)throw Error('Brave requiere una dirección HTTPS sin credenciales.');
  if(fallback.protocol!=='https:'&&!(fallback.protocol==='http:'&&['localhost','127.0.0.1'].includes(fallback.hostname)))throw Error('Dirección alternativa no válida.');
  const resource=(url.host+url.pathname+url.search).replace(/;/g,'%3B');
  return `intent://${resource}#Intent;scheme=https;package=com.brave.browser;S.browser_fallback_url=${encodeURIComponent(fallback.href)};end`;
}
