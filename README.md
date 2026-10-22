# H200 Cloud — лендинг

Next.js 15 (App Router) · React 19 · TypeScript · Tailwind CSS 4. Подробности и правила — в [`CLAUDE.md`](CLAUDE.md).

## Запуск

```bash
npm install
cp .env.example .env.local   # заполните контакты и канал приёма заявок
npm run dev                  # http://localhost:3000
npm run build && npm start   # прод
```

## GitHub Pages

`npm run photos` оптимизирует фото в WebP под слоты страницы (см. `docs/IMAGES.md`).

`npm run build:pages` собирает боевую статику в `out/`; приём заявок тогда переезжает на Cloudflare Worker (`workers/lead`). Пока Worker не задеплоен, форма вежливо сообщает, что отправка через сайт не подключена, и не имитирует успех. `DEMO=1` — только внутренний просмотр скрытых блоков с заглушками (по умолчанию выключен). Пошаговая инструкция — [`docs/DEPLOY-PAGES.md`](docs/DEPLOY-PAGES.md).

## Приём заявок

`POST /api/lead` валидирует форму (на клиенте и на сервере), проверяет origin, ограничивает частоту обращений и доставляет заявку в настроенные каналы:

| Канал | Переменные |
|---|---|
| Telegram (сообщение + файл) | `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID` |
| Webhook (CRM, Make, n8n…) — `multipart/form-data` | `LEAD_WEBHOOK_URL`, `LEAD_WEBHOOK_TOKEN` (необязательно, уходит как `Bearer`) |

Успех показывается, только если **хотя бы один канал принял заявку**. Если ни один не настроен (или на статике нет `LEAD_ENDPOINT`), форма спокойно сообщает «отправка заявок через сайт пока не подключена»; если все каналы упали — «не удалось передать заявку». В обоих случаях показываются контакты из `NEXT_PUBLIC_CONTACT_*`, если они заданы.

Ограничение: лимит запросов хранится в памяти процесса. При нескольких инстансах/serverless его нужно перенести в Redis или на edge.

## Структура

```
src/app/                 страницы: /, /privacy, /drafts/projects, /api/lead
src/components/          секции (sections/), форма, шапка, иллюстрации
src/content/site.ts      все факты о компании: подтверждённые цифры с датой актуальности, остальное выключено
src/content/images.generated.ts   реестр изображений (генерируется)
src/content/image-overrides.ts    реальные фотографии поверх реестра (правится вручную)
src/lib/ , src/server/   схема формы, доставка заявок, rate limit
workers/lead/            Cloudflare Worker для приёма заявок на статическом хостинге
scripts/build-pages.mjs  статический экспорт для GitHub Pages
tools/images/            генератор 18 иллюстраций (Python, без зависимостей)
docs/                    DESIGN.md, IMAGES.md, CONTENT-TODO.md
```

## Изображения

`npm run images` пересобирает `public/images/*.svg` (вариант для компьютера и обрезка для телефона), `src/content/images.generated.ts` и `docs/IMAGES.md`. Требуется только Python 3.

Реальные фотографии кладутся в `public/images/real/` и подключаются записью в `src/content/image-overrides.ts`, генератор трогать не нужно. Инструкция — [`docs/IMAGES.md`](docs/IMAGES.md).
