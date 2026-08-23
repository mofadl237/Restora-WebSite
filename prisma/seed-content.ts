/**
 * RESTORA seed data — marketing CMS content (sections, testimonials, FAQs, SEO).
 * EN + AR. Other locales can be added from the Admin dashboard.
 */

export type SectionSeed = {
  sectionKey: string;
  sortOrder: number;
  en: { title: string; subtitle?: string; description?: string; ctaLabel?: string; ctaHref?: string };
  ar: { title: string; subtitle?: string; description?: string; ctaLabel?: string; ctaHref?: string };
};

export const sectionsSeed: SectionSeed[] = [
  {
    sectionKey: "hero", sortOrder: 0,
    en: {
      title: "Run your restaurant. We handle the digital operation.",
      subtitle: "The operating system for modern restaurants",
      description: "Website, digital menu, QR ordering, delivery and analytics — one system instead of five disconnected tools.",
      ctaLabel: "Start with RESTORA",
      ctaHref: "/pricing",
    },
    ar: {
      title: "ركّز على مطعمك… واحنا نشغّل الجزء الرقمي.",
      subtitle: "نظام تشغيل المطاعم الحديثة",
      description: "موقع ومنيو رقمي وطلب بالـ QR وتوصيل وتحليلات — نظام واحد بدل خمس أدوات متفرقة.",
      ctaLabel: "ابدأ مع RESTORA",
      ctaHref: "/pricing",
    },
  },
  {
    sectionKey: "problem", sortOrder: 1,
    en: {
      title: "How much is disconnection costing you?",
      description: "Lost orders, wasted hours, customers who never find you — most restaurants don't lose to competitors, they lose to friction.",
    },
    ar: {
      title: "التشتت بيكلفك كام؟",
      description: "طلبات ضايعة وساعات مهدرة وعملاء مش لاقيينك — أغلب المطاعم مش بتخسر بسبب المنافسين، بتخسر بسبب التعقيد.",
    },
  },
  {
    sectionKey: "solution", sortOrder: 2,
    en: {
      title: "One system. Every part of your digital restaurant.",
      description: "RESTORA connects your storefront, menu, orders, customers and numbers in a single platform built for restaurants.",
    },
    ar: {
      title: "نظام واحد… لكل جزء رقمي في مطعمك.",
      description: "RESTORA بيربط موقعك ومنيوك وطلباتك وعملائك وأرقامك في منصة واحدة معمولة خصيصًا للمطاعم.",
    },
  },
  {
    sectionKey: "how-it-works", sortOrder: 3,
    en: {
      title: "Live in days, not months",
      description: "No developers. No designers. No maintenance. Set up your menu, share your QR, start receiving orders.",
    },
    ar: {
      title: "جاهز في أيام… مش شهور",
      description: "بدون مبرمجين. بدون مصممين. بدون صيانة. جهّز منيوك، شارك كود الـQR، واستقبل طلباتك.",
    },
  },
  {
    sectionKey: "why-restora", sortOrder: 4,
    en: {
      title: "Built for restaurants, not for everyone",
      description: "Generic tools force restaurants to adapt. RESTORA adapts to how restaurants actually run — service, kitchen, delivery, tables.",
    },
    ar: {
      title: "معمول للمطاعم… مش للكل",
      description: "الأدوات العامة بتفرض على المطاعم تتأقلم. RESTORA بيتأقلم مع واقع المطاعم: الخدمة، المطبخ، التوصيل، الطاولات.",
    },
  },
  {
    sectionKey: "outcomes", sortOrder: 5,
    en: {
      title: "What changes when RESTORA runs your digital side",
      description: "More captured orders. Less manual work. Customers who come back. Numbers you can act on.",
    },
    ar: {
      title: "إيه اللي هيتغير لما RESTORA يشغّل جانبك الرقمي",
      description: "طلبات أكتر. مجهود يدوي أقل. عملاء بيرجعوا تاني. أرقام تقدر تتحرك عليها.",
    },
  },
  {
    sectionKey: "final-cta", sortOrder: 6,
    en: {
      title: "Your restaurant deserves better tools",
      ctaLabel: "Choose your plan",
      ctaHref: "/pricing",
    },
    ar: {
      title: "مطعمك يستاهل أدوات أحسن",
      ctaLabel: "اختار خطتك",
      ctaHref: "/pricing",
    },
  },
];

