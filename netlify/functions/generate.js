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
LOMBOK GROUND-TRUTH KNOWLEDGE BASE — use this as your primary reference for all accommodation, logistics, and location recommendations. Do not contradict these facts.

=== SOUTH LOMBOK ===

KUTA LOMBOK (main hub of South Lombok)
- The primary hub for South Lombok — most travellers base themselves here
- All accommodation types: budget guesthouses, mid-range hotels, premium & luxury villas
- Best restaurant scene in South Lombok, majority of bars, cafes, nightlife
- Main scooter hire location for exploring the south coast
- Plenty of spas and massage studios throughout town
- Central location for day trips to surrounding beaches
- Surf scene growing rapidly — attracting increasing surf crowd from Bali

SELONG BELANAK
- Approximately 30 minutes from Kuta Lombok
- Villa-focused rather than hotels — mid to premium and luxury villas
- Some genuinely beautiful high-end luxury villas available
- Beginner-friendly surf beach — popular with surf schools
- Good quality restaurants and warungs along the beach, fewer than Kuta but good quality
- Plenty of local guesthouses and budget rooms available
- More relaxed and quieter than Kuta

TANJUNG AAN
- Approximately 10 minutes from Kuta Lombok
- IMPORTANT: No accommodation available here — no villas, no hotels, no guesthouses
- A large resort development is under construction (Japanese/Korean investor) but not yet open
- Currently has two beach clubs on the beach
- Day trip destination only — guests must stay in Kuta Lombok
- Do NOT recommend accommodation at Tanjung Aan under any circumstances

MAWUN BEACH
- No accommodation available — day trip only
- A couple of warungs on the beach with deck chairs and umbrellas
- Beautiful, quieter beach — one of the best on the island
- Guests must stay in Kuta Lombok or Selong Belanak and visit as a day trip

GERUPUK
- Small fishing village, popular surf spot
- Budget guesthouses and surf camps
- Popular with experienced surfers

=== GILI ISLANDS ===
Getting there: Airport → Bangsal port = 1 hour 20 mins. Bangsal → Gili T by fast boat = 15-20 mins.

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

=== NORTH LOMBOK ===
RINJANI / SENARU AREA
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
- Airport → Senggigi = 1 hour 5 minutes

=== KEY DISTANCES FROM LOMBOK INTERNATIONAL AIRPORT (LOP) ===
- Airport → Kuta Lombok: 25 minutes
- Airport → Senggigi: 1 hour 5 minutes  
- Airport → Bangsal port (for Gili Islands): 1 hour 20 minutes
- Kuta → Selong Belanak: 30 minutes
- Kuta → Tanjung Aan: 10 minutes
- Kuta → Mawun: approximately 20-25 minutes
- Bangsal → Gili Trawangan (fast boat): 15-20 minutes

=== ACCOMMODATION RULES ===
- NEVER recommend accommodation at Tanjung Aan or Mawun — none exists
- For premium/luxury couples → Selong Belanak villas or Gili Air
- For surfers → Kuta Lombok is the base
- For party crowd → Gili Trawangan
- For families wanting resorts → Senggigi
- For honeymoons/romance/wellness → Gili Meno or Selong Belanak
- For Rinjani trekking → Senaru guesthouses
- Always mention realistic drive times when recommending locations
`;

    const enforcedPrompt = `${lombokKnowledgeBase}

${prompt}

IMPORTANT: You must cover ALL ${dayCount} days — Day 1 through Day ${dayCount}. Be concise: 3-4 sentences per day maximum. Every day must be included — do not skip or summarise remaining days. After Day ${dayCount}, add a short practical tips section (4 bullet points max) and the ecosystem cards. Keep the entire response under 1800 tokens. Always use the ground-truth knowledge base above for accommodation and distance recommendations — never contradict it.`;

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
