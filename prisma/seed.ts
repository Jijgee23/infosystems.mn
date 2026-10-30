/**
 * Seeds the company profile, history timeline, product comparison and downloads with the values the
 * site used to hardcode. Run after `npm run db:products` (the comparison needs the products).
 * Safe to re-run: only fills in data that isn't there yet.
 *
 *   npx prisma db seed
 */
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../lib/generated/prisma/client";

process.loadEnvFile?.(".env");

const prisma = new PrismaClient({
  adapter: new PrismaPg({
    connectionString: process.env.DATA_BASE_URL!,
    options: "-c TimeZone=UTC",
  }),
});

async function main() {
  if (!(await prisma.companySettings.findFirst()))
    await prisma.companySettings.create({
      data: {
        name: "InfoSystems Mongolia",
        legalName: "Инфосистемс Монголиа ХХК",
        shortDescription:
          "InfoSystems Mongolia нь 1997 оноос мэдээллийн технологийн салбарт програм хангамжийн чиглэлээр ажиллаж, зах зээлд өөрийн байр сууриа эзэлсэн тэргүүлэгч компаниудын нэг.",
        foundedYear: 1997,
        address:
          "Улаанбаатар хот, Чингэлтэй дүүрэг, 5-р хороо, Баянбогд плаза, 402 тоот",
        locationName: "Баянбогд плаза",
        mapUrl:
          "https://www.google.com/maps/search/?api=1&query=" +
          encodeURIComponent("Баянбогд плаза, Чингэлтэй дүүрэг, Улаанбаатар"),
        workingHours: "Даваа–Баасан 09:00–18:00",
      },
    });

  if ((await prisma.companyContact.count()) === 0) {
    await prisma.companyContact.createMany({
      data: [
        { type: "phone", value: "70116399", sortOrder: 1 },
        { type: "phone", value: "70126399", sortOrder: 2 },
        { type: "phone", value: "91916549", sortOrder: 3 },
        { type: "email", value: "contact@infosystems.mn", sortOrder: 1 },
        {
          type: "social",
          label: "Facebook",
          value: "https://www.facebook.com/infosystems.mn",
          sortOrder: 1,
        },
      ],
    });
  }
  if ((await prisma.milestone.count()) === 0) {
    await prisma.milestone.createMany({
      data: [
        {
          year: 1997,
          title: "Програм хангамжийн салбарт",
          description: "Мэдээллийн технологийн салбарт програм хангамжийн чиглэлээр үйл ажиллагаагаа эхэлсэн.",
        },
        {
          year: 1998,
          title: "MACS — Сангийн яамны зөвшөөрөл",
          description: "Сангийн яамны Нягтлан бодох бүртгэлийн газраас 2 жил тутам шинэчлэн олгодог тусгай зөвшөөрлийг авч эхэлсэн.",
        },
        { year: 2006, title: "PACS", description: "Төслийн санхүүгийн PACS програмын анхны хувилбарыг гаргасан." },
      ],
    });
  }
  // Comparison table on /products: only facts stated on the product pages. Cells nobody
  // has filled in stay empty (shown blank, not as "no"); complete them in admin.
  if ((await prisma.comparisonRow.count()) === 0) {
    const ids = Object.fromEntries((await prisma.product.findMany({ where: { slug: { in: ["macs-erp", "macs-pos", "macs-micro"] } }, select: { id: true, slug: true } })).map((p) => [p.slug, p.id]));
    const rows: [string, Record<string, string>][] = [
      ["Зориулалт", { "macs-erp": "Санхүүгийн бүртгэлийн иж бүрэн програм", "macs-pos": "Дэлгүүр, үйлчилгээний кассын програм", "macs-micro": "Бичил бизнесийн санхүүгийн апп" }],
      ["Сангийн яамны зөвшөөрөл", { "macs-erp": "✓" }],
      ["Модулиуд", { "macs-erp": "8 модуль" }],
      ["MACS ERP-тэй холбогдох", { "macs-pos": "✓ эсвэл дангаараа" }],
      ["Эмийн сангийн хувилбар", { "macs-pos": "✓" }],
      ["Төхөөрөмж", { "macs-micro": "Гар утас" }],
    ];
    for (const [i, [label, cells]] of rows.entries()) {
      await prisma.comparisonRow.create({
        data: {
          label,
          sortOrder: i,
          cells: { create: Object.entries(cells).filter(([slug]) => ids[slug]).map(([slug, value]) => ({ productId: ids[slug], value })) },
        },
      });
    }
  }
  // /support/downloads as it was hand-written, with the installers the old Strapi site hosted
  // (AnyDesk.exe, UltraViewer 6.4; imported as files.legacy_id 77 / 78) attached when present.
  if ((await prisma.download.count()) === 0) {
    const legacyFile = async (legacyId: number) => (await prisma.file.findUnique({ where: { legacyId }, select: { id: true } }))?.id ?? null;
    await prisma.download.createMany({
      data: [
        { title: "AnyDesk", description: "Алсаас тусламж авах програм", fileId: await legacyFile(77), externalUrl: "https://anydesk.com/en/downloads", guideSlug: "anydesk", sortOrder: 1 },
        { title: "TeamViewer", description: "Алсаас тусламж авах програм", externalUrl: "https://www.teamviewer.com/en/download/windows", guideSlug: "teamviewer", sortOrder: 2 },
        { title: "UltraViewer", description: "Алсаас тусламж авах програм (v6.4)", fileId: await legacyFile(78), externalUrl: "https://www.ultraviewer.net/en/download.html", sortOrder: 3 },
      ],
    });
  }
  console.log("Company profile seeded.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
