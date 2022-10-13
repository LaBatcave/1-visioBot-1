import puppeteer from 'puppeteer';

export default async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto('https://example.com');
  await page.screenshot({ path: 'example.png' });

  await new Promise((r) => setTimeout(r, 1000000));

  await browser.close();
};
