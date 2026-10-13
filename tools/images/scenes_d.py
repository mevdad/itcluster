"""IMG-13..IMG-18 — categories, diagnostics, competence map, expansion."""

from __future__ import annotations

import math
import random

from kit import *
from scenes_a import aisle, sym_defs
from kit import rack_front
from scenes_b import CARD, CARD_D, CARD_L, fan, gpu_card_front, scaled, shadow, studio
from scenes_c import arrow, ic_api, ic_check, ic_db, ic_gear, ic_monitor, ic_plug, ic_pulse, ic_rack, iso_tile


def product_stage(w, h) -> str:
    out = rect(0, 0, w, h, "url(#gBg)") + ell(w * 0.5, h * 0.55, w * 0.55, h * 0.4, "url(#gSoft)", op=0.9)
    return out + rect(0, h * 0.72, w, h * 0.28, "url(#gFloor)", op=0.55)


# --- IMG-13: accelerator on a neutral ground ---------------------------------------------
def img13(vb=None):
    W, H = 1200, 900
    body = product_stage(W, H)
    body += ell(600, 650, 520, 60, G2, op=0.3, extra='filter="url(#blur16)"')
    body += ell(600, 560, 320, 90, B1, op=0.2, extra='filter="url(#blur16)"')
    x, y, w, h, d = 150, 300, 880, 270, 70
    # slot bracket + connector hidden below the edge
    body += rect(86, y - 16, 56, h + 40, "url(#gMetalH)", rx=4, stroke=W4, sw=1.4)
    for i in range(8):
        body += rect(96, y + 10 + i * 32, 36, 12, G2, rx=6, op=0.8)
    body += box_oblique(x, y, w, h, d, front="url(#gDark)", top="#3A424D", side="#232A32", stroke=G0, rx=14, ox=0.5, oy=0.28)
    body += rect(x + 10, y + h - 14, w - 20, 5, "url(#gBlue)", rx=2.5)
    body += rect(x + 12, y + 12, w - 24, 8, W0, rx=4, op=0.12)
    for i, cx in enumerate((x + w * 0.27, x + w * 0.73)):
        body += fan(cx, y + h / 2 - 4, 108, blades=9, accent=(i == 0))
    # shroud accent lines
    body += path(f"M{x + 20} {y + 36} H{x + 210}", stroke=W4, sw=3, op=0.6) + path(f"M{x + w - 210} {y + h - 40} H{x + w - 20}", stroke=W4, sw=3, op=0.6)
    # PCIe edge peeking at the bottom
    body += rect(x + 200, y + h + 2, 420, 22, mix(W3, W4, 0.4), rx=2) + "".join(rect(x + 210 + i * 12.6, y + h + 4, 7, 16, W1, rx=1) for i in range(32))
    return svg(W, H, body, vb)


# --- IMG-14: server and network gear as one composition -----------------------------------
def img14(vb=None):
    W, H = 1200, 900
    body = product_stage(W, H)
    body += ell(560, 690, 520, 56, G2, op=0.28, extra='filter="url(#blur16)"')
    # switch (bottom), server (top)
    sx, sy, sw_ = 150, 480, 720
    body += box_oblique(sx, sy, sw_, 112, 260, front="url(#gDark)", top="#3A424D", side="#232A32", stroke=G0)
    body += scaled(switch_face(0, 0, 600, 93), sx, sy, sw_ / 600)
    body += box_oblique(sx, 300, sw_, 130, 300, rx=2, sw=1.2)
    body += scaled(server_1u(0, 0, 600, 108), sx, 300, sw_ / 600)
    body += rect(sx + 40, 300 + 126, sw_ - 80, 4, "url(#gBlue)", rx=2, op=0.8)
    # patch cables from the switch into the server rack side, tidy curves
    for i, (c, off) in enumerate(((B0, 0), (G1, 20), (W0, 40))):
        body += cable(f"M{sx + 120 + off} {sy + 90} C{sx + 120 + off} {sy + 190} {sx + 40 + off * 2} {sy + 230} {sx + 20} {sy + 330}", c, 8, W3 if c != B0 else B2)
    # router with antennas to the right
    rx_, ry = 930, 520
    body += box_oblique(rx_, ry, 190, 70, 150, front=W0, top=W1, side=W3)
    body += rect(rx_ + 20, ry + 26, 90, 6, "url(#gBlue)", rx=3) + led(rx_ + 148, ry + 35, 3.4) + led(rx_ + 164, ry + 35, 3.4, W4, glow=False)
    for k in (0, 1):
        body += rect(rx_ + 30 + k * 90, ry - 130 - 16 * k, 14, 130 + 16 * k, G1, rx=7)
    body += cable(f"M{sx + sw_ - 60} {sy + 70} C{sx + sw_ + 20} {sy + 150} {rx_ - 20} {ry + 80} {rx_ + 10} {ry + 40}", B0, 7, B2)
    return svg(W, H, body, vb)


