
# Stage 1: Compile and Build angular codebase
# Use official node image as the base image
FROM node:18.8.0-buster-slim as build

# Set the working directory
WORKDIR /usr/src/app

COPY ./package*.json /usr/src/app/


# Install all the dependencies
RUN npm ci -f  && npm cache clean --force

# Add the source code to app
COPY ./ /usr/src/app/

# Generate the build of the application
#RUN npm run build -- --prod --output-hashing none --deploy-url / --base-href / --output-path ./dist
RUN npm run build -- --configuration=production  --deploy-url / --base-href / --output-path ./dist

# Stage 2: Serve app with nginx servernp

# Use official nginx image as the base image
FROM nginx:stable-alpine

# Copy the build output to replace the default nginx contents.
COPY --from=build /usr/src/app/dist /usr/share/nginx/html

COPY ./nginx.conf /etc/nginx/nginx.conf
# Expose port 80
EXPOSE 80/TCP

CMD nginx -g "daemon off;"
