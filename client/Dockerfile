FROM node:22-buster-slim as build

WORKDIR /usr/src/app

COPY ./package*.json /usr/src/app/
RUN npm ci -f  && npm cache clean --force
COPY ./ /usr/src/app/
RUN npm run build -- --configuration production

FROM nginx:stable-alpine

COPY --from=build /usr/src/app/dist /usr/share/nginx/html
COPY ./nginx.conf /etc/nginx/nginx.conf
EXPOSE 80/TCP

CMD nginx -g "daemon off;"
