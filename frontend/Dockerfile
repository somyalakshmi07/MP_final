# ---- Stage 1: Build ----
FROM acrecomsomyaea123.azurecr.io/base/node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# ---- Stage 2: Run ----
FROM acrecomsomyaea123.azurecr.io/base/node:20-alpine

WORKDIR /app
COPY --from=builder /app /app

EXPOSE 80
CMD ["npm", "start"]