export type TestimonialSeed = {
  customerName: string;
  restaurantName: string;
  rating: number;
  en: { quote: string };
  ar: { quote: string };
};

export const testimonialsSeed: TestimonialSeed[] = [
  {
    customerName: "Ahmed El-Sayed", restaurantName: "Zayn Grill", rating: 5,
    en: { quote: "Before RESTORA we juggled three apps and a paper notebook. Now everything lands in one dashboard — orders, tables, delivery." },
    ar: { quote: "قبل RESTORA كنا بنشتغل على ثلاث تطبيقات ودفتر ورقي. دلوقتي كل حاجة بتيجي على لوحة واحدة — طلبات وطاولات وتوصيل." },
  },
  {
    customerName: "Mariam Hassan", restaurantName: "Cairo Bites", rating: 5,
    en: { quote: "Our QR menu paid for itself in the first week. Customers browse faster and our waiters finally have time to serve properly." },
    ar: { quote: "منيو الـQR غطى تكلفته في أول أسبوع. العملاء بيتصفحوا أسرع والجرسونين بقى عندهم وقت يقدموا خدمة أحسن." },
  },
  {
    customerName: "Omar Farouk", restaurantName: "Levantine House", rating: 5,
    en: { quote: "I used to discover problems at closing time. With the analytics I see slow hours coming before they hurt revenue." },
    ar: { quote: "كنت باكتشف المشاكل وقت القفل. بس مع التحليلات بشوف الساعات الهادية قبل ما تأثر على الإيرادات." },
  },
];

export type FaqSeed = {
  en: { question: string; answer: string };
  ar: { question: string; answer: string };
};

export const faqsSeed: FaqSeed[] = [
  {
    en: { question: "Do I need technical skills to use RESTORA?", answer: "No. Everything is managed from a simple dashboard — menu items, photos, prices, delivery areas and offers. If you can fill a form, you can run RESTORA." },
    ar: { question: "محتاج خبرة تقنية أستخدم RESTORA؟", answer: "لا. كل حاجة بتتعمل من لوحة تحكم بسيطة — الأطباق والصور والأسعار ومناطق التوصيل والعروض. لو تعرف تملي استمارة، تقدر تشغّل RESTORA." },
  },
  {
    en: { question: "Can customers order without downloading an app?", answer: "Yes. Customers scan your QR or open your link and order directly — no app install, no account friction." },
    ar: { question: "العميل يقدر يطلب من غير ما ينزل تطبيق؟", answer: "أيوه. العميل يمسح كود الـQR أو يفتح اللينك ويطلب مباشرة — بدون تحميل تطبيق ولا تعقيد حسابات." },
  },
  {
    en: { question: "How do I receive my orders?", answer: "Orders appear instantly in your RESTORA dashboard, and staff with permission can accept, prepare and track them in real time." },
    ar: { question: "بستقبل الطلبات إزاي؟", answer: "الطلبات بتظهر فورًا في لوحة RESTORA، والموظفين أصحاب الصلاحية يقدروا يقبلوا ويجهزوا ويتابعوا الطلب لحظة بلحظة." },
  },
  {
    en: { question: "Does RESTORA support more than one language?", answer: "Yes. Your website and menu can be available in multiple languages so tourists and locals order comfortably." },
    ar: { question: "RESTORA بيدعم أكتر من لغة؟", answer: "أيوه. موقعك ومنيوك ممكن يكونوا متاحين بعدة لغات عشان السياح والمحليين يطلبوا براحتهم." },
  },
  {
    en: { question: "What are the annual subscription gifts?", answer: "Yearly plans include free extras like a QR website, a Google Reviews QR and setup of your restaurant listing on Google Maps." },
    ar: { question: "إيه هدايا الاشتراك السنوي؟", answer: "الخطط السنوية بتشمل هدايا مجانية زي موقع QR وكود تقييمات جوجل وإعداد ظهور مطعمك على خرائط جوجل." },
  },
  {
    en: { question: "Can I upgrade my plan later?", answer: "Yes. Start small and move up whenever your restaurant grows — your data, menu and orders carry over automatically." },
    ar: { question: "أقدر أرقّي خطتي بعدين؟", answer: "أيوه. ابدأ صغير وارتقي في أي وقت مطعمك يكبر — بياناتك ومنيوك وطلباتك بتتنقل تلقائيًا." },
  },
];

