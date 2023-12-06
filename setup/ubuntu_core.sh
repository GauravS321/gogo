#!/bin/bash

source primechain-api.conf

rpcuser=$1
rpcpassword=$2

if ! id $linux_admin_user >/dev/null 2>&1; then
	echo $linux_admin_user" does not exist!" 1>&2
	exit 10
fi

homedir=`su -l $linux_admin_user -c 'echo ~'`

echo '----------------------------------------'
echo -e 'INSTALLING PREREQUISITES.....'
echo '----------------------------------------'

sudo apt-get install -y curl


echo -e '----------------------------------------'
echo -e 'PREREQUISITES SUCCESSFULLY SET UP!'
echo -e '----------------------------------------'


sudo apt-get --assume-yes update
sudo apt-get --assume-yes install jq

echo ''
echo ''
echo '----------------------------------------'
echo ''
echo ''
echo ''
echo ''

sleep 1

echo '------------------------------'
echo -e 'CONFIGURING FIREWALL.....'
echo '------------------------------'

sudo ufw allow $networkport
sudo ufw allow $rpcport

echo -e '----------------------------------'
echo -e 'FIREWALL SUCCESSFULLY CONFIGURED!'
echo -e '----------------------------------'

echo '--------------------------------------------'
echo -e 'INSTALLING & CONFIGURING MULTICHAIN.....'
echo '--------------------------------------------'

wget --no-verbose http://www.multichain.com/download/multichain-$multichainVersion.tar.gz
sudo bash -c 'tar xvf multichain-'$multichainVersion'.tar.gz'
sudo bash -c 'cp multichain-'$multichainVersion'*/multichain* /usr/local/bin/'

if [ ! -d $datadir ]; then
  sudo mkdir -p $datadir;
fi

sudo chown $linux_admin_user: $datadir

su -l $linux_admin_user -c  'multichain-util create '$chainname' '$protocol' -datadir='$datadir

su -l $linux_admin_user -c "sed -ie 's/.*chain-description =.*\#/chain-description = '$chainname'-Building blockchains for a better world     #/g' $datadir/$chainname/params.dat"
su -l $linux_admin_user -c "sed -ie 's/.*root-stream-open =.*\#/root-stream-open = false     #/g' $datadir/$chainname/params.dat"
su -l $linux_admin_user -c "sed -ie 's/.*target-block-time =.*\#/target-block-time = 15     #/g' $datadir/$chainname/params.dat"
su -l $linux_admin_user -c "sed -ie 's/.*maximum-block-size =.*\#/maximum-block-size = 1000000000     #/g' $datadir/$chainname/params.dat"
su -l $linux_admin_user -c "sed -ie 's/.*maximum-chunk-size =.*\#/maximum-chunk-size = 16777216     #/g' $datadir/$chainname/params.dat"
su -l $linux_admin_user -c "sed -ie 's/.*maximum-chunk-count =.*\#/maximum-chunk-count = 2048     #/g' $datadir/$chainname/params.dat"
su -l $linux_admin_user -c "sed -ie 's/.*timing-upgrade-min-gap =.*\#/timing-upgrade-min-gap = 1     #/g' $datadir/$chainname/params.dat"
su -l $linux_admin_user -c "sed -ie 's/.*mining-diversity =.*\#/mining-diversity = 0.6     #/g' $datadir/$chainname/params.dat"
su -l $linux_admin_user -c "sed -ie 's/.*admin-consensus-upgrade =.*\#/admin-consensus-upgrade = 0.8     #/g' $datadir/$chainname/params.dat"
su -l $linux_admin_user -c "sed -ie 's/.*admin-consensus-admin =.*\#/admin-consensus-admin = 0.8     #/g' $datadir/$chainname/params.dat"
su -l $linux_admin_user -c "sed -ie 's/.*admin-consensus-activate =.*\#/admin-consensus-activate = 0.0     #/g' $datadir/$chainname/params.dat"
su -l $linux_admin_user -c "sed -ie 's/.*admin-consensus-mine =.*\#/admin-consensus-mine = 0.8     #/g' $datadir/$chainname/params.dat"
su -l $linux_admin_user -c "sed -ie 's/.*lock-admin-mine-rounds =.*\#/lock-admin-mine-rounds = 5     #/g' $datadir/$chainname/params.dat"
su -l $linux_admin_user -c "sed -ie 's/.*mining-requires-peers =.*\#/mining-requires-peers = true     #/g' $datadir/$chainname/params.dat"
su -l $linux_admin_user -c "sed -ie 's/.*mine-empty-rounds =.*\#/mine-empty-rounds = 5     #/g' $datadir/$chainname/params.dat"
su -l $linux_admin_user -c "sed -ie 's/.*mining-turnover =.*\#/mining-turnover = 0.5     #/g' $datadir/$chainname/params.dat"
su -l $linux_admin_user -c "sed -ie 's/.*initial-block-reward =.*\#/initial-block-reward = 0     #/g' $datadir/$chainname/params.dat"
su -l $linux_admin_user -c "sed -ie 's/.*first-block-reward =.*\#/first-block-reward = -1     #/g' $datadir/$chainname/params.dat"
su -l $linux_admin_user -c "sed -ie 's/.*reward-halving-interval =.*\#/reward-halving-interval = 52560000     #/g' $datadir/$chainname/params.dat"
su -l $linux_admin_user -c "sed -ie 's/.*reward-spendable-delay =.*\#/reward-spendable-delay = 1     #/g' $datadir/$chainname/params.dat"
su -l $linux_admin_user -c "sed -ie 's/.*minimum-per-output =.*\#/minimum-per-output = 0     #/g' $datadir/$chainname/params.dat"
su -l $linux_admin_user -c "sed -ie 's/.*maximum-per-output =.*\#/maximum-per-output = 100000000000000     #/g' $datadir/$chainname/params.dat"
su -l $linux_admin_user -c "sed -ie 's/.*minimum-offchain-fee =.*\#/minimum-offchain-fee = 0     #/g' $datadir/$chainname/params.dat"
su -l $linux_admin_user -c "sed -ie 's/.*minimum-relay-fee =.*\#/minimum-relay-fee = 0     #/g' $datadir/$chainname/params.dat"
su -l $linux_admin_user -c "sed -ie 's/.*native-currency-multiple =.*\#/native-currency-multiple = 100000000     #/g' $datadir/$chainname/params.dat"
su -l $linux_admin_user -c "sed -ie 's/.*skip-pow-check =.*\#/skip-pow-check = true     #/g' $datadir/$chainname/params.dat"
su -l $linux_admin_user -c "sed -ie 's/.*pow-minimum-bits =.*\#/pow-minimum-bits = 2     #/g' $datadir/$chainname/params.dat"
su -l $linux_admin_user -c "sed -ie 's/.*target-adjust-freq =.*\#/target-adjust-freq = -1     #/g' $datadir/$chainname/params.dat"
su -l $linux_admin_user -c "sed -ie 's/.*allow-min-difficulty-blocks =.*\#/allow-min-difficulty-blocks = true     #/g' $datadir/$chainname/params.dat"
su -l $linux_admin_user -c "sed -ie 's/.*max-std-tx-size =.*\#/max-std-tx-size = 100000000     #/g' $datadir/$chainname/params.dat"
su -l $linux_admin_user -c "sed -ie 's/.*max-std-op-returns-count =.*\#/max-std-op-returns-count = 1024     #/g' $datadir/$chainname/params.dat"
su -l $linux_admin_user -c "sed -ie 's/.*max-std-op-return-size =.*\#/max-std-op-return-size = 67108864     #/g' $datadir/$chainname/params.dat"
su -l $linux_admin_user -c "sed -ie 's/.*max-std-op-drops-count =.*\#/max-std-op-drops-count = 100     #/g' $datadir/$chainname/params.dat"
su -l $linux_admin_user -c "sed -ie 's/.*max-std-element-size =.*\#/max-std-element-size = 32768     #/g' $datadir/$chainname/params.dat"
su -l $linux_admin_user -c "sed -ie 's/.*default-network-port =.*\#/default-network-port = '$networkport'     #/g' $datadir/$chainname/params.dat"
su -l $linux_admin_user -c "sed -ie 's/.*default-rpc-port =.*\#/default-rpc-port = '$rpcport'     #/g' $datadir/$chainname/params.dat"

