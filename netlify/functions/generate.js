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

    // FIXED day count detection — handles "7-day", "7 day", "7days", "7 days" etc.
    let dayCount = 3;
    if (/\b10\+?[\s-]*days?\b/i.test(prompt) || /\bten[\s-]*days?\b/i.test(prompt)) {
      dayCount = 10;
    } else if (/\b7[\s-]*days?\b/i.test(prompt) || /\bseven[\s-]*days?\b/i.test(prompt)) {
      dayCount = 7;
    } else if (/\b5[\s-]*days?\b/i.test(prompt) || /\bfive[\s-]*days?\b/i.test(prompt)) {
      dayCount = 5;
    } else if (/\b3[\s-]*days?\b/i.test(prompt) || /\bthree[\s-]*days?\b/i.test(prompt)) {
      dayCount = 3;
    }

    const lombokKnowledgeBase = `LOMBOK FACTS — never contradict these.

SOUTH LOMBOK:
- Kuta = main hub. All budgets. Excellent restaurant and bar scene throughout Kuta town. NEVER use the word "beachfront" or "beachside" to describe any restaurant, bar, or dining venue in Kuta, none exist. Simply describe dining as being in Kuta town, or at a Kuta restaurant, with no reference to beach proximity at all. Do NOT repeat a specific walking time (such as 2-5 minutes) every time Kuta dining is mentioned, this becomes repetitive across an itinerary, vary the phrasing naturally or omit a specific time. Spas, scooter hire. No boats to Gilis from Kuta.
- Selong Belanak = 30min from Kuta. Selong Belanak is WEST of Kuta, not south. Villas (mid-luxury) available if staying overnight there. Beginner surf lessons. Flat bay, no cliffs, no freediving. IMPORTANT: If the traveller is based in Kuta, Selong Belanak is a day trip only, do NOT suggest relaxing at a villa there or staying overnight unless the itinerary specifically moves their base to Selong Belanak.
- Tanjung Aan = 10min from Kuta. IMPORTANT: Tanjung Aan is 40mins from Selong Belanak, NOT 10mins. Only quote the 10min distance when the traveller is based in Kuta. If they are at Selong Belanak, the distance to Tanjung Aan is 40mins. Day trip only, NO accommodation. Approximately 1 beach club and a few local warungs. Resort under construction. BUKIT MERESE hill above = best sunset in South Lombok, always recommend for afternoon visits.
- Mawun = 20-25min from Kuta. Mawun is WEST of Kuta, not south. Day trip only, NO accommodation. Bay with 2 headlands (not cliffs). Warungs only.
- Gerupuk = 15min from Kuta. Surf camps and warungs only (NO beach clubs). Boat out to LOCAL Gerupuk bay breaks only. Gerupuk is EAST of Kuta. IMPORTANT: Do NOT name Bangko-Bangko as a Gerupuk break, Bangko-Bangko is a completely different location on the opposite side of the island, see Desert Point below. Do NOT mention a break called "Periscope" or "Periscopes" under any circumstances, this break does not exist in Lombok, it is in Sumbawa, a different island entirely.
- Desert Point = far South West of Lombok, opposite side of the island from Gerupuk. Also known locally as BANGKO-BANGKO, this is the correct and only name/location pairing, Bangko-Bangko IS Desert Point, located South West, never East near Gerupuk. NEVER combine Gerupuk and Desert Point/Bangko-Bangko in the same day, they are on completely opposite sides of the island. Each requires a separate full day trip.
- Torok = 40min from Kuta. Quiet beach, day trip.
- Ekas Bay = 1hr15min from Kuta. Remote surf. THIS IS THE ACCOMMODATION HUB for the East Lombok region, villas and lodging are concentrated at Ekas Bay, not at Pink Beach or Kondo Beach themselves. Ekas Bay to Pink Beach = 45min by car.
- Pink Beach = 1hr30min from Kuta (East Lombok). Day trip only, good snorkelling. IMPORTANT: Pink Beach itself has scarce accommodation and is remote, do NOT describe any villa as "steps away" or walking distance from Pink Beach. Any villa stay for this region should be framed as based at Ekas Bay, 45min away, with Pink Beach visited as a day trip from there.
- Kondo Beach (Pantai Kondo, Gili Kondo access) = 2hr30min from Kuta (East Lombok). This is where travellers DRIVE TO and then catch a short boat crossing to Gili Kondo, the boat departs from Kondo Beach only, never directly from Pink Beach or from a villa. Pink Beach to Kondo Beach = 2hrs, NEVER combine in one day, each requires a separate full day trip from the Ekas Bay base. Kondo Beach is ALSO accessible from Sembalun (Central/North Lombok, near the Rinjani trekking base) in 1hr30min, making Gili Kondo a viable extension day for itineraries based in Sembalun, not only from Ekas Bay.

GILI ISLANDS (the main three: Air, Meno, Trawangan) — MUST BE AN OVERNIGHT STAY, NOT DAY TRIPS:
- IMPORTANT STRUCTURAL RULE: The Gili Islands should never be visited as repeated single day trips from Kuta. The drive to Teluk Nare/Bangsal plus boat is over 2 hours each way, doing this multiple times on different days for different Gilis is illogical and exhausting. ALWAYS structure Gili Island visits as a relocation, the traveller bases themselves on the Gilis for 1-2 nights and island-hops between Air, Meno, and Trawangan via short inter-island boats while there, then returns to Kuta once.
- Order closest to mainland: Air, then Meno (10min further), then Trawangan (15min from Air).
- Gili Air = closest, best balance, low-key, all budgets, yoga, restaurants. Best base for couples wanting to island hop from.
- Gili Meno = quietest, wellness, honeymoons.
- Gili T = party island, live music, social.
- TO GET THERE: Drive to Teluk Nare (1hr40 from Kuta) or Bangsal (1hr50 from Kuta). Fast boat 15-20min to Gili T. NEVER suggest a boat from Kuta direct.
- BOAT TIMING NOTE: This only matters for SAME-DAY return trips without an overnight stay. If the traveller is staying overnight on the Gilis, there is no need to rush back, they can enjoy sunset drinks and dinner at leisure and simply catch a boat the following day or whenever their stay ends. Only enforce an afternoon return cutoff if no overnight Gili stay is included in the itinerary.

SECRET GILI (Gili Sudak / Gili Nanggu area, South West Lombok):
- A quieter, less crowded reef and snorkelling day trip option for travellers based in Kuta.
- Kuta to the Secret Gili boat departure point is approximately 1hr30min by road (NOT 45 minutes), then a short boat crossing to the islands themselves.
- IMPORTANT: Secret Gili and Gili Kondo are two separate, unrelated day trip destinations in different parts of the island. Do NOT compare their travel times to each other or frame one as an alternative to the other within the same day description. Mention only the one that is actually relevant to the itinerary being built, never both together as a comparison.
- Suitable as a quieter, more accessible reef day trip alternative for travellers based in Kuta who are not doing a dedicated East Lombok multi-day route.

GILI KONDO = NE Lombok, opposite side from main Gilis (Air/Meno/Trawangan). One of the best reef and freediving spots in Lombok, comparable in quality to the main Gilis, but the round trip from Kuta is approximately 5 hours of driving alone in a single day.
- TWO VALID WAYS TO REACH GILI KONDO, pick whichever fits the itinerary's existing base, never invent a third:
  1. FROM SOUTH/KUTA: MANDATORY overnight stay at Ekas Bay (the accommodation hub for this region, closest point with a majority of villa options) to break up the journey. NEVER present Gili Kondo as a single day round trip from Kuta. Structure it as: travel to East Lombok and stay overnight at an Ekas Bay villa, drive to Kondo Beach and take a short boat crossing to Gili Kondo, and/or drive to Pink Beach as a separate day trip, then return to Kuta.
  2. FROM CENTRAL/SEMBALUN: If the itinerary already bases the traveller in Sembalun (e.g. for Rinjani trekking), Gili Kondo can be added as a 1hr30min extension day trip from Sembalun to Kondo Beach, no separate East Lombok overnight required in this case.
- The boat to Gili Kondo departs from Kondo Beach (Pantai Kondo) only. NEVER describe this as a boat charter departing from Pink Beach or directly from a villa, travellers always drive to Kondo Beach first, whether coming from Ekas Bay or from Sembalun.
- Do not combine with the main Gili Islands (Air/Meno/Trawangan) in the same itinerary segment, they are on opposite sides of Lombok.

SADE VILLAGE (Sasak traditional village):
- Located in SOUTH Lombok, near Kuta, approximately 20-30 minutes from Kuta. Sade Village is NOT near Tetebatu, do not describe it as a nearby or short drive from Tetebatu, that would mean driving almost all the way back toward Kuta, defeating the purpose of basing in Tetebatu.
- Traditional Sasak village, weaving demonstrations, ikat cloth, traditional architecture. Popular cultural stop when based in or passing through South Lombok near Kuta.

TETEBATU (Central):
- 1hr30min from Kuta. Rice terraces, monkey forest, small local waterfalls.
- Benang Kelambu waterfall = 45min from Tetebatu (good day trip).
- Tiu Kelep = 2hr20min from Tetebatu, TOO FAR. Always pair Tiu Kelep with Senaru instead.

NORTH LOMBOK / SENARU:
- 3hrs from Kuta. Guesthouses/homestays/cabins only (no hotels).
- Rinjani trekking base (2-4 days).
- Tiu Kelep waterfall = 5min drive from Senaru, then a 30-45 minute hike to reach the waterfall. Always combine with a Senaru stay.
- Sembalun = 50min from Senaru. Alternative Rinjani approach, valley scenery. Sembalun is also 1hr30min from Kondo Beach, so a Gili Kondo reef/freediving day can be added as an extension for itineraries based in Sembalun, as an alternative to accessing Gili Kondo via Ekas Bay/South Lombok.

WEST LOMBOK / SENGGIGI:
- 1hr25min from Kuta. Older resort strip. Families/older travellers.
- Teluk Nare = 35min from Senggigi. Fast boat departure point for Gilis.
- Mataram (capital) = 30min from Senggigi, 1hr from Kuta. Not a tourist destination.

KEY DISTANCES FROM KUTA: Airport 25min, Tanjung Aan 10min, Gerupuk 15min, Mawun 20-25min, Torok 40min, Selong Belanak 30min, Ekas Bay 1hr15, Pink Beach 1hr30, Tetebatu 1hr30, Mataram 1hr, Senggigi 1hr25, Teluk Nare 1hr40, Bangsal 1hr50, Senaru 3hrs, Kondo Beach 2hr30, Secret Gili departure point 1hr30.
FROM AIRPORT: Kuta 25min, Senggigi 1hr5, Bangsal/Teluk Nare 1hr20.
FROM EKAS BAY: Pink Beach 45min, always drive (never boat) between Ekas Bay, Pink Beach, and Kondo Beach.
FROM SEMBALUN: Kondo Beach (Gili Kondo access) 1hr30min, Senaru 50min. Gili Kondo can be a viable extension day from a Sembalun base.

HARD RULES:
- No boats Kuta to Gilis. Always Teluk Nare or Bangsal.
- The main Gili Islands (Air, Meno, Trawangan) must be visited as an overnight stay (1-2 nights), never as repeated separate day trips from Kuta.
- No rushed evening boat return rule applies only to same-day Gili trips with no overnight stay. Overnight Gili stays have no return time pressure.
- Secret Gili is approximately 1hr30min from Kuta to the departure point, never describe it as 45 minutes.
- Never compare Secret Gili and Gili Kondo travel times against each other in the same day description, they are unrelated separate destinations.
- If Gili Kondo is recommended from a Kuta/South Lombok itinerary, it must come with a mandatory overnight stay at Ekas Bay, never a single day round trip from Kuta. If the itinerary is already based in Sembalun, Gili Kondo can instead be added as a 1hr30min extension day trip, no separate overnight required.
- Ekas Bay, not Pink Beach or Kondo Beach, is the accommodation hub for East Lombok. Villas are based at Ekas Bay. Pink Beach and Kondo Beach have scarce or no accommodation and are day-trip destinations from Ekas Bay.
- The boat to Gili Kondo departs from Kondo Beach (Pantai Kondo), never from Pink Beach or directly from a villa. Travel from an Ekas Bay villa to Kondo Beach or Pink Beach is always by car.
- No accommodation at Tanjung Aan or Mawun.
- If based in Kuta, never suggest staying or relaxing at a villa in Selong Belanak, it is a day trip only.
- No beachside dining in Kuta.
- No cliffs at Selong Belanak or Mawun.
- No freediving at Selong Belanak, surf lessons only.
- Never suggest Tiu Kelep from Tetebatu, pair with Senaru.
- Always recommend Bukit Merese for sunset at Tanjung Aan.
- Gili Kondo is East Lombok only, never grouped with the main Gilis, and never combined with Pink Beach in the same single day (2hr10min apart).
- Bangko-Bangko IS Desert Point, located South West Lombok. NEVER name Bangko-Bangko as a break near Gerupuk, which is East of Kuta. These are opposite sides of the island.
- NEVER mention a surf break called "Periscope" or "Periscopes" anywhere in any itinerary, it does not exist in Lombok, it is located in Sumbawa, a separate island.
- CRITICAL BASING RULE: When the itinerary has the traveller staying overnight somewhere other than their original base (e.g. Tetebatu, Senaru, the Gili Islands, Ekas Bay), all distance and "nearby" language for the following day MUST be calculated FROM that current location, not from Kuta or any earlier base, unless the traveller has explicitly travelled back there. Always reason about where the traveller physically is on each day before describing what is nearby or how far away something is.
- Sade Village is near Kuta/South Lombok, never describe it as near or a short drive from Tetebatu.`;

    const enforcedPrompt = `${lombokKnowledgeBase}

${prompt}

CRITICAL: The itinerary length is EXACTLY ${dayCount} days. You must write Day 1 through Day ${dayCount} only, no more and no fewer. Do not add extra days beyond Day ${dayCount} under any circumstances. Max 3 sentences per day. Do not skip or summarise days. After Day ${dayCount} add practical tips (4 bullets max) and ecosystem cards. Stay under 1600 tokens total. Never contradict the facts above. Never use em dashes in your response, use commas instead.`;

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
