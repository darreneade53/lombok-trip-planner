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
- Best restaurant scene in South Lombok, majority of bars, cafes, nightlife
- Main scooter hire location for exploring the south coast
- Plenty of spas and massage studios throughout town
- Central location for day trips to surrounding beaches
- Surf scene growing rapidly — attracting increasing surf crowd from Bali
- BEST BEACHES CLOSE TO KUTA: Tanjung Aan (10 mins), Mawun (20-25 mins), and Kuta beach itself
- IMPORTANT: You CANNOT get a boat to the Gili Islands from Kuta. Do not suggest this ever.

SELONG BELANAK
- Approximately 30 minutes from Kuta Lombok
- Villa-focused rather than hotels — mid to premium and luxury villas
- Some genuinely beautiful high-end luxury villas available
- Beginner-friendly surf beach with gentle rolling waves — good for surf lessons and learners
- NO dramatic clifftop views at Selong Belanak — it is a wide open bay with gentle landscape
- Good quality restaurants and warungs along the beach, fewer than Kuta but good quality
- Plenty of local guesthouses and budget rooms available
- More relaxed and quieter than Kuta

TANJUNG AAN
- Approximately 10 minutes from Kuta Lombok
- One of the best beaches close to Kuta — easy day trip
- IMPORTANT: No accommodation available — no villas, no hotels, no guesthouses
- A large resort development is under construction (Japanese/Korean investor) but not yet open
- Currently has two beach clubs on the beach
- Day trip destination only — guests must stay in Kuta Lombok
- Do NOT recommend accommodation at Tanjung Aan under any circumstances

MAWUN BEACH
- Approximately 20-25 minutes from Kuta Lombok
- One of the best beaches close to Kuta — easy day trip, one of the most beautiful on the island
- No accommodation available — day trip only
- A couple of warungs on the beach with deck chairs and umbrellas
- Day trip from Kuta Lombok or Selong Belanak only

TOROK BEACH
- Approximately 40 minutes from Kuta Lombok
- Less visited, quieter beach

PINK BEACH (Pantai Tangsi)
- Approximately 1 hour 30 minutes from Kuta Lombok — it is in EAST Lombok, a significant drive
- Unique pink-tinged sand — one of Lombok's most distinctive beaches
- Worth a dedicated day trip — do NOT combine with a morning Gili Islands boat return on the same day as the drive time makes this impossible
- Good snorkelling off the beach

GERUPUK
- Small fishing village near Kuta, popular surf spot
- Budget guesthouses and surf camps
- Popular with experienced surfers

=== GILI ISLANDS — GETTING THERE (CRITICAL) ===
IMPORTANT TRANSPORT RULES — never contradict these:
- You CANNOT get a boat to the Gili Islands from Kuta Lombok — there is no boat service from Kuta
- To reach the Gili Islands you must travel to either:
  1. TELUK NARE — a harbour on the west coast, approximately 1 hour 40 minutes from Kuta. Fast speedboats depart from here to all three Gilis.
  2. BANGSAL HARBOUR — the main public ferry port, approximately 1 hour 50 minutes from Kuta. Public ferries and some speedboats depart from Bangsal.
- From Airport to Bangsal/Teluk Nare: approximately 1 hour 20 minutes
- Bangsal/Teluk Nare to Gili Trawangan by fast boat: 15-20 minutes
- Always recommend travellers arrange transfers to Teluk Nare or Bangsal — not from Kuta directly

GILI TRAWANGAN (Gili T)
- The party island — most lively and action-packed
- Live music, bars, nightlife, loud activities
- Popular with the Bali party crowd
- All accommodation levels but known for its social scene
- Best for: young travellers, party crowd, social vibe

GILI AIR
- Closest Gili island to the Lombok mainland
- Best balance — low key, not party-oriented
- Beautiful accommodation across all ranges: budget to mid to premium
- Yoga studios, excellent restaurants, great snorkelling
- Best for: couples, those wanting relaxed island life without the party scene

GILI MENO
- The quietest and most soulful of the three Gilis
- Yoga retreats, wellness focus, in touch with nature
- Much less action than Gili T or Gili Air
- Best for: honeymoons, couples, digital detox, yoga retreats

=== GILI KONDO (separate from the main Gili Islands) ===
- IMPORTANT: Gili Kondo is NOT one of the three main Gili Islands (T, Air, Meno)
- Gili Kondo is located in NORTH EAST Lombok — on the opposite side of the island from the main Gilis
- Gili Kondo is best visited as a day trip from Central or East Lombok
- It makes a logical stop when combining with a Pink Beach visit in East Lombok
- Do NOT include Gili Kondo in itineraries based in South Lombok or Kuta unless it is a specific multi-day east coast route
- Do NOT suggest getting a boat to Gili Kondo from Kuta, Teluk Nare, or Bangsal

