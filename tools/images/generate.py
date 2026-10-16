"""Builds public/images/*.svg (desktop + mobile crop) and the image manifest.

Run from the repo root:  python3 tools/images/generate.py
"""

from __future__ import annotations

import json
import os
import sys

sys.path.insert(0, os.path.dirname(__file__))

import scenes_a, scenes_b, scenes_c, scenes_d  # noqa: E402

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
OUT = os.path.join(ROOT, "public", "images")

ILLUSTRATION = "иллюстрация"
RENDER = "визуализация"


def crop(w, h, aspect, zoom, fx=0.5, fy=0.5):
    """Same-subject crop: viewBox of `aspect` at `zoom` (1 = widest fit), centred on (fx, fy)."""
    cw = min(w, h * aspect)
    ch = cw / aspect
    cw, ch = cw / zoom, ch / zoom
    x = min(max(fx * w - cw / 2, 0), w - cw)
    y = min(max(fy * h - ch / 2, 0), h - ch)
    return (round(x, 1), round(y, 1), round(cw, 1), round(ch, 1))


# code, slug, title, placement, source fn, canvas, mobile (aspect, zoom, fx, fy), status, alt
IMAGES = [
    ("IMG-01", "hero-racks", "Серверные стойки, главный кадр", "Первый экран, справа (45%)", scenes_a.hero, (1200, 1500), (4 / 3, 1.0, 0.5, 0.43), RENDER,
     "Визуализация: длинный коридор с рядами серверных стоек и синей подсветкой пола, в конце — светлый проём."),
    ("IMG-02", "gpu-node", "Серверный узел, вид спереди", "Услуги: карточка «Аренда GPU-серверов»", scenes_b.img02, (1600, 1000), (1.6, 1.12, 0.45, 0.5), RENDER,
     "Визуализация: GPU-сервер крупным планом, вид спереди под небольшим углом."),
    ("IMG-03", "supply-kit", "Комплект оборудования к проверке и отправке", "Услуги: карточка «Поставка оборудования»", scenes_b.img03, (1600, 1000), (1.6, 1.15, 0.55, 0.55), ILLUSTRATION,
     "Иллюстрация: упакованный сервер, GPU-карта, кабели и чек-лист приёмки на столе."),
    ("IMG-04", "open-rack-work", "Инженерная работа у открытой стойки", "Услуги: карточка «Настройка и сопровождение»", scenes_b.img04, (1600, 1000), (1.6, 1.2, 0.42, 0.5), ILLUSTRATION,
     "Иллюстрация процесса: открытая серверная стойка, инструменты и патч-корды, людей в кадре нет."),
    ("IMG-05", "ai-schema", "Схема: сотрудники и системы → ИИ-модель → GPU-сервер", "Блок «Собственный ИИ», справа", None, None, None, ILLUSTRATION,
     "Векторная схема: сотрудники и системы компании обращаются к ИИ-модели, которая работает на GPU-сервере."),
    ("IMG-06", "rack-full", "Стойка с оборудованием целиком", "Инфраструктура: большой кадр галереи", scenes_b.img06, (1600, 1000), (1.6, 1.08, 0.5, 0.5), RENDER,
     "Визуализация: серверная стойка целиком с GPU-серверами, коммутатором и патч-панелью."),
    ("IMG-07", "node-inside", "Серверный узел изнутри", "Инфраструктура: малый кадр галереи", scenes_b.img07, (1600, 1000), (1.6, 1.15, 0.5, 0.5), RENDER,
     "Визуализация: сервер без крышки, вид сверху: вентиляторы, процессоры, память и четыре GPU."),
    ("IMG-08", "network-patching", "Сетевая коммутация", "Инфраструктура: малый кадр галереи", scenes_b.img08, (1600, 1000), (1.6, 1.2, 0.5, 0.42), RENDER,
     "Визуализация: патч-панель и два коммутатора с аккуратно уложенными кабелями."),
    ("IMG-09", "ai-solution-scheme", "Схема решения: развёртывание ИИ", "Проекты: карточка проекта аренды / развёртывания ИИ", scenes_c.img09, (1600, 1000), (1.6, 1.12, 0.5, 0.5), ILLUSTRATION,
     "Иллюстрация: источники данных передают запросы к модели, которая работает на группе GPU-серверов."),
    ("IMG-10", "supply-composition", "Состав поставки", "Проекты: карточка проекта поставки", scenes_c.img10, (1600, 1000), (1.6, 1.08, 0.5, 0.5), ILLUSTRATION,
     "Иллюстрация: состав поставки — сервер, GPU-карты, коммутатор, кабели, направляющие, комплектующие."),
    ("IMG-11", "launch-scheme", "Схема запуска", "Проекты: карточка проекта настройки", scenes_c.img11, (1600, 1000), (1.6, 1.18, 0.5, 0.5), ILLUSTRATION,
     "Иллюстрация: пять последовательных шагов запуска — от монтажа и подключения до проверки и запуска."),
    ("IMG-12", "acceptance-desk", "Проверка оборудования при приёмке", "Поставка: главное изображение справа", scenes_c.img12, (1600, 1000), (1.6, 1.1, 0.5, 0.55), ILLUSTRATION,
     "Иллюстрация: открытый сервер на рабочем столе, упаковка, инструменты и чек-лист приёмки."),
    ("IMG-13", "gpu-card", "GPU-ускоритель", "Поставка: категория «GPU и ускорители»", scenes_d.img13, (1200, 900), (4 / 3, 1.1, 0.5, 0.5), RENDER,
     "Визуализация: GPU-ускоритель с двумя вентиляторами на нейтральном фоне."),
    ("IMG-14", "server-network", "Сервер и сетевое оборудование", "Поставка: категория «Серверы и сетевое оборудование»", scenes_d.img14, (1200, 900), (4 / 3, 1.1, 0.5, 0.5), RENDER,
     "Визуализация: сервер, коммутатор и маршрутизатор, соединённые патч-кордами."),
    ("IMG-15", "solar-energy", "Солнечная панель и энергетическое оборудование", "Поставка: категория «Солнечные панели и энергетическое оборудование»", scenes_d.img15, (1200, 900), (4 / 3, 1.1, 0.5, 0.55), RENDER,
     "Визуализация: солнечная панель на опоре, инвертор и аккумуляторный блок."),
    ("IMG-16", "diagnostics", "Диагностика оборудования", "Этапы работы: блок «После запуска остаёмся на связи»", scenes_d.img16, (1600, 1000), (1.6, 1.1, 0.6, 0.55), ILLUSTRATION,
     "Иллюстрация процесса: ноутбук с диагностикой подключён к серверу в ряду стоек, людей в кадре нет."),
    ("IMG-17", "competences", "Три направления в одном проекте", "Компания: блок «Компетенции, которые объединяют ваш проект»", scenes_d.img17, (1200, 1000), (1.2, 1.0, 0.5, 0.5), ILLUSTRATION,
     "Иллюстрация: инфраструктура, поставки и сопровождение связаны через единый центр проекта."),
    ("IMG-18", "rack-expansion", "Подготовка дополнительной стойки", "Партнёрам: небольшое изображение справа", scenes_d.img18, (1200, 900), (4 / 3, 1.0, 0.5, 0.5), RENDER,
     "Визуализация: стойка с частично установленным оборудованием и тележка со следующим сервером."),
]


