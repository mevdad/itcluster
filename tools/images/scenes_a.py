"""IMG-01 hero corridor + shared perspective-aisle builder (also used by IMG-16)."""

from __future__ import annotations

import random

from kit import *

# Symbols: faceplates drawn once in local px (600 wide, 52 per rack unit), instanced with <use>.
SYMS = {
    "gpu4": (4, lambda: server_gpu(0, 0, 600, 208)),
    "srv2": (2, lambda: server_1u(0, 0, 600, 104)),
    "srv1": (1, lambda: server_1u(0, 0, 600, 52)),
    "sw1": (1, lambda: switch_face(0, 0, 600, 52)),
    "blk1": (1, lambda: blank_panel(0, 0, 600, 52)),
    "pp1": (1, lambda: patch_panel(0, 0, 600, 52)),
}


def sym_defs() -> str:
    return "".join(f'<g id="s_{k}">{fn()}</g>' for k, (_, fn) in SYMS.items())


def rack_layout(rng: random.Random, units: int = 42) -> list[str]:
    out: list[str] = []
    left = units
    weights = [("gpu4", 5), ("srv2", 3), ("srv1", 3), ("sw1", 1), ("blk1", 1), ("pp1", 1)]
    names = [w[0] for w in weights]
    wt = [w[1] for w in weights]
    while left > 0:
        k = rng.choices(names, wt)[0]
        u = SYMS[k][0]
        if u > left:
            k, u = "blk1", 1
        out.append(k)
        left -= u
    return out


def aisle(cam: Cam, rng: random.Random, sides=(-1, 1), x_wall=1.3, z0=1.3, z1=22.0, fog="#0E1217", fog_max=0.9,
          rack_body=G2, top_y=-0.75, floor_y=1.55, fog_base=0.46) -> str:
    """Rows of racks along a corridor; each rack fogged by distance."""
    out = ""
    rack_len, gap = 0.6, 0.02
    k = 0
    ranges = []
    z = z0
    while z < z1:
        ranges.append((z, z + rack_len))
        z += rack_len + gap
    # far to near so nearer racks overdraw
    for side in sides:
        X = side * x_wall
        for (za, zb) in reversed(ranges):
            wall = cam.quad_wall(X, top_y, floor_y, za, zb)
            out += poly(wall, rack_body, G0, 0.6)
            layout = rack_layout(rng)
            y = top_y + 0.06
            u_m = (floor_y - top_y - 0.12) / 42
            for kind in layout:
                u = SYMS[kind][0]
                y0, y1 = y, y + u * u_m
                p0 = cam.p(X, y0 + 0.004, za + 0.03)
                p1 = cam.p(X, y0 + 0.004, zb - 0.03)
                p2 = cam.p(X, y1 - 0.004, za + 0.03)
                out += f'<use href="#s_{kind}" transform="{matrix(p0, p1, p2, 600, 52 * u)}"/>'
                y = y1
            t = fog_base + min(1.0, max(0.0, (za - z0) / (z1 - z0))) ** 0.6 * (fog_max - fog_base)
            out += poly(wall, fog, op=t)
            k += 1
    return out


def hero(vb=None):
    W, H = 1200, 1500
    cam = Cam(W / 2, H * 0.44, 1000)
    rng = random.Random(1)
    ceil_y, floor_y = -1.45, 1.55
    z0, z1 = 1.3, 24.0
    body = rect(0, 0, W, H, "#0D1116")
    # end of the aisle: soft lit doorway
    a, b = cam.p(-1.3, ceil_y, z1), cam.p(1.3, floor_y, z1)
    body += rect(a[0], a[1], b[0] - a[0], b[1] - a[1], "url(#hGlow)")
    body += ell(W / 2, cam.cy + 6, 170, 210, "url(#gGlow)")
    # floor + ceiling
    body += poly(cam.quad_floor(floor_y, -1.3, 1.3, z0, z1), "url(#hFloor)")
    body += poly(cam.quad_floor(ceil_y, -1.3, 1.3, z0, z1), "url(#hCeil)")
    # floor tiles
    for zz in [z0 + i * 0.6 for i in range(0, 40)]:
        if zz > z1:
            break
        pA, pB = cam.p(-1.3, floor_y, zz), cam.p(1.3, floor_y, zz)
        body += line(pA[0], pA[1], pB[0], pB[1], "#2A323C", 1.2, op=max(0.08, 0.55 - (zz - z0) / 22))
    for xx in (-0.65, 0.0, 0.65):
        pA, pB = cam.p(xx, floor_y, z0), cam.p(xx, floor_y, z1)
        body += line(pA[0], pA[1], pB[0], pB[1], "#2A323C", 1.2, op=0.4)
    # blue floor LED strips (glow + core)
    for xx in (-1.0, 1.0):
        glow = cam.quad_floor(floor_y, xx - 0.07, xx + 0.07, z0, z1)
        core = cam.quad_floor(floor_y, xx - 0.012, xx + 0.012, z0, z1)
        body += poly(glow, B1, op=0.22, extra='filter="url(#blur8)"') + poly(core, B2, op=0.95)
    # racks
    body += aisle(cam, rng, z0=z0, z1=z1)
    # ceiling light bars (segments)
    for xx in (-0.55, 0.55):
        zz = 2.2
        while zz < z1:
            seg = cam.quad_floor(ceil_y + 0.01, xx - 0.07, xx + 0.07, zz, zz + 1.5)
            body += poly(seg, mix("#FFFFFF", "#9DBBFF", 0.35), op=max(0.12, 0.7 - (zz - 2) / 20))
            zz += 2.4
    # light spill on floor
    body += ell(W / 2, cam.p(0, floor_y, 3.2)[1], 330, 90, B1, op=0.14, extra='filter="url(#blur16)"')
    # vignette
    body += rect(0, 0, W, H, "url(#hVig)")
    ex = f"""
<linearGradient id="hFloor" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#27425F"/><stop offset="0.35" stop-color="#151B22"/><stop offset="1" stop-color="#0B0E12"/></linearGradient>
<linearGradient id="hCeil" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#1B232C"/><stop offset="1" stop-color="#090B0E"/></linearGradient>
<linearGradient id="hGlow" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7EA3FF"/><stop offset="1" stop-color="#DCE7FF"/></linearGradient>
<radialGradient id="hVig" cx="0.5" cy="0.45" r="0.78"><stop offset="0.45" stop-color="#05070A" stop-opacity="0"/><stop offset="1" stop-color="#05070A" stop-opacity="0.78"/></radialGradient>
{sym_defs()}"""
    return svg(W, H, body, vb, bg="#0D1116", extra_defs=ex)
