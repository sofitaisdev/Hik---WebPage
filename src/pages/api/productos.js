export const prerender = false;

let cache = null;
let cacheTime = 0;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutos

export async function GET() {
  const now = Date.now();
  
  if (cache && (now - cacheTime) < CACHE_TTL) {
    return new Response(JSON.stringify(cache), {
      headers: { "Content-Type": "application/json" }
    });
  }

  const SB_URL = "https://mywtmrwjzwpwkctixnzi.supabase.co";
  const SB_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im15d3Rtcndqendwd2tjdGl4bnppIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE5NTQ4NDYsImV4cCI6MjA4NzUzMDg0Nn0.jdA2J-YUuRqnqj5-4l7yxGn_VoOX6C5Jwvn7k4l_ZgA";
  
  let allRows = [];
  let offset = 0;
  const limit = 1000;

  while (true) {
    const res = await fetch(
      `${SB_URL}/rest/v1/productos?select=*&limit=${limit}&offset=${offset}`,
      { headers: { apikey: SB_KEY, Authorization: `Bearer ${SB_KEY}` } }
    );
    const chunk = await res.json();
    if (!Array.isArray(chunk) || chunk.length === 0) break;
    allRows = allRows.concat(chunk);
    if (chunk.length < limit) break;
    offset += limit;
  }

  cache = allRows;
  cacheTime = now;

  return new Response(JSON.stringify(allRows), {
    headers: { "Content-Type": "application/json" }
  });
}