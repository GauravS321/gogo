#!/bin/bash

if ! id $linux_admin_user >/dev/null 2>&1; then
	echo $linux_admin_user" does not exist!" 1>&2
	exit 10
fi

homedir=`su -l $linux_admin_user -c 'echo ~'`

echo ''
echo ''
echo ''
echo ''

echo 
echo '----------------------------------------'
echo -e 'CONFIGURING FIREWALL FOR NGNIX.....'
echo '----------------------------------------'

sudo ufw enable
sudo ufw status
sudo ufw allow ssh #(Port 22)
sudo ufw allow http #(Port 80)
sudo ufw allow https #(Port 443)

echo ''
echo ''
echo ''
echo ''

echo '----------------------------------------'
echo -e 'LIMIT SSH CONNECTIONS'
echo '----------------------------------------'

sudo ufw limit ssh


echo ''
echo ''
echo ''
echo ''
echo '----------------------------------------'
echo -e 'UPDATING UBUNTU SERVER....'
echo '----------------------------------------'

sudo apt-get --assume-yes update

echo -e '----------------------------------------'
echo -e 'UPDATED SUCCESSFULLY SET UP!'
echo -e '----------------------------------------'


echo ''
echo ''
echo '----------------------------------------'
echo ''
echo ''
echo ''
echo ''

echo '----------------------------------------'
echo -e 'INSTALLING & CONFIGURING NGNIX.....'
echo '----------------------------------------'

sudo apt install nginx

su -l $linux_admin_user -c "sed -ie 's/.*root-stream-open =.*\#/root-stream-open = false     #/g' $datadir/$chainname/params.dat"

su -l $linux_admin_user -c 'echo rpcuser='$rpcuser' > '$datadir'/'$chainname'/multichain.conf'
su -l $linux_admin_user -c 'echo rpcpassword='$rpcpassword' >> '$datadir'/'$chainname'/multichain.conf'
su -l $linux_admin_user -c 'echo rpcport='$rpcport' >> '$datadir'/'$chainname'/multichain.conf'
su -l $linux_admin_user -c 'echo rpcallowip='10.0.0.0/255.0.0.0' >> '$datadir'/'$chainname'/multichain.conf'
su -l $linux_admin_user -c 'echo rpcallowip='172.16.0.0/255.255.0.0' >> '$datadir'/'$chainname'/multichain.conf'
su -l $linux_admin_user -c 'echo rpcallowip='192.168.0.0/255.255.0.0' >> '$datadir'/'$chainname'/multichain.conf'

su -l $linux_admin_user -c 'echo "txindex=0" >> '$datadir'/'$chainname'/multichain.conf'
su -l $linux_admin_user -c 'echo "autosubscribe=assets,streams" >> '$datadir'/'$chainname'/multichain.conf'

echo ''
echo ''
echo '----------------------------------------'
echo ''
echo ''
echo ''
echo ''



echo '----------------------------------------'
echo -e 'CREATING AND CONFIGURING STREAMS.....'
echo '----------------------------------------'

