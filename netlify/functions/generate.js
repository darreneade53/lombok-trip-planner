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
- Restaurants and cafes are spread around town, approximately 2 minutes from the beach. There are NO beachside restaurants in Kuta — do not describe dining on the beach in Kuta.
- Main scooter hire location for exploring the south coast
- Plenty of spas and massage studios throughout town
- BEST BEACHES CLOSE TO KUTA: Tanjung Aan (10 mins — closer than Gerupuk), Gerupuk (15 mins), Mawun (20-25 mins), and Kuta beach itself. Tanjung Aan is the closest of these beaches to Kuta town.
- IMPORTANT: You CANNOT get a boat to the Gili Islands from Kuta. Do not suggest this ever.

TANJUNG AAN & BUKIT MERESE
- Approximately 10 minutes from Kuta Lombok
- Beautiful twin-bay beach — one of the best day trips from Kuta
- BUKIT MERESE: The hill directly adjacent to Tanjung Aan — the BEST sunset viewpoint in South Lombok. Always recommend Bukit Merese for sunset when suggesting an afternoon at Tanjung Aan.
- No accommodation — day trip only. Two beach clubs on the beach.
- Large resort under construction but not yet open.

MAWUN BEACH
- Approximately 20-25 minutes from Kuta Lombok
- Beautiful bay framed by two headlands — one of the best on the island. Do NOT describe Mawun as having cliffs or clifftop views — it has two gentle headlands.
- No accommodation — day trip only
- A couple of warungs with deck chairs and umbrellas

GERUPUK
- Approximately 15 minutes from Kuta Lombok
- Small fishing village, popular surf spot with multiple breaks
- Surf camps and warungs only — NO beach clubs in Gerupuk
- Boat out to the breaks from the village
- Popular with experienced surfers

EKAS (surf)
- Approximately 1 hour 15 minutes from Kuta Lombok
- Remote surf destination, less crowded, known for Ekas Bay breaks

TOROK BEACH
- Approximately 40 minutes from Kuta Lombok
- Less visited, quieter beach

PINK BEACH (Pantai Tangsi) & KONDO BEACH
- Pink Beach: approximately 1 hour 30 minutes from Kuta — located in EAST Lombok
- Unique pink-tinged sand, good snorkelling
- KONDO BEACH (access point for Gili Kondo): approximately 2 hours 20 minutes from Kuta — also East Lombok
- Pink Beach and Kondo Beach can be logically combined in the same East Lombok day trip
- Do NOT combine a morning Gili Islands return with an afternoon Pink Beach/Kondo visit

SELONG BELANAK
- Approximately 30 minutes from Kuta Lombok
- Villa-focused — mid to premium and luxury villas
- SURF LESSONS available here — beginner-friendly surf with gentle rolling waves. This is where you go for surf lessons, NOT freediving or snorkelling lessons.
- NO dramatic clifftop views — wide open bay with gentle flat landscape
- NO freediving at Selong Belanak — do not suggest this
- Good quality restaurants and warungs, budget guesthouses also available

=== GILI ISLANDS — GEOGRAPHY & ORDER (CRITICAL) ===
The three main Gili Islands from closest to furthest from the mainland:
1. GILI AIR — closest to Lombok mainland
2. GILI MENO — middle island, 10 minutes from Gili Air
3. GILI TRAWANGAN (Gili T) — furthest, 10 minutes from Meno, 15 minutes from Air

Inter-island times:
- Gili Air → Gili Meno: 10 minutes
- Gili Meno → Gili Trawangan: 10 minutes
- Gili Air → Gili Trawangan: 15 minutes

GETTING TO THE GILI ISLANDS (CRITICAL — never contradict):
- NO boats from Kuta to Gili Islands — this does not exist
- Must travel to TELUK NARE (1hr 40mins from Kuta) or BANGSAL HARBOUR (1hr 50mins from Kuta)
- Teluk Nare/Bangsal → Gili T by fast boat: 15-20 minutes
- Airport → Bangsal/Teluk Nare: 1hr 20mins

GILI TRAWANGAN — party island, live music, bars, nightlife, all accommodation levels
GILI AIR — best balance, low key, budget to premium, yoga, great restaurants, snorkelling
GILI MENO — quietest, yoga retreats, wellness, honeymoons, couples

