-- Only one product can be «Үндсэн бүтээгдэхүүн» (group = main). Keep the one set most
-- recently; any other main product becomes a featured card.
UPDATE "products" SET "group" = 'featured'
WHERE "group" = 'main'
  AND "id" <> (SELECT "id" FROM "products" WHERE "group" = 'main' ORDER BY "updated_at" DESC LIMIT 1);

-- Partial unique index (not expressible in schema.prisma): at most one row with group = main.
CREATE UNIQUE INDEX "products_single_main_key" ON "products" (("group")) WHERE "group" = 'main';
