# infosystems.mn

The new infosystems.mn site, built with Next.js 16, Postgres and Prisma 7. It replaces the old Strapi v3 backend (`../infosystems-back`) and the old frontend.

| Area | Path | Notes |
|---|---|---|
| Public site | `app/(site)/*` | Converted from `../InfoSystems_new_front` |
| News | `/news`, `/news/[slug]` | Read from the DB and cached with `"use cache"` + `cacheTag("posts")` |
| Contact / demo form | `/contact` → `lib/actions/contact.ts` | Saved to `contact_requests`, then emailed to `NOTIFY_EMAIL` |
| Customer portal | `/portal` | Sign in with a company register number or email plus password. Customers can file issues and reply |
| Admin | `/admin` | Roles `admin` and `employee` |
| Desktop app API | `/api/news-check`, `/api/version-infos`, `/api/auth/local`, `/api/checkcustomerlicense`, `/api/bankrate`, `/api/coreissues` | Same request and response shapes as Strapi |
| Uploads | `/uploads/*` | Served from `UPLOAD_DIR` (default `storage/uploads`), at the same URLs Strapi used |
| Private files | `/files/<id>` | Issue attachments and project-issue screenshots, from `PRIVATE_UPLOAD_DIR` (default `storage/private`). Staff, or the customer who owns the issue, only |

## Local setup

```bash
cp .env.example .env          # fill in DATA_BASE_URL and AUTH_SECRET
createdb -U postgres infosystems
npm install                   # also runs `prisma generate`
npm run db:migrate            # prisma migrate dev: creates/applies prisma/migrations
npm run db:import -- ../infosystems-back/exported.sql --reset
npm run create-admin -- you@infosystems.mn "Таны нэр"
npm run dev
```

`npm run db:import -- <dump> --dry` only parses the dump and prints row counts.

When `SMTP_HOST` is empty, emails are written to the console instead of being sent.

## Schema changes

Edit `prisma/schema.prisma`, then run `npm run db:migrate -- --name <change>`. Commit the new folder in `prisma/migrations`. The client is generated to `lib/generated/prisma` (gitignored), and `lib/db/index.ts` exports it as `db`.

## Moving production over

1. Take a fresh dump from the production MySQL. `exported.sql` in the repo is out of date: production has 92 version-infos, and the dump has only 34.
   ```bash
   mysqldump -u <user> -p infodata > infodata-$(date +%F).sql
   ```
2. Copy the Strapi uploads into the new upload dir, for example `rsync -a /path/to/strapi/public/uploads/ /var/www/infosystems/uploads/`, and set `UPLOAD_DIR`.
3. On the server, run `npm ci && npm run build && npm run db:deploy && npm run db:import -- infodata-….sql --reset && npm run db:products && npm run db:guides && npm run db:privatize -- --apply && npm run db:image-sizes && npx prisma db seed`. `db:privatize` moves issue attachments out of the public upload dir (run it without `--apply` first to see the list); `db:image-sizes` records the pixel size of images that lack it, which `next/image` uses to reserve their space. `db:products` loads the product pages from `prisma/data/product-content.json` (see below); `db:guides` loads the help guides from `prisma/data/guide-content.json`; the seed fills the company profile, the About timeline and the downloads list.
4. Start the app with `pm2 start ecosystem.config.js --env production`. It runs one process on port 3000 with `TZ=Asia/Ulaanbaatar`.
5. In nginx, send **everything**, including `/api/` and `/uploads/`, to `127.0.0.1:3000`. Remove the old `/api` → `:1337` rule. Set `client_max_body_size 60m;`. Pass the client address with `proxy_set_header X-Real-IP $remote_addr;` and `proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;`: rate limits key on `X-Real-IP` (or the last `X-Forwarded-For` hop), and without them every visitor shares one limit.
6. Keep Strapi and the MySQL DB stopped but intact for a while so you can roll back.
7. **Rotate every secret.** The old repo has hardcoded DB, SMTP and JWT passwords. Use new values for `AUTH_SECRET`, `LICENSE_JWT_SECRET`, the SMTP password and the DB password.

## Product pages

