mongopassword=$1
email=$2
primechain_address=$3

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


echo '----------------------------------------'
echo -e 'CREATING MONGODB USER'
echo '----------------------------------------'
echo ''
echo ''

mongo --quiet primechain 
db.createUser({user: primechainuser, pwd: $mongopassword, roles:[{ role: "userAdmin", db: "primechain"}]})
EOF
sudo service mongod  stop
sudo sh -c 'echo "security:\n  authorization : enabled" >> /etc/mongod.conf'
sudo service mongod  restart

echo ''
echo ''
echo '----------------------------------------'
echo ''
echo ''
echo ''
echo '----------------------------------------'
echo -e 'AUTHENTICATING MONGODB USER'
echo '----------------------------------------'
echo ''
echo ''

mongo primechain --port 27017 -u primechainuser -p $mongopassword

echo ''
echo ''
echo '----------------------------------------'
echo ''
echo ''

echo ''
echo ''
echo '----------------------------------------'
echo -e 'INSERTING ADMIN USER INTO COLLECTION'
echo '----------------------------------------'
echo ''
echo ''

# create a document in users collection
db.users.insert({"username": "admin", "email": "$email", "password": "$mongopassword", "primechain_address": "$primechain_address", "role": "admin"});

echo ''
echo ''
echo '----------------------------------------'
echo ''
echo ''
echo ''
