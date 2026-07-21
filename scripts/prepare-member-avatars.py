"""Create consistent head-and-shoulders avatar crops from verified member frames."""

from __future__ import annotations

from dataclasses import dataclass
from pathlib import Path

from PIL import Image, ImageFilter


ROOT = Path(__file__).resolve().parents[1]
MEMBER_IMAGE_DIR = ROOT / "public" / "images" / "members"
FRAME_DIR = MEMBER_IMAGE_DIR / "frames"
AVATAR_DIR = MEMBER_IMAGE_DIR / "avatars"
AVATAR_SIZE = 384
CONTENT_SIZE = 336


@dataclass(frozen=True)
class AvatarConfig:
    slug: str
    visible_height_ratio: float


CONFIGS = (
    AvatarConfig("luo-tianbiao", 0.64),
    AvatarConfig("he-xin", 0.60),
    AvatarConfig("chen-jiangluan", 0.42),
)


def create_avatar(config: AvatarConfig) -> None:
    source = Image.open(FRAME_DIR / config.slug / "01.webp").convert("RGBA")
    subject_bounds = source.getchannel("A").getbbox()
    if subject_bounds is None:
        raise ValueError(f"No visible subject found for {config.slug}")

    left, top, right, bottom = subject_bounds
    visible_bottom = top + round((bottom - top) * config.visible_height_ratio)
    portrait = source.crop((left, top, right, visible_bottom))
    portrait.thumbnail((CONTENT_SIZE, CONTENT_SIZE), Image.Resampling.LANCZOS)
    portrait = portrait.filter(
        ImageFilter.UnsharpMask(radius=0.8, percent=75, threshold=2),
    )

    canvas = Image.new("RGBA", (AVATAR_SIZE, AVATAR_SIZE), (0, 0, 0, 0))
    x = (AVATAR_SIZE - portrait.width) // 2
    y = max(18, (AVATAR_SIZE - portrait.height) // 2)
    canvas.alpha_composite(portrait, (x, y))

    AVATAR_DIR.mkdir(parents=True, exist_ok=True)
    canvas.save(
        AVATAR_DIR / f"{config.slug}.png",
        "PNG",
        optimize=True,
    )


def main() -> None:
    for config in CONFIGS:
        create_avatar(config)


if __name__ == "__main__":
    main()
