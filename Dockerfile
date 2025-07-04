# Build
FROM oven/bun:canary-alpine AS build
WORKDIR /app
COPY bun.lock* package.json ./
RUN --mount=type=cache,target=/root/.bun \
    bun install --frozen-lockfile
COPY . .
RUN bun run build

# Deploy
FROM gcr.io/distroless/nodejs20-debian12
ENV NODE_ENV=production
COPY --from=build /app/.output .
CMD ["node", ".output/server/index.mjs"]
