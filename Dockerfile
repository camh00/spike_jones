FROM node:latest

LABEL Dev = "Cam H (but really Derek L)"

WORKDIR /app

COPY . .

WORKDIR /app/backend

RUN npm ci

RUN rm -rf /app/Dockerfile

CMD ["npm", "run", "start"]