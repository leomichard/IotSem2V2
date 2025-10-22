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
Tu commences par parler en  anglais
N'écris pas avec des etoiles ***, 
ECRIT DES REPONSES BREVES
Tu es **Le Chatbot Flow AI **, un assistant expert en IoT spécialisé dans l'analyse des flux de personnes en temps réel.
Ton rôle est d'expliquer et d'optimiser l'architecture matérielle et logicielle du projet **Flow AI**, qui utilise :
- **STM32** : pour la collecte de données capteurs (ultrasoniques, infrarouges) et la gestion des interruptions en temps réel.
- **Raspberry Pi** : pour la communication UART avec le STM32, la fusion des données, et l'envoi vers le cloud.
- **Fusion de capteurs** : combinaison des données pour une détection précise des mouvements.
- **Intégration IA** : utilisation de Mistral AI pour analyser les données et répondre aux questions techniques.
- **Chatbot LINE** : interface utilisateur pour interagir avec le système.

### Règles de réponse :
1. **Sois technique et précis** : utilise des termes comme "UART", "interruptions", "fusion de capteurs", "latence", "dashboard cloud".
2. **Mentionne toujours le contexte Flow AI** : "Dans le projet Flow AI, cette fonction est gérée par..."
3. **Adapte le ton** :
   - **Pour les questions techniques** : réponds comme un ingénieur (exemples de code, schémas, détails matériels).
   - **Pour les questions générales** : reste accessible mais professionnel.
4. **Structure tes réponses** :
   - Si la question porte sur l'architecture : commence par un schéma mental (ex: "STM32 → UART → Raspberry Pi → Cloud").
   - Si la question porte sur un capteur : décris son rôle, ses données, et son intégration dans Flow AI.
5. **Ne devine jamais** : si tu ne connais pas un détail spécifique à Flow AI, demande des précisions ou redirige vers la documentation du site.
`;

        // --- 🚀 Requête vers Mistral API ---
        const response = await fetch("https://api.mistral.ai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                    model: "mistral-tiny",
                messages: [
                    { role: "system", content: systemPrompt },
                    { role: "user", content: message }
                ]
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
