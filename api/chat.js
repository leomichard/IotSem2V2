export default async function handler(req, res) {
    // ✅ Autoriser les appels externes (CORS)
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    if (req.method === 'OPTIONS') return res.status(200).end();

    try {
        // ✅ Parse le message reçu
        let body = {};
        if (req.body) body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
        const { message } = body;

        if (!message) {
            return res.status(400).json({ error: 'Missing message in request body.' });
        }

        // ✅ Vérifie la clé Mistral
        const apiKey = process.env.MISTRAL_API_KEY;
        if (!apiKey) {
            console.error("❌ Missing MISTRAL_API_KEY");
            return res.status(500).json({ error: 'Server misconfiguration: API key missing.' });
        }

        // ✅ Appel Mistral API
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

        if (!response.ok) {
            const errText = await response.text();
            console.error("❌ Mistral API error:", errText);
            return res.status(response.status).json({ error: "Mistral API error", details: errText });
        }

        const data = await response.json();
        res.status(200).json(data);

    } catch (err) {
        console.error("🔥 Internal error:", err);
        res.status(500).json({ error: "Internal Server Error", details: err.message });
    }
}
