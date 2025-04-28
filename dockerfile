FROM node:23-alpine
ENV NODE_ENV=production
RUN apk add --no-cache openssl postgresql-client
COPY . /app
WORKDIR /app
RUN npm ci --omit=dev
RUN npm run build
CMD ["sh", "-c", "npx prisma generate && npm run start"]