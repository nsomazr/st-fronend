#!/usr/bin/env python3
"""Generate trimmed logo assets from public/smart.pdf."""
from __future__ import annotations

import subprocess
import sys
from pathlib import Path

from PIL import Image

PUBLIC_DIR = Path(__file__).resolve().parent.parent / "public"
PDF_PATH = PUBLIC_DIR / "smart.pdf"
TEMP_PATH = PUBLIC_DIR / "logo-temp.png"

OUTPUTS = {
    "logo.png": 256,
    "favicon.png": 64,
    "apple-touch-icon.png": 180,
    "logo-email.png": 200,
}

WHITE_THRESHOLD = 235
PADDING_RATIO = 0.04


def pdf_to_png(pdf_path: Path, output_path: Path, dpi: int = 300) -> None:
    subprocess.run(
        [
            "pdftoppm",
            "-png",
            "-r",
            str(dpi),
            "-singlefile",
            str(pdf_path),
            str(output_path.with_suffix("")),
        ],
        check=True,
    )


def trim_whitespace(image: Image.Image) -> Image.Image:
    rgba = image.convert("RGBA")
    pixels = rgba.load()
    width, height = rgba.size

    for y in range(height):
        for x in range(width):
            r, g, b, a = pixels[x, y]
            if r >= WHITE_THRESHOLD and g >= WHITE_THRESHOLD and b >= WHITE_THRESHOLD:
                pixels[x, y] = (255, 255, 255, 0)

    bbox = rgba.getbbox()
    if not bbox:
        return image

    cropped = rgba.crop(bbox)

    pad = max(4, int(max(cropped.size) * PADDING_RATIO))
    padded = Image.new("RGBA", (cropped.width + pad * 2, cropped.height + pad * 2), (0, 0, 0, 0))
    padded.paste(cropped, (pad, pad), cropped)
    return padded


def save_resized(image: Image.Image, path: Path, size: int) -> None:
    resized = image.copy()
    resized.thumbnail((size, size), Image.Resampling.LANCZOS)
    canvas = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    offset = ((size - resized.width) // 2, (size - resized.height) // 2)
    canvas.paste(resized, offset, resized)
    canvas.save(path, "PNG", optimize=True)


def main() -> int:
    if not PDF_PATH.exists():
        print(f"Error: {PDF_PATH} not found", file=sys.stderr)
        return 1

    if not shutil_which("pdftoppm"):
        print("Error: pdftoppm not found. Install poppler.", file=sys.stderr)
        return 1

    print("Converting PDF to PNG...")
    pdf_to_png(PDF_PATH, TEMP_PATH)

    print("Trimming white borders...")
    source = Image.open(TEMP_PATH)
    trimmed = trim_whitespace(source)

    print("Writing logo assets...")
    for filename, size in OUTPUTS.items():
        save_resized(trimmed, PUBLIC_DIR / filename, size)
        print(f"  {filename} ({size}px)")

    TEMP_PATH.unlink(missing_ok=True)
    print("Done.")
    return 0


def shutil_which(cmd: str) -> bool:
    from shutil import which

    return which(cmd) is not None


if __name__ == "__main__":
    raise SystemExit(main())
