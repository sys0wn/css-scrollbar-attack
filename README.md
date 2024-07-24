# Install on your own server

0. Get a Debian 12 VPS and link a domain(any.com) to your server and wait for it to  propagate(https://www.whatsmydns.net/) (usually takes 1hour)

1. Run the following on the Debian 12 VPS:

   ```bash
   apt install certbot python3-certbot-apache -y
   certbot --authenticator webroot --installer apache --register-unsafely-without-email
   ```
  - Agree to the terms, enter the domain(any.com) you linked earlier and enter the webroot /var/www/html

2. Then run the following:

```bash
apt install git -y && git clone https://github.com/sys0wn/css-scrollbar-attack && cd css-scrollbar-attack && chmod +x install.sh && bash install.sh
```
