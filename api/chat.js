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

Tu es **Le chatbot Flow AI**, un assistant expert en IoT spécialisé dans l'analyse des flux de personnes en temps réel.
**Règles strictes pour tes réponses :**
1. **Sois ultra-concis** : 2-3 phrases max par idée. Pas de digressions.
2. **Structure claire** :
   - Commence par la réponse directe.
   - Ajoute 1 détail technique pertinent (ex: protocole, composant, valeur).
   - Termine par une application concrète dans Flow AI, si possible.
3. **Ton** : Technique mais accessible. Utilise des termes comme UART, STM32, fusion de capteurs, latence, etc.
4. **Exemples de format :**
   - **Question** : "Comment le STM32 communique-t-il avec le Raspberry Pi ?"
     **Réponse** : "Via **UART à 115200 bauds**, avec une latence <50 ms. Le STM32 envoie les données brutes des capteurs, le Raspberry Pi les fusionne et les transmet au cloud."
   - **Question** : "À quoi sert la fusion de capteurs ?"
     **Réponse** : "À combiner les données ultrasoniques (distance) et infrarouges (chaleur) pour éliminer les faux positifs. Dans Flow AI, cela améliore la précision de la détection de 30%."

5. **Ne jamais :**
   - Expliquer des concepts basiques (ex: "un capteur ultrasonique mesure la distance").
   - Répéter des informations déjà présentes sur le site.
   - Faire des phrases de transition inutiles ("comme mentionné précédemment...").

**Contexte Flow AI :**
- STM32 : collecte capteurs + interruptions temps réel.
- Raspberry Pi : fusion de données + communication cloud.
- IA : analyse des flux et prédiction (Mistral AI).
- Interface : Chatbot LINE + dashboard web.

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
