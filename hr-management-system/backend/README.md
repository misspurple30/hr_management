
# API Backend - Gestion RH (WeHR)

Ce projet est l'API backend pour le système de gestion des ressources humaines WeHR. Il est construit avec Node.js, Express, TypeScript et Prisma.

## Stack Technique

  * **Node.js**
  * **Express**
  * **TypeScript**
  * **Prisma**
  * **PostgreSQL**

-----

## 🚀 Démarrage Rapide

Suivez ces étapes pour lancer le serveur localement.

### 1\. Prérequis

  * Node.js (v18+)
  * NPM
  * PostgreSQL (doit être installé et en cours d'exécution)

### 2\. Installation

```bash
# Clonez le projet
git clone [git@github.com:misspurple30/hr_management.git]
cd hr-management-system/backend

# Installez les dépendances
npm install
```

### 3\. Base de données

1.  **Créer le fichier `.env`**
    Copiez `.env.example` et renommez-le en `.env`. Assurez-vous que votre `DATABASE_URL` pointe vers votre base de données PostgreSQL.

    *Exemple de `DATABASE_URL` :*
    `DATABASE_URL="postgresql://hr_user:root@localhost:5432/hr_management?schema=public"`

2.  **Lancer les migrations**
    Cette commande crée les tables dans votre base de données.

    ```bash
    npm run prisma:migrate
    ```

3.  **Peupler la base de données (Seed)**
    Cette commande ajoute des données de test (utilisateurs, employés, etc.).

    ```bash
    npm run prisma:seed
    ```

### 4\. Lancer le serveur

Le serveur démarrera sur `http://localhost:5000`.

```bash
npm run dev
```

-----

## 🧪 Tester l'API

Pour tester les routes protégées, vous devez d'abord vous connecter pour obtenir un token.

### Comptes de Test

Les utilisateurs suivants sont créés par le script de seed.

  * **Email :** `admin@wehr.com`
  * **Mot de passe :** `Password123`

### Étapes pour tester (avec Postman)

1.  **Se connecter (Login)**

      * Faites un `POST` à `http://localhost:5000/api/auth/login`.
      * Envoyez ceci dans le `Body` (en JSON) :
        ```json
        {
          "email": "admin@wehr.com",
          "password": "Password123"
        }
        ```
      * Copiez le `accessToken` de la réponse.

2.  **Tester les routes protégées**

      * Ouvrez une nouvelle requête (ex: `GET http://localhost:5000/api/employees`).
      * Allez dans l'onglet `Authorization`.
      * Sélectionnez `Bearer Token` et collez votre `accessToken`.
      * Envoyez la requête.

-----

## 🗺️ Routes Principales

  * `GET /api/health` : Vérifier si l'API est en ligne.
  * `GET /api/dashboard/stats` : (Protégé) Obtenir toutes les statistiques pour la page d'accueil Figma.
  * `GET /api/employees` : (Protégé) Lister tous les employés.
  * `GET /api/departments` : (Protégé) Lister tous les départements.
  * *(CRUD complet disponible pour `/employees` et `/departments`)*