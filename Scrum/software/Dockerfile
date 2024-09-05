FROM node:20

RUN rm -rf /var/lib/apt/lists/*

RUN useradd -m meteoruser
WORKDIR /usr/src/app
RUN chown -R meteoruser:meteoruser /usr/src/app

RUN curl https://install.meteor.com/ | sh

COPY package.json ./

RUN rm -f package-lock.json

RUN npm install -g npm@latest --legacy-peer-deps

RUN mkdir -p /usr/src/app/.meteor/local && chown -R meteoruser:meteoruser /usr/src/app/.meteor

USER meteoruser
RUN meteor update
RUN meteor npm install --legacy-peer-deps

COPY . .
EXPOSE 3000

CMD ["npm","start"]
