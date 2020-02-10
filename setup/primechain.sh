#!/bin/bash

source primechain-api.conf

sessionkey=`< /dev/urandom tr -dc A-Za-z0-9 | head -c40; echo`

ipaddress=$1

homedir=`su -l $linux_admin_user -c 'cd ~ && pwd'`

echo '-----------------------------'
echo -e 'CONFIGURING FIREWALL.....'
echo '-----------------------------'

sudo ufw allow $primechainport

echo ''
echo ''
echo -e '---------------------------------'
echo -e 'FIREWALL SUCCESSFULLY CONFIGURED!'
echo -e '---------------------------------'
echo ''
echo ''
echo ''
echo ''

content=$(sudo curl -s GET http://$ipaddress:2512/api/v1/get_api_key)
echo $content
username=$(jq -r '.api_key.username' <<< "${content}")
password=$(jq -r '.api_key.password' <<< "${content}")

echo '--------------------------------'
echo -e 'SETTING UP APPLICATIONS.....'
echo '--------------------------------'

appdir=$homedir/primechain

echo ''
echo ''
echo ''
echo ''

echo -e '-------------------------------------'
echo -e 'APPLICATIONS SUCCESSFULLY CONFIGURED!'
echo -e '-------------------------------------'
echo ''
echo ''
echo ''
echo ''
echo -e '---------------------'
echo -e 'GENERATING .env FILE'
echo -e '---------------------'

echo ''
echo ''
echo ''
echo ''

echo -e \
'--------------------------------------------'"\n"\
'APPLICATION INFORMATION'"\n"\
'--------------------------------------------'"\n"\
'APPLICATION_HOSTNAME='$ipaddress"\n"\
'APPLICATION_PORT=1410'"\n"\
'APPLICATION_NAME=primechain'"\n"\
'APPLICATION_SESSION_SECRET='$sessionkey"\n\n" >>  $appdir/.env

echo -e \
'--------------------------------------------'"\n"\
'PRIMECHAIN-API INFORMATION'"\n"\
'--------------------------------------------'"\n"\
'PRIMECHAIN_USERNAME='$username"\n"\
'PRIMECHAIN_PASSWORD='$password"\n"\
'PRIMECHAIN_API_URN='$ipaddress"\n"\
'PRIMECHAIN_API_PORT=2512'"\n\n" >> $appdir/.env

echo -e \
'--------------------------------------------'"\n"\
'SENDGRID'"\n"\
'--------------------------------------------'"\n"\
'MAIL_SERVICE_NAME=<Service-name>'"\n"\
'MAIL_USERNAME=<username>'"\n"\
'MAIL_PASSWORD=<password>'"\n\n" >> $appdir/.env 

echo -e \
'--------------------------------------------'"\n"\
'GOOGLE API CREDENTIALS'"\n"\
'--------------------------------------------'"\n"\
'GOOGLE_ID=<your-id>'"\n"\
'GOOGLE_SECRET=<your-secret>'"\n\n" >> $appdir/.env

echo -e \
'--------------------------------------------'"\n"\
'FACEBOOK API CREDENTIALS'"\n"\
'--------------------------------------------'"\n"\
'FACEBOOK_ID=<your-id>'"\n"\
'FACEBOOK_SECRET=<your-secret>'"\n\n" >> $appdir/.env 

echo -e \
'--------------------------------------------'"\n"\
'MONGODB'"\n"\
'--------------------------------------------'"\n"\
'MONGODB_URI=mongodb://localhost:27017/primechain'"\n\n"\
 >> $appdir/.env

echo ''
echo ''
echo -e '-----------------------------------'
echo -e '.env FILE GENERATED SUCCESSFULLY!!!'
echo -e '------------------------------------'

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

su -l $linux_admin_user -c 'pm2 start '$appdir'/bin/www'
echo "su -l "$linux_admin_user" -c 'pm2 start "$appdir"/bin/www'" >> $startup_script_full_path

echo -e '----------------------------------------------------'
echo -e 'PRIMECHAIN HAS BEEN SUCCESSFULLY INSTALLED : "DONE"'
echo -e '----------------------------------------------------'
echo ''
echo ''
echo ''

echo -e '---------------------------------'
echo -e 'APPLICATION RUNNING SUCCESSFULLY!'
echo -e '---------------------------------'
echo ''
echo ''
echo ''
