FROM node:16.16 as builder

ARG LAGOON_PROJECT
ARG LAGOON_GIT_BRANCH
ARG LAGOON_ENVIRONMENT
ARG REACT_APP_API_BASE_URL
ARG REACT_APP_FATHOM_SITE_CODE
ENV REACT_APP_LAGOON_PROJECT=$LAGOON_PROJECT
ENV REACT_APP_LAGOON_BRANCH=$LAGOON_GIT_BRANCH
ENV REACT_APP_LAGOON_ENVIRONMENT=$LAGOON_ENVIRONMENT

WORKDIR /app
COPY frontend ./
COPY yarn.lock ./
RUN yarn
RUN yarn build

FROM amazeeio/nginx
COPY --from=builder /app/build /app
# COPY app.nginx.conf /etc/nginx/conf.d/app.conf

RUN echo "~^app.contribkanban.com           https://contribkanban.com\$request_uri;" >> /etc/nginx/redirects-map.conf
RUN echo "~^www.contribkanban.com           https://contribkanban.com\$request_uri;" >> /etc/nginx/redirects-map.conf
