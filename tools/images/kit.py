"""SVG toolkit for the H200 Cloud illustration set.

All 18 images share one rendering language: soft neutral studio light, white and
light-grey hardware, graphite for depth, a single blue accent. Hardware is drawn
in cabinet-oblique projection (flat front, receding top/side), and the corridor
scenes use a real one-point perspective. Nothing here is a photograph.
"""

from __future__ import annotations

import math

# --- palette -----------------------------------------------------------------
BG0, BG1, BG2 = "#F5F7FA", "#E6EAF0", "#D6DCE5"
W0, W1, W2, W3, W4, W5 = "#FFFFFF", "#F2F4F7", "#E3E7EC", "#C9D0D9", "#9BA5B3", "#6C7686"
G0, G1, G2, G3 = "#2B3139", "#1D2229", "#12161B", "#0A0D11"
B0, B1, B2, B3 = "#2F6BFF", "#5B8CFF", "#9DBBFF", "#DCE7FF"


def n(v: float) -> str:
    s = f"{v:.1f}"
    return s[:-2] if s.endswith(".0") else s


def pts(points: list[tuple[float, float]]) -> str:
    return " ".join(f"{n(x)},{n(y)}" for x, y in points)


def lerp(a: float, b: float, t: float) -> float:
    return a + (b - a) * t


def hex_rgb(h: str) -> tuple[int, int, int]:
    h = h.lstrip("#")
    return int(h[0:2], 16), int(h[2:4], 16), int(h[4:6], 16)


def mix(c1: str, c2: str, t: float) -> str:
    t = max(0.0, min(1.0, t))
    a, b = hex_rgb(c1), hex_rgb(c2)
    return "#%02X%02X%02X" % tuple(round(lerp(a[i], b[i], t)) for i in range(3))


def _attrs(fill=None, stroke=None, sw=None, op=None, extra="") -> str:
    out = ""
    out += f' fill="{fill}"' if fill is not None else ' fill="none"'
    if stroke is not None:
        out += f' stroke="{stroke}"'
    if sw is not None and stroke is not None:
        out += f' stroke-width="{n(sw)}"'
    if op is not None:
        out += f' opacity="{n(op) if op not in (0, 1) else op}"'
    return out + (" " + extra if extra else "")


def rect(x, y, w, h, fill=None, rx=0, stroke=None, sw=1, op=None, extra="") -> str:
    r = f' rx="{n(rx)}"' if rx else ""
    return f'<rect x="{n(x)}" y="{n(y)}" width="{n(w)}" height="{n(h)}"{r}{_attrs(fill, stroke, sw, op, extra)}/>'


def poly(points, fill=None, stroke=None, sw=1, op=None, extra="") -> str:
    return f'<polygon points="{pts(points)}"{_attrs(fill, stroke, sw, op, extra)}/>'


def circ(cx, cy, r, fill=None, stroke=None, sw=1, op=None, extra="") -> str:
    return f'<circle cx="{n(cx)}" cy="{n(cy)}" r="{n(r)}"{_attrs(fill, stroke, sw, op, extra)}/>'


def ell(cx, cy, rx, ry, fill=None, stroke=None, sw=1, op=None, extra="") -> str:
    return f'<ellipse cx="{n(cx)}" cy="{n(cy)}" rx="{n(rx)}" ry="{n(ry)}"{_attrs(fill, stroke, sw, op, extra)}/>'


def line(x1, y1, x2, y2, stroke, sw=1, op=None, cap="round", extra="") -> str:
    e = f'stroke-linecap="{cap}"' + (" " + extra if extra else "")
    return f'<line x1="{n(x1)}" y1="{n(y1)}" x2="{n(x2)}" y2="{n(y2)}"{_attrs(None, stroke, sw, op, e)}/>'


def path(d, fill="none", stroke=None, sw=1, op=None, cap="round", extra="") -> str:
    e = f'stroke-linecap="{cap}" stroke-linejoin="round"' + (" " + extra if extra else "")
    return f'<path d="{d}"{_attrs(fill, stroke, sw, op, e)}/>'


