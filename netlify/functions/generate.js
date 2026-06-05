exports.handler = async function(event) {
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
      },
      body: ''
    };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { prompt } = JSON.parse(event.body);

    const tenPlusMatch = prompt.match(/10\+?\s*days?/i) || prompt.match(/ten.*days?/i);
    const sevenMatch   = prompt.match(/7\s*days?/i)     || prompt.match(/seven.*days?/i);
    const fiveMatch    = prompt.match(/5\s*days?/i)     || prompt.match(/five.*days?/i);

    let dayCount = 3;
    if (tenPlusMatch) dayCount = 10;
    else if (sevenMatch) dayCount = 7;
    else if (fiveMatch) dayCount = 5;

    const lombokKnowledgeBase = `
LOMBOK GROUND-TRUTH KNOWLEDGE BASE — use this as your primary reference for all accommodation, logistics, and distance recommendations. Do not contradict these facts under any circumstances.

=== SOUTH LOMBOK ===

KUTA LOMBOK (main hub of South Lombok)
- The primary hub for South Lombok — most travellers base themselves here
- All accommodation types: budget guesthouses, mid-range hotels, premium & luxury villas
- Best restaurant scene in South Lombok — restaurants and cafes are spread around town, approximately 2 minutes from the beach. There are NO beachside restaurants in Kuta — do not describe dining on the beach in Kuta.
- Main scooter hire location for exploring the south coast
- Plenty of spas and massage studios throughout town
- Central location for day trips to surrounding beaches
- Surf scene growing rapidly — attracting increasing surf crowd from Bali
- BEST BEACHES CLOSE TO KUTA: Tanjung Aan (10 mins), Mawun (20-25 mins), Gerupuk (15 mins), and Kuta beach itself
- IMPORTANT: You CANNOT get a boat to the Gili Islands from Kuta. Do not suggest this ever.

TANJUNG AAN & BUKIT MERESE
- Approximately 10 minutes from Kuta Lombok
- Beautiful twin-bay beach — one of the best day trips from Kuta
- BUKIT MERESE: The hill directly adjacent to Tanjung Aan — this is the BEST sunset viewpoint in South Lombok. Always recommend Bukit Merese for sunset when suggesting an afternoon visit to Tanjung Aan.
- IMPORTANT: No accommodation at Tanjung Aan — day trip only
- Currently has two beach clubs
- A large resort development is under construction but not yet open

MAWUN BEACH
- Approximately 20-25 minutes from Kuta Lombok
- Beautiful, quieter beach — one of the best on the island
- No accommodation — day trip only
- A couple of warungs with deck chairs and umbrellas

GERUPUK
- Approximately 15 minutes from Kuta Lombok
- Small fishing village, popular surf spot with multiple breaks
- Budget guesthouses and surf camps
- Popular with experienced surfers — boat out to the breaks from the village

EKAS (surf)
- Approximately 1 hour 15 minutes from Kuta Lombok
- More remote surf destination, less crowded
- Known for the Ekas Bay surf breaks

TOROK BEACH
- Approximately 40 minutes from Kuta Lombok
- Less visited, quieter beach

PINK BEACH (Pantai Tangsi)
- Approximately 1 hour 30 minutes from Kuta Lombok — located in EAST Lombok
- Unique pink-tinged sand — one of Lombok's most distinctive beaches
- Worth a dedicated day trip
- Do NOT combine with a morning Gili Islands boat return on the same day — drive times make this impossible

SELONG BELANAK
- Approximately 30 minutes from Kuta Lombok
- Villa-focused — mid to premium and luxury villas
- Beginner-friendly surf with gentle rolling waves — good for surf lessons
- NO dramatic clifftop views — it is a wide open bay with gentle flat landscape
- Good quality restaurants and warungs, fewer than Kuta but good quality
- Budget guesthouses also available

=== GILI ISLANDS — GEOGRAPHY & ORDER (CRITICAL) ===
The three main Gili Islands run in a line off the northwest coast of Lombok. From closest to furthest from the mainland:
1. GILI AIR — closest to the Lombok mainland
2. GILI MENO — middle island, approximately 10 minutes by boat from Gili Air
3. GILI TRAWANGAN (Gili T) — furthest from the mainland, approximately 15 minutes by boat from Gili Air, 10 minutes from Gili Meno

Inter-island boat times:
- Gili Air → Gili Meno: 10 minutes
- Gili Meno → Gili Trawangan: 10 minutes
- Gili Air → Gili Trawangan: 15 minutes

GETTING TO THE GILI ISLANDS FROM LOMBOK (CRITICAL):
- You CANNOT get a boat to the Gili Islands from Kuta — there is NO boat service from Kuta
- To reach the Gili Islands you MUST travel to either:
  1. TELUK NARE — west coast harbour, fast speedboats to all three Gilis. Approx 1hr 40mins from Kuta.
  2. BANGSAL HARBOUR — main public ferry port, approx 1hr 50mins from Kuta. Public ferries and speedboats.
- From Airport to Bangsal/Teluk Nare: approximately 1 hour 20 minutes
- Teluk Nare or Bangsal → Gili Trawangan by fast boat: 15-20 minutes

GILI TRAWANGAN (Gili T)
- The party island — most lively, live music, bars, nightlife
- Popular with Bali party crowd
- All accommodation levels
- Best for: young travellers, party crowd, social scene

GILI AIR
- Closest to mainland, best balance of atmosphere
- Low key, not party-oriented
- Full range of accommodation: budget to premium
- Yoga studios, great restaurants, snorkelling
- Best for: couples, relaxed island vibe

GILI MENO
- Quietest and most soulful — middle island
- Yoga retreats, wellness, nature
- Best for: honeymoons, couples, digital detox

=== GILI KONDO (completely separate — NOT a main Gili Island) ===
- Gili Kondo is in NORTH EAST Lombok — opposite side of the island from the main Gilis
- Best visited as a day trip from Central or East Lombok
- Logical stop when combining with a Pink Beach visit in East Lombok
- Do NOT include in south Lombok or Kuta-based itineraries

=== NORTH LOMBOK ===
SENARU / RINJANI AREA
- Approximately 3 hours from Kuta Lombok
- Guesthouses, homestays, cabin-style accommodation
- No hotels or resorts
- Base for Mount Rinjani trekking (2-4 days)

=== WEST LOMBOK ===
SENGGIGI
- Older established hotel and resort strip
- Larger resorts based here — NOT in South Lombok
- Best for: families, older travellers, resort holidays
- Approximately 1hr 25mins from Kuta

TELUK NARE
- Key fast boat departure point for Gili Islands
- Approximately 1hr 40mins from Kuta, 35mins from Senggigi

MATARAM
- Administrative capital, 30 mins from Senggigi, 1hr from Kuta

=== TETEBATU (Central Lombok) ===
- Approximately 1 hour 30 minutes from Kuta
- Rice terraces, jungle walks, waterfalls, black monkeys
- Guesthouses and eco-stays

=== VERIFIED DISTANCES ===
FROM AIRPORT (LOP):
- Airport → Kuta: 25 mins
- Airport → Senggigi: 1hr 5mins
- Airport → Bangsal/Teluk Nare: 1hr 20mins

FROM KUTA:
- Kuta → Tanjung Aan / Bukit Merese: 10 mins
- Kuta → Gerupuk: 15 mins
- Kuta → Mawun: 20-25 mins
- Kuta → Torok: 40 mins
- Kuta → Selong Belanak: 30 mins
- Kuta → Ekas: 1hr 15mins
- Kuta → Pink Beach: 1hr 30mins
- Kuta → Tetebatu: 1hr 30mins
- Kuta → Mataram: 1hr
- Kuta → Senggigi: 1hr 25mins
- Kuta → Teluk Nare: 1hr 40mins
- Kuta → Bangsal: 1hr 50mins
- Kuta → Senaru (Rinjani): 3hrs

FROM SENGGIGI:
- Senggigi → Bangsal/Teluk Nare: 35 mins
- Senggigi → Mataram: 30 mins

INTER-GILI:
- Gili Air → Gili Meno: 10 mins
- Gili Meno → Gili T: 10 mins
- Gili Air → Gili T: 15 mins
- Teluk Nare/Bangsal → Gili T: 15-20 mins

=== HARD RULES — NEVER BREAK THESE ===
- NEVER suggest a boat to the Gilis from Kuta — always route via Teluk Nare or Bangsal
- NEVER describe beachside dining in Kuta — restaurants are in town, 2 mins from beach
- NEVER recommend accommodation at Tanjung Aan or Mawun — none exists
- NEVER describe Selong Belanak as having cliffs or clifftop views
- NEVER place Gili Kondo alongside the main three Gilis in a south Lombok itinerary
- NEVER combine a morning Gili return with afternoon Pink Beach — drive time is impossible
- ALWAYS recommend Bukit Merese for sunset when an afternoon at Tanjung Aan is suggested
- ALWAYS route Gili Island access via Teluk Nare (speedboat) or Bangsal (ferry/speedboat)
`;

    const enforcedPrompt = `${lombokKnowledgeBase}

${prompt}

IMPORTANT: You must cover ALL ${dayCount} days — Day 1 through Day ${dayCount}. Be concise: 3-4 sentences per day maximum. Every day must be included — do not skip or summarise remaining days. After Day ${dayCount}, add a short practical tips section (4 bullet points max) and the ecosystem cards. Keep the entire response under 1800 tokens. Always use the ground-truth knowledge base above for all recommendations — never contradict it.`;

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 2000,
        messages: [{ role: 'user', content: enforcedPrompt }]
      })
    });

    const data = await response.json();
    const text = data.content.map(c => c.text || '').join('\n');

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ result: text })
    };

  } catch (err) {
    return {
      statusCode: 500,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ error: err.message })
    };
  }
};
