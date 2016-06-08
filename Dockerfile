FROM node:6.1

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

RUN npm install -g mean-cli bower gulp

RUN	groupadd -r node \
&&	useradd -r -m -g node node

COPY . /usr/src/app/
RUN rm -rf /usr/src/app/node_modules
RUN chown -R node:node /usr/src/app

USER node
RUN touch /home/node/.mean
RUN npm install && gulp webpack:build-dev
ENV PORT 3000  
ENV DB_PORT_27007_TCP_ADDR db
CMD [ "npm", "start" ]
EXPOSE 3000
