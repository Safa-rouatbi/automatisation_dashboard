# Task Automation Dashboard

## Description
Task Automation Dashboard simule des tâches automatisées (backup, analyse de logs, upload de rapports) et fournit un dashboard pour suivre leur état, leur durée d’exécution et les logs associés.  
Le dashboard Angular lit des logs JSON générés par Robot Framework et calcule des KPI comme le taux de succès, le temps moyen d’exécution et les dernières exécutions.

---

## Objectifs
- Simuler l’exécution automatique de tâches avec Robot Framework.
- Centraliser les résultats et logs dans un dashboard Angular.
- Calculer et afficher des KPI pertinents pour la supervision.
- Démontrer la mise en place d’une intégration continue (CI) avec GitLab.

---

## Stack technique
- **Frontend :** Angular  
- **Backend :** Node.js / Express 
- **Automation :** Robot Framework  
- **CI :** Github Actions  
- **Données :** Fichiers JSON simulant les logs  

---

## Fonctionnalités
- Simulation de tâches automatisées : Backup, Analyse, Upload  
- Génération de logs JSON pour chaque exécution  
- Dashboard Angular avec :  
  - Total de tâches exécutées  
  - Taux de succès / échec  
  - Temps moyen d’exécution  
  - Liste des logs récents  
- Intégration continue (CI) pour build et tests automatiques  
- Exécution continue via fichier `.bat`  

---
## Installation et utilisation

### 1. Installation du frontend
cd frontend
npm install
ng serve

### 2. Installation du backend
**cd backend
**npm install
**npm start





