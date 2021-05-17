FROM node
WORKDIR /var/www
COPY . /var/www
RUN npm install
EXPOSE 9797
ENTRYPOINT ["npm", "start"]