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

    const lombokKnowledgeBase = `LOMBOK FACTS — never contradict these.

SOUTH LOMBOK:
- Kuta = main hub. All budgets. Restaurants/bars in town (2-5 mins from the beach, NOT beachside). No beachside hotels or beach bars in Kuta. Spas, scooter hire. No boats to Gilis from Kuta.
- Selong Belanak = 30min from Kuta. Selong Belanak is WEST of Kuta, not south. Villas (mid-luxury) available if staying overnight there. Beginner surf lessons. Flat bay, no cliffs, no freediving. IMPORTANT: If the traveller is based in Kuta, Selong Belanak is a day trip only, do NOT suggest relaxing at a villa there or staying overnight unless the itinerary specifically moves their base to Selong Belanak.
- Tanjung Aan = 10min from Kuta. IMPORTANT: Tanjung Aan is 40mins from Selong Belanak, NOT 10mins. Only quote the 10min distance when the traveller is based in Kuta. If they are at Selong Belanak, the distance to Tanjung Aan is 40mins. Day trip only, NO accommodation. 2 approximately 1 beach club and a few local warungs. Resort under construction. BUKIT MERESE hill above = best sunset in South Lombok — always recommend for afternoon visits.
- Mawun = 20-25min from Kuta. Day trip only, NO accommodation. Bay with 2 headlands (not cliffs). Warungs only.
- Gerupuk = 15min from Kuta. Surf camps and warungs only (NO beach clubs). Boat out to breaks. Gerupuk is EAST of Kuta.
- Desert Point = far South West of Lombok, opposite side of the island from Gerupuk. NEVER combine Gerupuk and Desert Point in the same day, they are on completely opposite sides of the island. Each requires a separate full day trip.
- Torok = 40min from Kuta. Quiet beach, day trip.
- Ekas = 1hr15min from Kuta. Remote surf.
- Pink Beach = 1hr30min from Kuta (East Lombok). Day trip. Good snorkelling.
- Kondo Beach (Gili Kondo access) = 2hr20min from Kuta (East Lombok). Pink Beach to Kondo Beach = 2hr10min — NEVER combine in one day. Each requires a separate full day trip.

GILI ISLANDS — order closest to mainland: Air → Meno (10min) → Trawangan (15min from Air).
- Gili Air = closest, best balance, low-key, all budgets, yoga, restaurants.
- Gili Meno = quietest, wellness, honeymoons.
- Gili T = party island, live music, social.
- TO GET THERE: Drive to Teluk Nare (1hr40 from Kuta) or Bangsal (1hr50 from Kuta). Fast boat 15-20min to Gili T. NEVER suggest boat from Kuta direct.
- BOAT TIMING WARNING: Fast boats between Gili T and the mainland (Teluk Nare/Bangsal) do not run late in the evening. Last boats typically depart in the late afternoon. Never suggest returning from Gili T to the mainland in the evening, always plan returns in the afternoon.

GILI KONDO = NE Lombok, opposite side from main Gilis. Day trip from East/Central Lombok only.

TETEBATU (Central):
- 1hr30min from Kuta. Rice terraces, monkey forest, small local waterfalls.
- Benang Kelambu waterfall = 45min from Tetebatu (good day trip).
- Tiu Kelep = 2hr20min from Tetebatu — TOO FAR. Always pair Tiu Kelep with Senaru instead.

NORTH LOMBOK / SENARU:
- 3hrs from Kuta. Guesthouses/homestays/cabins only (no hotels).
- Rinjani trekking base (2-4 days).
- Tiu Kelep waterfall = 5min drive from Senaru, then a 30-45 minute hike to reach the waterfall. Always combine with a Senaru stay.
- Sembalun = 50min from Senaru. Alternative Rinjani approach, valley scenery.

WEST LOMBOK / SENGGIGI:
- 1hr25min from Kuta. Older resort strip. Families/older travellers.
- Teluk Nare = 35min from Senggigi. Fast boat departure point for Gilis.
- Mataram (capital) = 30min from Senggigi, 1hr from Kuta. Not a tourist destination.

KEY DISTANCES FROM KUTA: Airport 25min, Tanjung Aan 10min, Gerupuk 15min, Mawun 20-25min, Torok 40min, Selong Belanak 30min, Ekas 1hr15, Pink Beach 1hr30, Tetebatu 1hr30, Mataram 1hr, Senggigi 1hr25, Teluk Nare 1hr40, Bangsal 1hr50, Senaru 3hrs, Kondo Beach 2hr20.
FROM AIRPORT: Kuta 25min, Senggigi 1hr5, Bangsal/Teluk Nare 1hr20.

HARD RULES:
- No boats Kuta→Gilis. Always Teluk Nare or Bangsal.
- No accommodation at Tanjung Aan or Mawun.
- If based in Kuta, never suggest staying or relaxing at a villa in Selong Belanak, it is a day trip only.
- No beachside dining in Kuta.
- No cliffs at Selong Belanak or Mawun.
- No freediving at Selong Belanak — surf lessons only.
- Never suggest Tiu Kelep from Tetebatu — pair with Senaru.
- Always recommend Bukit Merese for sunset at Tanjung Aan.
- Gili Kondo = East Lombok only, not with main Gilis. NEVER combine Pink Beach and Gili Kondo in the same day — too far apart (2hr10min between them). Always separate full days.`;

    const enforcedPrompt = `${lombokKnowledgeBase}

${prompt}

IMPORTANT: Cover ALL ${dayCount} days — Day 1 through Day ${dayCount}. Max 3 sentences per day. Do not skip or summarise days. After Day ${dayCount} add practical tips (4 bullets max) and ecosystem cards. Stay under 1600 tokens total. Never contradict the facts above. Never use em dashes in your response, use commas instead.`;

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
