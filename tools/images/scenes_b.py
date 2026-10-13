"""IMG-02, 03, 04, 06, 07, 08 — services cards and infrastructure gallery."""

from __future__ import annotations

import random

from kit import *

CARD = "#D9D5CE"  # neutral packaging card
CARD_D = "#BDB8AF"
CARD_L = "#E8E5DF"


def studio(w, h, horizon, light=(0.5, 0.35)) -> str:
    out = rect(0, 0, w, horizon, "url(#gBg)") + rect(0, horizon, w, h - horizon, "url(#gFloor)")
    out += line(0, horizon, w, horizon, W3, 1, op=0.6)
    out += ell(w * light[0], h * light[1], w * 0.42, h * 0.38, "url(#gSoft)", op=0.7)
    return out


def scaled(content: str, x: float, y: float, k: float) -> str:
    return g(content, f"translate({n(x)} {n(y)}) scale({k:.4f})")


def fan(cx, cy, r, blades=7, accent=False) -> str:
    out = circ(cx, cy, r, G2, stroke=G0, sw=r * 0.06) + circ(cx, cy, r * 0.9, G1)
    for i in range(blades):
        a = i * 360 / blades
        out += path(
            f"M{n(cx)} {n(cy)} C{n(cx + r * 0.2)} {n(cy - r * 0.35)} {n(cx + r * 0.6)} {n(cy - r * 0.55)} {n(cx + r * 0.78)} {n(cy - r * 0.25)} "
            f"C{n(cx + r * 0.55)} {n(cy - r * 0.2)} {n(cx + r * 0.3)} {n(cy - r * 0.05)} {n(cx)} {n(cy)}Z",
            G0, extra=f'transform="rotate({n(a)} {n(cx)} {n(cy)})"',
        )
    out += circ(cx, cy, r * 0.2, G2, stroke=B1 if accent else G0, sw=r * 0.04) + circ(cx, cy, r * 0.07, B1 if accent else W4)
    return out


# --- IMG-02: GPU node, front, slight angle ------------------------------------
def img02(vb=None):
    W, H = 1600, 1000
    body = studio(W, H, 690)
    body += ell(860, 752, 640, 56, G2, op=0.28, extra='filter="url(#blur16)"')
    body += ell(700, 744, 420, 28, B0, op=0.25, extra='filter="url(#blur16)"')
    # soft second node behind for depth
    body += g(box_oblique(560, 300, 520, 150, 260, rx=2) + scaled(server_1u(0, 0, 600, 173), 560, 300, 520 / 600), op=0.55, extra='filter="url(#blur3)"')
    x, y, w, h, d = 170, 360, 1000, 372, 540
    body += box_oblique(x, y, w, h, d, rx=3, sw=1.4)
    # top vents on the lid
    dx, dy = d * 0.6, -d * 0.36
    for i in range(7):
        t = 0.12 + i * 0.12
        body += line(x + dx * t + 60, y + dy * t, x + dx * t + w - 220, y + dy * t, W3, 2.4, op=0.9)
    body += scaled(server_gpu(0, 0, 600, 223), x, y, w / 600)
    # rail glow and label plate
    body += rect(x + 40, y + h - 16, w - 80, 4, "url(#gBlue)", rx=2, op=0.85)
    return svg(W, H, body, vb)


# --- IMG-03: kit prepared for inspection and dispatch --------------------------
def clipboard(x, y, w, h) -> str:
    out = rect(x, y, w, h, W0, rx=10, stroke=W3, sw=1.6) + rect(x + w * 0.3, y - 14, w * 0.4, 30, G1, rx=7)
    for i in range(6):
        yy = y + 62 + i * (h - 90) / 6
        out += rect(x + 24, yy, 22, 22, W1, rx=5, stroke=W3, sw=1.4)
        if i < 4:
            out += path(f"M{n(x + 29)} {n(yy + 11)} L{n(x + 34)} {n(yy + 17)} L{n(x + 43)} {n(yy + 5)}", stroke=B0, sw=3.2)
        out += rect(x + 60, yy + 6, w - 90 - (i % 3) * 22, 9, W2, rx=4.5)
    return out


def gpu_card_front(x, y, w, h, fans=2) -> str:
    """Dual-fan GPU, seen from the top-front (flat), used in several scenes."""
    out = rect(x, y, w, h, "url(#gDark)", rx=h * 0.07, stroke=G0, sw=1.5)
    out += rect(x + 6, y + h - 8, w - 12, 4, "url(#gBlue)", rx=2)
    step = (w - 40) / fans
    for i in range(fans):
        out += fan(x + 20 + step * (i + 0.5), y + h / 2, min(h * 0.4, step * 0.44), accent=(i == 0))
    return out


