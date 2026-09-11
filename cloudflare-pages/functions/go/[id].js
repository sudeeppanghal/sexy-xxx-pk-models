// Cloudflare Pages Edge Function for Per-Model Routing
export async function onRequest(context) {
  const smartLink = "https://www.effectivecpmnetwork.com/rm9cqers?key=53f807fa771a60ba28a6dbc43af423a1";
  return Response.redirect(smartLink, 302);
}
