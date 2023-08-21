FROM node:20-slim

RUN npm i -g @nestjs/cli npm

USER node

WORKDIR /home/node/app

CMD ["tail", "-f", "/dev/null" ]