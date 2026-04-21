import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', error => console.log('PAGE ERROR:', error.message));

  console.log('Navigating...');
  await page.goto('http://localhost:3005', { waitUntil: 'networkidle0' });
  console.log('Done.');
  await browser.close();
})();
