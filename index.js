const express = require('express');
const puppeteer = require('puppeteer');
const crypto = require('crypto'); //for ids

const app = express();
//this does not persist after server restart
//because i dont even know how to do that
const sessions = {};

app.use(express.static('./webapp'));

app.post('/createSession', async (req, res) => {
    if (!req.query.url) {
        return res.status(400).json({error: 'no parameters'});
    }

    if (req.query.url.includes('porn')) {
        return res.status(400).json({error: 'sybau'});
    }

    const id = crypto.randomBytes(10).toString('hex');
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.goto(req.query.url);
    await page.setViewport({width: 1280, height: 720}); //bad resolution so it can fit in the webapp
    
    sessions[id] = {browser, page};

    //you can only use the browser for 5 minutes
    //actually idk if this works but ill try it
    setTimeout(async () => {
        try {
            const browsertoclose = sessions[id]['browser'];
            await browsertoclose.close();
        } catch (error) {
            console.log('probably already killed');
        }
    }, 300000);

    res.json({session: id});
});

app.get('/screenshot', async (req, res) => {
    if (!req.query.session) {
        return res.status(400).json({error: 'no parameters'});
    }

    if (!sessions[req.query.session]) {
        return res.status(400).json({error: 'session not exist'});
    }

    //i should use typescript
    /**
     * @type {import("puppeteer").Page}
     */
    const page = sessions[req.query.session]['page'];
    const img = await page.screenshot({
        type: 'webp',
    });

    res.type('webp').send(img);
});

app.post('/kill', async (req, res) => {
    if (!req.query.session) {
        return res.status(400).json({error: 'no parameters'});
    }

    if (!sessions[req.query.session]) {
        return res.status(400).json({error: 'session not exist'});
    }

    /**
     * @type {import("puppeteer").Browser}
     */
    const browser = sessions[req.query.session]['browser'];

    await browser.close();

    res.status(204).end();
});

app.post('/click', async (req, res) => {
    if (!req.query.session || !req.query.x || !req.query.y) {
        return res.status(400).json({error: 'no parameters'});
    }

    if (!sessions[req.query.session]) {
        return res.status(400).json({error: 'session not exist'});
    }

    const x = Number(req.query.x);
    const y = Number(req.query.y);

    /**
     * @type {import("puppeteer").Page}
     */
    const page = sessions[req.query.session]['page'];
    
    await page.mouse.click(x, y);

    res.status(204).end();
});

app.post('/type', async (req, res) => {
    if (!req.query.session || !req.query.text) {
        return res.status(400).json({error: 'no parameters'});
    }

    if (!sessions[req.query.session]) {
        return res.status(400).json({error: 'session not exist'});
    }

    /**
     * @type {import("puppeteer").Page}
     */
    const page = sessions[req.query.session]['page'];
    
    await page.keyboard.type(req.query.text);

    res.status(204).end();
});

app.post('/enter', async (req, res) => {
    if (!req.query.session) {
        return res.status(400).json({error: 'no parameters'});
    }

    if (!sessions[req.query.session]) {
        return res.status(400).json({error: 'session not exist'});
    }

    /**
     * @type {import("puppeteer").Page}
     */
    const page = sessions[req.query.session]['page'];
    
    await page.keyboard.press('Enter');

    res.status(204).end();
});

app.post('/backspace', async (req, res) => {
    if (!req.query.session) {
        return res.status(400).json({error: 'no parameters'});
    }

    if (!sessions[req.query.session]) {
        return res.status(400).json({error: 'session not exist'});
    }

    /**
     * @type {import("puppeteer").Page}
     */
    const page = sessions[req.query.session]['page'];
    
    await page.keyboard.press('Backspace');

    res.status(204).end();
});

app.listen(8080, () => console.log('http://localhost:8080'));