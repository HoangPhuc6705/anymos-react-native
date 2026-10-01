import { test, expect } from '@playwright/test';

test.describe('Test Luồng Đăng ký và Chat của Harry & Hermione', () => {

  const harry = { email: 'harry_potter2@gmail.com', pwd: 'Harry123@', name: 'harry_potter' };
  const hermione = { email: 'hermione_granger2@gmail.com', pwd: 'Hermione123@', name: 'hermione_granger' };

  test('Tạo tài khoản, kết bạn và nhắn tin', async ({ browser }) => {
    // 1. Khởi tạo 2 trình duyệt riêng biệt
    const contextHarry = await browser.newContext();
    const contextHermione = await browser.newContext();

    const pageHarry = await contextHarry.newPage();
    const pageHermione = await contextHermione.newPage();

    // 2. Hàm tiện ích Đăng ký
    async function register(page, user) {
      await page.goto('http://localhost:8081/register');
      // Đợi trang register tải xong (nếu bị redirect thì quay lại)
      await page.waitForURL('**/register*');
      
      // Các ô nhập: Tên đăng nhập, Email, Mật khẩu, Xác nhận
      const inputs = page.locator('input');
      await inputs.nth(0).fill(user.name);
      await inputs.nth(1).fill(user.email);
      await inputs.nth(2).fill(user.pwd);
      await inputs.nth(3).fill(user.pwd);
      
      // Bấm nút Tạo tài khoản
      await page.locator('button', { hasText: /Tạo tài khoản/i }).click();
      
      // Chờ tự động đăng nhập và chuyển hướng vào friend-chat
      await page.waitForURL('**/friend-chat*');
    }

    // 3. Thực hiện đăng ký
    await register(pageHarry, harry);
    await register(pageHermione, hermione);

    // 4. Harry gửi lời mời kết bạn cho Hermione
    await pageHarry.getByRole('textbox').first().click();
    await pageHarry.waitForURL('**/friend-search*');
    
    // Chọn tab Tìm bạn mới
    await pageHarry.locator('text=Tìm bạn mới').click();
    // Nhập email Hermione
    await pageHarry.getByRole('textbox').fill(hermione.email);
    // Đợi kết quả API
    await pageHarry.waitForTimeout(2000);
    // Bấm Kết bạn
    await pageHarry.locator('button', { hasText: /Kết bạn/i }).click();
    // Đợi trạng thái đổi thành Đã gửi
    await pageHarry.waitForTimeout(1000);

    // 5. Hermione chấp nhận lời mời kết bạn
    await pageHermione.getByRole('textbox').first().click();
    await pageHermione.waitForURL('**/friend-search*');
    
    await pageHermione.locator('text=Tìm bạn mới').click();
    await pageHermione.getByRole('textbox').fill(harry.email);
    await pageHermione.waitForTimeout(2000);
    // Bấm Chấp nhận
    await pageHermione.locator('button', { hasText: /Chấp nhận/i }).click();
    await pageHermione.waitForTimeout(1000);

    // 6. Hermione vào nhắn tin cho Harry (qua tab Friends)
    await pageHermione.locator('[aria-label="Go back"], [aria-label="Quay l"]').first().click();
    await pageHermione.waitForURL('**/friend-chat*');
    
    await pageHermione.getByRole('tab').nth(1).click();
    await pageHermione.waitForURL('**/friends*');
    await pageHermione.getByRole('textbox').first().fill(harry.name);
    await pageHermione.locator('div[role="button"], button').filter({ hasText: harry.name }).first().click();
    await pageHermione.waitForURL('**/chatting*');
    await pageHermione.waitForTimeout(2000); // Đợi resolve conversationId

    // Hermione gửi tin nhắn đầu tiên
    const msg1 = "Harry, cậu đã làm bài tập Độc dược chưa?";
    await pageHermione.getByRole('textbox').last().fill(msg1);
    await pageHermione.locator('[aria-label="Send message"]').click();

    // 7. Harry vào nhận tin nhắn và phản hồi
    await pageHarry.locator('[aria-label="Go back"], [aria-label="Quay l"]').first().click();
    await pageHarry.waitForURL('**/friend-chat*');
    
    await pageHarry.getByRole('tab').nth(1).click();
    await pageHarry.waitForURL('**/friends*');
    await pageHarry.getByRole('textbox').first().fill(hermione.name);
    await pageHarry.locator('div[role="button"], button').filter({ hasText: hermione.name }).first().click();
    await pageHarry.waitForURL('**/chatting*');
    await pageHarry.waitForTimeout(2000);

    // Kì vọng Harry thấy tin nhắn của Hermione
    await expect(pageHarry.locator(`text=${msg1}`).first()).toBeVisible({ timeout: 10000 });

    const msg2 = "Chưa, tớ bận tập Quidditch mất rồi!";
    await pageHarry.getByRole('textbox').last().fill(msg2);
    await pageHarry.locator('[aria-label="Send message"]').click();

    // Kì vọng Hermione thấy tin nhắn của Harry
    await expect(pageHermione.locator(`text=${msg2}`).first()).toBeVisible({ timeout: 10000 });

    // Đóng browser
    await contextHarry.close();
    await contextHermione.close();
  });
});
