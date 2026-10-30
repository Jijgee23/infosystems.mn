-- /news has two categories: «Зөвлөгөө» (advice, guides) and «Мэдээ мэдээлэл» (the rest).
-- Same rule as normalizePostCategory in lib/post-categories.ts.
UPDATE "posts" SET "category" = CASE
  WHEN "category" LIKE '%Зөвлөгөө%' OR "category" LIKE '%зөвлөгөө%'
    OR "category" LIKE 'Гарын авлага%' OR "category" LIKE '%Заавар%' OR "category" LIKE '%заавар%' THEN 'Зөвлөгөө'
  ELSE 'Мэдээ мэдээлэл'
END;
