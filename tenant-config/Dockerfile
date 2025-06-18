FROM node:18-alpine

# Set working directory inside container
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install --production
COPY . .
EXPOSE 4000
# Run the app
CMD ["node", "index.js"]
