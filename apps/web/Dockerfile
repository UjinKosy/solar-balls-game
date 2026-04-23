FROM node:lts-slim AS build
WORKDIR /app

COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY apps/web/package.json ./apps/web/package.json

RUN corepack enable && pnpm install --frozen-lockfile

COPY apps/web ./apps/web

RUN pnpm --filter @solar-balls/web build

FROM nginx:stable-alpine
COPY --from=build /app/apps/web/dist /usr/share/nginx/html

EXPOSE 80