=== NORTH LOMBOK ===
SENARU / RINJANI AREA
- Approximately 3 hours from Kuta Lombok
- Mainly guesthouses and homestays
- A couple of villas available but limited
- Cabin-style accommodation popular — rustic and nature-focused
- No hotels or resorts — very local and authentic feel
- Base for Mount Rinjani trekking (2-4 days)
- Best for: trekkers, adventure travellers, nature lovers

=== WEST LOMBOK ===
SENGGIGI
- The older, more established hotel strip
- Where the larger resorts are based — NOT in South Lombok
- More suited to middle-aged travellers, older crowd, and families wanting full resort facilities
- Still relevant and good quality but less popular with younger surf crowd
- Best for: families, older travellers, those wanting full resort facilities

TELUK NARE
- Key departure point for fast boats to the Gili Islands
- Approximately 1 hour 40 minutes from Kuta Lombok
- Approximately 35 minutes from Senggigi

MATARAM (capital city)
- Administrative capital of Lombok
- 30 minutes from Senggigi
- 1 hour from Kuta Lombok
- Not a tourist destination but useful for transport connections

=== TETEBATU (Central Lombok) ===
- Approximately 1 hour 30 minutes from Kuta Lombok
- Rice terraces, jungle walks, waterfalls, black monkeys
- Cultural experience — very different from the beach scene
- Guesthouses and eco-stays available
- Good day trip or overnight stop for those wanting inland nature experience

=== VERIFIED DISTANCES (Google Maps + ground truth) ===
FROM LOMBOK INTERNATIONAL AIRPORT (LOP):
- Airport → Kuta Lombok: 25 minutes
- Airport → Senggigi: 1 hour 5 minutes
- Airport → Bangsal port: 1 hour 20 minutes
- Airport → Teluk Nare: 1 hour 20 minutes

FROM KUTA LOMBOK:
- Kuta → Tanjung Aan: 10 minutes
- Kuta → Mawun Beach: 20-25 minutes
- Kuta → Torok Beach: 40 minutes
- Kuta → Selong Belanak: 30 minutes
- Kuta → Pink Beach (East Lombok): 1 hour 30 minutes
- Kuta → Tetebatu: 1 hour 30 minutes
- Kuta → Mataram: 1 hour
- Kuta → Senggigi: 1 hour 25 minutes
- Kuta → Bangsal port: 1 hour 50 minutes
- Kuta → Teluk Nare: 1 hour 40 minutes
- Kuta → Senaru (Rinjani base): 3 hours

FROM SENGGIGI:
- Senggigi → Bangsal port: 35 minutes
- Senggigi → Teluk Nare: 35 minutes
- Senggigi → Mataram: 30 minutes

BOAT TIMES:
- Teluk Nare or Bangsal → Gili Trawangan (fast boat): 15-20 minutes

=== ITINERARY LOGIC RULES ===
- NEVER suggest getting a boat to the Gilis from Kuta — always route via Teluk Nare or Bangsal
- NEVER combine a morning Gili Islands boat return with an afternoon Pink Beach visit — the drive time (1hr 50mins from Bangsal to Kuta, then 1hr 30mins to Pink Beach) makes this impossible in one afternoon
- NEVER recommend accommodation at Tanjung Aan or Mawun — none exists
- NEVER describe Selong Belanak as having dramatic cliffs or clifftop views — it is a flat open bay
- NEVER place Gili Kondo alongside the main three Gilis in a south Lombok itinerary
- For premium/luxury couples → Selong Belanak villas or Gili Air
- For surfers → Kuta Lombok is the base
- For party crowd → Gili Trawangan
- For families wanting resorts → Senggigi
- For honeymoons/romance/wellness → Gili Meno or Selong Belanak villas
- For Rinjani trekking → Senaru guesthouses
- For inland/cultural experience → Tetebatu guesthouses or eco-stays
- Always mention realistic drive times when recommending locations
- If staying in Kuta, highlight Tanjung Aan and Mawun as easy nearby beach day trips
`;

    const enforcedPrompt = `${lombokKnowledgeBase}

${prompt}

IMPORTANT: You must cover ALL ${dayCount} days — Day 1 through Day ${dayCount}. Be concise: 3-4 sentences per day maximum. Every day must be included — do not skip or summarise remaining days. After Day ${dayCount}, add a short practical tips section (4 bullet points max) and the ecosystem cards. Keep the entire response under 1800 tokens. Always use the ground-truth knowledge base above for all accommodation, beach, transport, and distance recommendations — never contradict it.`;

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