su -l $linux_admin_user -c 'echo rpcuser='$rpcuser' > '$datadir'/'$chainname'/multichain.conf'
su -l $linux_admin_user -c 'echo rpcpassword='$rpcpassword' >> '$datadir'/'$chainname'/multichain.conf'
su -l $linux_admin_user -c 'echo rpcport='$rpcport' >> '$datadir'/'$chainname'/multichain.conf'
su -l $linux_admin_user -c 'echo rpcallowip='10.0.0.0/255.0.0.0' >> '$datadir'/'$chainname'/multichain.conf'
su -l $linux_admin_user -c 'echo rpcallowip='172.16.0.0/255.255.0.0' >> '$datadir'/'$chainname'/multichain.conf'
su -l $linux_admin_user -c 'echo rpcallowip='192.168.0.0/255.255.0.0' >> '$datadir'/'$chainname'/multichain.conf'
su -l $linux_admin_user -c 'echo rpcallowip='192.168.56.0/255.255.0.0' >> '$datadir'/'$chainname'/multichain.conf'

su -l $linux_admin_user -c 'echo "txindex=0" >> '$datadir'/'$chainname'/multichain.conf'
su -l $linux_admin_user -c 'echo "autosubscribe=assets,streams" >> '$datadir'/'$chainname'/multichain.conf'

echo ''
echo ''
echo '----------------------------------------'
echo ''
echo ''
echo ''
echo ''

echo '---------------------------'
echo -e 'RUNNING BLOCKCHAIN.....'
echo '---------------------------'

su -l $linux_admin_user -c 'multichaind '$chainname' -daemon -datadir='$datadir''

echo "su -l "$linux_admin_user" -c 'multichaind "$chainname" -daemon -datadir="$datadir"'" >> $startup_script_full_path

echo ''
echo ''
echo '----------------------------------------'
echo ''
echo ''
echo ''
echo ''

echo '------------------------------'
echo -e 'LOADING CONFIGURATION.....'
echo '------------------------------'

sleep 2 

addr=`curl --user $rpcuser:$rpcpassword --data-binary '{"jsonrpc": "1.0", "id":"curltest", "method": "getaddresses", "params": [] }' -H 'content-type: text/json;' http://127.0.0.1:$rpcport | jq -r '.result[0]'`

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