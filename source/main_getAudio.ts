import { launch, getStream } from 'puppeteer-stream';
import fs from 'fs';

const file = fs.createWriteStream(__dirname + '/test.webm');

const _delay = async (seconds: number) => {
  await new Promise((r) => setTimeout(r, seconds * 1000));
};

export default async (email: string, password: string, URLGmeet: string) => {
  const browser = await launch({
    headless: false,
  });
  const context = browser.defaultBrowserContext();
  await context.overridePermissions(URLGmeet, ['camera', 'microphone']);

  //Logging Google
  const page = await browser.newPage();
  await page.goto('https://accounts.google.com/ ');

  await page.type('#identifierId', email, { delay: 100 });
  await page.click('#identifierNext');
  await page.waitForSelector('input[name="Passwd"]');
  await _delay(1);
  await page.type('input[name="Passwd"]', password, { delay: 100 });
  await page.click('#passwordNext');
  await _delay(3);

  //Go to Meet
  await page.goto(URLGmeet);
  await _delay(1);
  await page.keyboard.down('Control');
  await page.keyboard.press('d');
  await _delay(1);
  await page.keyboard.press('e');
  await _delay(1);
  await page.keyboard.up('Control');
  await _delay(1);

  const buttons = await page.$$('button');
  await Promise.all(
    buttons.map(async (button) => {
      await page.evaluate((el) => {
        if (
          el.textContent == 'Participer' ||
          el.textContent == 'Participer à la réunion'
        ) {
          el.click();
        }
      }, button);
    })
  );

  const stream = await getStream(page, { audio: true, video: true });
  console.log('recording');

  stream.pipe(file);
  setTimeout(async () => {
    await stream.destroy();
    file.close();
    console.log('finished');
  }, 1000 * 10);

  await _delay(100);

  await browser.close();
};
