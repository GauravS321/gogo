#!/bin/bash
source primechain-api.conf

MongoDBUser=$1
MongoDBpass=$2


echo '----------------------------------------'
echo -e 'INSTALLING MONGODB.....'
echo '----------------------------------------'
sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 4B7C549A058F8B6B
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu xenial/mongodb-org/4.2 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb.list
sudo apt-get update
sudo apt-get install -y mongodb-org


echo '----------------------------------------'
echo -e 'STARTING MONGODB.....'
echo '----------------------------------------'


echo '----------------------------------------'
echo -e 'Creating new user in MONGODB.....'
echo '----------------------------------------'

echo -e "use primechain"

echo -e "db.createUser({user: primechainuser, pwd: $MongoDBpass, roles: [ 'readWrite', 'dbAdmin']})"
echo -e "db.auth(primechainuser, $MongoDBpass)"

sudo systemctl restart mongod


echo ''
echo ''
echo '----------------------------------------'
echo ''
echo ''
echo ''


