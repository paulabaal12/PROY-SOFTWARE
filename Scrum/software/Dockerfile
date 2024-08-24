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

USER meteoruser
COPY package*.json ./
RUN meteor npm install

COPY . .


RUN meteor update

RUN curl -o wait-for-it.sh https://raw.githubusercontent.com/vishnubob/wait-for-it/master/wait-for-it.sh

RUN chmod +x wait-for-it.sh

EXPOSE 3000

CMD ["./wait-for-it.sh", "db:5432", "--", "npm", "start"]
