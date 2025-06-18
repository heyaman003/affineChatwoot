FROM node:18

WORKDIR /usr/src/app/frontend

COPY package.json yarn.lock ./

# Use Yarn instead of NPM
RUN yarn install

COPY . .

EXPOSE 5173

CMD ["yarn", "dev"]
