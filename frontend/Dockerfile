FROM node:24.1-bookworm-slim

WORKDIR /app

ENV NODE_ENV=production

# ref: https://pnpm.io/docker
ENV PNPM_HOME=/pnpm

ENV PATH="$PNPM_HOME:$PATH"

RUN corepack enable

COPY ./ /app/

RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

ENV NODE_OPTIONS="--max-old-space-size=4096"

RUN pnpm run build

RUN pnpm prune --prod

CMD ["node", "build/index.js"]