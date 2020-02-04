#!/bin/bash
source primechain-api.conf

MongoDBUser=$1
MongoDBpass=$2
emailaddress=$3
rpcuser=$4
rpcpassword=$5

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

sudo systemctl start mongod

echo ''
echo ''
echo '----------------------------------------'
echo ''
echo ''
echo ''

addr=`curl --user $rpcuser:$rpcpassword --data-binary '{"jsonrpc": "1.0", "id":"curltest", "method": "getaddresses", "params": [] }' -H 'content-type: text/json;' http://127.0.0.1:$rpcport | jq -r '.result[0]'`

echo '----------------------------------------'
echo -e 'Creating new user in MONGODB.....'
echo '----------------------------------------'

echo -e "use admin"
echo -e "db.addUser($MongoDBUser, $MongoDBpass')"
echo -e "db.auth($MongoDBUser', $MongoDBpass)"

sudo systemctl restart mongod --auth $MongoDBUser  -u $MongoDBUser -p $MongoDBpass 

use primechain;
echo -e "db.users.insert( { email: $emailaddress, password: $MongoDBpass, primechain_address: $addr})"

echo ''
echo ''
echo '----------------------------------------'
echo ''
echo ''
echo ''


