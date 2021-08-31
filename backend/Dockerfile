FROM node:16-alpine
WORKDIR /srv/app
COPY . .
RUN npm install 
EXPOSE 5000

#CMD [ "npx", "sequelize-auto", "-o", "./models", "-d", "app", "-h", "db", "-u", "root", "-p", "3306", "-x", "pass", "-e", "mysql" ]
#CMD [ "npm", "start" ]
CMD [ "./run.sh" ]