# --- IMG-15: solar panel and energy equipment ---------------------------------------------------
def img15(vb=None):
    W, H = 1200, 900
    body = product_stage(W, H)
    body += ell(560, 720, 560, 64, G2, op=0.26, extra='filter="url(#blur16)"')
    O, U, V = (250, 190), (590, -50), (-40, 460)
    # stand struts
    body += line(O[0] + V[0] + 60, O[1] + V[1], O[0] + V[0] + 20, 760, W5, 14) + line(O[0] + V[0] + U[0] - 60, O[1] + V[1] + U[1] + 8, O[0] + V[0] + U[0] - 70, 740, W5, 14)
    body += line(O[0] + V[0] - 10, 770, O[0] + V[0] + U[0] + 30, 748, W4, 10)
    # panel: frame + cells in local 600x780 space
    p0, p1, p2 = O, (O[0] + U[0], O[1] + U[1]), (O[0] + V[0], O[1] + V[1])
    body += poly([(p0[0] - 16, p0[1] - 14), (p1[0] + 16, p1[1] - 14), (p1[0] + V[0] + 16, p1[1] + V[1] + 14), (p2[0] - 16, p2[1] + 14)], "url(#gMetalH)", W4, 1.6)
    cells = ""
    cols, rows = 6, 10
    cw, ch = 600 / cols, 780 / rows
    for r in range(rows):
        for c in range(cols):
            cells += rect(c * cw + 4, r * ch + 4, cw - 8, ch - 8, "url(#gCell)", rx=3)
            for b in (0.33, 0.66):
                cells += line(c * cw + 4, r * ch + 4 + (ch - 8) * b, c * cw + cw - 4, r * ch + 4 + (ch - 8) * b, "#8FA3C9", 0.8, op=0.5)
    cells += poly([(0, 0), (260, 0), (60, 780), (0, 780)], W0, op=0.08)
    body += g(cells, matrix(p0, p1, p2, 600, 780))
    # inverter + battery
    body += box_oblique(840, 470, 210, 250, 90, front=W0, top=W1, side=W3)
    body += rect(870, 500, 150, 70, G1, rx=8) + path("M884 546 L910 528 L936 540 L962 512 L1004 524", stroke=B1, sw=3.5)
    body += circ(900, 620, 7, B0) + circ(930, 620, 7, W4) + rect(868, 660, 154, 14, W2, rx=7)
    body += box_oblique(1050, 540, 100, 180, 70, front=W1, top=W0, side=W3)
    body += rect(1070, 560, 60, 6, "url(#gBlue)", rx=3) + circ(1100, 640, 6, B0)
    body += cable("M520 660 C560 780 760 790 840 640", G1, 8, W3)
    return svg(W, H, body, vb, extra_defs='<linearGradient id="gCell" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#26437A"/><stop offset="1" stop-color="#162B55"/></linearGradient>')


