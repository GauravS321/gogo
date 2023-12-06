mongopassword=$1
email=$2
primechain_address=$3

echo '----------------------------------------'
echo -e 'INSTALLING MONGODB.....'
echo '----------------------------------------'
# sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 4B7C549A058F8B6B
# echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu xenial/mongodb-org/4.2 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb.list
# sudo apt-get update
# sudo apt-get install -y mongodb-org
curl -fsSL https://www.mongodb.org/static/pgp/server-4.4.asc | sudo apt-key add -
apt-key list
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/4.4 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-4.4.list
sudo apt update -y
sudo apt install -y mongodb-org

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


sleep 2

echo '----------------------------------------'
echo -e 'CREATING MONGODB USER'
echo '----------------------------------------'
echo ''
echo ''

sudo mongo <<EOF
use admin
db.createUser({user : "adminuser", pwd : "$mongopassword", roles : [{ role : "root", db : "admin"}]})
db.auth("adminuser", "$mongopassword")
use primechain
db.createUser({user : "primechainuser", pwd : "$mongopassword", roles : [{ role : "dbOwner", db : "primechain"}]})
db.users.insert({"username" : "admin" , "email" : "$email", "method": "local", "local": { "password" : "$mongopassword" }, "primechain_address" : "$primechain_address", "role" : "admin"})
EOF

echo '----------------------------------------'
echo -e 'USER CREATION COMPLETED!!!'
echo '----------------------------------------'


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

echo ''
echo ''
echo '----------------------------------------'
echo ''
echo ''

echo '------------------------------------------'
echo -e 'CONFIGURING AUTHENTICATION MONGODB USER'
echo '------------------------------------------'
echo ''
echo ''

# sudo service mongod  stop
sudo systemctl stop mongod
sleep 1
sudo sh -c 'echo "security:\n  authorization : enabled" >> /etc/mongod.conf'
sleep 1
# sudo service mongod  restart
sudo systemctl restart mongod

echo ''
echo ''
echo '----------------------------------------'
echo ''
echo ''
echo ''


echo '------------------------------------------------------'
echo -e 'MONGODB USER CONFIGURED AUTHENTICATION SUCCESSFULLY'
echo '------------------------------------------------------'
echo ''
echo ''

echo ''
echo ''
echo '----------------------------------------'
echo ''
echo ''
echo ''
