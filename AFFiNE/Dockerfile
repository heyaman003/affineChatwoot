FROM node:20-alpine
ENV NODE_OPTIONS=--max_old_space_size=8192
WORKDIR /app
RUN corepack enable
COPY . .
RUN yarn install --frozen-lockfile
EXPOSE 8080
CMD ["yarn", "affine", "dev", "-p", "web"]