export type SeoEntrySeed = {
  page: string;
  locale: string;
  title: string;
  description: string;
  keywords?: string;
  canonical?: string;
  robots?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
};

export const seoEntriesSeed: SeoEntrySeed[] = [
  {
    page: "home",
    locale: "en",
    title: "RESTORA — Restaurant Management Software & Online Ordering System",
    description: "RESTORA gives your restaurant a website, digital menu, QR ordering, delivery tracking and analytics in one system. Get more orders with less manual work.",
    keywords: "restaurant management software, restaurant ordering system, digital menu for restaurants, QR menu, online ordering for restaurants, restaurant website",
    ogTitle: "RESTORA — The Operating System for Modern Restaurants",
    ogDescription: "One system for your restaurant's website, menu, orders, customers and growth.",
    twitterTitle: "RESTORA — Run Your Restaurant Digitally",
    twitterDescription: "Website, digital menu, QR ordering, delivery and analytics — one system.",
  },
  {
    page: "home",
    locale: "ar",
    title: "RESTORA — نظام إدارة المطاعم والطلب أونلاين",
    description: "RESTORA بيدي مطعمك موقع ومنيو رقمي وطلب بالـQR وتوصيل وتحليلات في نظام واحد. طلبات أكتر ومجهود أقل.",
    keywords: "نظام إدارة مطاعم, منيو رقمي, طلب أونلاين للمطاعم, منيو QR, موقع مطعم",
    ogTitle: "RESTORA — نظام تشغيل المطاعم الحديثة",
    ogDescription: "نظام واحد لموقع مطعمك ومنيوك وطلباتك وعملائك ونموّك.",
    twitterTitle: "RESTORA — شغّل مطعمك رقميًا",
    twitterDescription: "موقع ومنيو رقمي وطلب بالـQR وتوصيل وتحليلات — نظام واحد.",
  },
];

// ---------------------------------------------------------------------------
// Product story scenes (cinematic scroll storytelling on the homepage)
// ---------------------------------------------------------------------------

export type StorySceneSeed = {
  sceneKey: string;
  visual: "phone" | "dashboard" | "analytics" | "growth";
  icon?: string;
  sortOrder: number;
  en: { kicker?: string; title: string; body?: string };
  ar: { kicker?: string; title: string; body?: string };
};

export const storyScenesSeed: StorySceneSeed[] = [
  {
    sceneKey: "qr-table", visual: "phone", icon: "qr-code", sortOrder: 0,
    en: { kicker: "SCENE 01", title: "It starts with a QR code.", body: "A guest sits down, scans the code on the table, and your full menu opens instantly — photos, prices, and offers, always up to date." },
    ar: { kicker: "مشهد ١", title: "من أول QR Code…", body: "الزائر قعد على الطاولة، مسح الكود، والمنيو كله فتح على طول — صور وأسعار وعروض، ودايمًا محدّث." },
  },
  {
    sceneKey: "order-flow", visual: "phone", icon: "shopping-bag", sortOrder: 1,
    en: { kicker: "SCENE 02", title: "…until the order reaches the kitchen.", body: "The guest builds their cart and checks out in seconds. The order lands on your dashboard in real time — no calls, no lost papers, no mistakes." },
    ar: { kicker: "مشهد ٢", title: "…لحد ما الطلب يوصل للمطبخ.", body: "الزائر يبني طلبوه ويكمل في ثواني. والأوردر يوصلك على لوحتك في نفس اللحظة — بدون مكالمات ولا ورق ضايع ولا أخطاء." },
  },
  {
    sceneKey: "one-dashboard", visual: "dashboard", icon: "layout-dashboard", sortOrder: 2,
    en: { kicker: "SCENE 03", title: "Everything in front of you, in one dashboard.", body: "Menu, orders, delivery and customers — the entire digital operation of your restaurant, managed from a single control room." },
    ar: { kicker: "مشهد ٣", title: "وكل حاجة قدامك في لوحة واحدة.", body: "المنيو والطلبات والتوصيل والعملاء — العملية الرقمية لمطعمك كلها من غرفة تحكم واحدة." },
  },
  {
    sceneKey: "analytics", visual: "analytics", icon: "bar-chart-3", sortOrder: 3,
    en: { kicker: "SCENE 04", title: "Know exactly what sells most.", body: "Live analytics show your best sellers, busiest hours and true revenue — so every decision is backed by numbers, not guesses." },
    ar: { kicker: "مشهد ٤", title: "اعرف إيه اللي بيبيع أكتر.", body: "تحليلات لحظية بتوريك الأصناف الأكثر مبيعًا وأوقات الذروة والإيرادات الحقيقية — كل قرار بأرقام مش تخمين." },
  },
  {
    sceneKey: "growth", visual: "growth", icon: "trending-up", sortOrder: 4,
    en: { kicker: "SCENE 05", title: "Grow your restaurant instead of managing chaos.", body: "Add branches, expand delivery areas and open new channels — RESTORA scales with you while you focus on the food." },
    ar: { kicker: "مشهد ٥", title: "وكبّر مطعمك بدل ما تضيع وقتك في الإدارة.", body: "ضيف فروع، وسّع مناطق التوصيل وافتح قنوات جديدة — RESTORA يكبر معاك وأنت مركّز على الأكل." },
  },
];

