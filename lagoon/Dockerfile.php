ARG CLI_IMAGE
FROM ${CLI_IMAGE} as cli

FROM amazeeio/php:8.1-fpm

COPY --from=cli /app /app
