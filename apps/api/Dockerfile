FROM node:lts-slim AS base
WORKDIR /app

COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY apps/api/package.json ./apps/api/package.json

RUN corepack enable && pnpm install --frozen-lockfile

COPY apps/api ./apps/api

RUN pnpm --filter @solar-balls/api build

EXPOSE 3000

CMD ["pnpm", "--filter", "@solar-balls/api", "start"]
