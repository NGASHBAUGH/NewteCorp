#!/usr/bin/env python3
"""
generate_bison_logo.py  v4 — Two-colour KFC-style graphic mark

The KFC logo works like this:
  - One flat colour fills the body/silhouette
  - A second flat colour is "carved into" the dark to show the
    lit face and the bright shoulder edge — giving mass and life

This bison follows the same recipe:
  DARK  #1E0C04  — the whole body silhouette
  AMBER #C8892A  — the lit front-of-face and the hump ridge

Bison faces LEFT.  Bust format: head + dominant hump, legs cropped.

Usage:   python generate_bison_logo.py
Outputs: assets/bison_logo.svg
         assets/bison_logo_nav.svg
"""

import os

DARK  = "#1E0C04"
AMBER = "#C8892A"
WHITE = "#F5EDE0"   # warm cream for eye iris

# ────────────────────────────────────────────────────────────────────────────
# Coordinate map (viewBox 0 0 200 210):
#
#   Hump peak    (104, 20)  ← highest solid mass
#   Horn tip     ( 54,  6)  ← just below hump, above head
#   Head crown   (  ·, 34)  ← clearly below hump
#   Horn base    ( 70, 48)
#   Back of head ( 90, 64)
#   Neck dip     ( 88, 88)  ← concave valley between head & hump
#   Eye          ( 24, 70)
#   Muzzle tip   (  6, 70)
#   Chin         ( 14,112)
#   Beard bottom ( 20,168)
#   Crop bottom  (  ·,192)
# ────────────────────────────────────────────────────────────────────────────

SVG = """\
<svg xmlns="http://www.w3.org/2000/svg"
     viewBox="0 0 200 210"
     width="200" height="210"
     aria-label="Bison logo mark">

  <!-- ════════════════════════════════════════════════════════
       LAYER 1 — DARK SILHOUETTE
       One closed path, clockwise from hump peak.
       ════════════════════════════════════════════════════════ -->
  <path d="
    M 104  20
    C 126  10  154  26  172  58
    C 184  80  184 112  178 142
    L 178 192
    L  46 192
    C  34 190   22 174   18 158
    C  14 142   14 126   16 110
    C  14  94    6  80    6  70
    C   4  56   14  44   30  40
    C  42  34   56  32   70  46
    C  82  52   90  64   92  78
    C  94  88   92  94   88  88
    C  90  80   98  58  102  36
    C 103  28  104  22  104  20
    Z
  " fill="{DARK}"/>

  <!-- ════════════════════════════════════════════════════════
       LAYER 2 — AMBER: LIT FACE

       In the reference photos the front of the face catches
       the light — a warm zone covering the muzzle, forehead,
       and jaw.  This is the bison equivalent of the KFC
       Colonel's lit face carved out of the red silhouette.
       ════════════════════════════════════════════════════════ -->
  <path d="
    M  28  40
    C  18  42    8  54    8  68
    C   8  84   12 100   18 110
    C  24 116   34 116   40 110
    C  46 104   44  90   40  78
    C  38  68   38  54   32  44
    C  30  40   28  40   28  40
    Z
  " fill="{AMBER}"/>

  <!-- ════════════════════════════════════════════════════════
       LAYER 2 — AMBER: HUMP RIDGE

       The sunlit left slope of the hump — a bold tapered wedge.
       Thicker at the neck-dip base, tapering to the peak.
       ════════════════════════════════════════════════════════ -->
  <path d="
    M  88  88
    C  92  74   98  52  102  34
    C 103  26  104  20  104  20
    C 106  28  108  46  106  64
    C 104  78  100  86   88  88
    Z
  " fill="{AMBER}"/>

  <!-- ════════════════════════════════════════════════════════
       LAYER 2 — AMBER: HORN
       Bold crescent. Widest at the base, tapers to a point.
       Curves upward and slightly forward (left) from the head.
       ════════════════════════════════════════════════════════ -->
  <path d="
    M  64  50
    C  56  36   50  18   54   8
    C  56   2   64   2   68   8
    C  72  18   72  36   64  50
    Z
  " fill="{AMBER}"/>

  <!-- Horn leading-edge sheen -->
  <path d="M 65 48 C 58 32 52 14 55 6"
        stroke="rgba(255,215,100,0.5)"
        stroke-width="2"
        stroke-linecap="round"
        fill="none"/>

  <!-- ════════════════════════════════════════════════════════
       EYE — sits on the amber face zone
       White iris with dark pupil pops against the amber.
       ════════════════════════════════════════════════════════ -->
  <circle cx="24" cy="68" r="5.5" fill="{WHITE}"/>
  <circle cx="24" cy="68" r="2.8" fill="{DARK}"/>

</svg>
""".format(DARK=DARK, AMBER=AMBER, WHITE=WHITE)


def main():
    script_dir = os.path.dirname(os.path.abspath(__file__))
    assets_dir = os.path.join(script_dir, "assets")
    os.makedirs(assets_dir, exist_ok=True)

    full_path = os.path.join(assets_dir, "bison_logo.svg")
    with open(full_path, "w", encoding="utf-8") as f:
        f.write(SVG)
    print(f"OK  {full_path}")

    nav_svg = SVG.replace(
        'width="200" height="210"',
        'width="56" height="59"'
    )
    nav_path = os.path.join(assets_dir, "bison_logo_nav.svg")
    with open(nav_path, "w", encoding="utf-8") as f:
        f.write(nav_svg)
    print(f"OK  {nav_path}")

    print()
    print("Open assets/bison_logo.svg in a browser to preview.")


if __name__ == "__main__":
    main()
