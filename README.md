## 1. Prerequisites
- To setup Primechain you need an 
  - Ubuntu 16.0.4 machine (1 GB RAM, 1 CPU) with CURL and git. 
  - The ports used are 22, 80, 1410, 2512, 15590 and 61172.

**Notes:** 
- For full functionality of PWA, SSL enabed domain is needed. 
- For system generated emails (password reset etc), enter your sendgrid key.

## 2. Getting Started
Login to server / VM as a sudo or root user. Then run the following:
```
sudo git clone https://primechainuser@github.com/Primechain/primechain
9q0W4gcSDGbjkBGUKWHk0MytFPDWcDLcUBZOI1yc
cd primechain/setup
sudo bash -e primechain_setup.sh <ip-address> <email-address>
```
Instead of the IP address you can enter the domain name above. Or after setup, go to the .env file and change the IP address or domain name.

**The setup should take about 6 minutes. You will see something like this:
```
=============================================
ADMIN LOGIN CREDENTIALS FOR WEB APPLICATION
=============================================

#######################################################
#  Email address: info@primechain.in #
#  Password: 5Ofxy3bmMx0Z9xfelnDoHWbaGs5T2RyItZ1n4RYL #
#######################################################


===================================================
WEB APPLICATION UP AND RUNNING IN THE FOLLOWING URL
===================================================
http://example.com:1410


===================================================
API APPLICATION UP AND RUNNING IN THE FOLLOWING URL
===================================================
http://example.com:2512/api/v1/get_api_key

All your credentials are in root/primechain-api.out

```
To view mysql, mongo and multichain credentials
```
nano ~root/primechain-api.out
```

The web application credentials can be obtained from:**
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
Enter your **google** and **facebook** credentials if you want to use login through these services. If not, comment out the relevant code in `src/web/views/users/account/login.hbs`

Copy **Primechain-API** username and password if you will be using the API service.

## 3. Updating Primechain
Login to the server / VM as a sudo or root user.

```
sudo su primechain-user 
cd ~
cd primechain
sudo git pull && npm i && pm2 restart 1
```
## 4. Adding nodes
https://github.com/Primechain/primechain_nodes/blob/master/README.md

## 5. Stop / start multichain
Login to the server / VM as a sudo or root user.
For stopping multichain:
```
sudo su primechain-user 
cd ~
multichain-cli Primechain stop
```
For starting multichain:
```
sudo su primechain-user 
cd ~
multichaind Primechain --daemon
```
## 6. Setting up ngnix and SSL

Login to the VM as root and then
```
sudo ufw allow https
sudo apt install nginx
sudo nano /etc/nginx/sites-available/default

# Add the following to the location part of the server block

    server_name yourdomain.com www.yourdomain.com;

    location / {
        proxy_pass http://localhost:5000; #whatever port your app runs on
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

# Check NGINX config
sudo nginx -t

# Restart NGINX
sudo service nginx restart

sudo add-apt-repository ppa:certbot/certbot
sudo apt-get update
sudo apt-get install python-certbot-nginx
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Only valid for 90 days, test the renewal process with
certbot renew --dry-run
```
Now visit https://yourdomain.com and you should see your web app.
