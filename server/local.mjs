import { createServer } from "node:http";
import handler from "../api/contact.mjs";

// Adaptateur de test local pour le handler de l'API.
const server = createServer(async (req, res) => {
  res.status = (code) => {
    res.statusCode = code;
    return res;
  };
  res.json = (data) => {
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.end(JSON.stringify(data));
  };

  if (new URL(req.url, "http://localhost").pathname !== "/api/contact") {
    return res.status(404).json({ error: "Route inconnue" });
  }

  // Permet de tester submit() sans implémenter la préparation de production.
  if (req.method === "GET") {
    return res.json({ available: true, token: "local-test" });
  }
  if (req.method !== "POST") {
    res.setHeader("Allow", "GET, POST");
    return res.status(405).json({ error: "Méthode non autorisée" });
  }

  try {
    const chunks = [];
    let size = 0;
    for await (const chunk of req) {
      size += chunk.length;
      if (size > 16 * 1024) {
        return res.status(413).json({ error: "Corps trop volumineux" });
      }
      chunks.push(chunk);
    }
    try {
      req.body = JSON.parse(Buffer.concat(chunks).toString("utf8"));
    } catch {
      return res.status(400).json({ error: "JSON invalide" });
    }

    await handler(req, res);
    // Termine la requête si ton handler ne renvoie pas encore de réponse.
    if (!res.writableEnded) {
      res.json({ stored: false, message: "Test local : handler exécuté." });
    }
  } catch (error) {
    console.error(error);
    if (!res.headersSent) {
      res.status(500).json({ error: "Erreur du handler local" });
    } else if (!res.writableEnded) {
      res.end();
    }
  }
});

server.listen(3000, "127.0.0.1", () => {
  console.log("API locale : http://127.0.0.1:3000/api/contact");
  console.log("Les données reçues apparaissent dans ce terminal.");
});
