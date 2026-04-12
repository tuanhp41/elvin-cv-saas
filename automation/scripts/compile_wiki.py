#!/usr/bin/env python3
"""
compile_wiki.py — LLM Wiki Compiler
CV SaaS Project | automation/scripts/

Gộp tất cả file trong wiki/raw/ thành 1 file wiki/compiled/knowledge.md
để AI đọc làm context mà không phải mở nhiều file.

Usage:
    python automation/scripts/compile_wiki.py

    # Watch mode (chạy khi file thay đổi):
    python automation/scripts/compile_wiki.py --watch

Output: wiki/compiled/knowledge.md
"""

import os
import sys
import time
import argparse
from pathlib import Path
from datetime import datetime

# Project root = 2 levels up từ script này (automation/scripts/ → root)
PROJECT_ROOT = Path(__file__).parent.parent.parent
RAW_DIR = PROJECT_ROOT / "wiki" / "raw"
COMPILED_DIR = PROJECT_ROOT / "wiki" / "compiled"
OUTPUT_FILE = COMPILED_DIR / "knowledge.md"

# Thứ tự file (ưu tiên file quan trọng đọc trước)
FILE_ORDER = [
    "nextjs.md",
    "supabase.md",
    "gemma-api.md",
    "payos.md",
    "cv-patterns-vn.md",
]


def compile_wiki(verbose=True):
    """Gộp tất cả file raw/ thành knowledge.md"""

    # Tạo thư mục compiled/ nếu chưa có
    COMPILED_DIR.mkdir(parents=True, exist_ok=True)

    if not RAW_DIR.exists():
        print(f"ERROR: wiki/raw/ không tồn tại tại {RAW_DIR}")
        return False

    # Lấy danh sách files theo thứ tự ưu tiên + các file còn lại
    raw_files = list(RAW_DIR.glob("*.md"))
    ordered = []

    # File theo thứ tự ưu tiên trước
    for filename in FILE_ORDER:
        path = RAW_DIR / filename
        if path.exists():
            ordered.append(path)

    # Thêm file còn lại (chưa có trong FILE_ORDER)
    for path in sorted(raw_files):
        if path not in ordered:
            ordered.append(path)

    if not ordered:
        print("WARNING: Không có file .md nào trong wiki/raw/")
        return False

    # Build header
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    header = f"""# CV SaaS — LLM Knowledge Base (compiled)
# Tự động compile từ wiki/raw/ — KHÔNG edit file này trực tiếp
# Sửa ở: wiki/raw/[filename].md → chạy lại compile_wiki.py
# Last compiled: {timestamp}
# Source files: {len(ordered)} files

---

## HOW TO USE THIS FILE
Đây là knowledge base tổng hợp cho tất cả AI coders làm việc với dự án CV SaaS.
Khi được hỏi về stack, patterns, hoặc business logic của dự án này,
câu trả lời nằm trong file này — không cần search internet.

Stack (FROZEN): Next.js 14 | Supabase | Gemma 4 API | PayOS | Vercel | Tailwind + shadcn/ui
Server: Ubuntu 24.04 | Tailscale 100.67.85.6 | Ollama (gemma4:latest) | n8n Docker
IDE: Antigravity trên Windows | Code qua L:\\ (Samba mount)

---

"""

    # Gộp content
    sections = []
    for filepath in ordered:
        with open(filepath, "r", encoding="utf-8") as f:
            content = f.read().strip()

        section = f"""{'='*60}
## SOURCE: wiki/raw/{filepath.name}
{'='*60}

{content}

"""
        sections.append(section)

    # Write output
    full_content = header + "\n".join(sections)

    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
        f.write(full_content)

    total_size = OUTPUT_FILE.stat().st_size
    if verbose:
        print(f"✅ Compiled {len(ordered)} files → wiki/compiled/knowledge.md")
        print(f"   Files: {', '.join(f.name for f in ordered)}")
        print(f"   Size: {total_size:,} bytes ({total_size//1024} KB)")
        print(f"   Output: {OUTPUT_FILE}")

    return True


def watch_mode():
    """Theo dõi thay đổi file và tự động recompile"""
    print(f"👀 Watch mode — theo dõi {RAW_DIR}")
    print("   Ctrl+C để dừng\n")

    # Lấy timestamps lần đầu
    def get_mtimes():
        if not RAW_DIR.exists():
            return {}
        return {
            f: f.stat().st_mtime
            for f in RAW_DIR.glob("*.md")
        }

    last_mtimes = get_mtimes()
    compile_wiki(verbose=True)

    while True:
        time.sleep(2)
        current_mtimes = get_mtimes()

        if current_mtimes != last_mtimes:
            changed = [
                f.name for f in current_mtimes
                if current_mtimes.get(f) != last_mtimes.get(f)
            ]
            print(f"\n🔄 Detected changes: {', '.join(changed)}")
            compile_wiki(verbose=True)
            last_mtimes = current_mtimes


def main():
    parser = argparse.ArgumentParser(
        description="Compile wiki/raw/*.md → wiki/compiled/knowledge.md"
    )
    parser.add_argument(
        "--watch", "-w",
        action="store_true",
        help="Watch mode: tự động recompile khi file thay đổi"
    )
    parser.add_argument(
        "--check",
        action="store_true",
        help="Chỉ kiểm tra, không compile"
    )
    args = parser.parse_args()

    if args.check:
        files = list(RAW_DIR.glob("*.md")) if RAW_DIR.exists() else []
        print(f"📁 wiki/raw/: {len(files)} files")
        for f in sorted(files):
            size = f.stat().st_size
            print(f"   - {f.name} ({size:,} bytes)")
        if OUTPUT_FILE.exists():
            size = OUTPUT_FILE.stat().st_size
            mtime = datetime.fromtimestamp(OUTPUT_FILE.stat().st_mtime)
            print(f"\n📄 wiki/compiled/knowledge.md:")
            print(f"   Size: {size:,} bytes | Last compiled: {mtime}")
        else:
            print("\n⚠️  wiki/compiled/knowledge.md chưa tồn tại — chạy compile_wiki.py")
        return

    if args.watch:
        try:
            watch_mode()
        except KeyboardInterrupt:
            print("\n\n👋 Watch mode stopped.")
    else:
        success = compile_wiki(verbose=True)
        sys.exit(0 if success else 1)


if __name__ == "__main__":
    main()
