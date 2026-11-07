from pathlib import Path
from PIL import Image

SRC = Path("public/icons")
OUT = SRC / "cropped"
OUT.mkdir(parents=True, exist_ok=True)

for source in sorted(SRC.glob("*.png")):
    image = Image.open(source).convert("RGBA")
    bbox = image.getchannel("A").getbbox()
    if not bbox:
        continue
    left, top, right, bottom = bbox
    pad = max(12, int(max(right - left, bottom - top) * 0.05))
    cropped = image.crop((max(0, left - pad), max(0, top - pad), min(image.width, right + pad), min(image.height, bottom + pad)))
    side = max(cropped.width, cropped.height)
    canvas = Image.new("RGBA", (side, side), (0, 0, 0, 0))
    canvas.alpha_composite(cropped, ((side - cropped.width) // 2, (side - cropped.height) // 2))
    canvas.resize((768, 768), Image.Resampling.LANCZOS).save(OUT / source.name, optimize=True)
    print(OUT / source.name)
