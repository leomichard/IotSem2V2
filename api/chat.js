export default async function handler(req, res) {
    try {
        // Parse safely
        const body = req.body || {};
        const { message } = typeof body === 'string' ? JSON.parse(body) : body;

        if (!message) {
            return res.status(400).json({ error: 'Missing message in request body.' });
        }

        const response = await fetch("https://api.mistral.ai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + process.env.MISTRAL_API_KEY
            },
            body: JSON.stringify({
                model: "mistral-medium",
                messages: [{ role: "user", content: message }]
            })
        });

        const data = await response.json();
        return res.status(200).json(data);
    } catch (err) {
        console.error("Error in Mistral API:", err);
        return res.status(500).json({ error: "Internal server error." });
    }
}
