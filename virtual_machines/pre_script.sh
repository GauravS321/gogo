#!/bin/bash

sudo apt-get update
sudo apt install net-tools -y
sudo apt install build-essential -y
sudo mkdir -p /home/primechain-user/
sudo chown vagrant:vagrant /home/primechain-user/