def main() -> None:
    os.makedirs(OUT, exist_ok=True)
    manifest = []
    for code, slug, title, placement, fn, canvas, mob, status, alt in IMAGES:
        key = code.lower()
        entry = {"code": code, "id": key, "title": title, "placement": placement, "status": status, "alt": alt}
        if fn is None:
            entry.update(source="src/components/AiSchema.tsx", desktop=None, mobile=None,
                         note="Текст схемы набирается средствами страницы (HTML + inline SVG), поэтому файла-изображения нет.")
            manifest.append(entry)
            continue
        w, h = canvas
        desk = f"{key}-{slug}.svg"
        mfile = f"{key}-{slug}-m.svg"
        with open(os.path.join(OUT, desk), "w", encoding="utf-8") as f:
            f.write(fn())
        aspect, zoom, fx, fy = mob
        vb = crop(w, h, aspect, zoom, fx, fy)
        with open(os.path.join(OUT, mfile), "w", encoding="utf-8") as f:
            f.write(fn(vb))
        entry.update(
            source=f"tools/images/{fn.__module__}.py::{fn.__name__}",
            desktop={"src": f"/images/{desk}", "width": w, "height": h},
            mobile={"src": f"/images/{mfile}", "width": round(vb[2]), "height": round(vb[3]), "viewBox": list(vb)},
        )
        if tuple(vb) == (0, 0, w, h):  # identical crop: do not ship a duplicate file
            os.remove(os.path.join(OUT, mfile))
            entry["mobile"] = dict(entry["desktop"], viewBox=list(vb))
        manifest.append(entry)
    body = ",\n".join(f'  "{e["id"]}": {json.dumps(e, ensure_ascii=False)}' for e in manifest)
    with open(os.path.join(ROOT, "src", "content", "images.generated.ts"), "w", encoding="utf-8") as f:
        f.write("// Generated by tools/images/generate.py — do not edit by hand.\n")
        f.write('import type { ImageEntry } from "./image-types";\n\n')
        f.write("export const images = {\n" + body + ",\n} satisfies Record<string, ImageEntry>;\n")
    lines = [
        "# Реестр изображений IMG-01 — IMG-18",
        "",
        "Файл генерируется командой `npm run images` (`tools/images/generate.py`). Не редактируйте вручную.",
        "",
        "Реальных фотографий компании в исходных материалах нет, поэтому все кадры — собственные "
        "иллюстрации и визуализации. Они **не** изображают дата-центры, сотрудников или проекты компании. "
        "Реальные фотографии подключаются поверх этого реестра, без правки генератора (см. ниже).",
        "",
        "## Как заменить картинку реальной фотографией",
        "",
        "1. Положите файл в `public/images/real/` (JPG или WebP, около 2000 px по длинной стороне, до ~400 КБ). "
        "Для телефона можно положить отдельный кадр, например `…-m.jpg`.",
        "2. Найдите код слота в таблице ниже (например, IMG-06 → id `img-06`).",
        "3. Добавьте запись в `src/content/image-overrides.ts`:",
        "",
        "   ```ts",
        '   "img-06": {',
        '     desktop: { src: "/images/real/rack-msk.jpg", width: 2400, height: 1600 },',
        '     mobile: { src: "/images/real/rack-msk-m.jpg", width: 1200, height: 900 }, // необязательно',
        '     alt: "Что именно на фото",',
        '     status: "реальная фотография",',
        '     objectPosition: "50% 40%", // необязательно: какая часть кадра остаётся видна при обрезке',
        "   },",
        "   ```",
        "",
        "4. `npm run typecheck` — опечатка в id, пропущенный `alt` или неверный статус не скомпилируются.",
        "",
        "Что происходит автоматически:",
        "",
        "- пропорции блока на странице остаются от слота (колонки «Десктоп» и «Телефон» ниже), фото любого размера "
        "вписывается в него с `object-fit: cover`; положение кадра задаёт `objectPosition`;",
        "- плашка «Визуализация» / «Иллюстрация» на картинке для реальной фотографии не показывается; "
        "в подписях галереи инфраструктуры (`Infrastructure.tsx`) пропадает слово «Визуализация»;",
        "- `width`/`height` указывайте реальные размеры файла: они нужны браузеру, на раскладку не влияют.",
        "",
        "Проверьте вручную: подпись к кадру (если есть) описывает именно ваше фото; на фото нет лиц или данных "
        "клиентов без согласия; первый экран (IMG-01) после замены остаётся лёгким, так как влияет на LCP.",
        "",
        "## Реестр",
        "",
        "| Код | Название | Место на странице | Статус | Исходник | Десктоп | Телефон (обрезка) | Alt |",
        "|---|---|---|---|---|---|---|---|",
    ]
    for e in manifest:
        d, m = e["desktop"], e["mobile"]
        dtxt = f"`{d['src']}` {d['width']}×{d['height']}" if d else "—"
        mtxt = f"`{m['src']}` {m['width']}×{m['height']}" if m else "—"
        lines.append(f"| {e['code']} | {e['title']} | {e['placement']} | {e['status']} | `{e['source']}` | {dtxt} | {mtxt} | {e['alt']} |")
    with open(os.path.join(ROOT, "docs", "IMAGES.md"), "w", encoding="utf-8") as f:
        f.write("\n".join(lines) + "\n")
    print("wrote svg files, images.generated.ts, docs/IMAGES.md")


if __name__ == "__main__":
    main()
