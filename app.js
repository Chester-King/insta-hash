const express = require('express');
const puppeteer = require('puppeteer');
const app = express();

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
const port = process.env.PORT || 7253;

app.use(express.json());

app.get('', (req, res) => {
  console.log(req.query.username);
  console.log('**********');
  console.log(req.query.hashtag);
  console.log(req.query.number);
  user = req.query.username;
  pass = req.query.password;
  hash = req.query.hashtag;
  reqno = req.query.number;

  (async () => {
    const browser = await puppeteer.launch({
      headless: false,
      defaultViewport: null,
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--start-maximized']
    });
    const page = await browser.newPage();
    let element, formElement, tabs;

    await page.evaluateOnNewDocument(() => {
      const originalQuery = window.navigator.permissions.query;
      return (window.navigator.permissions.query = parameters =>
        parameters.name === 'notifications'
          ? Promise.resolve({ state: Notification.permission })
          : originalQuery(parameters));
    });
    const userAgent =
      'Mozilla/5.0 (X11; Linux x86_64)' +
      'AppleWebKit/537.36 (KHTML, like Gecko) Chrome/64.0.3282.39 Safari/537.36';
    await page.evaluateOnNewDocument(() => {
      Object.defineProperty(navigator, 'webdriver', {
        get: () => false
      });
    });
    await page.setUserAgent(userAgent);

    await page.goto(
      `https://www.instagram.com/accounts/login/?source=auth_switcher`,
      { waitUntil: 'networkidle0' }
    );

    await sleep(3000);

    element = await page.$x(`//*[@name="username"]`);
    await element[0].click();

    element = await page.$x(`//*[@name="username"]`);
    await element[0].type(user);

    console.log('Usename Entered');

    await sleep(2000);

    element = await page.$x(`//*[@name="password"]`);
    await element[0].click();

    element = await page.$x(`//*[@name="password"]`);
    await element[0].type(pass);

    console.log('Password Entered');

    await sleep(3000);

    element = await page.$x(
      `(.//*[normalize-space(text()) and normalize-space(.)='Show'])[1]/following::div[2]`
    );
    await element[0].click();

    console.log('Accessing...');
    await sleep(6000);

    try {
      element = await page.$x(
        `(.//*[normalize-space(text()) and normalize-space(.)='Know right away when people follow you or like and comment on your photos.'])[1]/following::button[2]`
      );
      await element[0].click();
      console.log('Notification Bypassed');
    } catch (e) {
      console.log('Notification Excepted');
    }
    await sleep(2000);

    element = await page.$x(
      `(.//*[normalize-space(text()) and normalize-space(.)='© 2019 Instagram'])[1]/following::div[13]`
    );
    await element[0].click();

    element = await page.$x(
      `(.//*[normalize-space(text()) and normalize-space(.)='© 2019 Instagram'])[1]/following::input[2]`
    );
    await element[0].type('#' + hash);
    console.log('Hash typed');

    await sleep(6000);

    element = await page.$x(
      `(.//*[normalize-space(text()) and normalize-space(.)='#` +
        hash +
        `'])[1]/following::span[1]`
    );
    await element[0].click();

    console.log('Hash entered');
    await sleep(6000);

    await page.waitForSelector('.Nnq7C > .v1Nh3 > a');
    await page.click('.Nnq7C > .v1Nh3 > a');

    console.log('post');
    await sleep(6000);

    console.log('Getting to the first post...');
    while (true) {
      try {
        element = await page.$x(`//a[contains(text(),'Previous')]`);
        await element[0].click();
        await page.waitForNavigation();

        await sleep(1000);
      } catch (e) {
        break;
      }
    }

    console.log('First post found on target');

    for (step = 0; step < reqno; step++) {
      try {
        element = await page.$x(`//button/span`);
        await element[0].click();
      } catch (e) {
        console.log(step + 'failed');
      }

      element = await page.$x(`//a[contains(text(),'Next')]`);
      await element[0].click();
      await page.waitForNavigation();

      await sleep(2000);

      console.log('Post ', step, ' liked');
    }

    await sleep(2000);

    element = await page.$x(`//button/span`);
    await element[0].click();
    await browser.close();

    return res.send({ status: 'Success' });
  })();
});

app.listen(port, () => {
  console.log('Server is up on port ' + port);
});
