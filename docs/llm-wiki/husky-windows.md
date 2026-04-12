# Husky trên Windows — UNC Path / Network Drive

> Verified: 2026-04-12 | Windows 11 | Husky v9 | Network drive L:\

---

## Triệu chứng
```
error: could not read Username for 'https://github.com'
husky - pre-commit hook exited with code 1
```
Hoặc Husky hook không chạy / báo lỗi path khi commit từ `L:\` drive.

## Nguyên nhân gốc
Husky không hoạt động đúng trên **UNC paths** (`\\server\share`) và **network-mapped drives** (`L:\`) trên Windows do Git shell restrictions.

## Giải pháp đã verify ✅

### Option 1: Bypass Husky khi commit từ Windows
```powershell
$env:HUSKY = "0"
git commit -m "message"
```
Hoặc thêm vào PowerShell profile:
```powershell
# Trong $PROFILE
$env:HUSKY = "0"    # disable Husky permanently trên Windows
```

### Option 2: Commit từ Linux server (recommended)
```bash
# SSH vào server, commit từ đó — Husky chạy đúng
ssh ubuntu-server "cd /home/elvin/projects/cv-saas && git add . && git commit -m 'message'"
```

## Quy tắc team

- **Windows**: Dùng `HUSKY=0` khi commit
- **Linux server**: Husky chạy đầy đủ — commit quan trọng từ đây
- CI/CD: Husky chạy đầy đủ (không bị ảnh hưởng)

## Tham khảo
- [Husky — Windows UNC paths](https://typicode.github.io/husky/troubleshoot.html)
