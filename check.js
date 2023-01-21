require('dotenv').config();

const puppeteer = require('puppeteer');
const {Client , Intents} = require('discord.js');

/** TODO replace with an existing directory for screenshots **/
const SCREENSHOT_DIR = '/home/bwu/other/visa_slots/screenshots';

(async () => {
  const client = await prepareDiscordBot();
  /** TODO: Replace with your own Discord channel id **/
  const channel = client.channels.cache.get('961464495815946284');
  await checkVisaSlots(channel);
})();

async function checkVisaSlots(discordBot) {
  const browserURL = 'http://127.0.0.1:9222';
  let browser, page;
  try {
    browser = await puppeteer.connect({browserURL});
    page = await browser.newPage();

    console.log('Opening extension...');
    await page.goto('chrome-extension://beepaenfejnphdgnkmccjcfiieihhogl/popup.html');

    // Wait for slots to load
    await page.waitForSelector('.slots-info table');
  }
  catch (err) {
    console.log('Failed opening the page.');
    console.error(err);
  }

  while (true) {
    let totalSlots = 0;
    let consulatesWithSlots = [];
    try {
      let rowEls = await page.$$('.slots-info tr');
      rowEls = rowEls.slice(1);
      for (const rowEl of rowEls) {
        const cols = await rowEl.$$('td');
        const consulateEl = cols[0]; //await rowEl.$('td:nth-child(1)');
        const slotEl = cols[1]; //await rowEl.$('td:nth-child(2)');

        const numSlotsText = await page.evaluate(el => el.textContent, slotEl);
        const consulate = await page.evaluate(el => el.textContent, consulateEl);
        const numSlots = parseInt(numSlotsText);
        totalSlots += (isNaN(numSlots)) ? 0 : numSlots;
        if (!isNaN(numSlots) && numSlots > 0) {
          consulatesWithSlots.push(`${consulate}: ${numSlots}`);
        }
      }
    }
    catch (err) {
      console.log(`Failed to inspect slots at ${new Date()}`);
      console.error(err);
    }

    if (totalSlots > 0 ) {
      // Send a message
      await page.screenshot({
        path: `${SCREENSHOT_DIR}/screenshots_found_${new Date()}.png`,
        fullPage: true
      });
      await discordBot.send(`OMG @everyone! There are ${totalSlots} slots!\n${consulatesWithSlots.join(',')}`);
      console.log(`OMG! ${totalSlots} slots found at ${new Date()}`);
    }
    else {
      console.log(`No slots found at ${new Date()}`);
    }

    try {
      await page.waitForTimeout(4*60*1000);
      await page.click('a.retreive-slots');
      // Wait for reload
      await page.waitForTimeout(2000);
    }
    catch (err) {
      try {
      	await page.waitForSelector('.alert#server_msg', {timeout: 0});
      	console.log('No more quota');
      	discordBot.send('Hello I need more quota!');
      	await page.waitForTimeout(10*60*1000);
      	await page.reload({waitUntil: [
      	  'networkidle0',
      	  'domcontentloaded'
      	]});
      } catch (err) {
      	console.error(err);
      	console.log('Something else failed...');
      }
      console.log('Failed to refresh slots');
    }
  }
}

async function prepareDiscordBot() {
  const client = new Client({
    disableEveryone: false,
    intents: [Intents.FLAGS.GUILDS]
  });
  client.on('ready', () => {
      console.log(`Logged in as ${client.user.tag}!`);
  });
  /** TODO: Replace with your discord bot client ID **/
  await client.login('OTYxNDYyMjEwMjMwNjM2NTY0.Yk5Vdg.-NbfVjtKVUjeKCHzXr1nqS_KiTw');
  return client;
}
