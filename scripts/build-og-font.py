#!/usr/bin/env python3
"""生成分享卡片（opengraph-image）用的中文字体子集。

用法：
  python3 -I scripts/build-og-font.py /path/to/NotoSansCJKsc-Regular.otf

源字体必须是 SIL OFL 许可的 Noto Sans CJK SC（允许再分发与子集化）。
子集包含：ASCII、GB2312 一级常用字（3755 个）、content/ 与 src/ 下出现过的全部非 ASCII 字符。
新增内容后若分享图出现方块字，重新运行本脚本并提交 assets/fonts/ 下的产物。
依赖：fonttools（pyftsubset）。构建本身不依赖它，也不联网。
"""
import os
import subprocess
import sys
import tempfile

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "assets", "fonts", "NotoSansSC-og-subset.otf")

chars = {chr(c) for c in range(32, 127)}
for hi in range(0xB0, 0xD8):  # GB2312 一级汉字
    for lo in range(0xA1, 0xFF):
        try:
            chars.add(bytes([hi, lo]).decode("gb2312"))
        except UnicodeDecodeError:
            pass
for top in ("content", "src"):
    for base, _, files in os.walk(os.path.join(ROOT, top)):
        for name in files:
            try:
                with open(os.path.join(base, name), encoding="utf8") as f:
                    chars |= {c for c in f.read() if ord(c) > 127}
            except (UnicodeDecodeError, OSError):
                pass

with tempfile.NamedTemporaryFile("w", suffix=".txt", encoding="utf8", delete=False) as tmp:
    tmp.write("".join(sorted(chars)))
subprocess.run(
    [
        "pyftsubset", sys.argv[1], f"--text-file={tmp.name}", f"--output-file={OUT}",
        "--layout-features=", "--no-hinting", "--desubroutinize",
    ],
    check=True,
)
os.unlink(tmp.name)
print(f"{len(chars)} chars -> {OUT} ({os.path.getsize(OUT) // 1024} KB)")
