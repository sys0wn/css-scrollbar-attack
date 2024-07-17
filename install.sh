apt install apache fontforge npm -y
cd shop.appCssInjectionDemo
npm install
head -n -2 /etc/apache2/sites-enabled/000-default-le-ssl.conf >> temp && mv temp /etc/apache2/sites-enabled/000-default-le-ssl.conf
printf "ProxyPass / http://localhost:3000/\nProxyPassReverse / http://localhost:3000/\n\n</VirtualHost>\n</IfModule>" > /etc/apache2/sites-enabled/000-default-le-ssl.conf
a2enmod proxy proxy_http
systemctl restart apache2
node index.js