su -l $linux_admin_user -c  "multichain-cli "$chainname" -datadir="$datadir" createrawsendfrom "$addr" '{}' '[{\"create\":\"stream\",\"name\":\"VERIFIED_USER_MASTERLIST\",\"open\":false,\"details\":{\"purpose\":\"Seed node writes to this stream when a new verified address is requested by a member.\"}}]' send"
su -l $linux_admin_user -c  "multichain-cli "$chainname" -datadir="$datadir" createrawsendfrom "$addr" '{}' '[{\"create\":\"stream\",\"name\":\"TOKEN_MASTERLIST\",\"open\":true,\"details\":{\"purpose\":\"Stores details of issued tokens\"}}]' send"
su -l $linux_admin_user -c  "multichain-cli "$chainname" -datadir="$datadir" createrawsendfrom "$addr" '{}' '[{\"create\":\"stream\",\"name\":\"OFFER_DETAIL_STREAM\",\"open\":true,\"details\":{\"purpose\":\"Stores the offer details\"}}]' send"
su -l $linux_admin_user -c "multichain-cli "$chainname" -datadir="$datadir" createrawsendfrom "$addr" '{}' '[{\"create\":\"stream\",\"name\":\"FILE_MASTERLIST\",\"open\":true,\"details\":{\"purpose\":\"Stores encrypted files data\"}}]' send"
su -l $linux_admin_user -c "multichain-cli "$chainname" -datadir="$datadir" createrawsendfrom "$addr" '{}' '[{\"create\":\"stream\",\"name\":\"FILE_SIGNATURE_MASTERLIST\",\"open\":true,\"details\":{\"purpose\":\"Stores signatures of files\"}}]' send"
su -l $linux_admin_user -c "multichain-cli "$chainname" -datadir="$datadir" createrawsendfrom "$addr" '{}' '[{\"create\":\"stream\",\"name\":\"DATA_SIGNATURE_MASTERLIST\",\"open\":true,\"details\":{\"purpose\":\"Stores signatures of data\"}}]' send"
su -l $linux_admin_user -c "multichain-cli "$chainname" -datadir="$datadir" createrawsendfrom "$addr" '{}' '[{\"create\":\"stream\",\"name\":\"DATA_MASTERLIST\",\"open\":true,\"details\":{\"purpose\":\"Stores encrypted JSON data\"}}]' send"
su -l $linux_admin_user -c "multichain-cli "$chainname" -datadir="$datadir" createrawsendfrom "$addr" '{}' '[{\"create\":\"stream\",\"name\":\"ONBOARD_USERLIST\",\"open\":false,\"details\":{\"purpose\":\"Stores details of user onboarded to the current private Blockchain instance\"}}]' send"
su -l $linux_admin_user -c "multichain-cli "$chainname" -datadir="$datadir" createrawsendfrom "$addr" '{}' '[{\"create\":\"stream\",\"name\":\"GREAT\",\"open\":true,\"details\":{\"purpose\":\"Global Repository for E-Signatures And Timestamps\"}}]' send"
su -l $linux_admin_user -c "multichain-cli "$chainname" -datadir="$datadir" createrawsendfrom "$addr" '{}' '[{\"create\":\"stream\",\"name\":\"AUTH_USERS_MASTERLIST\",\"open\":true,\"details\":{\"purpose\":\"Contains basic details and public keys of onboarded users\"}}]' send"
su -l $linux_admin_user -c "multichain-cli "$chainname" -datadir="$datadir" createrawsendfrom "$addr" '{}' '[{\"create\":\"stream\",\"name\":\"OFFER_STATUS_STREAM\",\"open\":true,\"details\":{\"purpose\":\"Stores status of bids\"}}]' send"
su -l $linux_admin_user -c "multichain-cli "$chainname" -datadir="$datadir" createrawsendfrom "$addr" '{}' '[{\"create\":\"stream\",\"name\":\"DIRECTORY_STREAM\",\"open\":false,\"details\":{\"purpose\":\"Master directory of members\"}}]' send"
su -l $linux_admin_user -c "multichain-cli "$chainname" -datadir="$datadir" createrawsendfrom "$addr" '{}' '[{\"create\":\"stream\",\"name\":\"INVOICE_MASTERLIST\",\"open\":true,\"details\":{\"purpose\":\"Stores details of Invoices\"}}]' send"
su -l $linux_admin_user -c "multichain-cli "$chainname" -datadir="$datadir" createrawsendfrom "$addr" '{}' '[{\"create\":\"stream\",\"name\":\"KYC_MASTERLIST\",\"open\":true,\"details\":{\"purpose\":\"Stores KYC details\"}}]' send"
su -l $linux_admin_user -c "multichain-cli "$chainname" -datadir="$datadir" createrawsendfrom "$addr" '{}' '[{\"create\":\"stream\",\"name\":\"REVIEW_MASTERLIST\",\"open\":true,\"details\":{\"purpose\":\"Stores reviews\"}}]' send"
su -l $linux_admin_user -c "multichain-cli "$chainname" -datadir="$datadir" createrawsendfrom "$addr" '{}' '[{\"create\":\"stream\",\"name\":\"TRADE_DOCS_MASTERLIST\",\"open\":true,\"details\":{\"purpose\":\"Stores trade documents\"}}]' send"
su -l $linux_admin_user -c "multichain-cli "$chainname" -datadir="$datadir" createrawsendfrom "$addr" '{}' '[{\"create\":\"stream\",\"name\":\"CHARGE_MASTERLIST\",\"open\":true,\"details\":{\"purpose\":\"Stores Charge registry related details\"}}]' send"


# SUBSCRIBE STREAMS
# --------- -------

su -l $linux_admin_user -c  "multichain-cli "$chainname" -datadir="$datadir" subscribe VERIFIED_USER_MASTERLIST"
su -l $linux_admin_user -c  "multichain-cli "$chainname" -datadir="$datadir" subscribe TOKEN_MASTERLIST"
su -l $linux_admin_user -c  "multichain-cli "$chainname" -datadir="$datadir" subscribe OFFER_DETAIL_STREAM"
su -l $linux_admin_user -c "multichain-cli "$chainname" -datadir="$datadir" subscribe FILE_MASTERLIST"
su -l $linux_admin_user -c "multichain-cli "$chainname" -datadir="$datadir" subscribe FILE_SIGNATURE_MASTERLIST"
su -l $linux_admin_user -c "multichain-cli "$chainname" -datadir="$datadir" subscribe DATA_SIGNATURE_MASTERLIST"
su -l $linux_admin_user -c "multichain-cli "$chainname" -datadir="$datadir" subscribe DATA_MASTERLIST"
su -l $linux_admin_user -c "multichain-cli "$chainname" -datadir="$datadir" subscribe ONBOARD_USERLIST"
su -l $linux_admin_user -c "multichain-cli "$chainname" -datadir="$datadir" subscribe GREAT"
su -l $linux_admin_user -c "multichain-cli "$chainname" -datadir="$datadir" subscribe AUTH_USERS_MASTERLIST"
su -l $linux_admin_user -c "multichain-cli "$chainname" -datadir="$datadir" subscribe OFFER_STATUS_STREAM"
su -l $linux_admin_user -c "multichain-cli "$chainname" -datadir="$datadir" subscribe DIRECTORY_STREAM"
su -l $linux_admin_user -c "multichain-cli "$chainname" -datadir="$datadir" subscribe INVOICE_MASTERLIST"
su -l $linux_admin_user -c "multichain-cli "$chainname" -datadir="$datadir" subscribe KYC_MASTERLIST"
su -l $linux_admin_user -c "multichain-cli "$chainname" -datadir="$datadir" subscribe REVIEW_MASTERLIST"
su -l $linux_admin_user -c "multichain-cli "$chainname" -datadir="$datadir" subscribe TRADE_DOCS_MASTERLIST"
su -l $linux_admin_user -c "multichain-cli "$chainname" -datadir="$datadir" subscribe CHARGE_MASTERLIST"

echo -e '----------------------------------------'
echo -e 'BLOCKCHAIN SUCCESSFULLY SET UP!'
echo -e '----------------------------------------'