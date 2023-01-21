# Requirements

* Node (version 16 or later). Recommend using [nvm](https://github.com/nvm-sh/nvm)
* Google chrome
* US Visa Slots [Chrome extension](https://chrome.google.com/webstore/detail/check-us-visa-slots/beepaenfejnphdgnkmccjcfiieihhogl)

# Chrome setup
Puppeteer typically launches a fresh browser session (no user data, etc). This makes it difficult to automate against Extensions. Instead, we are going to attach puppeteer to an existing browser session we need to set up, with the extension installed and configured (with your unique ACCESS CODE).

1. Create a local user dir with which to launch Chrome eg. `mkdir ~/myUser/userDataDir`
2. Replace the dir referenced by the `run.sh` script.
3. Execute the script `sh run.sh`
4. In the browser window that is launched, install the CheckVisaSlots extension, and enter your unique access code.
5. If you close and relaunch chrome using the `run.sh` script, you should verify the extension is installed, and your access code has persisted.

# Discord bot configuration

1. Create a discord server.
2. Create a bot for the server https://www.alphr.com/add-bots-discord-server/
3. Add the bot token to the `check.js` script where annotated.
4. Create a discord channel, adding the channel ID to the `check.js` script where annotated.

# Installing

1. Run `npm install`

# Running the script

1. First launch an instance of chrome with remote debugging enabled, using the user data dir created above: `sh run.sh`
2. Rename `check.txt` to `check.js` (Gmail doesn't allow me to send .js extensions).
3. In a separate window, launch the puppeteer script with `node check.js`	

