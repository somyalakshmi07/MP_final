# Stage 1 — Build stage
FROM acrecomsomyaea123.azurecr.io/base/node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Stage 2 — Production runtime
FROM acrecomsomyaea123.azurecr.io/base/node:20-alpine AS runtime

WORKDIR /app

# Only copy built output + dependencies
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 3000
CMD ["node", "dist/index.js"]
