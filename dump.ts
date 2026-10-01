import { chromium } from '@playwright/test';
import * as fs from 'fs';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('http://localhost:8081/');
  await page.waitForTimeout(5000); // Wait for redirect and render
  const html = await page.content();
  fs.writeFileSync('dump.html', html);
  console.log('Dumped HTML to dump.html');
  await browser.close();
})();
