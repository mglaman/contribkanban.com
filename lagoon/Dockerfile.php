ARG CLI_IMAGE
FROM ${CLI_IMAGE} as cli

FROM amazeeio/php:8.2-fpm

COPY --from=cli /app /app
