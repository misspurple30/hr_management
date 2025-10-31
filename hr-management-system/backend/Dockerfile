FROM node:20.18-alpine3.21

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 5000 

CMD ["npm", "run", "dev"]