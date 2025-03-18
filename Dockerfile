FROM node:latest

LABEL Dev = "Cam H"

WORKDIR /app

COPY . .

RUN cd backend

RUN npm ci

RUN rm -rf /app/Dockerfile

CMD ["npm", "run", "server"]