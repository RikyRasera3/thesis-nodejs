FROM node:24-alpine3.22 AS build

WORKDIR /app

COPY package.json package-lock.json tsconfig.json .env.prod ./
COPY src ./src

RUN npm run ci
RUN npm run build

FROM node:24-alpine3.22 AS run

WORKDIR /app

COPY --from=build /app/package.json /app/package-lock.json /app/tsconfig.json /app/.env.prod ./
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules

EXPOSE 3000

CMD ["npm", "run", "start"]