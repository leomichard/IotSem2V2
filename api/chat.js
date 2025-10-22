export default async function handler(req, res) {
    // ✅ Autoriser les appels externes
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    if (req.method === 'OPTIONS') return res.status(200).end();

    try {
        // ✅ Vérifie le body (compatibilité Vercel)
        const rawBody = req.body || '';
        const parsedBody = typeof rawBody === 'string' ? JSON.parse(rawBody || '{}') : rawBody;
        const { message } = parsedBody;

        if (!message) {
            console.log("❌ No message provided");
            return res.status(400).json({ error: 'Missing message in request body.' });
        }

        const apiKey = process.env.MISTRAL_API_KEY;
        if (!apiKey) {
            console.error("❌ Missing MISTRAL_API_KEY");
            return res.status(500).json({ error: 'Server misconfiguration: API key missing.' });
        }

        // ✅ Appel à Mistral
        const response = await fetch("https://api.mistral.ai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: "mistral-medium",
                messages: [{ role: "user", content: message }]
            })
        });

        // ✅ Traite la réponse Mistral
        const data = await response.json();
        console.log("✅ Mistral response:", data);
        return res.status(200).json(data);

    } catch (error) {
        console.error("🔥 Internal error:", error);
        return res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
}
