# H200 Cloud — лендинг

Next.js 15 (App Router) · React 19 · TypeScript · Tailwind CSS 4. Подробности и правила — в [`CLAUDE.md`](CLAUDE.md).

## Запуск

```bash
npm install
cp .env.example .env.local   # заполните контакты и канал приёма заявок
npm run dev                  # http://localhost:3000
npm run build && npm start   # прод
```

## GitHub Pages и демо

`npm run build:pages` собирает статику в `out/`; приём заявок тогда переезжает на Cloudflare Worker (`workers/lead`), а `DEMO=1` показывает все блоки с заглушками. Пошаговая инструкция — [`docs/DEPLOY-PAGES.md`](docs/DEPLOY-PAGES.md).

## Приём заявок

`POST /api/lead` валидирует форму (на клиенте и на сервере), проверяет origin, ограничивает частоту обращений и доставляет заявку в настроенные каналы:

| Канал | Переменные |
|---|---|
| Telegram (сообщение + файл) | `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID` |
| Webhook (CRM, Make, n8n…) — `multipart/form-data` | `LEAD_WEBHOOK_URL`, `LEAD_WEBHOOK_TOKEN` (необязательно, уходит как `Bearer`) |

Успех показывается, только если **хотя бы один канал принял заявку**. Если ни один не настроен, форма отвечает «приём заявок не подключён»; если все упали — «не удалось передать заявку». В обоих случаях показываются контакты из `NEXT_PUBLIC_CONTACT_*`, если они заданы.

Ограничение: лимит запросов хранится в памяти процесса. При нескольких инстансах/serverless его нужно перенести в Redis или на edge.

## Структура

```
src/app/                 страницы: /, /privacy, /drafts/projects, /api/lead
src/components/          секции (sections/), форма, шапка, иллюстрации
src/content/site.ts      все факты о компании — выключены, пока не подтверждены
src/content/images.generated.ts   реестр изображений (генерируется)
src/lib/ , src/server/   схема формы, доставка заявок, rate limit
workers/lead/            Cloudflare Worker для приёма заявок на статическом хостинге
scripts/build-pages.mjs  статический экспорт для GitHub Pages
tools/images/            генератор 18 иллюстраций (Python, без зависимостей)
docs/                    DESIGN.md, IMAGES.md, CONTENT-TODO.md
```

## Изображения

`npm run images` пересобирает `public/images/*.svg` (вариант для компьютера и обрезка для телефона), `src/content/images.generated.ts` и `docs/IMAGES.md`. Требуется только Python 3.
