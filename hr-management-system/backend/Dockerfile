FROM node:20.18-alpine3.21

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN DATABASE_URL="postgresql://user:pass@localhost:5432/db" npx prisma generate

RUN npm run build

EXPOSE 5000

CMD ["npm", "start"]