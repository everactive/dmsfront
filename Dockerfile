FROM nginx

COPY nginx.conf /etc/nginx
COPY build/static/css /usr/share/nginx/html/static/css
COPY build/static/js /usr/share/nginx/html/static/js
COPY build/index.html /usr/share/nginx/html/index.html
EXPOSE 80

