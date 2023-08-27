#!bin/bash

if [ ! -f "./src/@core/.env.testing"]; then
    cp ./src/@core/.env.test.example ./src/@core/.env.test
fi

npm install

tail -f /dev/null #adicionar permissao no terminal: chmod +x .docker/start.sh

#npm run start:dev