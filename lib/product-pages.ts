/**
 * Old Strapi product slugs whose content now lives on a different page of the new site
 * (redirected in next.config.ts). Every other old /product/<slug> URL goes to the DB
 * product page /products/<slug>.
 */
export const LEGACY_PRODUCT_PAGES: Record<string, string> = {
  macs: "/products/macs-erp",
  "macs-human-capital": "/products/macs-erp/hr-payroll",
  carservice: "/solutions/auto-service",
  "farmacy-pos": "/solutions/pharmacy",
};
