FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json jest.config.ts tsconfig.build.json tsconfig.json .prettierrc ./

RUN npm install

COPY src ./src

RUN npm run build

FROM node:20-alpine

WORKDIR /app

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist

RUN npm install --only=production --ignore-scripts

EXPOSE 3000

CMD ["node", "dist/main.js"]