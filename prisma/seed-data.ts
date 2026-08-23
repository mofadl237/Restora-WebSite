/**
 * RESTORA seed data — the CURRENT commercial plans, features and gifts.
 * These are initial values only; everything remains editable from the Admin CMS.
 */

export const LOCALES = ["en", "ar"] as const;
export type SeedLocale = (typeof LOCALES)[number];

// ---------------------------------------------------------------------------
// Branding
// ---------------------------------------------------------------------------
export const brandingSeed = {
  id: 1,
  brandName: "RESTORA",
  primaryColor: "#EF6701",
  secondaryColor: "#221812",
  accentColor: "#FF8A3D",
  defaultLocale: "ar",
  contactEmail: "hello@restora.app",
};

export const socialLinksSeed = [
  { platform: "facebook", url: "https://facebook.com/restora", sortOrder: 0 },
  { platform: "instagram", url: "https://instagram.com/restora", sortOrder: 1 },
  { platform: "linkedin", url: "https://linkedin.com/company/restora", sortOrder: 2 },
];

// ---------------------------------------------------------------------------
// Countries
// ---------------------------------------------------------------------------
export const countriesSeed = [
  { code: "EG", name: "Egypt", currencyCode: "EGP", currencySymbol: "ج.م", locale: "ar", dialCode: "+20", sortOrder: 0 },
  { code: "SA", name: "Saudi Arabia", currencyCode: "SAR", currencySymbol: "ر.س", locale: "ar", dialCode: "+966", sortOrder: 1 },
  { code: "AE", name: "United Arab Emirates", currencyCode: "AED", currencySymbol: "د.إ", locale: "ar", dialCode: "+971", sortOrder: 2 },
];

// ---------------------------------------------------------------------------
// Features
// ---------------------------------------------------------------------------
export type FeatureSeed = {
  key: string;
  icon: string;
  category: string;
  sortOrder: number;
  en: { name: string; description?: string };
  ar: { name: string; description?: string };
};

