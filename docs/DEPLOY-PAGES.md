# Публикация на GitHub Pages

GitHub Pages отдаёт только статику, поэтому сайт собирается в `out/` (`npm run build:pages`), а заявки принимает отдельный **Cloudflare Worker** (`workers/lead`) — он использует тот же код проверки и доставки, что и серверный маршрут Next.js.

```
посетитель → GitHub Pages (статика) ──форма──► Cloudflare Worker ──► Telegram / webhook (CRM)
```

## 1. Включить Pages

В репозитории: **Settings → Pages → Build and deployment → Source: GitHub Actions**. Workflow `.github/workflows/pages.yml` запускается при пуше в `main`, вручную (Actions → Run workflow) и раз в сутки (чтобы обновлялся год в подвале). Адрес: `https://<владелец>.github.io/<репозиторий>/`.

## 2. Задеплоить приём заявок (Cloudflare Worker)

```bash
cd workers/lead
npm install
# в wrangler.toml поставьте ALLOWED_ORIGINS = адрес сайта (https://<владелец>.github.io)
npx wrangler login
npx wrangler secret put TELEGRAM_BOT_TOKEN
npx wrangler secret put TELEGRAM_CHAT_ID      # и/или LEAD_WEBHOOK_URL, LEAD_WEBHOOK_TOKEN
npx wrangler deploy                            # напечатает https://h200-lead.<аккаунт>.workers.dev
```

Токены лежат только в секретах Worker, в репозиторий и в браузер они не попадают. Origin сайта, которому разрешено слать форму, — `ALLOWED_ORIGINS` (по умолчанию чужим источникам Worker отвечает 403).

Рекомендуется добавить в Cloudflare правило ограничения частоты (Security → WAF → Rate limiting) на этот Worker: встроенный лимит живёт в памяти одного экземпляра.

## 3. Переменные репозитория

**Settings → Secrets and variables → Actions → Variables:**

| Переменная | Значение |
|---|---|
| `LEAD_ENDPOINT` | адрес Worker из шага 2. Пока пусто — форма честно пишет «приём заявок не подключён» |
| `DEMO` | `1` (по умолчанию) — показать **все** блоки с заглушками; `0` — боевая версия |
| `PAGES_BASE_PATH` | по умолчанию `/<имя репозитория>`; для корня сайта или своего домена — `/` |
| `CONTACT_EMAIL`, `CONTACT_PHONE` | публичные контакты (необязательно) |

## Демо и боевая версия

`DEMO=1` включает всё, что скрыто до подтверждения: карточки проектов (шаблоны), схему и карточки площадок, карточки специалистов, реквизиты и контакты-заглушки, строку про проекты расширения. Заглушки в `[квадратных скобках]` и помечены плашкой «Демо». Страница закрыта от индексации (`noindex`). **Для настоящего запуска ставьте `DEMO=0`** и заполняйте `src/content/site.ts` подтверждёнными данными.

## Локальная проверка

```bash
BASE_PATH=/itcluster npm run build:pages         # → out/
npx serve out                                    # или любой статический сервер с префиксом /itcluster
```

Скрипт на время сборки временно убирает серверные маршруты (`src/app/api`, `src/app/drafts`) и всегда возвращает их обратно.
