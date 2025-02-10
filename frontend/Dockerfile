FROM node:22-slim AS base

ARG PORT=3000

ENV NEXT_TELEMETRY_DISABLED=1

WORKDIR /app

# Dependencies
FROM base AS dependencies

COPY package.json package-lock.json ./
RUN npm ci

# Build
FROM base

COPY --from=dependencies /app/node_modules ./node_modules
COPY . .

ENV NODE_ENV=production
ENV PORT=$PORT
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

ENV HOSTNAME="0.0.0.0"
CMD ["npm", "run", "start"]