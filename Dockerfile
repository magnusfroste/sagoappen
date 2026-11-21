FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci --no-audit --no-fund
COPY . .
RUN npm run build

# A small Node server: the built app, and /api/story-narration, which reads a
# story aloud with ElevenLabs (ELEVENLABS_API_KEY). No packages of its own.
FROM node:22-alpine
WORKDIR /app
COPY --from=build /app/dist ./dist
COPY deploy/server.mjs ./server.mjs
ENV NODE_ENV=production PORT=8080 STATIC_DIR=/app/dist
USER node
EXPOSE 8080
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s CMD wget -qO- http://127.0.0.1:8080/healthz >/dev/null || exit 1
CMD ["node", "server.mjs"]