# --- IMG-16: diagnostics from the aisle --------------------------------------------------------------
def img16(vb=None):
    W, H = 1600, 1000
    cam = Cam(1020, 430, 900)
    rng = random.Random(16)
    floor_y, ceil_y, z0, z1 = 1.55, -1.45, 1.0, 20.0
    body = rect(0, 0, W, H, "url(#gBg)")
    body += poly(cam.quad_floor(ceil_y, -1.1, 6, z0, z1), mix(BG1, W3, 0.4))
    body += poly(cam.quad_floor(floor_y, -1.1, 6, z0, z1), "url(#gFloor)")
    for zz in [z0 + i * 0.6 for i in range(40)]:
        a, b = cam.p(-1.1, floor_y, zz), cam.p(6, floor_y, zz)
        body += line(a[0], a[1], b[0], b[1], W3, 1.2, op=max(0.08, 0.5 - (zz - z0) / 22))
    for zz in (3, 6.5, 11):
        a, b = cam.p(-1.1, ceil_y + 0.01, zz), cam.p(3.4, ceil_y + 0.01, zz)
        body += poly(cam.quad_floor(ceil_y + 0.01, 0.2, 1.3, zz, zz + 1.8), W0, op=0.85)
    body += ell(1100, 800, 560, 90, W0, op=0.55, extra='filter="url(#blur16)"')
    body += aisle(cam, rng, sides=(-1,), x_wall=1.1, z0=z0, z1=z1, fog=BG1, fog_max=0.82, rack_body=G1, fog_base=0.0, top_y=-0.75, floor_y=floor_y)
    # highlighted unit under diagnosis
    target = cam.quad_wall(-1.1, -0.05, 0.12, 2.4, 3.0)
    body += poly(target, B1, op=0.22, stroke=B0, sw=3)
    tp = cam.p(-1.1, 0.03, 2.55)
    body += circ(tp[0], tp[1], 28, B1, op=0.2, extra='filter="url(#blur3)"') + circ(tp[0], tp[1], 5, B0)
    # laptop on a service cart (foreground)
    body += ell(1150, 960, 420, 36, G2, op=0.3, extra='filter="url(#blur8)"')
    body += poly([(760, 760), (1500, 740), (1560, 800), (700, 826)], W1, W3, 1.4)
    body += poly([(700, 826), (1560, 800), (1560, 822), (700, 850)], W3)
    body += rect(740, 850, 16, 130, G1) + rect(1480, 826, 16, 150, G1)
    # laptop: base + screen
    base = [(840, 735), (1380, 722), (1440, 770), (790, 786)]
    body += poly(base, mix(W2, W3, 0.5), W4, 1.4)
    body += poly([(790, 786), (1440, 770), (1440, 782), (790, 800)], W4)
    for r in range(4):
        a = (850 + r * 14, 748 + r * 10)
        for c in range(12):
            body += poly([(a[0] + c * 46, a[1] - c * 0.6), (a[0] + c * 46 + 38, a[1] - c * 0.6 - 0.5), (a[0] + c * 46 + 40, a[1] + 6 - c * 0.6), (a[0] + c * 46 - 2, a[1] + 6 - c * 0.6)], W1, W3, 0.6)
    scr = [(850, 735), (1370, 722), (1346, 430), (872, 450)]
    body += poly([(842, 740), (1380, 726), (1356, 418), (862, 440)], G1, G0, 2)
    body += poly(scr, "#EAF1FF")
    # on-screen diagnostics: bars, line, status dots
    sx0, sy0 = 892, 468
    for i in range(7):
        hh = 40 + (i * 37) % 90
        body += rect(sx0 + i * 40, 640 - hh, 26, hh, B1 if i % 3 else B0, rx=3, op=0.9)
    body += path("M890 560 L950 540 L1010 570 L1070 520 L1130 548 L1200 500 L1280 520", stroke=G1, sw=3.4)
    for i in range(3):
        body += circ(1230 + i * 26, 470 + i * 0, 7, [B0, W4, B1][i])
    body += rect(sx0, 470, 120, 10, W3, rx=5)
    # service cable from the laptop to the unit
    body += cable("M1380 760 C1500 860 1240 900 1180 780 C1080 560 560 640 " + f"{tp[0]:.0f} {tp[1]:.0f}", B0, 5, B2)
    return svg(W, H, body, vb, extra_defs=sym_defs())


# --- IMG-17: three competences working as one ---------------------------------------------------------
def card3(cx, cy, s, icon_fn) -> str:
    out = rect(cx - s / 2 + 8, cy - s / 2 + 18, s, s, G2, rx=34, op=0.16, extra='filter="url(#blur16)"')
    out += rect(cx - s / 2, cy - s / 2, s, s, W0, rx=34, stroke=W3, sw=2)
    out += rect(cx - s / 2 + 22, cy + s / 2 - 34, s - 44, 8, W2, rx=4) + rect(cx - s / 2 + 22, cy + s / 2 - 34, (s - 44) * 0.55, 8, B1, rx=4)
    return out + icon_fn(cx, cy - 14, s * 0.46)


def ic_box(cx, cy, s, c=G1) -> str:
    out = poly([(cx, cy - s * .42), (cx + s * .4, cy - s * .2), (cx, cy + s * .02), (cx - s * .4, cy - s * .2)], None, c, s * .08)
    out += path(f"M{n(cx - s * .4)} {n(cy - s * .2)} V{n(cy + s * .24)} L{n(cx)} {n(cy + s * .46)} L{n(cx + s * .4)} {n(cy + s * .24)} V{n(cy - s * .2)}", stroke=c, sw=s * .08)
    return out + line(cx, cy + s * .02, cx, cy + s * .46, c, s * .08)


