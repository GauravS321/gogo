#!/bin/bash

source primechain-api.conf

ipaddress=$1

outputfilepath=~/primechain-api.out
rm -rf $outputfilepath

echo -e \
'#!/bin/bash'"\n"\
'### BEGIN INIT INFO'"\n"\
'# Provides:          primechain_api_daemon'"\n"\
'# Required-Start:    $remote_fs $syslog'"\n"\
'# Required-Stop:     $remote_fs $syslog'"\n"\
'# Default-Start:     2 3 4 5'"\n"\
'# Default-Stop:      0 1 6'"\n"\
'# Short-Description: Start daemon at boot time'"\n"\
'# Description:       Start Primechain-API services at boot time.'"\n"\
'### END INIT INFO'"\n"\
 > $startup_script_full_path

chmod +x $startup_script_full_path

rpcuser=`< /dev/urandom tr -dc A-Za-z0-9 | head -c40; echo`
rpcpassword=`< /dev/urandom tr -dc A-Za-z0-9 | head -c40; echo`

dbuser=`< /dev/urandom tr -dc A-Za-z0-9 | head -c20; echo`
dbpass=`< /dev/urandom tr -dc A-Za-z0-9^_ | head -c40; echo`
dbrootpass=`< /dev/urandom tr -dc A-Za-z0-9^_ | head -c40; echo`


echo ''
echo ''
echo -e '========================================'
echo -e 'CREATING LINUX ADMIN USER'
echo -e '========================================'
echo ''
echo ''
echo ''

### CREATING LINUX ADMIN USER
bash -e ubuntu_create_linux_admin_user.sh

echo ''
echo ''
echo -e '==========================================='
echo -e 'LINUX ADMIN USER CREATED SUCCESSFULLY!!!'
echo -e '==========================================='
echo ''
echo ''
echo ''

sleep 1

echo ''
echo ''
echo -e '========================'
echo -e 'HARDENING THE SERVER'
echo -e '========================'
echo ''
echo ''
echo ''

### HARDENING THE SERVER
bash -e ubuntu_hardening.sh

echo ''
echo ''
echo -e '=================================='
echo -e 'HARDENING THE SERVER COMPLETED!!!'
echo -e '=================================='
echo ''
echo ''
echo ''

sleep 1

echo ''
echo ''
echo -e '=============================='
echo -e 'INSTALLING NODEJS INITIATED...'
echo -e '==============================='
echo ''
echo ''
echo ''

### INSTALLING NODE JS
bash -e ubuntu_nodejs.sh

echo ''
echo ''
echo -e '=================================='
echo -e 'NODE JS INSTALLATION COMPLETED!!!'
echo -e '=================================='
echo ''
echo ''
echo ''

sleep 1

echo ''
echo ''
echo -e '==============================='
echo -e 'INSTALLING MySQL INITIATED...'
echo -e '==============================='
echo ''
echo ''
echo ''

### INSTALLING MySQL
bash -e ubuntu_mysql_setup.sh $dbrootpass $dbuser $dbpass

echo ''
echo ''
echo -e '=================================='
echo -e 'MySQL INSTALLATION COMPLETED!!!'
echo -e '=================================='
echo ''
echo ''
echo ''

sleep 1

echo ''
echo ''
echo -e '==============================='
echo -e 'INSTALLING MONGODB INITIATED...'
echo -e '==============================='
echo ''
echo ''
echo ''

### INSTALLING MongoDB
bash -e ubuntu_mongodb_setup.sh

echo ''
echo ''
echo -e '=================================='
echo -e 'MONGODB INSTALLATION COMPLETED!!!'
echo -e '=================================='
echo ''
echo ''
echo ''

sleep 1

echo -e \
'--------------------------------------------'"\n"\
'MYSQL DATABASE CREDENTIALS'"\n"\
'--------------------------------------------'"\n"\
'dbrootpass='$dbrootpass"\n"\
'dbuser='$dbuser"\n"\
'dbpass='$dbpass"\n\n"\
 > $outputfilepath

 echo -e \
'--------------------------------------------'"\n"\
'MONGODB DATABASE CREDENTIALS'"\n"\
'--------------------------------------------'"\n"\
'dbname= primechain'"\n"\
'dbuser= primechainuser'"\n"\
'dbpass='$MongoDBpass"\n\n"\
 > $outputfilepath

echo ''
echo ''
echo -e '=================================='
echo -e 'INSTALLING BLOCKCHAIN INITIATED...'
echo -e '=================================='
echo ''
echo ''
echo ''

### INSTALLING MULTICHAIN
bash -e ubuntu_core.sh $rpcuser $rpcpassword

echo ''
echo ''
echo -e '===================================='
echo -e 'BLOCKCHAIN INSTALLATION COMPLETED!!!'
echo -e '===================================='
echo ''
echo ''
echo ''


echo -e \
'--------------------------------------------'"\n"\
'API CREDENTIALS'"\n"\
'--------------------------------------------'"\n"\
'rpcuser='$rpcuser"\n"\
'rpcpassword='$rpcpassword"\n\n"\
 >> $outputfilepath

sleep 1

echo ''
echo ''
echo -e '=========================='
echo -e 'INSTALLING PRIMECHAIN-API'
echo -e '=========================='
echo ''
echo ''
echo ''

### INSTALLING API
bash -e application.sh 'localhost' $rpcuser $rpcpassword 'localhost' $dbuser $dbpass

update-rc.d primechain.sh defaults

echo ''
echo ''

echo -e '============================================'
echo -e 'PRIMECHAIN-API SETUP COMPLETED SUCCESSFULLY!'
echo -e '============================================'
echo ''
echo ''
echo ''

sleep 1

echo ''
echo ''
echo -e '======================='
echo -e 'INSTALLING PRIMECHAIN'
echo -e '======================='
echo ''
echo ''
echo ''

### INSTALLING primechain
bash -e primechain.sh $ipaddress
 
echo ''
echo ''

echo -e '========================================'
echo -e 'PRIMECHAIN SETUP COMPLETED SUCCESSFULLY!'
echo -e '========================================'
echo ''
echo ''
echo ''

echo ''
echo ''
echo '----------------------------------------'
echo ''
echo ''
echo ''

sleep 1

echo -e '==================================================='
echo -e 'WEB APPLICATION UP AND RUNNING IN THE FOLLOWING URL'
echo -e '==================================================='
echo -e 'http://'$ipaddress':1410'
echo ''
echo ''
echo ''
echo ''
echo ''
echo -e '==================================================='
echo -e 'API APPLICATION UP AND RUNNING IN THE FOLLOWING URL'
echo -e '==================================================='
echo -e 'http://'$ipaddress':2512/api/v1/get_api_key' 

echo ''
echo ''
echo -e 'All your credentials are in root/primechain-api.out'


