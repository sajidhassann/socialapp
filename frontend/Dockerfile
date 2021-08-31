FROM node:16-alpine as build
WORKDIR /src/app
COPY . .
RUN npm cache clear --force
RUN npm install
# EXPOSE 3000
# CMD ["npm", "start"]
RUN npm run build


FROM nginx
EXPOSE 3000
COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=build /src/app/build /usr/share/nginx/html