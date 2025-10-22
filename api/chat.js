export default async function handler(req, res) {
    // --- ✅ Autoriser CORS pour les appels front externes ---
    if (req.method === 'OPTIONS') {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
        return res.status(200).end();
    }

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    try {
        // --- ✅ Parse du body ---
        const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body;
        const { message } = body || {};

        if (!message) {
            console.log("❌ No message received");
            return res.status(400).json({ error: 'Missing message in request body.' });
        }

        // --- ✅ Vérifie la clé Mistral ---
        const apiKey = process.env.MISTRAL_API_KEY;
        if (!apiKey) {
            console.error("❌ Missing MISTRAL_API_KEY");
            return res.status(500).json({ error: 'Server misconfiguration: API key missing.' });
        }

        // --- ✅ Appel API Mistral ---
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

        // --- ✅ Retour de la réponse ---
        const data = await response.json();
        console.log("✅ Mistral response:", data);
        return res.status(200).json(data);

    } catch (err) {
        console.error("🔥 Internal error:", err);
        return res.status(500).json({ error: "Internal Server Error", details: err.message });
    }
}
