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

    // Determine how many days are requested so we can enforce completeness
    const tenPlusMatch = prompt.match(/10\+?\s*days?/i) || prompt.match(/ten.*days?/i);
    const sevenMatch   = prompt.match(/7\s*days?/i)     || prompt.match(/seven.*days?/i);
    const fiveMatch    = prompt.match(/5\s*days?/i)     || prompt.match(/five.*days?/i);

    let dayCount = 3; // default
    if (tenPlusMatch) dayCount = 10;
    else if (sevenMatch) dayCount = 7;
    else if (fiveMatch) dayCount = 5;

    // Inject a hard instruction into the prompt to prevent early truncation
    const enforcedPrompt = `${prompt}

CRITICAL INSTRUCTION: You MUST write a complete day-by-day itinerary covering ALL ${dayCount} days. Do not stop early. Do not summarise the remaining days. Every single day from Day 1 to Day ${dayCount} must have its own full section with specific Lombok place names, activities, accommodation suggestion, and a meal recommendation. If you reach Day ${dayCount} and have covered all days completely, you may then add the practical tips and ecosystem card sections. Stopping before Day ${dayCount} is not acceptable.`;

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 4000,
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
