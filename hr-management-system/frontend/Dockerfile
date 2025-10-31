FROM node:22.12-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
RUN npm install --save-dev web-vitals
COPY . .
EXPOSE 5173
CMD ["npm", "run", "dev", "--", "--host"]