def img03(vb=None):
    W, H = 1600, 1000
    body = studio(W, H, 560)
    body += shadow(800, 860, 700, 60, 0.22)
    # carton with tape and label
    bx, by, bw, bh, bd = 120, 330, 480, 330, 300
    body += box_oblique(bx, by, bw, bh, bd, front=CARD, top=CARD_L, side=CARD_D, stroke="#A9A398", sw=1.2)
    body += rect(bx + bw / 2 - 26, by, 52, bh, B0, op=0.88) + poly([(bx + bw / 2 - 26, by), (bx + bw / 2 - 26 + 180 * 0.6 * 0.15, by - 180 * 0.36 * 0.15), (bx + bw / 2 + 26 + 180 * 0.6 * 0.15, by - 180 * 0.36 * 0.15), (bx + bw / 2 + 26, by)], B1)
    body += rect(bx + 40, by + 220, 130, 72, W0, rx=3, stroke=W3, sw=1)
    for i in range(14):
        body += rect(bx + 52 + i * 7.2, by + 232, 3 + (i % 3), 28, G1)
    body += rect(bx + 52, by + 270, 70, 6, W3, rx=3)
    # server on foam in front
    sx, sy, sw_, sh = 470, 560, 620, 150
    body += rect(sx - 30, sy + sh - 10, sw_ + 60, 46, "#CFCBC3", rx=8, stroke="#B2AEA5", sw=1.2)
    body += box_oblique(sx, sy, sw_, sh, 300, rx=2, sw=1.2)
    body += scaled(server_1u(0, 0, 600, 145), sx, sy, sw_ / 600)
    # GPU card in anti-static bag
    gx, gy = 1040, 420
    body += g(gpu_card_front(0, 0, 360, 130), f"translate({gx} {gy}) rotate(-8)")
    body += poly([(gx - 30, gy - 40), (gx + 400, gy - 70), (gx + 410, gy + 160), (gx - 22, gy + 190)], B3, stroke=B2, sw=1.4, op=0.36)
    body += path(f"M{gx - 30} {gy - 40} L{gx + 410} {gy - 70}", stroke=W0, sw=3, op=0.8)
    # cable coil
    for i in range(5):
        body += ell(1260, 760 + i * 6, 130 - i * 8, 40 - i * 2, None, stroke=G1, sw=10)
        body += ell(1260, 757 + i * 6, 130 - i * 8, 40 - i * 2, None, stroke=G0, sw=2.6, op=0.7)
    body += ell(1260, 774, 72, 20, BG2, op=0.9)
    # clipboard
    body += g(clipboard(0, 0, 250, 330), "translate(1230 480) rotate(6)")
    return svg(W, H, body, vb)


# --- IMG-04: open rack, tools, no people ---------------------------------------
def door_mesh(quad) -> str:
    out = poly(quad, "#2C333C", G0, 2)
    out += poly(quad, "url(#vent)", op=0.8)
    (x0, y0), (x1, y1), (x2, y2), (x3, y3) = quad
    out += rect(min(x0, x1) + 14, (y0 + y3) / 2 - 40, 10, 80, W3, rx=5)
    return out


