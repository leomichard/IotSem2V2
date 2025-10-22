export default async function handler(req, res) {
    // --- DEBUG LOGS ---
    console.log("🟣 Incoming request:");
    console.log("➡️ Method:", req.method);
    console.log("➡️ Origin:", req.headers.origin);
    console.log("➡️ Headers:", req.headers);

    // --- CORS HANDLING ---
    if (req.method === 'OPTIONS') {
        console.log("🟢 OPTIONS preflight received");
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
        return res.status(200).end();
    }

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    try {
        // --- PARSE BODY ---
        const raw = req.body || '';
        let body;
        try {
            body = typeof raw === 'string' ? JSON.parse(raw || '{}') : raw;
        } catch (err) {
            console.error("⚠️ Failed to parse body:", raw);
            return res.status(400).json({ error: "Invalid JSON body." });
        }

        console.log("🧩 Parsed body:", body);

        const message = body.message;
        if (!message) {
            console.log("❌ No message provided");
            return res.status(400).json({ error: 'Missing message in request body.' });
        }

        // --- CHECK API KEY ---
        const apiKey = process.env.MISTRAL_API_KEY;
        if (!apiKey) {
            console.error("❌ Missing MISTRAL_API_KEY in environment variables");
            return res.status(500).json({ error: 'Server misconfiguration: API key missing.' });
        }

        // --- CALL MISTRAL API ---
        console.log("📡 Sending request to Mistral...");
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

        console.log("📬 Mistral response status:", response.status);
        const data = await response.json();
        console.log("✅ Mistral API response:", data);

        return res.status(200).json(data);

    } catch (err) {
        console.error("🔥 Internal error:", err);
        return res.status(500).json({ error: "Internal Server Error", details: err.message });
    }
}
