FROM node:18

RUN apt-get update && apt-get install -y \
  curl \
  openssl \
  libssl-dev

RUN rm -rf /var/lib/apt/lists/*

RUN useradd -m meteoruser
WORKDIR /usr/src/app
RUN chown -R meteoruser:meteoruser /usr/src/app

RUN curl https://install.meteor.com/ | sh

COPY package.json ./

RUN rm -f package-lock.json

RUN npm install -g npm@10.8.2

RUN mkdir -p /usr/src/app/.meteor/local && chown -R meteoruser:meteoruser /usr/src/app/.meteor

USER meteoruser
RUN meteor npm install --legacy-peer-deps

COPY . .

RUN curl -o wait-for-it.sh https://raw.githubusercontent.com/vishnubob/wait-for-it/master/wait-for-it.sh

RUN chmod +x wait-for-it.sh

EXPOSE 3000

CMD ["./wait-for-it.sh", "db:5432", "--", "npm", "start"]