export const featuresSeed: FeatureSeed[] = [
  { key: "website", icon: "globe", category: "presence", sortOrder: 0,
    en: { name: "Full restaurant website", description: "A complete professional website for your restaurant." },
    ar: { name: "موقع إلكتروني كامل للمطعم", description: "موقع احترافي متكامل لمطعمك." } },
  { key: "digital-menu", icon: "utensils", category: "menu", sortOrder: 1,
    en: { name: "Digital menu" },
    ar: { name: "منيو رقمي" } },
  { key: "menu-management", icon: "list", category: "menu", sortOrder: 2,
    en: { name: "Menu management", description: "Add, edit and organize dishes anytime." },
    ar: { name: "إدارة المنيو", description: "أضف وعدّل وصفوف الأطباق في أي وقت." } },
  { key: "qr-menu", icon: "qr-code", category: "menu", sortOrder: 3,
    en: { name: "QR menu", description: "Customers scan and browse instantly." },
    ar: { name: "منيو QR", description: "العميل يمسح الكود ويستعرض المنيو فورًا." } },
  { key: "online-ordering", icon: "shopping-bag", category: "ordering", sortOrder: 4,
    en: { name: "Online ordering", description: "Receive orders directly from your own channels." },
    ar: { name: "طلب أونلاين", description: "استقبل الطلبات مباشرة من قنواتك الخاصة." } },
  { key: "cart", icon: "cart", category: "ordering", sortOrder: 5,
    en: { name: "Cart" },
    ar: { name: "سلة الطلبات" } },
  { key: "checkout", icon: "credit-card", category: "ordering", sortOrder: 6,
    en: { name: "Checkout", description: "Smooth purchasing flow for your customers." },
    ar: { name: "إتمام الشراء", description: "تجربة شراء سلسة لعملائك." } },
  { key: "delivery-pricing", icon: "truck", category: "delivery", sortOrder: 7,
    en: { name: "Delivery pricing configuration", description: "Set delivery fees per area." },
    ar: { name: "تسعير التوصيل", description: "حدد رسوم التوصيل لكل منطقة." } },
  { key: "order-tracking", icon: "map-pin", category: "delivery", sortOrder: 8,
    en: { name: "Order tracking", description: "Customers follow their order status." },
    ar: { name: "تتبع الطلبات", description: "العميل يتابع حالة طلبه لحظة بلحظة." } },
  { key: "reservations", icon: "calendar-check", category: "operations", sortOrder: 9,
    en: { name: "Table reservations", description: "Accept and manage bookings online." },
    ar: { name: "حجز الطاولات", description: "استقبل وأدر الحجوزات أونلاين." } },
  { key: "offers", icon: "badge-percent", category: "marketing", sortOrder: 10,
    en: { name: "Offers & promotions", description: "Create and manage promotions easily." },
    ar: { name: "العروض والخصومات", description: "أنشئ وأدر العروض بسهولة." } },
  { key: "homepage-sections", icon: "layout-template", category: "marketing", sortOrder: 11,
    en: { name: "Homepage section management", description: "Control what appears on your site's homepage." },
    ar: { name: "إدارة أقسام الصفحة الرئيسية", description: "تحكم فيما يظهر على صفحة موقعك الرئيسية." } },
  { key: "multi-language", icon: "languages", category: "presence", sortOrder: 12,
    en: { name: "Multi-language support", description: "Serve customers in their language." },
    ar: { name: "دعم تعدد اللغات", description: "خدم عملاءك بلغتهم." } },
  { key: "employees", icon: "users", category: "team", sortOrder: 13,
    en: { name: "Employees", description: "Manage your team accounts." },
    ar: { name: "إدارة الموظفين", description: "أدر حسابات فريق عملك." } },
  { key: "roles-permissions", icon: "shield-check", category: "team", sortOrder: 14,
    en: { name: "Roles & permissions", description: "Each employee sees only what they need." },
    ar: { name: "الأدوار والصلاحيات", description: "كل موظف يرى ما يحتاجه فقط." } },
  { key: "analytics-basic", icon: "chart-column", category: "insights", sortOrder: 15,
    en: { name: "General analytics", description: "Understand sales and traffic at a glance." },
    ar: { name: "تحليلات عامة", description: "افهم مبيعاتك وزوارك بنظرة واحدة." } },
  { key: "activity-logs", icon: "history", category: "operations", sortOrder: 16,
    en: { name: "Activity logs", description: "Track every action inside your dashboard." },
    ar: { name: "سجل النشاطات", description: "تابع كل إجراء يتم داخل لوحتك." } },
  { key: "customers-crm", icon: "user-round", category: "customers", sortOrder: 17,
    en: { name: "Customer management", description: "Know who buys from you." },
    ar: { name: "إدارة العملاء", description: "اعرف من يشتري منك." } },
  { key: "purchase-history", icon: "receipt-text", category: "customers", sortOrder: 18,
    en: { name: "Customer purchase history", description: "See what each customer orders over time." },
    ar: { name: "سجل مشتريات العميل", description: "شاهد ما يطلبه كل عميل عبر الزمن." } },
  { key: "qr-tables", icon: "qr-code", category: "dinein", sortOrder: 19,
    en: { name: "QR code per table", description: "A dedicated QR for every table." },
    ar: { name: "QR لكل طاولة", description: "كود خاص لكل طاولة." } },
  { key: "dine-in", icon: "utensils-crossed", category: "dinein", sortOrder: 20,
    en: { name: "Dine-in ordering", description: "Order right from the table." },
    ar: { name: "الطلب داخل المطعم", description: "العميل يطلب من طاولته مباشرة." } },
  { key: "custom-domain", icon: "link", category: "growth", sortOrder: 21,
    en: { name: "Custom domain", description: "Your brand on your own domain." },
    ar: { name: "دومين خاص", description: "علامتك على نطاقك الخاص." } },
  { key: "advanced-seo", icon: "trending-up", category: "growth", sortOrder: 22,
    en: { name: "Advanced SEO", description: "Tools to improve your search visibility." },
    ar: { name: "تحسين محركات البحث المتقدم", description: "أدوات لتحسين ظهورك في نتائج البحث." } },
  { key: "priority-support", icon: "headset", category: "support", sortOrder: 23,
    en: { name: "Priority support", description: "Faster help when you need it." },
    ar: { name: "دعم ذو أولوية", description: "مساعدة أسرع عندما تحتاجها." } },
];

// ---------------------------------------------------------------------------
// Plans — CURRENT commercial plans
// Yearly prices are stored independently (never derived from monthly).
// ---------------------------------------------------------------------------
export type PlanSeed = {
  slug: string;
  displayOrder: number;
  popular?: boolean;
  monthlyPrice: string;
  yearlyPrice: string;
  monthlyCompareAtPrice?: string;
  yearlyCompareAtPrice?: string;
  badgeKey?: string;
  features: string[];
  en: { name: string; shortDescription: string; longDescription: string };
  ar: { name: string; shortDescription: string; longDescription: string };
};

const starterFeatures = [
  "website", "digital-menu", "menu-management", "qr-menu",
  "online-ordering", "cart", "checkout", "delivery-pricing",
  "order-tracking", "employees", "analytics-basic", "multi-language",
];
const growthFeatures = [...starterFeatures, "reservations", "offers", "homepage-sections", "roles-permissions"];
const professionalFeatures = [...growthFeatures, "activity-logs", "customers-crm", "purchase-history", "qr-tables", "dine-in"];
const enterpriseFeatures = [...professionalFeatures, "custom-domain", "advanced-seo", "priority-support"];