def img04(vb=None):
    W, H = 1600, 1000
    rng = random.Random(4)
    body = studio(W, H, 840, light=(0.45, 0.3))
    # floor perspective tiles
    for i in range(-6, 12):
        body += line(800 + i * 70, 840, 800 + i * 260 - 400, 1000, W3, 1.2, op=0.45)
    for yy in (872, 912, 960):
        body += line(0, yy, W, yy, W3, 1.2, op=0.35)
    body += shadow(700, 905, 700, 40, 0.24)
    # neighbour rack right, cropped
    body += g(rack_front(1010, 110, 520, 780, 42, [("blank", 2), ("gpu", 4), ("gpu", 4), ("1u", 1), ("1u", 1), ("switch", 1)] + [("1u", 2)] * 12, body=G1), op=0.55)
    body += rect(1010, 110, 520, 780, "#E6EAF0", op=0.35)
    # main rack (open)
    lay = [("switch", 1), ("patch", 1), ("blank", 1), ("gpu", 4), ("gpu", 4), ("1u", 1), ("1u", 1), ("blank", 1)] + [("1u", 2)] * 6 + [("gpu", 4), ("1u", 1), ("blank", 1)]
    used = sum(u for _, u in lay)
    lay += [("blank", 42 - used)] if used < 42 else []
    body += rack_front(430, 70, 520, 820, 42, lay)
    # open door, swung to the left
    body += door_mesh([(430, 70), (232, 118), (232, 846), (430, 890)])
    body += poly([(430, 70), (440, 70), (440, 890), (430, 890)], G0)
    # patch cables from the switch down the rack
    body += cable("M520 112 C500 190 470 260 500 330", B0, 5, B2)
    body += cable("M560 112 C560 210 600 250 590 330", G2, 5, G0)
    body += cable("M600 112 C640 160 700 210 690 300", W2, 5, W0)
    # tool tray / cart
    tx, ty = 1050, 640
    body += box_oblique(tx, ty, 430, 36, 190, front=W1, top=W0, side=W3, stroke=W3)
    body += rect(tx + 24, ty + 36, 14, 200, G2) + rect(tx + 392, ty + 36, 14, 200, G2) + circ(tx + 31, ty + 246, 12, G1) + circ(tx + 399, ty + 246, 12, G1)
    # case with tools on tray
    body += rect(tx + 30, ty - 62, 230, 62, G1, rx=6, stroke=G0, sw=1.4)
    for i in range(5):
        body += rect(tx + 44 + i * 40, ty - 52, 26, 42, mix(W3, W1, i / 6), rx=4)
        body += rect(tx + 52 + i * 40, ty - 52, 10, 20, B1 if i % 2 == 0 else W4, rx=3)
    # cable tester + coiled cable
    body += rect(tx + 290, ty - 38, 100, 38, G1, rx=7) + circ(tx + 312, ty - 19, 8, B1) + rect(tx + 336, ty - 28, 40, 18, G3, rx=3)
    # spare GPU on the floor mat
    body += poly([(1140, 880), (1480, 880), (1520, 930), (1100, 930)], W2, stroke=W3, sw=1.2, op=0.9)
    body += g(gpu_card_front(0, 0, 300, 74), "translate(1160 855) skewX(-14)")
    return svg(W, H, body, vb)


# --- IMG-06: whole rack ---------------------------------------------------------
def img06(vb=None):
    W, H = 1600, 1000
    body = studio(W, H, 900, light=(0.5, 0.3))
    for i in range(-8, 14):
        body += line(800 + i * 80, 900, 800 + i * 300 - 500, 1000, W3, 1.2, op=0.4)
    lay = [("switch", 1), ("patch", 1), ("1u", 1), ("blank", 1), ("gpu", 4), ("gpu", 4), ("gpu", 4), ("gpu", 4), ("1u", 2), ("1u", 2), ("1u", 1), ("1u", 1), ("blank", 1), ("gpu", 4), ("1u", 2), ("1u", 2), ("blank", 2), ("switch", 1), ("blank", 4)]
    used = sum(u for _, u in lay)
    assert used == 42, used
    for cx, op in ((190, 0.7), (1110, 0.7)):
        body += g(rack_front(cx - 270 + 140, 120, 500, 780, 42, lay[::-1], body=G1), op=1.0)
        body += rect(cx - 130, 120, 500, 780, BG1, op=0.62)
    body += shadow(800, 920, 520, 36, 0.3)
    body += ell(800, 910, 360, 20, B0, op=0.25, extra='filter="url(#blur16)"')
    # main rack
    body += rack_front(550, 70, 500, 830, 42, lay)
    # blue vertical accent strip on the right post
    body += rect(1042, 80, 4, 810, "url(#gBlue)", rx=2, op=0.9)
    body += rect(1036, 80, 16, 810, B1, rx=4, op=0.16, extra='filter="url(#blur3)"')
    # top cable tray
    body += rect(548, 50, 504, 22, W3, rx=3, stroke=W4, sw=1)
    return svg(W, H, body, vb)


# --- IMG-07: server from inside (top-down) --------------------------------------
def heatsink(x, y, w, h) -> str:
    out = rect(x, y, w, h, W3, rx=8, stroke=W4, sw=1.4)
    for i in range(1, 14):
        out += line(x + 10, y + i * h / 14, x + w - 10, y + i * h / 14, W5, 2, op=0.55)
    out += rect(x + w / 2 - 30, y + h / 2 - 30, 60, 60, W1, rx=10, stroke=W4, sw=1.2) + circ(x + w / 2, y + h / 2, 7, B0)
    return out


