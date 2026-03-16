FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json ./
# Note: since there is no package-lock.json generated yet, we just npm i
RUN npm install
ENV NEXT_TELEMETRY_DISABLED 1
COPY . .
RUN npm run build

FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
# If no public folder exists, that's fine, we ignore failure or just run Next
CMD ["npm", "start"]