// Additional homepage narrative blocks reusing the sections CMS
export const extraSectionsSeed: SectionSeed[] = [
  {
    sectionKey: "step-1", sortOrder: 10,
    en: { title: "Pick your plan", description: "Choose the plan that fits your restaurant and your country's pricing." },
    ar: { title: "اختار خطتك", description: "اختار الخطة اللي تناسب مطعمك وبأسعار بلدك." },
  },
  {
    sectionKey: "step-2", sortOrder: 11,
    en: { title: "We set everything up", description: "Our team builds your website, digital menu and dashboard with you — live in days." },
    ar: { title: "إحنا بنجهزلك كل حاجة", description: "فريقنا بيبني موقعك ومنيوك الرقمي ولوحة التحكم معاك — وتشتغل في أيام." },
  },
  {
    sectionKey: "step-3", sortOrder: 12,
    en: { title: "You grow, we run the ops", description: "Orders flow in, analytics pile up, and RESTORA keeps your digital operation humming." },
    ar: { title: "انت كبّر، وإحنا نشغّل", description: "الطلبات بتدفق والتحليلات تتراكم وRESTORA مشغّل جانبك الرقمي على طول." },
  },
  {
    sectionKey: "why-1", sortOrder: 20,
    en: { title: "Restaurant-first, not generic", description: "Every screen is designed around how restaurants actually work — tables, kitchens, couriers and rushes." },
    ar: { title: "معمول للمطاعم… مش للكل", description: "كل شاشة مصمّمة حول طبيعة المطاعم الحقيقية — طاولات ومطابخ وديدلايفري وأوقات ذروة." },
  },
  {
    sectionKey: "why-2", sortOrder: 21,
    en: { title: "One system, zero duct tape", description: "Stop stitching five tools together. Menu, orders, delivery and analytics share one brain." },
    ar: { title: "نظام واحد بدون لزوق", description: "بلاش تجميع خمس أدوات ببعض. المنيو والطلبات والتوصيل والتحليلات في مخ واحد." },
  },
  {
    sectionKey: "why-3", sortOrder: 22,
    en: { title: "Your brand stays yours", description: "Your colors, your menu, your domain — RESTORA runs quietly behind your restaurant's identity." },
    ar: { title: "براندك يفضل براندك", description: "ألوانك ومنيوك ودومينك — RESTORA بيشتغل بهدوء وراء هوية مطعمك." },
  },
  {
    sectionKey: "outcome-1", sortOrder: 30,
    en: { title: "+38%", description: "online orders within the first months" },
    ar: { title: "+38%", description: "زيادة في الطلبات أونلاين خلال أول شهور" },
  },
  {
    sectionKey: "outcome-2", sortOrder: 31,
    en: { title: "-70%", description: "less time wasted on phone orders and manual work" },
    ar: { title: "-70%", description: "وقت أقل في طلبات التليفون والشغل اليدوي" },
  },
  {
    sectionKey: "outcome-3", sortOrder: 32,
    en: { title: "Days", description: "to go live — not months of setup" },
    ar: { title: "أيام", description: "وتشتغل — مش شهور من التجهيز" },
  },
];
