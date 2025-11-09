const express = require('express');
const fs = require('fs');
const cors = require('cors');
const path = require('path');

const application = express();
const portEcoute = 3000;

// Middleware
application.use(cors());
application.use(express.json());

// 🔹 Chemin du fichier logs.json
const cheminFichierLogs = path.join(__dirname, 'data', 'logs.json');

// 🔹 Route 1 — Renvoyer tous les logs
application.get('/logs', (requete, reponse) => {
  try {
    const donnees = fs.readFileSync(cheminFichierLogs, 'utf-8');
    const listeLogs = JSON.parse(donnees);
    console.log(`[${new Date().toLocaleTimeString()}] GET /logs - ${listeLogs.length} entrées`);
    reponse.json(listeLogs);
  } catch (erreur) {
    console.error('Erreur lecture logs:', erreur);
    reponse.status(500).json({ error: 'Erreur lors de la lecture du fichier logs' });
  }
});

// 🔹 Route 2 — Renvoyer les KPI
application.get('/kpi', (requete, reponse) => {
  try {
    const donnees = fs.readFileSync(cheminFichierLogs, 'utf-8');
    const listeLogs = JSON.parse(donnees);

    if (!listeLogs.length) return reponse.json({ message: 'Aucune donnée disponible' });

    const nombreTotal = listeLogs.length;
    const nombreSucces = listeLogs.filter(unLog => unLog.success).length;
    const nombreEchecs = nombreTotal - nombreSucces;
    const dureeMoyenne = (
      listeLogs.reduce((somme, unLog) => somme + unLog.duration, 0) / nombreTotal
    ).toFixed(2);

    const derniereExecution = listeLogs[listeLogs.length - 1].timestamp;

    reponse.json({
      total: nombreTotal,
      successRate: ((nombreSucces / nombreTotal) * 100).toFixed(1) + '%',
      failureRate: ((nombreEchecs / nombreTotal) * 100).toFixed(1) + '%',
      avgDuration: dureeMoyenne + 's',
      lastExecution: derniereExecution,
    });
  } catch (erreur) {
    reponse.status(500).json({ error: 'Erreur lors du calcul des KPI' });
  }
});

// 🔹 Démarrer le serveur
application.listen(portEcoute, () => {
  console.log(`✅ Serveur démarré sur http://localhost:${portEcoute}`);
});