Every product page (`/products/<slug>`, modules at `/products/<parent>/<slug>`), the `/products` list and the header menu are built from the `products` table and its `product_blocks` (text, feature cards, links), edited in **Admin › Бүтээгдэхүүн**. `group` places a product on `/products` (main box, featured card or «Бусад систем»), `listed` hides it from lists without removing the page, and `parentId` makes it a module.

The initial content was taken from the hand-written pages of the new design into `prisma/data/product-content.json`. `npm run db:products` loads it into products that have no blocks yet; `-- --force` resets them to the file (discarding admin edits). It also renames the old Strapi product `macs` to `macs-erp`, keeping its customers and issues.

## Guides and downloads

`/support/guides` and every guide page (`/support/guides/<slug>`) come from the `guides` table, edited in **Admin › Заавар**. Sections are fixed in `lib/guide-categories.ts`; `sortOrder` is the step number inside a section. In the body, a YouTube link alone on its line becomes a video card and an image alone on its line can be zoomed (`lib/rich-body.ts`). The initial guides were taken from the hand-written pages into `prisma/data/guide-content.json` (`npm run db:guides`, `-- --force` to overwrite admin edits); their screenshots were placeholders, so none were carried over.

`/support/downloads` lists the `downloads` table (**Admin › Програм татах**): an uploaded installer or archive (checked by extension, 50MB max), the vendor's download page, or both, plus an optional guide.

Phone numbers and emails on public pages all come from **Компанийн мэдээлэл** (`getCompany()`, via `HelpCard`, `CtaContacts` and `components/site/company-links.tsx`); none are written in page code.

## Trust content

Everything that makes claims about customers is entered in admin and hidden on the site while empty: **Амжилтын түүх** (`/customers`, `/customers/<slug>`), **Хэрэглэгчийн сэтгэгдэл**, **Харилцагчийн лого**, and the trust-bar figures (Компанийн мэдээлэл › Тоон үзүүлэлт; with none entered, the founding year and product / module counts are computed from the data). Product pages also show their release notes from version_infos (`Product.versionNames`, all at `/updates`), the solutions they belong to (`Product.solutions`, listed back on each `/solutions/*` page), an intro video (`Product.videoUrl`, YouTube / Vimeo) and, for products marked «Харьцуулах хүснэгтэд», the comparison table on `/products` (Admin › Харьцуулах хүснэгт).

## Security headers

In production every response carries a Content-Security-Policy, HSTS and Permissions-Policy (`next.config.ts`). The CSP lists every outside origin the site uses (YouTube thumbnails, old posts' absolute `https://infosystems.mn` images, the YouTube / Vimeo / Google Maps iframes). **Embedding anything from another site (a chat widget, analytics, a new video host) needs its origin added there**, or the browser blocks it. Scripts allow `'unsafe-inline'` because nonces would make every page dynamic.

## Compatibility notes

- **IDs.** Every primary key is a string cuid2 (`@default(cuid(2))`). The importer assigns new cuids and keeps the old Strapi id in `legacy_id`, so old numeric links such as `/api/coreissues?project_category=3` still resolve. `insert_notifications` and `version_infos` also have an auto-increment `seq` column, imported from the old ids. The desktop APIs return `seq` as `id`, so the apps keep getting the same numbers.
- **Timezone.** The Postgres server runs in `Asia/Ulaanbaatar`, so every Prisma client connects with `-c TimeZone=UTC` (`pgOptions` in `lib/db`). Without that, `timestamp` columns are stored 8 hours off.
- **Passwords.** Strapi stored bcrypt hashes, so imported users sign in with their existing passwords.
- **`POST /api/auth/local`.** The old override handed out a JWT for any known `company_register` or email **without checking a password**. Installed desktop apps may depend on this, so it still works. The token it issues is license-scoped, though: only `/api/checkcustomerlicense` accepts it, and it grants no portal or data access.
- **`GET /api/news-check`.** The matching logic, including the old quirks, is ported from `infosystems-back/api/newsCheck`. Production currently answers 403 to the public, so check whether the apps still call it.
- **Permissions.** The old public role could update posts and products, delete notifications and answers, and upload files. None of that is carried over; every write now needs a staff session.
- **HTML sanitising.** Rich text (old CKEditor HTML, customer messages) passes through `lib/sanitize.ts` before it is rendered.
