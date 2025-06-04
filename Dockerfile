# syntax=docker/dockerfile:1

# node.js
ARG NODE_VERSION=20
FROM node:${NODE_VERSION}-alpine
ENV NODE_ENV=production

RUN apk add --no-cache \
      certbot \
      wget \
      curl \
      unzip \
      bash

# Bun
ENV BUN_INSTALL=/usr/local
ARG BUN_VERSION=1.2.15
ARG BUN_RELEASE=bun-linux-x64-baseline
RUN set -euxo pipefail; \
    wget -L "https://github.com/oven-sh/bun/releases/download/bun-v${BUN_VERSION}/${BUN_RELEASE}.zip" \
    -O /tmp/bun.zip && \
    unzip /tmp/bun.zip -d /tmp && \
    mv /tmp/${BUN_RELEASE}/bun ${BUN_INSTALL}/bin/bun && \
    chmod +x ${BUN_INSTALL}/bin/bun && \
    bun --version && \
    rm /tmp/bun.zip

# Install deps.
WORKDIR /app

COPY bun.lock* package.json ./

RUN --mount=type=cache,target=/root/.bun \
    bun install --omit=dev

COPY . .

# Build
RUN bun run build

# Non‑root user for security
RUN addgroup -S app && adduser -S app -G app
USER app

EXPOSE 3010

CMD ["node", ".output/server/index.mjs"]
