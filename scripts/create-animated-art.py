from pathlib import Path
from PIL import Image

SRC = Path("public/icons")
OUT = SRC / "animated"
OUT.mkdir(parents=True, exist_ok=True)

for source in sorted(SRC.glob("*.png")):
    image = Image.open(source).convert("RGBA")
    alpha = image.getchannel("A")
    bbox = alpha.getbbox()
    if not bbox:
        continue

    # Remove the large transparent margin generated around the illustration.
    left, top, right, bottom = bbox
    pad = max(18, int(max(right - left, bottom - top) * 0.08))
    left = max(0, left - pad)
    top = max(0, top - pad)
    right = min(image.width, right + pad)
    bottom = min(image.height, bottom + pad)
    cropped = image.crop((left, top, right, bottom))

    side = max(cropped.width, cropped.height)
    canvas = Image.new("RGBA", (side, side), (0, 0, 0, 0))
    canvas.alpha_composite(cropped, ((side - cropped.width) // 2, (side - cropped.height) // 2))
    canvas = canvas.resize((768, 768), Image.Resampling.LANCZOS)

    frames = []
    for scale, angle in [(0.96, -1.2), (0.99, -0.4), (1.02, 0.6), (1.04, 1.2), (1.02, 0.6), (0.99, -0.4)]:
        size = int(768 * scale)
        frame = canvas.resize((size, size), Image.Resampling.LANCZOS).rotate(angle, resample=Image.Resampling.BICUBIC, expand=True)
        frame.thumbnail((744, 744), Image.Resampling.LANCZOS)
        stage = Image.new("RGBA", (768, 768), (0, 0, 0, 0))
        stage.alpha_composite(frame, ((768 - frame.width) // 2, (768 - frame.height) // 2))
        frames.append(stage.convert("P", palette=Image.Palette.ADAPTIVE, colors=255))

    output = OUT / f"{source.stem}.gif"
    frames[0].save(output, save_all=True, append_images=frames[1:], duration=150, loop=0, disposal=2, transparency=0, optimize=True)
    print(output)
