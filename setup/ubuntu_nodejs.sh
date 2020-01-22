#!/bin/bash

source primechain-api.conf

if [ -n "$1" ] ; then
	nodejs_version=$1
fi

echo ''
echo ''
echo -e '=================================='
echo -e 'INSTALLING NODE JS'
echo -e '=================================='
echo ''
echo ''
echo ''

curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.11/install.sh | bash
source $HOME/.bashrc
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"
nvm install v$nodejs_version

n=$(which npm) && n=${n%/bin/npm} && chmod -R 755 $n/bin/* && sudo cp -rf $n/{bin,lib,share} /usr/local && sudo rm -rf $n/{bin,lib,share}

n=$(which node) && n=${n%/bin/node} && chmod -R 755 $n/bin/* && sudo cp -rf $n/{bin,lib,share} /usr/local && sudo rm -rf $n/{bin,lib,share}

ln -f -s /usr/local/bin/npm /usr/local/sbin

# curl -sL https://deb.nodesource.com/setup_9.x | sudo -E bash -
# sudo apt-get install -y --allow-unauthenticated nodejs


echo '----------------------------------------'
echo -e 'INSTALLING PM2.....'
echo '----------------------------------------'

npm install -g pm2

echo ''
echo ''
echo '----------------------------------------'
echo ''
echo ''
echo ''
echo ''