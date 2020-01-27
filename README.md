**1. Prerequisites**
- To setup Primechain you need an 
  - Ubuntu 16.0.4 machine (1 GB RAM, 1 CPU) with CURL and git. 
  - The ports used are 22, 80, 1410, 2512, 15590 and 61172.

**Notes:** 
- For full functionality of PWA, SSL enabed domain is needed. 
- For system generated emails (password reset etc), enter your sendgrid key.

**2. Getting Started**
Login to server / VM as a sudo or root user. Then run the following:
```
sudo git clone https://primechainuser@github.com/Primechain/primechain
9q0W4gcSDGbjkBGUKWHk0MytFPDWcDLcUBZOI1yc
cd primechain/setup
sudo bash -e primechain_setup.sh <ip-address>
```
**The setup should take about 6 minutes. Once it is setup, all the credentials can be obtained from:**
```
su primechain-user 
cd ~
cd primechain
sudo nano .env
```
Update the below in .env, to use sendgrid for transactional emails.
```
MAIL_SERVICE_NAME=SENDGRID
MAIL_USERNAME=<your-username>
MAIL_PASSWORD=<your-password>
```
2. Copy Primechain-API username and password if you will be using the API service.

**Updating Primechain**
Login to the server / VM as a sudo or root user.

```
sudo su primechain-user 
cd ~
cd primechain
git pull && pm2 restart bin/www
```