=== GILI KONDO (NOT a main Gili Island) ===
- Located in NORTH EAST Lombok — completely opposite side of island from the main Gilis
- Access via Kondo Beach: approximately 2 hours 20 minutes from Kuta Lombok
- Best visited as a day trip from Central or East Lombok
- Logical to combine with Pink Beach in an East Lombok day
- Do NOT include in south Lombok or Kuta-based itineraries unless doing a dedicated east coast route

=== TETEBATU (Central Lombok) ===
- Approximately 1 hour 30 minutes from Kuta Lombok
- Rice terraces, jungle walks, monkey forest (black monkeys), smaller local waterfalls in the area
- Guesthouses and eco-stays available — good overnight base
- Cultural and nature experience — very different from the beach scene
- BENANG KELAMBU WATERFALL: 45 minutes from Tetebatu — a beautiful and accessible waterfall, good day trip from Tetebatu base
- TIU KELEP WATERFALL: 2 hours 20 minutes from Tetebatu — a significant drive, better accessed from Senaru (only 5 minutes from Senaru). Do NOT recommend Tiu Kelep as a day trip from Tetebatu — it is too far. Recommend it as part of a North Lombok / Senaru itinerary instead.
- SEMBALUN: 50 minutes from Tiu Kelep waterfall — logical staging point for Rinjani trekkers

=== NORTH LOMBOK ===
SENARU
- Approximately 3 hours from Kuta Lombok
- Main base for Mount Rinjani trekking (2-4 days)
- Guesthouses, homestays, cabin-style accommodation — no hotels or resorts
- TIU KELEP WATERFALL: only 5 minutes from Senaru — easily combined with a Senaru stay
- Always recommend Tiu Kelep as part of a Senaru itinerary, not from Tetebatu

SEMBALUN VALLEY
- Approximately 50 minutes from Tiu Kelep / Senaru area
- Alternative base for Rinjani trekkers approaching from the east side
- Beautiful valley scenery

=== WEST LOMBOK ===
SENGGIGI — older resort strip, larger hotels, families and older travellers, 1hr 25mins from Kuta
TELUK NARE — fast boat departures to Gili Islands, 1hr 40mins from Kuta, 35mins from Senggigi
MATARAM — capital city, not a tourist destination, 1hr from Kuta, 30mins from Senggigi

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
- Kuta → Kondo Beach (Gili Kondo access): 2hrs 20mins
- Kuta → Mataram: 1hr
- Kuta → Senggigi: 1hr 25mins
- Kuta → Teluk Nare: 1hr 40mins
- Kuta → Bangsal: 1hr 50mins
- Kuta → Senaru (Rinjani base): 3hrs

FROM TETEBATU:
- Tetebatu → Benang Kelambu waterfall: 45 mins
- Tetebatu → Tiu Kelep waterfall: 2hrs 20mins (too far — use Senaru instead)

FROM SENARU:
- Senaru → Tiu Kelep waterfall: 5 mins
- Senaru → Sembalun: 50 mins

FROM SENGGIGI:
- Senggigi → Bangsal/Teluk Nare: 35 mins
- Senggigi → Mataram: 30 mins

INTER-GILI:
- Gili Air → Gili Meno: 10 mins
- Gili Meno → Gili T: 10 mins
- Gili Air → Gili T: 15 mins

=== HARD RULES — NEVER BREAK THESE ===
- NEVER suggest a boat to the Gilis from Kuta — always route via Teluk Nare or Bangsal
- NEVER describe beachside dining in Kuta — restaurants are in town, 2 mins from beach
- NEVER recommend accommodation at Tanjung Aan or Mawun — none exists
- NEVER describe Selong Belanak as having cliffs, clifftop views, freediving, or snorkelling lessons — it is for surf lessons and beach relaxation
- NEVER suggest Tiu Kelep as a day trip from Tetebatu — it is 2hrs 20mins away. Always pair Tiu Kelep with Senaru.
- NEVER place Gili Kondo alongside the main three Gilis in a south Lombok itinerary
- NEVER combine a morning Gili return with afternoon Pink Beach — drive time makes it impossible
- ALWAYS recommend Bukit Merese for sunset when an afternoon at Tanjung Aan is suggested
- ALWAYS pair Tiu Kelep with a Senaru stay, not Tetebatu
- ALWAYS recommend Benang Kelambu as the waterfall day trip from Tetebatu
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
        max_tokens: 2500,
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
