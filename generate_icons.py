from PIL import Image, ImageDraw, ImageFont
import os

def create_pwa_icon(size, output_path, is_maskable=False):
    # Background: dark mountain gradient
    img = Image.new('RGBA', (size, size), (15, 23, 42, 255))
    draw = ImageDraw.Draw(img)
    
    # Outer glow / circle
    center = size // 2
    radius = int(size * (0.42 if not is_maskable else 0.38))
    
    # Base circle
    draw.ellipse(
        [center - radius, center - radius, center + radius, center + radius],
        fill=(16, 185, 129, 30),
        outline=(16, 185, 129, 220),
        width=max(2, size // 64)
    )
    
    # Mountain Peak 1 (Back mountain)
    peak1 = [
        (center - int(size * 0.28), center + int(size * 0.22)),
        (center - int(size * 0.08), center - int(size * 0.16)),
        (center + int(size * 0.16), center + int(size * 0.22))
    ]
    draw.polygon(peak1, fill=(5, 150, 105, 255))
    
    # Mountain Peak 2 (Front mountain)
    peak2 = [
        (center - int(size * 0.12), center + int(size * 0.24)),
        (center + int(size * 0.08), center - int(size * 0.22)),
        (center + int(size * 0.30), center + int(size * 0.24))
    ]
    draw.polygon(peak2, fill=(16, 185, 129, 255))
    
    # Snow cap on Peak 2
    snow2 = [
        (center + int(size * 0.04), center - int(size * 0.14)),
        (center + int(size * 0.08), center - int(size * 0.22)),
        (center + int(size * 0.13), center - int(size * 0.14))
    ]
    draw.polygon(snow2, fill=(240, 253, 250, 255))
    
    # Emergency Radar Pulse Rings
    for r_offset in [0.28, 0.34]:
        r = int(size * r_offset)
        draw.arc(
            [center - r, center - r, center + r, center + r],
            start=200,
            end=340,
            fill=(56, 189, 248, 200),
            width=max(2, size // 96)
        )
        
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    img.save(output_path, 'PNG')
    print(f"Generated {output_path} ({size}x{size})")

create_pwa_icon(192, 'assets/icons/icon-192.png', False)
create_pwa_icon(512, 'assets/icons/icon-512.png', False)
create_pwa_icon(192, 'assets/icons/icon-maskable-192.png', True)
create_pwa_icon(512, 'assets/icons/icon-maskable-512.png', True)
