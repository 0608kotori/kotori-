"""Prepare clean, transparent member turntable frames from verified sheets."""

from __future__ import annotations

from collections import deque
from dataclasses import dataclass
from pathlib import Path
from statistics import median

from PIL import Image, ImageEnhance, ImageFilter


ROOT = Path(__file__).resolve().parents[1]
SOURCE_DIR = ROOT / "public" / "images" / "members"
OUTPUT_DIR = SOURCE_DIR / "frames"
FRAME_SIZE = (720, 900)


@dataclass(frozen=True)
class SheetConfig:
    source: str
    output: str
    columns: int
    rows: int
    order: tuple[int, ...]
    top: int = 0
    bottom: int | None = None


CONFIGS = (
    SheetConfig(
        source="luo-tianbiao-sheet.jpg",
        output="luo-tianbiao",
        columns=4,
        rows=2,
        order=(0, 4, 1, 6, 2, 7, 3, 5),
    ),
    SheetConfig(
        source="he-xin-sheet.jpg",
        output="he-xin",
        columns=4,
        rows=2,
        order=(0, 4, 1, 6, 2, 7, 3, 5),
    ),
    SheetConfig(
        source="chen-jiangluan-sheet.jpg",
        output="chen-jiangluan",
        columns=8,
        rows=1,
        order=(0, 1, 2, 3, 4, 5, 6, 7),
        top=104,
        bottom=518,
    ),
)


def color_distance(first: tuple[int, int, int], second: tuple[int, int, int]) -> int:
    return sum((first[index] - second[index]) ** 2 for index in range(3))


def estimate_background(image: Image.Image) -> tuple[int, int, int]:
    rgb = image.convert("RGB")
    width, height = rgb.size
    samples: list[tuple[int, int, int]] = []
    step_x = max(1, width // 60)
    step_y = max(1, height // 60)

    for x in range(0, width, step_x):
        samples.extend((rgb.getpixel((x, 0)), rgb.getpixel((x, height - 1))))
    for y in range(0, height, step_y):
        samples.extend((rgb.getpixel((0, y)), rgb.getpixel((width - 1, y))))

    return tuple(int(median(channel)) for channel in zip(*samples, strict=True))


def remove_connected_background(image: Image.Image) -> Image.Image:
    rgba = image.convert("RGBA")
    rgb = rgba.convert("RGB")
    width, height = rgba.size
    background = estimate_background(image)
    threshold = 52**2
    visited = bytearray(width * height)
    queue: deque[tuple[int, int]] = deque()

    def enqueue(x: int, y: int) -> None:
        index = y * width + x
        if visited[index]:
            return
        if color_distance(rgb.getpixel((x, y)), background) > threshold:
            return
        visited[index] = 1
        queue.append((x, y))

    for x in range(width):
        enqueue(x, 0)
        enqueue(x, height - 1)
    for y in range(height):
        enqueue(0, y)
        enqueue(width - 1, y)

    while queue:
        x, y = queue.popleft()
        if x > 0:
            enqueue(x - 1, y)
        if x + 1 < width:
            enqueue(x + 1, y)
        if y > 0:
            enqueue(x, y - 1)
        if y + 1 < height:
            enqueue(x, y + 1)

    alpha = Image.new("L", (width, height), 255)
    alpha_pixels = alpha.load()
    for y in range(height):
        for x in range(width):
            if visited[y * width + x]:
                alpha_pixels[x, y] = 0

    alpha = alpha.filter(ImageFilter.GaussianBlur(0.55))
    rgba.putalpha(alpha)
    return rgba


def keep_primary_subject(image: Image.Image) -> Image.Image:
    alpha = image.getchannel("A")
    width, height = alpha.size
    pixels = alpha.load()
    visited = bytearray(width * height)
    components: list[list[tuple[int, int]]] = []

    for start_y in range(height):
        for start_x in range(width):
            start_index = start_y * width + start_x
            if visited[start_index] or pixels[start_x, start_y] < 96:
                continue

            component: list[tuple[int, int]] = []
            queue: deque[tuple[int, int]] = deque([(start_x, start_y)])
            visited[start_index] = 1
            while queue:
                x, y = queue.popleft()
                component.append((x, y))
                for next_x, next_y in ((x - 1, y), (x + 1, y), (x, y - 1), (x, y + 1)):
                    if not (0 <= next_x < width and 0 <= next_y < height):
                        continue
                    index = next_y * width + next_x
                    if visited[index] or pixels[next_x, next_y] < 96:
                        continue
                    visited[index] = 1
                    queue.append((next_x, next_y))
            components.append(component)

    if not components:
        return image

    primary = max(components, key=len)
    keep = set(primary)
    cleaned_alpha = Image.new("L", (width, height), 0)
    cleaned_pixels = cleaned_alpha.load()
    original_pixels = alpha.load()
    for x, y in keep:
        cleaned_pixels[x, y] = original_pixels[x, y]

    cleaned_alpha = cleaned_alpha.filter(ImageFilter.GaussianBlur(0.45))
    image.putalpha(cleaned_alpha)
    return image


def finish_frame(image: Image.Image) -> Image.Image:
    alpha_bbox = image.getchannel("A").getbbox()
    if alpha_bbox is None:
        raise ValueError("No visible subject found after background cleanup")

    subject = image.crop(alpha_bbox)
    subject = ImageEnhance.Contrast(subject).enhance(1.025)
    subject = ImageEnhance.Sharpness(subject).enhance(1.35)
    subject.thumbnail((590, 790), Image.Resampling.LANCZOS)
    subject = subject.filter(ImageFilter.UnsharpMask(radius=1.0, percent=90, threshold=2))

    canvas = Image.new("RGBA", FRAME_SIZE, (0, 0, 0, 0))
    x = (FRAME_SIZE[0] - subject.width) // 2
    y = FRAME_SIZE[1] - subject.height - 54
    canvas.alpha_composite(subject, (x, y))
    return canvas


def split_sheet(config: SheetConfig) -> None:
    source = Image.open(SOURCE_DIR / config.source).convert("RGB")
    output = OUTPUT_DIR / config.output
    output.mkdir(parents=True, exist_ok=True)
    bottom = config.bottom if config.bottom is not None else source.height
    working_height = bottom - config.top
    cell_width = source.width / config.columns
    cell_height = working_height / config.rows

    for output_index, cell_index in enumerate(config.order, start=1):
        column = cell_index % config.columns
        row = cell_index // config.columns
        left = round(column * cell_width)
        right = round((column + 1) * cell_width)
        top = round(config.top + row * cell_height)
        lower = round(config.top + (row + 1) * cell_height)
        crop = source.crop((left, top, right, lower))
        cleaned = remove_connected_background(crop)
        cleaned = keep_primary_subject(cleaned)
        frame = finish_frame(cleaned)
        frame.save(output / f"{output_index:02d}.webp", "WEBP", quality=94, method=6)


def main() -> None:
    for config in CONFIGS:
        split_sheet(config)


if __name__ == "__main__":
    main()
