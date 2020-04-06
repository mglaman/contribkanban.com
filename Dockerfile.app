FROM node:13 as builder
WORKDIR /app
COPY . ./
RUN yarn
RUN yarn build

FROM amazeeio/nginx
COPY --from=builder /app/build /app
