# 🏢 WeHR - Système de Gestion RH

Application web Fullstack de gestion des ressources humaines.

**Stack** : React + TypeScript + Vite | Node.js + Express + Prisma | PostgreSQL | Docker

---

## 🚀 Démarrage Rapide

### Prérequis
- Docker & Docker Compose

### Installation

```bash
# 1. Cloner le projet
git clone git@github.com:misspurple30/hr_management.git
cd hr-management-system

# 2. Créer le fichier .env
cat > .env << EOF
POSTGRES_USER=hr_user
POSTGRES_PASSWORD=root
POSTGRES_DB=hr_management
DATABASE_URL="postgresql://hr_user:root@db:5432/hr_management?schema=public"
EOF

# 3. Lancer l'application
docker-compose up -d --build
```

La base de données est initialisée automatiquement avec des données de test.

---

## 🌐 Accès

- **Frontend** : http://localhost:5173
- **API Backend** : http://localhost:5000
- **PostgreSQL** : localhost:5433 (user: `hr_user`, password: `root`)

---

## 🔑 Comptes de Test

| Rôle | Email | Mot de passe |
|------|-------|--------------|
| Admin | `admin@wehr.com` | `Password123` |
| HR Manager | `admira.john@wehr.com` | `Password123` |
| Employé | `sarah.williams@wehr.com` | `Password123` |

---

## 💡 Choix Techniques

### Backend
- **Node.js + Express + TypeScript** : Performance, typage strict, écosystème mature
- **Architecture en couches** : Routes → Controllers → Services → Repositories (testabilité, maintenabilité)
- **Sécurité** : JWT (access/refresh tokens), middlewares d'authentification/autorisation, express-validator, helmet, rate-limiting
- **Prisma ORM** : Type-safety, prévention SQL injection, migrations simplifiées

### Frontend
- **React + Vite** : Composants réutilisables, HMR ultra-rapide
- **Tailwind CSS** : Développement rapide, design system cohérent
- **React Context** : Gestion d'état simple pour l'authentification

### DevOps
- **Docker Compose** : Déploiement reproductible en une commande

---

## 📦 Commandes Utiles

```bash
# Démarrer / Arrêter
docker-compose up -d
docker-compose down

# Logs
docker-compose logs -f [service]

# Base de données
docker-compose exec backend npm run prisma:migrate
docker-compose exec backend npm run prisma:seed
docker-compose exec db psql -U hr_user -d hr_management
```

---

Développé avec ❤️ pour WeHR
