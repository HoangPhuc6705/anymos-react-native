import { chromium } from '@playwright/test';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('BROWSER CONSOLE:', msg.text()));
  page.on('pageerror', err => console.log('BROWSER ERROR:', err.message));

  await page.goto('http://localhost:8081/');
  await page.waitForTimeout(2000);
  
  await page.fill('input[type="email"]', 'phuc@gmail.com');
  await page.fill('input[type="password"]', 'phuc1234');
  await page.locator('button', { hasText: /Dang|Đăng/i }).first().click();

  await page.waitForTimeout(5000); // Wait for request to fail
  await browser.close();
})();
