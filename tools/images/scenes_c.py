"""IMG-09..IMG-12 — project schemes and supply/acceptance scenes."""

from __future__ import annotations

from kit import *
from scenes_b import (CARD, CARD_D, CARD_L, clipboard, fan, gpu_card_front, interior_elems, scaled, shadow, studio)


# --- tiny pictograms (own coordinate: centred at cx,cy, size s) -------------------
def ic_monitor(cx, cy, s, c=G1) -> str:
    return rect(cx - s * 0.5, cy - s * 0.4, s, s * 0.66, None, rx=s * 0.08, stroke=c, sw=s * 0.09) + line(cx, cy + s * 0.26, cx, cy + s * 0.45, c, s * 0.09) + line(cx - s * 0.22, cy + s * 0.46, cx + s * 0.22, cy + s * 0.46, c, s * 0.09)


def ic_db(cx, cy, s, c=G1) -> str:
    out = ell(cx, cy - s * 0.3, s * 0.4, s * 0.14, None, stroke=c, sw=s * 0.08)
    out += path(f"M{n(cx - s * .4)} {n(cy - s * .3)} V{n(cy + s * .3)} A{n(s * .4)} {n(s * .14)} 0 0 0 {n(cx + s * .4)} {n(cy + s * .3)} V{n(cy - s * .3)}", stroke=c, sw=s * 0.08)
    out += path(f"M{n(cx - s * .4)} {n(cy)} A{n(s * .4)} {n(s * .14)} 0 0 0 {n(cx + s * .4)} {n(cy)}", stroke=c, sw=s * 0.08)
    return out


def ic_api(cx, cy, s, c=G1) -> str:
    return path(f"M{n(cx - s * .15)} {n(cy - s * .3)} L{n(cx - s * .45)} {n(cy)} L{n(cx - s * .15)} {n(cy + s * .3)}", stroke=c, sw=s * 0.1) + path(f"M{n(cx + s * .15)} {n(cy - s * .3)} L{n(cx + s * .45)} {n(cy)} L{n(cx + s * .15)} {n(cy + s * .3)}", stroke=c, sw=s * 0.1) + line(cx + s * .07, cy - s * .32, cx - s * .07, cy + s * .32, c, s * 0.08)


def ic_check(cx, cy, s, c=W0) -> str:
    return path(f"M{n(cx - s * .3)} {n(cy)} L{n(cx - s * .08)} {n(cy + s * .24)} L{n(cx + s * .32)} {n(cy - s * .24)}", stroke=c, sw=s * 0.14)


def ic_gear(cx, cy, s, c=G1) -> str:
    out = circ(cx, cy, s * 0.22, None, stroke=c, sw=s * 0.09)
    for i in range(8):
        out += line(cx, cy - s * 0.3, cx, cy - s * 0.42, c, s * 0.13, extra=f'transform="rotate({i * 45} {n(cx)} {n(cy)})"', cap="butt")
    return out + circ(cx, cy, s * 0.31, None, stroke=c, sw=s * 0.07)


def ic_pulse(cx, cy, s, c=G1) -> str:
    return path(f"M{n(cx - s * .45)} {n(cy)} H{n(cx - s * .2)} L{n(cx - s * .08)} {n(cy - s * .3)} L{n(cx + s * .08)} {n(cy + s * .3)} L{n(cx + s * .2)} {n(cy)} H{n(cx + s * .45)}", stroke=c, sw=s * 0.09)


def ic_plug(cx, cy, s, c=G1) -> str:
    return rect(cx - s * .2, cy - s * .1, s * .4, s * .34, None, rx=s * .07, stroke=c, sw=s * .09) + line(cx - s * .1, cy - s * .1, cx - s * .1, cy - s * .32, c, s * .09) + line(cx + s * .1, cy - s * .1, cx + s * .1, cy - s * .32, c, s * .09) + line(cx, cy + s * .24, cx, cy + s * .42, c, s * .09)