export const plansSeed: PlanSeed[] = [
  {
    slug: "starter",
    displayOrder: 0,
    monthlyPrice: "447",
    yearlyPrice: "4470",
    features: starterFeatures,
    en: {
      name: "Starter",
      shortDescription: "Everything a restaurant needs to go digital.",
      longDescription: "Get your restaurant online with a full website, digital menu and online ordering — no disconnected tools required.",
    },
    ar: {
      name: "ستارتر",
      shortDescription: "كل ما يحتاجه مطعمك للتحول الرقمي.",
      longDescription: "اجعل مطعمك أونلاين بموقع كامل ومنيو رقمي وطلبات عبر الإنترنت — بدون أدوات متفرقة.",
    },
  },
  {
    slug: "growth",
    displayOrder: 1,
    popular: true,
    badgeKey: "popular",
    monthlyPrice: "947",
    yearlyPrice: "9470",
    monthlyCompareAtPrice: "1894",
    yearlyCompareAtPrice: "18940",
    features: growthFeatures,
    en: {
      name: "Growth",
      shortDescription: "From taking orders to running your operation.",
      longDescription: "Move beyond simple ordering: manage reservations, promotions, employees and permissions from one dashboard.",
    },
    ar: {
      name: "جروث",
      shortDescription: "من استقبال الطلبات إلى إدارة مطعمك بالكامل.",
      longDescription: "انتقل لما هو أبعد من الطلبات فقط: أدر الحجوزات والعروض والموظفين والصلاحيات من لوحة واحدة.",
    },
  },
  {
    slug: "professional",
    displayOrder: 2,
    monthlyPrice: "1447",
    yearlyPrice: "14470",
    monthlyCompareAtPrice: "2894",
    yearlyCompareAtPrice: "28940",
    features: professionalFeatures,
    en: {
      name: "Professional",
      shortDescription: "Know your customers. Own the dine-in experience.",
      longDescription: "Understand who your customers are and bring digital ordering inside your restaurant with table QR codes.",
    },
    ar: {
      name: "بروفيشنال",
      shortDescription: "اعرف عملاءك. امتلك تجربة الطلب داخل المطعم.",
      longDescription: "افهم من هم عملاؤك، وادخل تجربة الطلب الرقمية داخل مطعمك عبر أكواد QR لكل طاولة.",
    },
  },
  {
    slug: "enterprise",
    displayOrder: 3,
    monthlyPrice: "2997",
    yearlyPrice: "29970",
    features: enterpriseFeatures,
    en: {
      name: "Enterprise",
      shortDescription: "Turn RESTORA into a serious growth channel.",
      longDescription: "For restaurants that want their own domain, advanced search visibility tools and priority support.",
    },
    ar: {
      name: "إنتربرايز",
      shortDescription: "اجعل RESTORA قناة نمو حقيقية.",
      longDescription: "للمطاعم التي تريد دومين خاصًا وأدوات متقدمة للظهور في نتائج البحث ودعمًا ذا أولوية.",
    },
  },
];

// ---------------------------------------------------------------------------
// Gifts — annual subscription perks
// ---------------------------------------------------------------------------
export type GiftSeed = {
  slug: string;
  icon: string;
  sortOrder: number;
  en: { name: string; description: string };
  ar: { name: string; description: string };
};

export const giftsSeed: GiftSeed[] = [
  {
    slug: "qr-website", icon: "qr-code", sortOrder: 0,
    en: { name: "QR Website", description: "A scannable QR that opens your restaurant site anywhere." },
    ar: { name: "موقع QR", description: "كود قابل للمسح يفتح موقع مطعمك في أي مكان." },
  },
  {
    slug: "qr-google-reviews", icon: "star", sortOrder: 1,
    en: { name: "QR Google Reviews", description: "Make it effortless for happy customers to leave reviews." },
    ar: { name: "QR لتقييمات جوجل", description: "اجعل ترك التقييم أسهل لعملائك السعداء." },
  },
  {
    slug: "google-maps-setup", icon: "map-pin", sortOrder: 2,
    en: { name: "Google Maps listing setup", description: "We set up your restaurant listing on Google Maps." },
    ar: { name: "إعداد مطعمك على خرائط جوجل", description: "نقوم بإعداد ظهور مطعمك على خرائط جوجل." },
  },
];

// Country-specific initial pricing overrides for SA / AE.
// Egypt mirrors plan defaults. Admin can change any of these later.
export const countryPricingOverrides: Record<string, Array<{
  planSlug: string;
  monthlyPrice: string;
  yearlyPrice: string;
  monthlyCompareAtPrice?: string;
  yearlyCompareAtPrice?: string;
}>> = {
  SA: [
    { planSlug: "starter", monthlyPrice: "79", yearlyPrice: "790" },
    { planSlug: "growth", monthlyPrice: "149", yearlyPrice: "1490", monthlyCompareAtPrice: "298", yearlyCompareAtPrice: "2980" },
    { planSlug: "professional", monthlyPrice: "229", yearlyPrice: "2290", monthlyCompareAtPrice: "458", yearlyCompareAtPrice: "4580" },
    { planSlug: "enterprise", monthlyPrice: "449", yearlyPrice: "4490" },
  ],
  AE: [
    { planSlug: "starter", monthlyPrice: "79", yearlyPrice: "790" },
    { planSlug: "growth", monthlyPrice: "159", yearlyPrice: "1590", monthlyCompareAtPrice: "318", yearlyCompareAtPrice: "3180" },
    { planSlug: "professional", monthlyPrice: "249", yearlyPrice: "2490", monthlyCompareAtPrice: "498", yearlyCompareAtPrice: "4980" },
    { planSlug: "enterprise", monthlyPrice: "489", yearlyPrice: "4890" },
  ],
};