def g(content: str, transform: str | None = None, op=None, extra="") -> str:
    t = f' transform="{transform}"' if transform else ""
    o = f' opacity="{n(op)}"' if op is not None else ""
    return f"<g{t}{o}{(' ' + extra) if extra else ''}>{content}</g>"


def matrix(p0, p1, p2, wl, hl) -> str:
    """Affine map of local (0..wl, 0..hl) onto the parallelogram P0,P1(x-axis),P2(y-axis)."""
    a, b = (p1[0] - p0[0]) / wl, (p1[1] - p0[1]) / wl
    c, d = (p2[0] - p0[0]) / hl, (p2[1] - p0[1]) / hl
    return f"matrix({a:.5f} {b:.5f} {c:.5f} {d:.5f} {n(p0[0])} {n(p0[1])})"


DEFS = f"""
<linearGradient id="gBg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="{BG0}"/><stop offset="1" stop-color="{BG1}"/></linearGradient>
<linearGradient id="gFloor" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="{BG1}"/><stop offset="1" stop-color="{BG2}"/></linearGradient>
<linearGradient id="gMetal" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="{W0}"/><stop offset="1" stop-color="{W2}"/></linearGradient>
<linearGradient id="gMetalH" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="{W0}"/><stop offset="1" stop-color="{W2}"/></linearGradient>
<linearGradient id="gTop" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="{W0}"/><stop offset="1" stop-color="{W1}"/></linearGradient>
<linearGradient id="gSide" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="{W3}"/><stop offset="1" stop-color="{W4}"/></linearGradient>
<linearGradient id="gDark" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="{G0}"/><stop offset="1" stop-color="{G2}"/></linearGradient>
<linearGradient id="gBlue" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="{B1}"/><stop offset="1" stop-color="{B0}"/></linearGradient>
<radialGradient id="gGlow" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="{B1}" stop-opacity="0.55"/><stop offset="1" stop-color="{B1}" stop-opacity="0"/></radialGradient>
<radialGradient id="gSoft" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="#FFFFFF" stop-opacity="0.9"/><stop offset="1" stop-color="#FFFFFF" stop-opacity="0"/></radialGradient>
<filter id="blur8" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="8"/></filter>
<filter id="blur16" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="16"/></filter>
<filter id="blur3" x="-10%" y="-10%" width="120%" height="120%"><feGaussianBlur stdDeviation="3"/></filter>
<pattern id="vent" width="7" height="7" patternUnits="userSpaceOnUse"><circle cx="3.5" cy="3.5" r="1.6" fill="#4C5562"/></pattern>
<pattern id="ventLight" width="7" height="7" patternUnits="userSpaceOnUse"><circle cx="3.5" cy="3.5" r="1.4" fill="{W4}"/></pattern>
<pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M40 0H0V40" fill="none" stroke="{W3}" stroke-width="1" opacity="0.5"/></pattern>
"""


def svg(w: int, h: int, body: str, vb: tuple[float, float, float, float] | None = None, bg: str | None = "url(#gBg)", extra_defs: str = "") -> str:
    """Wrap a scene. `vb` crops the same scene (used for the mobile variants)."""
    x0, y0, vw, vh = vb if vb else (0, 0, w, h)
    back = rect(0, 0, w, h, bg) if bg else ""
    return (
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{n(x0)} {n(y0)} {n(vw)} {n(vh)}" '
        f'width="{n(vw)}" height="{n(vh)}" role="img" aria-hidden="true" preserveAspectRatio="xMidYMid slice">'
        f"<defs>{DEFS}{extra_defs}</defs>{back}{body}</svg>"
    )


# --- hardware faces (absolute coordinates, front view) ------------------------
def screw(x, y, r=2.4, fill=W4) -> str:
    return circ(x, y, r, fill) + circ(x, y, r * 0.45, G1, op=0.5)


def ears(x, y, w, h, ear=16) -> str:
    out = rect(x, y, ear, h, mix(W2, W3, 0.5), stroke=W3, sw=0.8) + rect(x + w - ear, y, ear, h, mix(W2, W3, 0.5), stroke=W3, sw=0.8)
    out += screw(x + ear / 2, y + h / 2) + screw(x + w - ear / 2, y + h / 2)
    return out


