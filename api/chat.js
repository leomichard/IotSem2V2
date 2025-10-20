export default async function handler(req, res) {
    const { message } = req.body;

    const response = await fetch("https://api.mistral.ai/v1/chat/completions", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + process.env.MISTRALAPIKEY  // 👈 clé cachée ici
        },
        body: JSON.stringify({
            model: "mistral-medium", // ou mistral-tiny si tu veux que ça soit plus rapide
            messages: [{ role: "user", content: message }]
        })
    });

    const data = await response.json();
    res.status(200).json(data);
}