def interior_elems() -> str:
    """Server interior in the 1600x1000 frame of IMG-07 (region 176..1424 x 126..854)."""
    body = ""
    body += rect(176, 126, 40, 728, G1, rx=8)
    body += rect(230, 140, 84, 700, G1, rx=8)
    for i in range(6):
        body += fan(272, 140 + 58 + i * 116, 48, accent=(i == 2))
    # CPUs and DIMMs
    for i, cy in enumerate((190, 480)):
        body += heatsink(420, cy, 170, 230)
        for j in range(8):
            xx = 330 + j * 11 if j < 4 else 612 + (j - 4) * 11
            body += rect(xx, cy - 6, 9, 242, W0, rx=2, stroke=W3, sw=1)
            body += rect(xx + 2, cy + 4, 5, 222, B1 if (i + j) % 3 else W3, rx=1.5, op=0.85)
    # GPU cards (stacked)
    for i in range(4):
        body += g(gpu_card_front(0, 0, 560, 128), f"translate(760 {150 + i * 172})")
    # PSU and backplane
    body += rect(1340, 140, 70, 700, G1, rx=8)
    for i in range(2):
        body += rect(1350, 156 + i * 330, 50, 300, G0, rx=6, stroke=G3, sw=1) + rect(1362, 176 + i * 330, 26, 4, B1) + circ(1375, 420 + i * 330, 6, B1)
    # cables
    body += cable("M1330 240 C1250 120 700 120 640 160", B0, 7, B2)
    body += cable("M1330 740 C1250 860 700 860 640 760", G2, 7, G0)
    body += cable("M1330 500 C1180 470 1100 560 1330 600", W4, 6, W0)
    return body


def img07(vb=None):
    W, H = 1600, 1000
    body = rect(0, 0, W, H, "url(#gFloor)")
    body += rect(150, 120, 1300, 790, G2, rx=26, op=0.28, extra='filter="url(#blur16)"')
    body += rect(150, 100, 1300, 780, W3, rx=22, stroke=W4, sw=2)
    body += rect(176, 126, 1248, 728, mix(W1, W2, 0.6), rx=12, stroke=W3, sw=1.4)
    # front bezel + fan wall
    body += interior_elems()
    return svg(W, H, body, vb)


# --- IMG-08: network patching ----------------------------------------------------
def img08(vb=None):
    W, H = 1600, 1000
    body = rect(0, 0, W, H, "url(#gFloor)")
    body += rect(60, 0, 1480, 1000, G1)  # rack interior
    body += rect(60, 0, 36, 1000, G2) + rect(1504, 0, 36, 1000, G2)
    body += patch_panel(96, 90, 1408, 150)
    # management bar with rings
    body += rect(96, 262, 1408, 36, G2, rx=4)
    for i in range(14):
        body += rect(150 + i * 98, 256, 54, 48, None, rx=18, stroke=W4, sw=5)
    body += switch_face(96, 330, 1408, 150, ports=24)
    body += rect(96, 502, 1408, 36, G2, rx=4)
    for i in range(14):
        body += rect(150 + i * 98, 496, 54, 48, None, rx=18, stroke=W4, sw=5)
    body += switch_face(96, 560, 1408, 150, ports=24)
    # cables patch -> switch (tidy loom)
    rng = random.Random(8)
    cols = [B0, G0, W0, B1, G1]
    for i in range(24):
        x1 = 140 + i * 57.5
        x2 = x1 + rng.uniform(-6, 6)
        c = cols[i % len(cols)]
        yb = 168 + (i % 2) * 40
        body += rect(x1 - 6, yb - 10, 14, 22, W3, rx=2)
        body += cable(f"M{n(x1)} {yb + 8} C{n(x1)} {yb + 80} {n(x2)} {yb + 100} {n(x2)} {yb + 168}", c, 6, W3 if c in (G0, G1) else None)
    # long cables leaving the second switch toward the bottom-left
    for i in range(8):
        x1 = 160 + i * 112
        c = cols[(i * 2) % len(cols)]
        body += cable(f"M{x1} 690 C{x1} 820 {200 + i * 20} 860 {120 + i * 30} 1010", c, 8, W3 if c in (G0, G1) else None)
    body += rect(0, 0, W, H, "url(#gSoft)", op=0.0)
    return svg(W, H, body, vb)
