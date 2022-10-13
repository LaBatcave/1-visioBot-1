import puppeteer from 'puppeteer';

const _delay = async (seconds: number) => {
  await new Promise((r) => setTimeout(r, seconds * 1000));
};

export default async () => {
  const browser = await puppeteer.launch({
    headless: false,
    args: ['--use-fake-ui-for-media-stream'],
  });

  //Logging Google
  const page = await browser.newPage();
  await page.goto('https://accounts.google.com/ ');

  await page.type('#identifierId', 'XXXXXXXX@gmail.com', { delay: 100 });
  await page.click('#identifierNext');
  await page.waitForSelector('input[name="Passwd"]');
  await _delay(1);
  await page.type('input[name="Passwd"]', 'XXXXXXXXXXXXXX', { delay: 100 });
  await page.click('#passwordNext');
  await _delay(3);

  //Go to Meet
  await page.goto('https://meet.google.com/tei-wjje-bug');
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

  await _delay(100);

  await browser.close();
};
