🚀 Transport App (React + TypeScript + Vite)

Application frontend développée avec React, TypeScript et Vite.
Elle consomme une API backend via Axios en utilisant des variables d’environnement configurables.

🛠️ Technologies utilisées

React

TypeScript

Vite

Axios

tailwindcss

⚡ Démarrage rapide
1️⃣ Cloner le repository
git clone git@github.com:username/nom-du-projet.git
cd nom-du-projet
2️⃣ Installer les dépendances
npm install
3️⃣ Configurer les variables d’environnement

Un fichier d’exemple est fourni :

env-example.txt

Copier ce fichier et le renommer en :

.env

Puis adapter la valeur selon votre configuration backend.

Exemple de contenu :

VITE_API_URL=http://localhost:3000
🔎 Explication

VITE_API_URL correspond à l’URL de base de l’API backend.

Toutes les variables d’environnement utilisées par Vite doivent commencer par VITE_.

Ces variables sont accessibles dans le code via import.meta.env.

🌐 Configuration Axios (src/services/api.ts)
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

export default api;
📌 Explication

axios.create() permet de créer une instance Axios personnalisée.

baseURL définit l’URL principale utilisée pour toutes les requêtes HTTP.

import.meta.env.VITE_API_URL récupère l’URL définie dans le fichier .env.

Ainsi, toutes les requêtes peuvent être écrites simplement :

api.get("/transport")

Ce qui appellera en réalité :

http://localhost:3000/transport

(si VITE_API_URL=http://localhost:3000)

▶️ Lancer l’application
npm run dev

Puis ouvrir :

http://localhost:5173

📦 Build pour production
npm run build

Pour prévisualiser le build :

npm run preview