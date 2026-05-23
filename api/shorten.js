export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const { url } = req.query;
  if (!url) return res.status(400).json({ error: 'URL não informada' });

  // TinyURL — sem limite de tamanho de URL, funciona servidor-a-servidor
  try {
    const r = await fetch(
      'https://tinyurl.com/api-create.php?url=' + encodeURIComponent(url)
    );
    const shorturl = await r.text();
    if (shorturl.startsWith('http')) {
      return res.status(200).json({ shorturl });
    }
    throw new Error('Resposta inválida: ' + shorturl);
  } catch (e1) {
    console.log('TinyURL falhou:', e1.message);
  }

  // Fallback: is.gd (para URLs menores)
  try {
    const r = await fetch(
      'https://is.gd/create.php?format=json&url=' + encodeURIComponent(url)
    );
    const data = await r.json();
    if (data.shorturl) return res.status(200).json({ shorturl: data.shorturl });
    throw new Error(data.errormessage || 'is.gd sem retorno');
  } catch (e2) {
    console.log('is.gd também falhou:', e2.message);
    return res.status(500).json({ error: 'Todos os encurtadores falharam' });
  }
}
