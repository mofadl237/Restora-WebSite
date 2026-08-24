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
      description: "Your own website, digital menu, online ordering and analytics — one system for restaurants, cafés, cloud kitchens and home food brands.",
      ctaLabel: "Start with RESTORA",
      ctaHref: "/pricing",
    },
    ar: {
      title: "ركّز على مطعمك… واحنا نشغّل وجودك على الإنترنت.",
      subtitle: "نظام تشغيل المطاعم الحديثة",
      description: "موقع خاص بيك ومنيو إلكتروني وطلبات أونلاين وتحليلات — نظام واحد للمطاعم والكافيهات والمطابخ السحابية وحتى مشاريع الأكل من البيت.",
      ctaLabel: "ابدأ مع RESTORA",
      ctaHref: "/pricing",
    },
  },
  {
    sectionKey: "problem", sortOrder: 1,
    en: {
      title: "Every lost order is a customer who never came back",
      description: "An order scattered across ten WhatsApp chats. A phone ringing during rush hour. An outdated menu apologizing for sold-out items. Customers who searched online and never found you. You're not losing to better food — you're losing to friction.",
    },
    ar: {
      title: "كل طلب بيضيع… عميل مش هيرجع تاني",
      description: "طلب ضايع بين عشر شاتات واتساب. تليفون بيرن في وقت الزحمة. منيو قديم بيعتذر عن أصناف خلصانة. وعملاء دوّروا أونلاين وملاقوش وجودك. انت مش بتخسر بسبب الأكل — بتخسر بسبب الفوضى اللي بتاكل مجهودك وفلوسك.",
    },
  },
  {
    sectionKey: "solution", sortOrder: 2,
    en: {
      title: "One system runs your entire online presence",
      description: "From the digital menu to the order, delivery and daily numbers — RESTORA gathers what five disconnected tools used to do, and puts it in front of you in one place.",
    },
    ar: {
      title: "نظام واحد يشغّل وجودك كله على الإنترنت",
      description: "من المنيو الإلكتروني لحد الطلب والتوصيل وأرقام اليوم — RESTORA بيجمع شغل خمس أدوات متفرقة في مكان واحد قدامك.",
    },
  },
  {
    sectionKey: "for-whom", sortOrder: 2,
    en: {
      title: "Built for every food business",
      description: "Restaurants · Cafés · Bakeries · Pastry & dessert shops · Juice bars · Cloud kitchens · Food trucks · Catering · Home chefs & home food brands",
    },
    ar: {
      title: "معمول لكل بيزنس أكل",
      description: "مطاعم · كافيهات · مخبوزات · حلويات ومعجنات · عصائر · مطابخ سحابية · فوود ترك · بوفيهات وضيافة · شيفات بيتية ومشاريع أكل من البيت",
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
      description: "Orders land organized instead of lost. Hours come back to you. And your restaurant finally exists online, where customers are looking.",
    },
    ar: {
      title: "إيه اللي هيتغير لما RESTORA يشغّل جانبك الرقمي",
      description: "الطلبات توصلك منظمة بدل ما تتضيّع. ساعاتك ترجعلك. ومطعمك أخيرًا يبقى موجود أونلاين، فين ما العملاء بيدوروا.",
    },
  },
  {
    sectionKey: "final-cta", sortOrder: 6,
    en: {
      title: "Open your restaurant's branch on the internet",
      description: "Ready in days — our team sets everything up with you. Start with the plan that fits your size today, and upgrade whenever you grow.",
      ctaLabel: "Choose your plan",
      ctaHref: "/pricing",
    },
    ar: {
      title: "افتح فرع مطعمك على الإنترنت",
      description: "جاهز في أيام — فريقنا بيهندس التجهيز معاك. ابدأ بالخطة اللي على قدّ مشروعك النهاردة، وارتقي أول ما تكبر.",
      ctaLabel: "اختار خطتك",
      ctaHref: "/pricing",
    },
  },
];