def led(x, y, r=2.2, color=B1, glow=True) -> str:
    out = circ(x, y, r * 2.6, color, op=0.22) if glow else ""
    return out + circ(x, y, r, color)


def bays(x, y, cols, rows, bw, bh, gap=5, blue=True) -> str:
    out = ""
    for r in range(rows):
        for c in range(cols):
            bx, by = x + c * (bw + gap), y + r * (bh + gap)
            out += rect(bx, by, bw, bh, W1, rx=2.5, stroke=W3, sw=1)
            out += rect(bx + 4, by + bh * 0.5 - 1.2, bw - 8, 2.4, W3, rx=1.2)
            out += circ(bx + bw - 6, by + 5, 1.6, B1 if blue and (r + c) % 3 else W4)
    return out


def fan_block(x, y, w, h) -> str:
    out = rect(x, y, w, h, G2, rx=3)
    out += rect(x, y, w, h, "url(#vent)", rx=3)
    out += rect(x, y, w, h, None, rx=3, stroke=G0, sw=1.2)
    return out


def server_gpu(x, y, w, h) -> str:
    """4U GPU node, front: drive bays left, fan wall centre, status cluster right."""
    out = rect(x, y, w, h, "url(#gMetal)", rx=3, stroke=W3, sw=1.2) + ears(x, y, w, h)
    pad = h * 0.14
    bh = (h - pad * 2 - 6) / 2
    out += bays(x + 28, y + pad, 4, 2, 46, bh, 6)
    fx = x + 28 + 4 * 52 + 10
    fw = w - (fx - x) - 150
    fan_w = (fw - 10) / 3
    for i in range(3):
        out += fan_block(fx + i * (fan_w + 5), y + pad, fan_w, h - pad * 2)
    cx = x + w - 130
    out += rect(cx, y + pad, 90, h - pad * 2, W1, rx=4, stroke=W3, sw=1)
    out += rect(cx + 10, y + pad + 12, 70, 5, "url(#gBlue)", rx=2.5)
    for i in range(4):
        out += led(cx + 16 + i * 17, y + h / 2 + 6, 2.6, B1 if i != 2 else W4)
    out += circ(cx + 45, y + h - pad - 18, 8, W2, stroke=W4, sw=1.2) + circ(cx + 45, y + h - pad - 18, 2.5, B0)
    return out


def server_1u(x, y, w, h, accent=True) -> str:
    out = rect(x, y, w, h, "url(#gMetal)", rx=2, stroke=W3, sw=1) + ears(x, y, w, h, ear=min(14, w * 0.04))
    inner = h - 8
    out += bays(x + 22, y + 4, 6, 1, 36, inner, 4, blue=False)
    vx = x + 22 + 6 * 40 + 8
    out += rect(vx, y + 4, w - (vx - x) - 90, inner, G2, rx=2) + rect(vx, y + 4, w - (vx - x) - 90, inner, "url(#vent)", rx=2)
    px = x + w - 76
    if accent:
        out += rect(px, y + h / 2 - 2, 26, 4, "url(#gBlue)", rx=2)
    out += led(px + 36, y + h / 2, 2.2) + led(px + 46, y + h / 2, 2.2, W4, glow=False)
    return out


def blank_panel(x, y, w, h) -> str:
    out = rect(x, y, w, h, "url(#gMetal)", rx=2, stroke=W3, sw=1) + ears(x, y, w, h, ear=min(14, w * 0.04))
    out += rect(x + 24, y + h * 0.3, w - 48, h * 0.4, "url(#ventLight)", rx=2, op=0.7)
    return out


