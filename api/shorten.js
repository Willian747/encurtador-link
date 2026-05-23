export default async function handler(req, res) {
  // Permite que qualquer site (incluindo sua loja Shopify) chame essa função
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');

  // Responde ao "preflight" do navegador
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ error: 'URL não informada' });
  }

  try {
    const response = await fetch(
      'https://is.gd/create.php?format=json&url=' + encodeURIComponent(url)
    );
    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: 'Falha ao encurtar' });
  }
}