export type TestimonialSeed = {
  customerName: string;
  restaurantName: string;
  jobTitle?: string;
  countryCode?: string;
  rating: number;
  en: { quote: string };
  ar: { quote: string };
};

export const testimonialsSeed: TestimonialSeed[] = [
  {
    customerName: "Ahmed El-Sayed", restaurantName: "Zayn Grill", jobTitle: "Restaurant Owner", countryCode: "EG", rating: 5,
    en: { quote: "Before RESTORA we juggled three apps and a paper notebook. Now everything lands in one dashboard — orders, tables, delivery." },
    ar: { quote: "قبل RESTORA كنا بنشتغل على ثلاث تطبيقات ودفتر ورقي. دلوقتي كل حاجة بتيجي على لوحة واحدة — طلبات وطاولات وتوصيل." },
  },
  {
    customerName: "Mariam Hassan", restaurantName: "Cairo Bites", jobTitle: "Founder", countryCode: "EG", rating: 5,
    en: { quote: "Our QR menu paid for itself in the first week. Customers browse faster and our waiters finally have time to serve properly." },
    ar: { quote: "منيو الـQR غطى تكلفته في أول أسبوع. العملاء بيتصفحوا أسرع والجرسونين بقى عندهم وقت يقدموا خدمة أحسن." },
  },
  {
    customerName: "Omar Farouk", restaurantName: "Levantine House", jobTitle: "General Manager", countryCode: "SA", rating: 5,
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
  {
    en: { question: "I cook from home. Is RESTORA for me?", answer: "Yes — home food brands are one of the best fits. You get your own website, a digital menu and an ordering link, so customers order from you professionally without needing a storefront. Your kitchen stays at home; your presence doesn't have to.", },
    ar: { question: "أنا بعمل أكل من البيت… RESTORA ينفعلي؟", answer: "أيوه، مشاريع الأكل البيتي من أنجح حالات RESTORA. هتاخد موقع خاص بيك ومنيو إلكتروني ولينك طلبات — عملاؤك يطلبوا منك بشكل احترافي من غير محل ولا واجهة. مطبخك في البيت… لكن وجودك مش محدود بيه.", },
  },
  {
    en: { question: "I own more than one branch. Can RESTORA handle that?", answer: "Yes. Branches run under the same system, each keeping its menu and orders, while you see the full picture from one dashboard as you grow.", },
    ar: { question: "عندي أكتر من فرع… النظام يغطيني؟", answer: "أيوه. الفروع بتشتغل تحت نفس النظام، كل فرع بمنيوك وطلباته، وأنت شايف الصورة الكاملة من لوحة واحدة وانت بتكبر.", },
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
    keywords: "restaurant management software, restaurant ordering system, digital menu for restaurants, QR menu, online ordering for restaurants, restaurant website, cafe digital menu, cloud kitchen ordering, home food business online",
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
    keywords: "نظام إدارة مطاعم, منيو إلكتروني, منيو QR للمطاعم, طلب أونلاين للمطاعم, موقع مطعم, منيو إلكتروني للكافيهات, نظام طلبات المطاعم, مشروع أكل من البيت",
    ogTitle: "RESTORA — نظام تشغيل المطاعم الحديثة",
    ogDescription: "نظام واحد لموقع مطعمك ومنيوك وطلباتك وعملائك ونموّك.",
    twitterTitle: "RESTORA — شغّل مطعمك رقميًا",
    twitterDescription: "موقع ومنيو رقمي وطلب بالـQR وتوصيل وتحليلات — نظام واحد.",
  },
  {
    page: "business",
    locale: "en",
    title: "RESTORA for Food Businesses — Restaurants, Cafés, Cloud Kitchens & Home Brands",
    description: "Whatever food business you run, RESTORA takes it online: website, digital menu, QR ordering and delivery in one system. Find the right plan for your segment.",
    keywords: "restaurant software, cafe ordering system, cloud kitchen platform, home food business online, food truck ordering, catering software",
  },
  {
    page: "business",
    locale: "ar",
    title: "RESTORA للأعمال الغذائية — مطاعم، كافيهات، مطابخ سحابية ومشاريع أكل من البيت",
    description: "أي مشروع أكل بتديره، RESTORA يشغّله أونلاين: موقع ومنيو رقمي وطلب بالـQR وتوصيل في نظام واحد. اكتشف الباقة المناسبة لنشاطك.",
    keywords: "نظام لمطعمك, نظام للكافيهات, مطبخ سحابي أونلاين, مشروع أكل من البيت, نظام فوود ترك, برنامج بوفيهات",
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
    en: { title: "You grow, we run the ops", description: "Orders flow in organized, your numbers add up by themselves, and RESTORA keeps scaling from one kitchen to many branches." },
    ar: { title: "انت كبّر، وإحنا نشغّل", description: "الطلبات بتوصلك منظمة، والأرقام بتتجمع لوحدها، وRESTORA بيكبر معاك من مطبخ واحد لفروع كتير." },
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
    en: { title: "Orders", description: "reach you organized in one place — no lost tickets, no missed calls" },
    ar: { title: "الطلبات", description: "بتوصلك منظمة في مكان واحد — لا ورق ضايع ولا مكالمات بتضيع" },
  },
  {
    sectionKey: "outcome-2", sortOrder: 31,
    en: { title: "Time", description: "comes back to your kitchen and your customers, not to app-juggling" },
    ar: { title: "وقتك", description: "بيرجع لمطبخك وعملائك، بدل ما يروح في متابعة تطبيقات متفرقة" },
  },
  {
    sectionKey: "outcome-3", sortOrder: 32,
    en: { title: "Online", description: "in days — a professional presence where new customers can find you" },
    ar: { title: "أونلاين", description: "في أيام — وجود محترف يجيب لك عملاء جداد من غير ما تدور عليهم" },
  },

  // --- /business page sections ---
  {
    sectionKey: "biz-hero", sortOrder: 40,
    en: {
      title: "Whatever you cook, RESTORA runs it online.",
      subtitle: "FOR FOOD BUSINESSES",
      description: "From a home kitchen to a restaurant group — one system that takes your food business from first idea to steady online orders.",
    },
    ar: {
      title: "مهما كان مشروعك… RESTORA يشغّله أونلاين.",
      subtitle: "للأعمال الغذائية",
      description: "من مطبخ بيتي صغير لمجموعة مطاعم — نظام واحد ياخد مشروع الأكل من أول فكرة لطلبات أونلاين مستمرة.",
    },
  },
  {
    sectionKey: "biz-segments", sortOrder: 41,
    en: {
      title: "Built around your kind of business",
      description: "Pick your segment — the system adapts to how you work.",
    },
    ar: {
      title: "معمّول على مقاس نوع مشروعك",
      description: "اختار نوع نشاطك — والنظام يتأقلم مع طريقة شغلك.",
    },
  },
  {
    sectionKey: "biz-journey", sortOrder: 42,
    en: {
      title: "Your journey with RESTORA",
      subtitle: "FROM IDEA TO GROWTH",
      description: "",
    },
    ar: {
      title: "رحلتك مع RESTORA",
      subtitle: "من الفكرة للنمو",
      description: "",
    },
  },
  {
    sectionKey: "biz-recommender", sortOrder: 43,
    en: {
      title: "Which plan fits your project?",
      description: "Tell us about your business and we'll point you to the right starting plan — you can always scale up later.",
      ctaLabel: "See plans & pricing",
      ctaHref: "/pricing",
    },
    ar: {
      title: "أنهي باقة تناسب مشروعك؟",
      description: "قولنا عن مشروعك وهنرشحلك الباقة المناسبة للبداية — وبتقدر تكبّر في أي وقت.",
      ctaLabel: "شوف الباقات والأسعار",
      ctaHref: "/pricing",
    },
  },
];
