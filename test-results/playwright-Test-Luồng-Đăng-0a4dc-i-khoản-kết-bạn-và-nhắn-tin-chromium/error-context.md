# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: playwright.test.ts >> Test Luồng Đăng ký và Chat của Harry & Hermione >> Tạo tài khoản, kết bạn và nhắn tin
- Location: playwright.test.ts:8:7

# Error details

```
Test timeout of 30000ms exceeded.
```

# Page snapshot

```yaml
- generic [ref=e14]:
  - button "Quay lại" [ref=e16] [cursor=pointer]
  - generic [ref=e19]:
    - generic [ref=e24]: Tạo tài khoản mới!
    - generic [ref=e25]: Chỉ vài bước đơn giản để bắt đầu.
  - generic [ref=e26]:
    - generic [ref=e27]:
      - generic [ref=e28]: Tên đăng nhập
      - textbox "Tên đăng nhập" [ref=e35]: harry_potter
    - generic [ref=e36]:
      - generic [ref=e37]: Email
      - textbox "example@gmail.com" [ref=e44]: harry_potter2@gmail.com
    - generic [ref=e45]:
      - generic [ref=e46]: Mật khẩu
      - generic [ref=e48]:
        - textbox "Mật khẩu" [ref=e54]: Harry123@
        - button "Hiện mật khẩu" [ref=e56] [cursor=pointer]
    - generic [ref=e63]:
      - generic [ref=e64]: Xác nhận mật khẩu
      - generic [ref=e66]:
        - textbox "Xác nhận mật khẩu" [ref=e72]: Harry123@
        - button "Hiện mật khẩu" [ref=e74] [cursor=pointer]
    - generic [ref=e81]:
      - checkbox "Tôi đồng ý với Điều khoản & Chính sách bảo mật." [ref=e82] [cursor=pointer]
      - generic [ref=e87]: Bạn cần đồng ý Điều khoản & Chính sách bảo mật.
    - button "Tạo tài khoản" [active] [ref=e89] [cursor=pointer]
  - generic [ref=e92]:
    - generic [ref=e93]: Đã có tài khoản?
    - generic [ref=e94] [cursor=pointer]: Đăng nhập
```