def ic_rack(cx, cy, s, c=G1) -> str:
    out = rect(cx - s * .3, cy - s * .44, s * .6, s * .88, None, rx=s * .06, stroke=c, sw=s * .08)
    for i in range(3):
        out += line(cx - s * .18, cy - s * .24 + i * s * .24, cx + s * .1, cy - s * .24 + i * s * .24, c, s * .07) + circ(cx + s * .18, cy - s * .24 + i * s * .24, s * .03, c)
    return out


def node(cx, cy, s, icon, active=False) -> str:
    out = rect(cx - s / 2 + 6, cy - s / 2 + 10, s, s, G2, rx=s * 0.22, op=0.14, extra='filter="url(#blur8)"')
    out += rect(cx - s / 2, cy - s / 2, s, s, W0, rx=s * 0.22, stroke=B2 if active else W3, sw=2)
    return out + icon(cx, cy, s * 0.5, B0 if active else G1)


def arrow(x1, y1, x2, y2, c=B0, sw=3) -> str:
    import math
    a = math.atan2(y2 - y1, x2 - x1)
    hx, hy = x2 - 9 * math.cos(a), y2 - 9 * math.sin(a)
    return line(x1, y1, hx, hy, c, sw) + poly([(x2, y2), (hx + 8 * math.sin(a), hy - 8 * math.cos(a)), (hx - 8 * math.sin(a), hy + 8 * math.cos(a))], c)


def iso_tile(cx, cy, w, h, fill=W1, stroke=W3) -> str:
    return poly([(cx, cy - h / 2), (cx + w / 2, cy), (cx, cy + h / 2), (cx - w / 2, cy)], fill, stroke, 1.4)


# --- IMG-09: AI deployment solution scheme (no text) ---------------------------------
def img09(vb=None):
    W, H = 1600, 1000
    body = rect(0, 0, W, H, "url(#gBg)") + rect(0, 0, W, H, "url(#grid)", op=0.7)
    body += ell(800, 500, 760, 330, "url(#gSoft)", op=0.8)
    # connectors
    for y in (280, 500, 720):
        body += path(f"M300 {y} C420 {y} 440 500 560 500", stroke=B1 if y == 500 else W3, sw=4, extra='stroke-dasharray="2 10"' if y != 500 else "")
    body += arrow(1010, 500, 1090, 500)
    # left: sources
    for y, ic in ((280, ic_monitor), (500, ic_db), (720, ic_api)):
        body += node(220, y, 150, ic, active=(y == 500))
    # middle: model, layered iso cube
    cx, cy = 790, 470
    body += iso_tile(cx, cy + 190, 420, 210, W2, W3)
    for i, c in enumerate((W1, W0, B3)):
        yy = cy + 110 - i * 70
        body += poly([(cx, yy - 70), (cx + 150, yy), (cx, yy + 70), (cx - 150, yy)], c, B2 if i == 2 else W3, 1.6)
        body += poly([(cx - 150, yy), (cx, yy + 70), (cx, yy + 106), (cx - 150, yy + 36)], mix(c, W4, 0.28), W3, 1.2)
        body += poly([(cx + 150, yy), (cx, yy + 70), (cx, yy + 106), (cx + 150, yy + 36)], mix(c, W4, 0.5), W3, 1.2)
    body += circ(cx, cy - 66, 20, B0) + circ(cx, cy - 66, 8, W0)
    for a in range(0, 360, 60):
        import math
        body += line(cx, cy - 66, cx + 54 * math.cos(math.radians(a)), cy - 66 + 30 * math.sin(math.radians(a)), B1, 3)
        body += circ(cx + 54 * math.cos(math.radians(a)), cy - 66 + 30 * math.sin(math.radians(a)), 6, W0, stroke=B1, sw=2.5)
    # right: GPU servers stack
    sx = 1130
    body += iso_tile(sx + 110, 760, 460, 230, W2, W3)
    for i in range(3):
        y = 330 + i * 130
        body += box_oblique(sx, y, 300, 90, 120, rx=2)
        body += scaled(server_1u(0, 0, 600, 90), sx, y, 0.5)
        body += led(sx + 270, y + 45, 3.2, B0)
    return svg(W, H, body, vb)


