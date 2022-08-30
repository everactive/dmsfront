ARG BUILDER_IMAGE=dmsfront-builder-dev:latest
ARG GIT_SUMMARY=UNSET
FROM $BUILDER_IMAGE AS builder
ARG GIT_SUMMARY
COPY . /src
RUN sed -i s/UNSET/$GIT_SUMMARY/g /src/src/version.js
RUN npm install
RUN npm run build

FROM nginx

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY static /usr/share/nginx/html/static
COPY --from=builder /src/build/static/css /usr/share/nginx/html/static/css
COPY --from=builder /src/build/static/js /usr/share/nginx/html/static/js
COPY --from=builder /src/build/index.html /usr/share/nginx/html/index.html
EXPOSE 80

