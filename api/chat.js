export default async function handler(req, res) {
    // --- ✅ Autoriser CORS ---
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
        // --- 🔍 DEBUG ---
        console.log("🟣 New request:", req.method);

        // --- 🔸 Lecture du body ---
        const rawBody = req.body || '';
        const parsedBody = typeof rawBody === 'string' ? JSON.parse(rawBody || '{}') : rawBody;
        const { message, system_prompt } = parsedBody;

        if (!message) {
            console.log("❌ No message provided");
            return res.status(400).json({ error: 'Missing message in request body.' });
        }

        // --- 🔐 Clé Mistral ---
        const apiKey = process.env.MISTRAL_API_KEY;
        if (!apiKey) {
            console.error("❌ Missing MISTRAL_API_KEY in environment variables");
            return res.status(500).json({ error: 'Server misconfiguration: API key missing.' });
        }

        // --- 🧠 Prompt système (contexte Flow AI) ---
        const systemPrompt = system_prompt || `
You are the FlowAI Chatbot, an IoT expert specializing in real-time people flow analysis.
Follow these strict rules for every response:
1. Start every answer with: "FlowAI Chatbot: "
2. Be extremely concise: 1-2 short sentences max. No paragraphs.
3. Never use asterisks (*) or special formatting.
4. Use technical terms: STM32, UART, sensor fusion, Raspberry Pi, latency.
5. Focus on FlowAI's specific implementation: STM32 for sensor data, Raspberry Pi for UART communication and cloud sync.
6. If the question is unclear, ask for clarification in 5 words max.

Example responses:
- Q: "How does STM32 communicate with Raspberry Pi?"
  A: "FlowAI Chatbot: Via UART at 115200 baud, latency under 50ms."

- Q: "How do you detect people?"
  A: "FlowAI Chatbot: Ultrasonic + IR sensor fusion, 92% accuracy in controlled environments."

- Q: "Can I use this in my store?"
  A: "FlowAI Chatbot: Yes. Deploy sensors at entrances, connect Raspberry Pi to WiFi."

`;

        // --- 🚀 Requête vers Mistral API ---
        const response = await fetch("https://api.mistral.ai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                    model: "mistral-small",
                messages: [
                    { role: "system", content: systemPrompt },
                    { role: "user", content: message }
                ],
                "max_tokens": 50,       // Limite stricte à ~50 mots
                "temperature": 0.1,     // Réponses très déterministes
                "stop": ["\n", "."]     // Évite les phrases multiples
            })
        });

        const data = await response.json();

        // --- ✅ Log et retour ---
        console.log("✅ Mistral response:", data);
        return res.status(200).json(data);

    } catch (err) {
        console.error("🔥 Internal error:", err);
        return res.status(500).json({ error: "Internal Server Error", details: err.message });
    }
}
