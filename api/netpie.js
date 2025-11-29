import mqtt from "mqtt";

let cachedData = {};

export default function handler(req, res) {
    // Retourne les dernières données reçues
    res.status(200).json(cachedData);
}
