# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json yarn.lock ./
COPY apps/backend/package.json ./apps/backend/

RUN yarn install --frozen-lockfile

COPY apps/backend ./apps/backend

WORKDIR /app/apps/backend

RUN yarn prisma:generate
RUN yarn build

# Production stage
FROM node:20-alpine AS production

WORKDIR /app

ENV NODE_ENV=production

RUN addgroup -g 1001 -S nodejs && adduser -S nestjs -u 1001

COPY package.json yarn.lock ./
COPY apps/backend/package.json ./apps/backend/

RUN yarn install --frozen-lockfile --production=true

COPY --from=builder /app/apps/backend/dist ./apps/backend/dist
COPY --from=builder /app/apps/backend/prisma ./apps/backend/prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma

WORKDIR /app/apps/backend

RUN mkdir -p logs && chown -R nestjs:nodejs logs

USER nestjs

EXPOSE 3000

CMD ["sh", "-c", "yarn prisma:deploy && node dist/main"]
