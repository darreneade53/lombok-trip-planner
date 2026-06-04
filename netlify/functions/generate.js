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

    // Detect trip length and inject a concise-but-complete instruction
    const tenPlusMatch = prompt.match(/10\+?\s*days?/i) || prompt.match(/ten.*days?/i);
    const sevenMatch   = prompt.match(/7\s*days?/i)     || prompt.match(/seven.*days?/i);
    const fiveMatch    = prompt.match(/5\s*days?/i)     || prompt.match(/five.*days?/i);

    let dayCount = 3;
    if (tenPlusMatch) dayCount = 10;
    else if (sevenMatch) dayCount = 7;
    else if (fiveMatch) dayCount = 5;

    const enforcedPrompt = `${prompt}

IMPORTANT: You must cover ALL ${dayCount} days — Day 1 through Day ${dayCount}. Be concise: 3-4 sentences per day maximum. Every day must be included — do not skip or summarise remaining days. After Day ${dayCount}, add a short practical tips section (4 bullet points max) and the ecosystem cards. Keep the entire response under 1800 tokens.`;

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
