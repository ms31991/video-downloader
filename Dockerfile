FROM node:22-bookworm-slim

RUN apt-get update \
  && apt-get install -y --no-install-recommends python3 ffmpeg ca-certificates \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY frontend/package.json frontend/package-lock.json ./frontend/
RUN cd frontend && npm ci

COPY frontend ./frontend
RUN cd frontend && npm run build

COPY backend/package.json ./backend/
RUN cd backend && npm install --omit=dev

COPY backend ./backend

ENV NODE_ENV=production
ENV PORT=4000
EXPOSE 4000

CMD ["node", "backend/src/index.js"]
