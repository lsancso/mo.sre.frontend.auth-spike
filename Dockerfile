FROM nginx:1.13.9-alpine

LABEL org.label-schema.build-date=${BUILD_DATE} \
        org.label-schema.name=permission-panel-nginx \
        org.label-schema.vcs-url="https://www.nginx.com/" \
        org.label-schema.vcs-ref=${VCS_REF} \
        org.label-schema.license=MIT \
        org.label-schema.docker.cmd="docker run --rm --name=permission-panel-nginx -p 80:80 eu.gcr.io/prod-mercadona/permission-panel-nginx:0.1.0"

COPY docker/nginx/assets/site.conf /etc/nginx/conf.d/default.conf
COPY docker/nginx/assets/gzip.conf /etc/nginx/conf.d/gzip.conf

RUN mkdir /etc/nginx/ssl

COPY build/ /app
