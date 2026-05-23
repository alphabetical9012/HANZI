export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { hanzi } = req.body;
  
  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{
        parts: [{
          text: `You are a Chinese language expert. For the word "${hanzi}", provide pinyin with tone marks and Russian translation (1-3 words) and two short example sentences.
Respond ONLY with valid JSON:
{"pinyin":"...","translation":"...","examples":[{"zh":"...","ru":"..."},{"zh":"...","ru":"..."}]}`
        }]
      }]
    })
  });

  const data = await response.json();
  const text = data.candidates[0].content.parts[0].text;
  const result = JSON.parse(text.replace(/\`\`\`json|\`\`\`/g, '').trim());
  
  res.status(200).json(result);
}
