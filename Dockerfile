FROM node:lts-alpine3.13
WORKDIR /var/www
COPY . /var/www
RUN npm install
EXPOSE 9797
ENTRYPOINT ["npm", "start"]