def ic_wrench(cx, cy, s, c=G1) -> str:
    return ic_gear(cx - s * 0.16, cy - s * 0.1, s * 0.7, c) + ic_pulse(cx + s * 0.1, cy + s * 0.36, s * 0.7, B0)


def img17(vb=None):
    W, H = 1200, 1000
    body = rect(0, 0, W, H, "url(#gBg)") + rect(0, 0, W, H, "url(#grid)", op=0.5)
    cx, cy = 600, 520
    for r in (150, 260, 370):
        body += circ(cx, cy, r, None, stroke=W3, sw=1.6, op=0.8, extra='stroke-dasharray="2 12"')
    nodes = [(600, 210), (300, 740), (900, 740)]
    for (x, y) in nodes:
        body += line(cx, cy, x, y, B1, 4, op=0.9)
    for a, b in ((0, 1), (1, 2), (2, 0)):
        body += line(nodes[a][0], nodes[a][1], nodes[b][0], nodes[b][1], W3, 3, extra='stroke-dasharray="3 12"')
    for (x, y) in nodes:
        mx, my = (x + cx) / 2, (y + cy) / 2
        body += circ(mx, my, 8, W0, stroke=B0, sw=3.4)
    body += circ(cx, cy, 98, G2, op=0.2, extra='filter="url(#blur16)"')
    body += circ(cx, cy, 90, "url(#gDark)", stroke=B1, sw=3)
    for i in range(3):
        body += rect(cx - 36, cy - 34 + i * 26, 72, 16, G1, rx=4, stroke=B1 if i == 1 else G0, sw=1.6) + circ(cx + 24, cy - 26 + i * 26, 3, B1)
    body += card3(*nodes[0], 220, ic_rack) + card3(*nodes[1], 220, ic_box) + card3(*nodes[2], 220, ic_wrench)
    return svg(W, H, body, vb)


# --- IMG-18: spare rack being prepared (calm) ------------------------------------------------------------
def img18(vb=None):
    W, H = 1200, 900
    body = rect(0, 0, W, H, "url(#gBg)") + rect(0, 700, W, 200, "url(#gFloor)")
    body += ell(560, 330, 640, 380, "url(#gSoft)", op=0.9)
    for i in range(-5, 10):
        body += line(600 + i * 70, 700, 600 + i * 250 - 400, 900, W3, 1.1, op=0.35)
    body += ell(520, 790, 400, 34, G2, op=0.2, extra='filter="url(#blur16)"')
    # rack: top 12U installed, the rest left empty (rails + cage-nut holes only)
    rx_, ry, rw, rh = 260, 90, 470, 700
    u_h = (rh - 20) / 42
    top_h = 12 * u_h + 20
    body += rect(rx_, ry, rw, rh, mix(W2, W3, 0.4), rx=6, stroke=W4, sw=2)
    body += rect(rx_ + 14, ry + 12, rw - 28, rh - 24, mix("#B9C1CC", W3, 0.5), rx=3)
    for i in range(42):
        yy = ry + 10 + i * u_h
        body += rect(rx_ + 20, yy + u_h / 2 - 3, 6, 6, W5, rx=1, op=0.7) + rect(rx_ + rw - 26, yy + u_h / 2 - 3, 6, 6, W5, rx=1, op=0.7)
    body += rack_front(rx_, ry, rw, top_h, 12, [("switch", 1), ("patch", 1), ("1u", 2), ("gpu", 4), ("blank", 1), ("1u", 1), ("blank", 2)])
    body += rect(rx_ + 14, ry + top_h + 6, rw - 28, 3, W4, op=0.5)
    # service cart with the next server
    cx0, cy0 = 820, 520
    body += box_oblique(cx0, cy0 + 150, 330, 22, 150, front=W1, top=W0, side=W3)
    body += rect(cx0 + 18, cy0 + 172, 12, 130, G1) + rect(cx0 + 300, cy0 + 172, 12, 130, G1) + circ(cx0 + 24, cy0 + 312, 10, G1) + circ(cx0 + 306, cy0 + 312, 10, G1)
    body += box_oblique(cx0 + 20, cy0 + 70, 290, 80, 120, rx=2)
    body += scaled(server_1u(0, 0, 600, 165), cx0 + 20, cy0 + 70, 290 / 600)
    # faint blue accent, kept minimal
    body += rect(rx_ + rw - 6, ry + 20, 3, rh - 40, B1, op=0.5)
    body += rect(0, 0, W, H, W0, op=0.1)
    return svg(W, H, body, vb)
