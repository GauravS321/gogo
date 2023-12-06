#!/bin/bash

source primechain-api.conf

rpchost=$1
rpcuser=$2
rpcpassword=$3
dbhost=$4
dbuser=$5
dbpass=$6

homedir=`su -l $linux_admin_user -c 'cd ~ && pwd'`

echo '-----------------------------'
echo -e 'CONFIGURING FIREWALL.....'
echo '-----------------------------'

sudo ufw allow $applicationport

echo ''
echo ''
echo -e '----------------------------------'
echo -e 'FIREWALL SUCCESSFULLY CONFIGURED!'
echo -e '----------------------------------'
echo ''
echo ''
echo ''
echo ''

echo '--------------------------------'
echo -e 'SETTING UP APPLICATIONS.....'
echo '--------------------------------'

appdir=$homedir/primechain/src/primechain-api
# su -l $linux_admin_user -c 'cd ~ && git clone https://'$git_user':'$git_pass'@github.com/Primechain/primechain.git'

# Configuring Primechain-API DATABASE CREDS
# ----------- -----------------------------
sudo sed -ie 's/host:.*,/host: "'$rpchost'",/g' $appdir/config/multichain.js
sudo sed -ie 's/port:.*,/port: "'$rpcport'",/g' $appdir/config/multichain.js
sudo sed -ie 's/user:.*,/user: "'$rpcuser'",/g' $appdir/config/multichain.js
sudo sed -ie 's/pass:.*/pass: "'$rpcpassword'",/g' $appdir/config/multichain.js

sudo sed -ie 's/host:.*,/host: "'$dbhost'",/g' $appdir/config/db.js
sudo sed -ie 's/user:.*,/user: "'$dbuser'",/g' $appdir/config/db.js
sudo sed -ie 's/pass:.*,/pass: "'$dbpass'",/g' $appdir/config/db.js
sudo sed -ie 's/database:.*,/database: "'$dbname'",/g' $appdir/config/db.js

echo ''
echo ''
echo ''
echo ''

echo -e '--------------------------------------'
echo -e 'APPLICATIONS SUCCESSFULLY CONFIGURED!'
echo -e '--------------------------------------'
echo ''
echo ''
echo ''
echo ''


echo '--------------------------------'
echo -e 'INSTALLING NODE MODULES.....'
echo '--------------------------------'

cd $appdir && npm install
sudo chown -R $linux_admin_user: $appdir

echo '------------------------------------------'
echo -e 'RUNNING PRIMECHAIN-API APPLICATION.....'
echo '------------------------------------------'

su -l $linux_admin_user -c 'pm2 start '$appdir'/app.js'
echo "su -l "$linux_admin_user" -c 'pm2 start "$appdir"/app.js'" >> $startup_script_full_path

echo -e '--------------------------------------------------------'
echo -e 'PRIMECHAIN-API HAS BEEN SUCCESSFULLY INSTALLED : "DONE"'
echo -e '--------------------------------------------------------'
echo ''
echo ''
echo ''

echo -e '------------------------------------'
echo -e 'PRIMECHAIN-API RUNNING SUCCESSFULLY!'
echo -e '------------------------------------'
echo ''
echo ''
echo ''