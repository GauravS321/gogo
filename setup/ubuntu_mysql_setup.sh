#!/bin/bash

source primechain-api.conf

db_root_pass=$1
db_user=$2
db_pass=$3

sudo apt-get -y update

echo '-----------------------'
echo -e 'INSTALLING MySQL...'
echo '-----------------------'

# SET UP A SILENT INSTALL OF MySQL
export DEBIAN_FRONTEND=noninteractive
# sudo sh -c "echo mysql-server-5.7 mysql-server/root_password password "$db_root_pass" | debconf-set-selections"
# sudo sh -c "echo mysql-server-5.7 mysql-server/root_password_again password "$db_root_pass" | debconf-set-selections"

sudo sh -c "echo mysql-apt-config mysql-apt-config/select-server select mysql-8.0 | debconf-set-selections"
sudo sh -c "echo mysql-community-server mysql-community-server/root-pass password "$db_root_pass" | debconf-set-selections"
sudo sh -c "echo mysql-community-server mysql-community-server/re-root-pass password "$db_root_pass" | debconf-set-selections"

# INSTALL MySQL
sudo apt-get -y install mysql-server


echo ''
echo ''
echo -e '=============================='
echo -e 'MySQL INSTALLED SUCCESSFULLY!'
echo -e '=============================='
echo ''
echo ''
echo ''

echo '--------------------------'
echo -e 'CREATING A DATABASE...'
echo '--------------------------'
echo ''
echo ''

sudo mysql -u root -p$db_root_pass -Bse 'SET GLOBAL FOREIGN_KEY_CHECKS=0;'
sudo mysql -u root -p$db_root_pass -Bse 'DROP DATABASE IF EXISTS `'$dbname'`'
sudo mysql -u root -p$db_root_pass -Bse 'CREATE DATABASE IF NOT EXISTS `'$dbname'`'
sudo mysql --user=root --password=$db_root_pass $dbname < $db_file_name
echo ''
echo ''
echo -e '================================'
echo -e 'DATABASE CREATED SUCCESSFULLY!'
echo -e '================================='
echo ''
echo ''
echo ''

echo '--------------------------'
echo -e 'CREATING A NEW USER...'
echo '--------------------------'
echo ''
echo ''
sudo mysql -u root -p$db_root_pass -Bse "CREATE USER IF NOT EXISTS '"$db_user"'@'localhost' IDENTIFIED WITH mysql_native_password BY '"$db_pass"';"
sudo mysql -u root -p$db_root_pass -Bse "CREATE USER IF NOT EXISTS '"$db_user"'@'10.%' IDENTIFIED WITH mysql_native_password BY '"$db_pass"';"
sudo mysql -u root -p$db_root_pass -Bse "CREATE USER IF NOT EXISTS '"$db_user"'@'172.16.%' IDENTIFIED WITH mysql_native_password BY '"$db_pass"';"
sudo mysql -u root -p$db_root_pass -Bse "CREATE USER IF NOT EXISTS '"$db_user"'@'192.168.%' IDENTIFIED WITH mysql_native_password BY '"$db_pass"';"

echo ''
echo ''
echo -e '==========================='
echo -e 'USER CREATED SUCCESSFULLY!'
echo -e '==========================='
echo ''
echo ''
echo ''
echo '-------------------------------------'
echo -e 'GRANTING PRIVILEGES TO NEW USER...'
echo '-------------------------------------'
echo ''
echo ''
sudo mysql -u root -p$db_root_pass -Bse "GRANT ALL PRIVILEGES ON \`"$dbname"\`. * TO '"$db_user"'@'localhost';"
sudo mysql -u root -p$db_root_pass -Bse "GRANT ALL PRIVILEGES ON \`"$dbname"\`. * TO '"$db_user"'@'10.%';"
sudo mysql -u root -p$db_root_pass -Bse "GRANT ALL PRIVILEGES ON \`"$dbname"\`. * TO '"$db_user"'@'172.16.%';"
sudo mysql -u root -p$db_root_pass -Bse "GRANT ALL PRIVILEGES ON \`"$dbname"\`. * TO '"$db_user"'@'192.168.%';"
sudo mysql -u root -p$db_root_pass -Bse "FLUSH PRIVILEGES;"

sudo mysql -u root -p$db_root_pass $dbname -Bse 'SET GLOBAL FOREIGN_KEY_CHECKS=1'

echo ''
echo ''
echo -e '================================'
echo -e 'GRANTED PRIVILEGES TO THE USER!'
echo -e '================================='
echo ''
echo ''
echo ''