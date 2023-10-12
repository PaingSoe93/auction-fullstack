# Development Stage
FROM node:18.15.0-alpine AS development

WORKDIR /app

COPY package.json yarn.lock prisma/schema.prisma ./
RUN yarn install

COPY . .
RUN npx prisma generate
RUN yarn build

EXPOSE 3000

# Production Stage
FROM node:18.15.0-alpine AS production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /app

COPY package.json yarn.lock prisma/schema.prisma ./
RUN yarn install --production

COPY --from=development /app/dist ./dist
COPY --from=development /app/node_modules/@prisma ./node_modules/@prisma

EXPOSE 3000

CMD ["yarn", "start:prod"]
