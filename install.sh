apt install apache2 fontforge npm -y
cd shop.appCssInjectionDemo
npm install
sed -i -e '$ d' /etc/apache2/sites-enabled/000-default-le-ssl.conf && sed -i -e '$ d' /etc/apache2/sites-enabled/000-default-le-ssl.conf
printf "ProxyPass / http://localhost:3000/\nProxyPassReverse / http://localhost:3000/\n\n</VirtualHost>\n</IfModule>" >> /etc/apache2/sites-enabled/000-default-le-ssl.conf
a2enmod proxy proxy_http
systemctl restart apache2
node index.js
