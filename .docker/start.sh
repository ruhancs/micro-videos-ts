#!bin/bash

if [ ! -f "./src/@core/.env.test"]; then
    cp ./src/@core/.env.test.example ./src/@core/.env.test
fi

if [ ! -f "./src/nest/envs/.env"]; then
    cp ./src/@core/.env.example ./src/@core/.env
fi

if [ ! -f "./src/nest/envs/.env.test"]; then
    cp ./src/@core/.env.test.example ./src/@core/.env.test
fi

if [ ! -f "./src/nest/envs/.env.e2e"]; then
    cp ./src/@core/.env.e2e.example ./src/@core/.env.e2e
fi

npm install

npm run build -w @rc/micro-videos

tail -f /dev/null #adicionar permissao no terminal: chmod +x .docker/start.sh

#npm run start:dev