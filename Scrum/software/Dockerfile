FROM node:14

WORKDIR /usr/src/app

RUN curl https://install.meteor.com/ | sh

COPY . .

RUN meteor npm install

RUN meteor build --directory /usr/src/app/build --allow-superuser

EXPOSE 3000

CMD ["node", "build/main.js"]
