FROM node:18

RUN apt-get update && apt-get install -y \
  curl \
  openssl \
  libssl-dev

RUN rm -rf /var/lib/apt/lists/*

WORKDIR /usr/src/app

RUN curl https://install.meteor.com/ | sh

COPY package*.json ./
RUN meteor npm install

RUN useradd -m meteoruser
COPY . .

RUN chown -R meteoruser:meteoruser /usr/src/app

USER meteoruser

RUN meteor update

# RUN meteor build --directory /usr/src/app/build

EXPOSE 3000

CMD ["npm", "start"]

