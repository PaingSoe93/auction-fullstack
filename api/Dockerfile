FROM node:18.15.0-alpine AS development
WORKDIR /app
COPY package.json ./
RUN yarn install
RUN yarn build
EXPOSE 3000

FROM node:18.15.0-alpine AS production
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --production
COPY --from=development /app/dist ./dist
EXPOSE 3000
CMD [ "yarn", "start:prod"]