def switch_face(x, y, w, h, ports=24, cable_color: str | None = None) -> str:
    out = rect(x, y, w, h, "url(#gDark)", rx=2, stroke=G0, sw=1) + ears(x, y, w, h, ear=min(14, w * 0.04)).replace(mix(W2, W3, 0.5), G0)
    cols = ports // 2
    pw = (w - 150) / cols
    for r in range(2):
        for c in range(cols):
            px = x + 28 + c * pw
            py = y + h * 0.2 + r * (h * 0.4)
            out += rect(px, py, pw - 4, h * 0.3, G3, rx=1.5, stroke=G0, sw=0.8)
            out += rect(px + 2, py + 2, pw - 8, 2.2, B1 if (c + r) % 4 else W4, rx=1, op=0.9)
    out += rect(x + w - 108, y + h * 0.3, 70, 4, "url(#gBlue)", rx=2)
    out += led(x + w - 74, y + h * 0.65, 2.2)
    return out


def patch_panel(x, y, w, h, ports=24) -> str:
    out = rect(x, y, w, h, mix(W1, W2, 0.5), rx=2, stroke=W3, sw=1) + ears(x, y, w, h, ear=min(14, w * 0.04))
    cols = ports // 2
    pw = (w - 70) / cols
    for r in range(2):
        for c in range(cols):
            out += rect(x + 34 + c * pw, y + h * 0.18 + r * h * 0.4, pw - 5, h * 0.3, G1, rx=1.5)
    return out


def box_oblique(x, y, w, h, d, front=None, top=None, side=None, ox=0.6, oy=0.36, stroke=W3, sw=1, rx=0) -> str:
    """Cabinet-oblique box: flat front, receding top and right side. Returns shapes only."""
    dx, dy = d * ox, -d * oy
    front = front or "url(#gMetal)"
    top = top or "url(#gTop)"
    side = side or "url(#gSide)"
    out = poly([(x + w, y), (x + w + dx, y + dy), (x + w + dx, y + h + dy), (x + w, y + h)], side, stroke, sw)
    out += poly([(x, y), (x + dx, y + dy), (x + w + dx, y + dy), (x + w, y)], top, stroke, sw)
    out += rect(x, y, w, h, front, rx=rx, stroke=stroke, sw=sw)
    return out


def shadow(cx, cy, rx, ry, op=0.28, blur="blur16") -> str:
    return ell(cx, cy, rx, ry, G2, op=op, extra=f'filter="url(#{blur})"')


def cable(d: str, color: str = G1, sw: float = 5, hi: str | None = None) -> str:
    out = path(d, stroke=color, sw=sw)
    if hi:
        out += path(d, stroke=hi, sw=max(1.2, sw * 0.28), op=0.55)
    return out


def rack_front(x, y, w, h, units, layout, post=14, body=G1, face=None) -> str:
    """Flat rack front. `layout` = list of (kind, u) from top to bottom."""
    out = rect(x, y, w, h, body, rx=4, stroke=G0, sw=2)
    inner_x, inner_w = x + post, w - post * 2
    u_h = (h - 20) / units
    cy = y + 10
    for kind, u in layout:
        hh = u * u_h - 2
        fn = {
            "gpu": server_gpu, "1u": server_1u, "blank": blank_panel,
            "switch": switch_face, "patch": patch_panel,
        }[kind]
        out += g(fn(0, 0, 600, 52 * u - 2), f"translate({n(inner_x)} {n(cy + 1)}) scale({inner_w / 600:.4f} {hh / (52 * u - 2):.4f})")
        cy += u * u_h
    out += rect(x + 4, y + 4, post - 6, h - 8, G2, rx=2, op=0.6) + rect(x + w - post + 2, y + 4, post - 6, h - 8, G2, rx=2, op=0.6)
    return out


# --- one-point perspective ----------------------------------------------------
class Cam:
    def __init__(self, cx: float, cy: float, f: float):
        self.cx, self.cy, self.f = cx, cy, f

    def p(self, X: float, Y: float, Z: float) -> tuple[float, float]:
        return (self.cx + self.f * X / Z, self.cy + self.f * Y / Z)

    def quad_wall(self, X, Y0, Y1, Z0, Z1):
        return [self.p(X, Y0, Z0), self.p(X, Y0, Z1), self.p(X, Y1, Z1), self.p(X, Y1, Z0)]

    def quad_floor(self, Y, X0, X1, Z0, Z1):
        return [self.p(X0, Y, Z0), self.p(X1, Y, Z0), self.p(X1, Y, Z1), self.p(X0, Y, Z1)]