# --- IMG-10: composition of a supply (flat-lay of slots) -------------------------------
def slot(x, y, w, h, done=True) -> str:
    out = rect(x, y, w, h, W0, rx=22, stroke=W3, sw=2, extra='stroke-dasharray="3 10"')
    if done:
        out += circ(x + w - 34, y + 34, 18, B0) + ic_check(x + w - 34, y + 34, 30)
    return out


def img10(vb=None):
    W, H = 1600, 1000
    body = rect(0, 0, W, H, "url(#gFloor)") + rect(60, 60, W - 120, H - 120, W2, rx=34, op=0.55) + rect(80, 80, W - 160, H - 160, BG0, rx=26, stroke=W3, sw=1.5)
    cw, ch, gx, gy = 440, 380, 40, 40
    x0, y0 = 160, 140
    cells = [(x0 + (i % 3) * (cw + gx), y0 + (i // 3) * (ch + gy)) for i in range(6)]
    for (x, y) in cells:
        body += slot(x, y, cw, ch)
    # 1 server
    x, y = cells[0]
    body += scaled(server_gpu(0, 0, 600, 223), x + 40, y + 110, 0.9 * 440 / 600 * 0.9)
    # 2 GPU cards
    x, y = cells[1]
    body += g(gpu_card_front(0, 0, 340, 120), f"translate({x + 50} {y + 90})") + g(gpu_card_front(0, 0, 340, 120), f"translate({x + 50} {y + 230})")
    # 3 switch
    x, y = cells[2]
    body += scaled(switch_face(0, 0, 600, 90), x + 28, y + 140, 0.67)
    # 4 cables
    x, y = cells[3]
    for i in range(4):
        body += ell(x + 220, y + 190 + i * 7, 150 - i * 12, 76 - i * 6, None, stroke=[G1, B0, G1, W4][i], sw=11)
    body += ell(x + 220, y + 204, 62, 28, BG2)
    # 5 rails
    x, y = cells[4]
    for i in range(2):
        body += rect(x + 50, y + 130 + i * 90, 340, 22, W3, rx=4, stroke=W4, sw=1.4)
        for j in range(9):
            body += circ(x + 70 + j * 36, y + 141 + i * 90, 3.2, W5)
    body += rect(x + 50, y + 300, 340, 14, W2, rx=4, stroke=W3)
    # 6 power / small parts
    x, y = cells[5]
    for i in range(3):
        body += box_oblique(x + 40 + i * 120, y + 150, 90, 70, 60, rx=3)
        body += circ(x + 85 + i * 120, y + 185, 9, G1)
    body += box_oblique(x + 70, y + 270, 300, 46, 40, front=W1)
    return svg(W, H, body, vb)


# --- IMG-11: depersonalised launch scheme --------------------------------------------------
def img11(vb=None):
    W, H = 1600, 1000
    body = rect(0, 0, W, H, "url(#gBg)") + rect(0, 0, W, H, "url(#grid)", op=0.55)
    body += ell(800, 520, 780, 260, "url(#gSoft)", op=0.8)
    xs = [210 + i * 295 for i in range(5)]
    y = 500
    body += line(xs[0], y, xs[-1], y, W3, 6)
    body += line(xs[0], y, xs[3], y, B0, 6)
    icons = [ic_rack, ic_plug, ic_gear, ic_pulse, None]
    for i, x in enumerate(xs):
        done = i < 4
        body += circ(x, y + 10, 82, G2, op=0.14, extra='filter="url(#blur8)"')
        body += circ(x, y, 78, B0 if done else W0, stroke=B1 if done else W3, sw=3)
        body += circ(x, y, 60, None, stroke=W0 if done else W3, sw=2, op=0.5)
        if icons[i]:
            body += icons[i](x, y, 74, W0)
        else:
            body += circ(x, y, 34, None, stroke=G1, sw=5) + ic_check(x, y, 60, B0)
        # ticks under each stage
        for k in range(3):
            body += rect(x - 54 + k * 38, y + 130, 30, 8, B1 if (done and k < 2 + (i % 2)) else W3, rx=4)
        body += rect(x - 70, y - 190, 140, 70, W0, rx=14, stroke=W3, sw=1.6)
        body += rect(x - 52, y - 170, 70 + (i % 3) * 14, 10, G1, rx=5, op=0.8) + rect(x - 52, y - 150, 100, 8, W3, rx=4)
    return svg(W, H, body, vb)


# --- IMG-12: acceptance inspection at a desk -------------------------------------------------
def img12(vb=None):
    W, H = 1600, 1000
    body = rect(0, 0, W, H, "url(#gBg)")
    body += poly([(0, 330), (W, 330), (W, H), (0, H)], "url(#gFloor)")
    body += ell(800, 330, 900, 160, "url(#gSoft)", op=0.6)
    body += "<g transform=\"translate(-80 -170) scale(1.1)\">"
    # anti-static mat
    body += poly([(120, 880), (1480, 880), (1560, 960), (40, 960)], G1, op=0.2)
    body += poly([(260, 450), (1340, 450), (1480, 880), (120, 880)], "#C7CFD9", stroke=W4, sw=1.4)
    body += poly([(260, 450), (1340, 450), (1480, 880), (120, 880)], "url(#grid)", op=0.5)
    # open server (top removed)
    x, y, w, h, d = 300, 610, 760, 150, 460
    dx, dy = d * 0.6, -d * 0.36
    body += shadow(x + w / 2 + 130, y + h + 20, 560, 40, 0.26)
    body += poly([(x + w, y), (x + w + dx, y + dy), (x + w + dx, y + h + dy), (x + w, y + h)], "url(#gSide)", W3, 1.2)
    body += poly([(x, y), (x + dx, y + dy), (x + w + dx, y + dy), (x + w, y)], G1, G0, 1.4)
    inner = g(rect(176, 126, 1248, 728, mix(W1, W2, 0.6)) + interior_elems(), "translate(-176 -126)")
    body += g(inner, matrix((x + dx, y + dy), (x + w + dx, y + dy), (x, y), 1248, 728))
    body += rect(x, y, w, h, "url(#gMetal)", stroke=W3, sw=1.4)
    body += scaled(server_1u(0, 0, 600, 118), x, y, w / 600)
    # outer carton behind the desk items
    body += box_oblique(1190, 330, 260, 190, 150, front=CARD, top=CARD_L, side=CARD_D, stroke="#A9A398", sw=1.2)
    body += rect(1190, 330, 260, 190, None, stroke="#A9A398", sw=1.2) + rect(1305, 330, 30, 190, B0, op=0.85)
    # foam packaging
    body += box_oblique(1180, 640, 330, 70, 150, front="#454D58", top="#59616D", side="#333A44", stroke=G0)
    body += rect(1210, 650, 120, 40, G3, rx=8, op=0.6)
    # tools: screwdriver, tweezers, strap coil
    body += g(rect(0, 0, 220, 16, W1, rx=8, stroke=W3, sw=1.4) + rect(0, -4, 78, 24, B0, rx=10) + rect(220, 4, 40, 8, W4, rx=4), "translate(330 835) rotate(-5)")
    for i in range(4):
        body += ell(640, 830 + i * 4, 70 - i * 6, 22 - i * 2, None, stroke=G1, sw=7)
    # clipboard checklist + small multimeter
    body += g(clipboard(0, 0, 230, 310), "translate(1230 700) rotate(-6) scale(0.82)")
    body += rect(860, 810, 150, 100, G1, rx=14, stroke=G0, sw=1.4) + rect(876, 822, 118, 36, "#CFE0FF", rx=6) + circ(935, 880, 14, W3) + circ(935, 880, 5, B0)
    body += "</g>"
    return svg(W, H, body, vb)
