import { prisma } from "../src/lib/db";
import { LOCALES } from "./seed-data";

type Faq = { q: string; a: string };

type SegmentSeed = {
  slug: string;
  planSlug: string;
  icon: string;
  sortOrder: number;
  en: {
    title: string;
    subtitle: string;
    description: string;
    problems: string[];
    useCases: string[];
    features: string[];
    faqs: Faq[];
    seoTitle: string;
    seoDescription: string;
  };
  ar: {
    title: string;
    subtitle: string;
    description: string;
    problems: string[];
    useCases: string[];
    features: string[];
    faqs: Faq[];
    seoTitle: string;
    seoDescription: string;
  };
};

const encodeFaqs = (faqs: Faq[]) => faqs.map((f) => `${f.q}::${f.a}`).join("||");

export const segmentPagesSeed: SegmentSeed[] = [
  {
    slug: "restaurants", planSlug: "professional", icon: "🍽️", sortOrder: 1,
    en: {
      title: "Restaurant management that runs your floor and your orders",
      subtitle: "FOR RESTAURANTS",
      description:
        "RESTORA puts your menu, tables, online orders and daily numbers in one system — so service stays fast when the room is full, and you finally see what is actually selling.",
      problems: [
        "Orders arrive by phone and WhatsApp and things get missed at rush hour",
        "Paper menus go out of date every time a price or dish changes",
        "No clear view of best-sellers, slow movers or busy hours",
        "Staff need three different tools to take an order end-to-end",
      ],
      useCases: [
        "Guests scan a QR code on the table and order without waiting for staff",
        "Delivery and pickup orders land in one dashboard with the kitchen ticket",
        "Daily sales reports show which dishes earn their place on the menu",
        "Offers and seasonal menus are updated once and appear everywhere instantly",
      ],
      features: [
        "QR table ordering with photos and live prices",
        "One inbox for delivery, pickup and dine-in orders",
        "Sales analytics by dish, hour and channel",
        "Multi-language menus for tourist-heavy locations",
      ],
      faqs: [
        { q: "How does a restaurant start taking online orders?", a: "You add your menu in the RESTORA dashboard, share your QR code and website link, and orders start arriving in your dashboard — no app store approvals or hardware setup required." },
        { q: "Does RESTORA replace our cashier system?", a: "RESTORA complements your counter workflow: dine-in, delivery and pickup orders flow into one dashboard with clear tickets, while your team keeps using whatever POS hardware they already know." },
        { q: "Can we keep our own delivery drivers?", a: "Yes. RESTORA sends orders straight to your team — you keep the customer relationship and the margin instead of routing everything through third-party platforms." },
      ],
      seoTitle: "Restaurant Management Software & Online Ordering | RESTORA",
      seoDescription:
        "Run your restaurant from one dashboard: QR table ordering, delivery and pickup in one place, live menus and sales analytics. See how RESTORA works for restaurants.",
    },
    ar: {
      title: "إدارة مطعم كاملة… من الطاولة للطلب أونلاين",
      subtitle: "للمطاعم",
      description:
        "RESTORA يجمع منيوك وطاولاتك وطلبات الأونلاين وأرقامك اليومية في نظام واحد — الخدمة تفضل سريعة حتى في الزحمة، وأنت شايف بالظبط إيه اللي بيتباع.",
      problems: [
        "الطلبات بتيجي من التليفون والواتساب وفي الزحمة بيضيع حاجة",
        "المنيو الورقي بيتقفل عليه الملف مع كل تغيير سعر أو طبق جديد",
        "مفيش صورة واضحة للأطباق الأكثر مبيعًا أو أوقات الذروة",
        "الفريق محتاج أكتر من أداة عشان يكمّل طلب واحد من الأول للآخر",
      ],
      useCases: [
        "الزائر يمسح كود QR على الطاولة ويطلب من غير ما يستنى الجارسون",
        "طلبات التوصيل والاستلام توصل في لوحة واحدة مع تذكرة المطبخ",
        "تقارير يومية بتوريك أنهي أطباق تستاهل مكانها في المنيو",
        "العروض والمنيو الموسمي بيتحدّث مرة واحدة ويظهر في كل حتة فورًا",
      ],
      features: [
        "طلب بالـQR من الطاولة بالصور والأسعار الحية",
        "صندوق واحد لطلبات التوصيل والاستلام والداخل المطعم",
        "تحليلات مبيعات حسب الطبق والساعة وقناة الطلب",
        "منيو بأكتر من لغة للمطاعم السياحية",
      ],
      faqs: [
        { q: "المطعم يبدأ يستقبل طلبات أونلاين إزاي؟", a: "بتضيف منيوك من لوحة RESTORA، وتوزع كود QR ولينك موقعك، والطلبات تبدأ توصل للوحة على طول — من غير موافقات متاجر التطبيقات ولا تركيب أجهزة." },
        { q: "RESTORA بيدّيل الكاشير بتاعنا؟", a: "RESTORA بيكمل شغل الكاشير: طلبات الداخل والتوصيل والاستلام كلها في لوحة واحدة بتذاكر واضحة، وفريقك بيستمر على الأجهزة اللي متعود عليها." },
        { q: "نقدر نفضل بسائقين التوصيل بتوعنا؟", a: "أيوه. RESTORA بيوصّل الطلبات لفريقك مباشرة — فتفضل انت صاحب العلاقة مع العميل وهامشك محفوظ بدل ما تمشي ورا منصات الوساطة." },
      ],
      seoTitle: "برنامج إدارة مطاعم ونظام طلبات أونلاين | RESTORA",
      seoDescription:
        "نظام إدارة مطاعم يجمع طلبات الـQR والتوصيل والاستلام وتحليلات المبيعات في مكان واحد. اكتشف إزاي RESTORA بيشتغل مع مطعمك.",
    },
  },
  {
    slug: "cafes", planSlug: "growth", icon: "☕", sortOrder: 2,
    en: {
      title: "A digital menu for your café that upsells while you brew",
      subtitle: "FOR CAFÉS",
      description:
        "Seasonal drinks change weekly, prices rise quietly, and regulars order from the counter anyway. RESTORA gives your café a living digital menu and pickup orders — without changing the vibe.",
      problems: [
        "Seasonal menus and sold-out items are hard to communicate at the counter",
        "Printed menus make every price adjustment feel expensive",
        "Morning rush queues lose customers who would have ordered ahead",
        "You never really know which drinks drive the profit",
      ],
      useCases: [
        "A QR code on every table shows drinks with photos, sizes and add-ons",
        "Regulars pre-order their morning coffee and skip the queue",
        "Sold-out items disappear from the menu instantly — no awkward moments",
        "Happy-hour offers switch on and off automatically by time",
      ],
      features: [
        "Photo-first digital menu built for drink menus and add-ons",
        "Pickup ordering for the morning rush",
        "Scheduled offers (happy hours, seasonal specials)",
        "Item-level analytics on what actually sells",
      ],
      faqs: [
        { q: "What is the best digital menu for cafés?", a: "One that shows photos and add-on options clearly, updates instantly when an item sells out, and lets customers order ahead. RESTORA's digital menu is built exactly around café menus — drinks, sizes, extras." },
        { q: "Do customers need to download an app?", a: "No. They scan the QR code or open your link and the menu opens right in the browser, in Arabic or English." },
        { q: "Can we run happy hour prices automatically?", a: "Yes — schedule offers with start and end times and the menu updates itself, so the 4 PM discount never depends on someone remembering." },
      ],
      seoTitle: "Digital Menu for Cafés & Coffee Shops | RESTORA",
      seoDescription:
        "Give your café a photo-rich digital menu, pickup ordering and scheduled offers. No app needed — customers just scan and order. See RESTORA for cafés.",
    },
    ar: {
      title: "منيو إلكتروني لكافيهك… بيبيع عنك وإنت بتجهّز",
      subtitle: "للكافيهات",
      description:
        "المشروبات الموسمية بتتغير كل أسبوع، والأسعار بتتحرك، والزباين الكراش بيكدروا على الكاونتر. RESTORA يدّي كافيهك منيو رقمي حي وطلبات استلام — من غير ما نغيّر روح المكان.",
      problems: [
        "المنيو الموسمي والأصناف اللي خلصت صعب توصل للعميل على الكاونتر",
        "كل تعديل سعر في المنيو المطبوع مكلف ومش عملي",
        "زحمة الصبح بتفقدك عملاء كانوا هيطلبوا قبل ما يوصلوا",
        "مش عارف بالظبط أنهي مشروبات بتجيب الرجيع الحقيقي",
      ],
      useCases: [
        "كود QR على كل طاولة بيعرض المشروبات بالصور والمقاسات والإضافات",
        "الزبون الدائم يطلب قهوة الصبح قبل ما يوصل ويعدّي من غير طابور",
        "الأصناف اللي خلصت بتختفي من المنيو فورًا — من غير مواقف محرجة",
        "عروض الساعات السعيدة بتشتغل وتقفل أوتوماتيك بالتوقيت",
      ],
      features: [
        "منيو رقمي بصور أول بأول مخصوص لمنيو المشروبات والإضافات",
        "طلب استلام لأوقات زحمة الصبح",
        "عروض مجدولة (ساعات سعيدة، أصناف موسمية)",
        "تحليلات لكل صنف عشان تعرف إيه اللي بيتباع فعلًا",
      ],
      faqs: [
        { q: "إيه أفضل منيو إلكتروني للكافيهات؟", a: "اللي بيعرض الصور والإضافات بوضوح، بيتحدّث فورًا لما صنف يخلص، وبيسمح للعميل يطلب قبل الوصول. منيو RESTORA الرقمي معمول أساسًا لمنيو الكافيهات: مشروبات ومقاسات وإضافات." },
        { q: "العميل محتاج ينزّل تطبيق؟", a: "لأ. بيمسح كود الـQR أو يفتح اللينك والمنيو يتفتح في المتصفح على طول، بالعربي أو الإنجليزي." },
        { q: "نقدر نعمل أسعار Happy Hour أوتوماتيك؟", a: "أيوه — بتجدول العروض بوقت بداية ونهاية والمنيو بيتحدّث لحاله، فخصوصية الساعة ٥ مش متوقعة على حد يفتكرها." },
      ],
      seoTitle: "منيو إلكتروني للكافيهات ومنيو QR للمشروبات | RESTORA",
      seoDescription:
        "منيو إلكتروني للكافيهات بالصور والإضافات، طلبات استلام، وعروض مجدولة — من غير تطبيق. العميل يمسح ويطلب. شوف RESTORA للكافيهات.",
    },
  },
  {
    slug: "bakeries", planSlug: "growth", icon: "🥖", sortOrder: 3,
    en: {
      title: "Sell out on purpose: online ordering for bakeries",
      subtitle: "FOR BAKERIES",
      description:
        "Fresh batches sell out fast and early orders are gold. RESTORA puts your daily breads and cakes online so customers reserve today's bake before the queue forms.",
      problems: [
        "Customers call asking \"is it still available?\" all day long",
        "Pre-orders for cakes and trays happen over scattered phone calls",
        "Leftovers at closing time because demand wasn't visible",
        "Price lists taped to the glass get outdated",
      ],
      useCases: [
        "Publish the day's bake list online each morning",
        "Cake pre-orders arrive as structured requests, not voicemails",
        "Availability updates live so nobody orders what's finished",
        "End-of-day analytics show what to bake more (or less) of tomorrow",
      ],
      features: [
        "Live availability on a digital catalogue",
        "Structured pre-orders with pickup times",
        "Instant price-list updates across web and QR",
        "Simple daily sales overview",
      ],
      faqs: [
        { q: "How do bakery pre-orders work online?", a: "Customers pick items and a pickup time from your online menu; the order reaches your dashboard like any other sale. No more scribbled phone notes." },
        { q: "Can we hide items that are sold out?", a: "One tap hides an item everywhere — website, link and QR menu update at the same moment." },
        { q: "Does this work for small neighbourhood bakeries?", a: "Yes — most RESTORA bakeries are single-location family shops. The starter plan covers menu, orders and a simple website." },
      ],
      seoTitle: "Online Ordering & Digital Menu for Bakeries | RESTORA",
      seoDescription:
        "Put your bakery's daily bake and cake pre-orders online. Live availability, instant price updates and a simple daily report — with RESTORA for bakeries.",
    },
    ar: {
      title: "بياع من أول رغيف: طلبات أونلاين للمخبز والحلويات",
      subtitle: "للمخابز",
      description:
        "التراي البتاع بياخد على طول والطلبات المسبقة ذهب خالص. RESTORA يحط مخبوزات اليوم وأتشيز الكيك أونلاين عشان العميل يحجز من دبلجة النهاردة قبل ما الطابور يطول.",
      problems: [
        "العملاء بيكلموا طول النهار بيسألوا: «لسه موجود؟»",
        "طلبات الكيك والأطباق المسبقة بتتم على تليفونات متناثرة",
        "بواقي وقت القفل لأنك كنت مش شايف الطلب الحقيقي",
        "لائحة الأسعار الملزوقة على الفاترينة بتنتهي صلاحيتها",
      ],
      useCases: [
        "تنشر لائحة مخبوزات النهاردة كل صباح أونلاين",
        "طلبات الكيك المسبقة توصل مكتوبة ومنظمة مش رسائل صوتية",
        "التوفر بيتحدّث لايف فمححدش يطلب حاجة خلصت",
        "تقرير آخر اليوم يقولك تكثر بكرة من إيه وتقلل من إيه",
      ],
      features: [
        "توفر لحيف على كاتالوج رقمي",
        "طلبات مسبقة منظمة بمواعيد استلام",
        "تحديث أسعار فوري على الموقع والـQR مع بعض",
        "ملخص مبيعات يومي بسيط",
      ],
      faqs: [
        { q: "طلب المخبوزات المسبق أونلاين بيشتغل إزاي؟", a: "العميل يختار الأصناف وموعد الاستلام من منيوك الأونلاين، والطلب يوصلك في اللوحة كأي بيعة — خلاص كتب التليفون المتناثرة." },
        { q: "نقدر نخفي صنف خلص؟", a: "بضغطة واحدة الصنف يختفي من كل حتة: الموقع واللينك ومنيو الـQR بنفس اللحظة." },
        { q: "ينفع للمخبز الصغير في الحارة؟", a: "أيوه — أغلب عملاء RESTORA من المحلات الأسرية بفرع واحد. باقة البداية تغطي المنيو والطلبات وموقع بسيط." },
      ],
      seoTitle: "منيو إلكتروني وطلبات أونلاين للمخابز | RESTORA",
      seoDescription:
        "حط مخبوزات يومك وطلبات الكيك المسبقة أونلاين. توفر لحيف، تحديث أسعار فوري، وتقرير يومي بسيط — مع RESTORA للمخابز.",
    },
  },
  {
    slug: "desserts", planSlug: "growth", icon: "🍰", sortOrder: 4,
    en: {
      title: "A dessert menu that looks as good as it tastes",
      subtitle: "FOR DESSERT & PASTRY SHOPS",
      description:
        "Desserts sell with the eyes. RESTORA turns your menu into a photo gallery with live prices and add-ons — and turns cravings into orders on WhatsApp-level convenience.",
      problems: [
        "Photos on Instagram bring questions, but ordering still happens over DMs",
        "Customisation (sizes, extras, messages on cakes) gets lost in chat",
        "Seasonal collections need printing every few weeks",
        "No data on which collections actually perform",
      ],
      useCases: [
        "Every item has its own page: photos, description, sizes, extras",
        "Cake messages and personalisation notes travel inside the order",
        "New collection goes live in minutes across site and QR",
        "Bestseller data decides what returns next season",
      ],
      features: [
        "Photo-led digital menu with option groups",
        "Order notes for personalisation requests",
        "Instant publishing of new collections",
        "Sales breakdown per product line",
      ],
      faqs: [
        { q: "Can customers add cake messages through the menu?", a: "Yes — option groups and order notes let them specify size, flavour and personalisation text, all captured inside the order itself." },
        { q: "We change collections often — is updating painful?", a: "No. Publish a new collection in minutes; everything updates on the website and QR menu at once, no printing involved." },
      ],
      seoTitle: "Digital Menu for Dessert & Pastry Shops | RESTORA",
      seoDescription:
        "Turn dessert lovers into orders with a photo-led digital menu: sizes, extras and personalisation notes captured inside every order. Discover RESTORA.",
    },
    ar: {
      title: "منيو حلويات شكله بحلاوة طعمه",
      subtitle: "للمحلات والحلويات والمعجنات",
      description:
        "الحلويات بتتباع بالعين. RESTORA يحوّل منيوك لمعرض صور بأسعار حية وإضافات — ويحوّل «حابب أكل ده» لطلب فعلي بنفس سهولة الواتساب.",
      problems: [
        "الصور على إنستجرام بتجيب أسئلة، لكن الطلب بيفضل في الدايريكت",
        "التخصيصات (مقاسات، إضافات، كتابة على الكيك) بتضيع في الشات",
        "كل مجموعة موسمية معناها طباعة جديدة كل شوية",
        "مفيش بيانات عن أي كوليكشن بيشوف نجاح فعلًا",
      ],
      useCases: [
        "كل صنف ليه صفحته: صور ووصف ومقاسات وإضافات",
        "رسائل الكيك وطلبات التخصيص بتسافر جوه الطلب نفسه",
        "الكوليكشن الجديد بينزل في دقايق على الموقع والـQR مع بعض",
        "بيانات الأكثر مبيعًا بتقرر مين بيرجع الموسم الجاي",
      ],
      features: [
        "منيو رقمي الصور في المقدمة مع مجموعات اختيارات",
        "ملاحظات داخل الطلب لطلبات التخصيص",
        "نشر مجموعات جديدة فورًا",
        "تفصيل مبيعات لكل خط إنتاج",
      ],
      faqs: [
        { q: "العميل يقدر يكتب رسالة على الكيك من المنيو؟", a: "أيوه — مجموعات الاختيارات وملاحظات الطلب بتخليه يحدد المقاس والنكهة ونص التخصيص، وكل ده جوه الطلب نفسه." },
        { q: "إحنا بنغيّر الكوليكشنز كتير — التحديث تقيل؟", a: "لأ. بتنزل كوليكشن جديد في دقايق، وكل حتة بتتحدث مرة واحدة: الموقع ومنيو الـQR — من غير طباعة." },
      ],
      seoTitle: "منيو إلكتروني للحلويات والمعجنات | RESTORA",
      seoDescription:
        "حوّل عشاق الحلويات لطلبات مع منيو رقمي بالصور: مقاسات وإضافات ورسائل تخصيص جوه كل طلب. اكتشف RESTORA للحلويات.",
    },
  },
  {
    slug: "home-food-businesses", planSlug: "starter", icon: "🏠", sortOrder: 5,
    en: {
      title: "Turn your home kitchen into a real food business",
      subtitle: "FOR HOME CHEFS & HOME FOOD BRANDS",
      description:
        "You cook better than half the restaurants in town — but orders live in WhatsApp chats and DMs. RESTORA gives your home food business a real menu, a real link, and real orders.",
      problems: [
        "Orders scattered across chats, calls and Instagram DMs",
        "No menu link to share — people keep asking \"what do you have?\"",
        "Prices negotiated one message at a time",
        "The business can't grow past your personal contact list",
      ],
      useCases: [
        "Share one menu link in your bio and every group chat",
        "Weekly menu published once — customers order themselves",
        "Order list auto-organized for cooking and delivery rounds",
        "A professional page that makes new customers trust you",
      ],
      features: [
        "A shareable menu + website link (your business's front door)",
        "Order collection without endless chatting",
        "WhatsApp sharing built in — meet customers where they are",
        "Starter pricing made for businesses with no storefront",
      ],
      faqs: [
        { q: "I cook from home — is RESTORA suitable for me?", a: "Yes. The starter plan exists exactly for home food businesses: a digital menu, a shareable link, and organized orders without opening a physical shop." },
        { q: "Do I need a commercial register to start?", a: "RESTORA is software — you can organise your menu and orders from day one, and add official paperwork whenever your business requires it according to your local regulations." },
        { q: "How do customers pay?", a: "They order through your menu link and pay however you agree — cash on delivery, wallet or transfer. You keep full control of payments." },
      ],
      seoTitle: "Online Menu & Orders for Home Food Businesses | RESTORA",
      seoDescription:
        "Cooking from home? Get a real menu link, organized orders and a professional page for your home food business — starter-friendly pricing from RESTORA.",
    },
    ar: {
      title: "حوّل مطبخ بيتك لمشروع أكل حقيقي",
      subtitle: "للشيفات البيتية ومشاريع الأكل من البيت",
      description:
        "انت بتطبخ أحسن من نص مطاعم البلد — لكن الطلبات عايشة في شاتات الواتساب والدايريكت. RESTORA يدي مشروع الأكل من البيت منيو حقيقي ولينك حقيقي وطلبات حقيقية.",
      problems: [
        "طلبات مبعثرة بين الشات والمكالمات ورسائل إنستجرام",
        "مفيش لينك منيو تشاركه — الناس بتفضل تسأل «عندك إيه؟»",
        "الأسعار بيتفاوض عليها رسالة رسالة",
        "المشروع مش قادر يكبر من قائمة معارفك الشخصية",
      ],
      useCases: [
        "شارك لينك منيو واحد في البايو وفي كل الجروبات",
        "منيو الأسبوع بيتنشر مرة واحدة — والعملاء يطلبوا لوحدهم",
        "لائحة الطلبات بتترتب لوحدها للطبخ وجولات التوصيل",
        "صفحة احترافية تخلي العميل الجديد يثق فيك من أول نظرة",
      ],
      features: [
        "لينك منيو وموقع قابل للمشاركة (باب مشروعك)",
        "تجميع طلبات من غير شات لا نهائي",
        "مشاركة واتساب مدمجة — قابلي العملاء حيث هم",
        "أسعار باقة البداية معمولة للمشاريع من غير محل",
      ],
      faqs: [
        { q: "أنا بعمل أكل من البيت — RESTORA ينفعلي؟", a: "أيوه. باقة البداية معمولة أساسًا لمشاريع الأكل من البيت: منيو رقمي ولينك تتشاركه وطلبات منظمة من غير ما تفتح محل." },
        { q: "محتاج سجل تجاري عشان أبدأ؟", a: "RESTORA برنامج — تنظم منيوك وطلباتك من أول يوم، وتضيف الأوراق الرسمية وقت ما مشروعك يحتاجها حسب أنظمة بلدك." },
        { q: "العملاء بيدفعوا إزاي؟", a: "بيطلبوا من لينك المنيو ويدفعوا زي ما اتفقوا: كاش عند الاستلام أو محفظة أو تحويل. انت المتحكم في الدفع بالكامل." },
      ],
      seoTitle: "منيو وطلبات أونلاين لمشروع أكل من البيت | RESTORA",
      seoDescription:
        "بتطبخ من البيت؟ خد لينك منيو حقيقي وطلبات منظمة وصفحة احترافية لمشروعك — بأسعار باقة البداية من RESTORA.",
    },
  },
  {
    slug: "cloud-kitchens", planSlug: "professional", icon: "📦", sortOrder: 6,
    en: {
      title: "Run multiple delivery brands from one cloud kitchen",
      subtitle: "FOR CLOUD KITCHENS",
      description:
        "Your entire business is online orders — so your own channel matters more than anyone's. RESTORA takes direct orders outside the aggregator apps, keeps margins sane, and tracks every brand separately.",
      problems: [
        "Aggregator commissions eat the margin on every order",
        "Several brands share one kitchen but reporting is blended",
        "Menu changes must be repeated across every platform",
        "Customer data belongs to the apps, not to you",
      ],
      useCases: [
        "Each brand gets its own menu, link and QR — managed from one dashboard",
        "Direct orders bypass commissions entirely",
        "Per-brand reports show which concept deserves the next kitchen slot",
        "Update prices once across every brand at once",
      ],
      features: [
        "Multi-brand menu management from one dashboard",
        "Direct-order channel with zero commission",
        "Per-brand analytics and order routing",
        "Own your customer contact data",
      ],
      faqs: [
        { q: "Can we manage several virtual brands in one place?", a: "Yes — each brand has its own menu and link while you run them all from a single dashboard with separate reports." },
        { q: "Does RESTORA work alongside delivery apps?", a: "Absolutely. Keep the apps for reach; RESTORA is your direct channel where the margin stays yours." },
      ],
      seoTitle: "Cloud Kitchen Management & Direct Online Orders | RESTORA",
      seoDescription:
        "Manage multiple delivery brands from one cloud kitchen dashboard. Direct orders with zero commission, per-brand analytics and unified menus — with RESTORA.",
    },
    ar: {
      title: "شغّل براندات توصيل متعددة من مطبخ سحابي واحد",
      subtitle: "للمطابخ السحابية",
      description:
        "مشروعك كله طلبات أونلاين — فقناتك الخاصة أهم من أي حد. RESTORA بياخد طلبات مباشرة من غير تطبيقات الوسطاء، وبيحمي الهامش، وبيتابع كل براند لوحده.",
      problems: [
        "عمولات التطبيقات بتاكل هامش الربح في كل طلب",
        "كذا براند في مطبخ واحد لكن التقارير مخلوطة",
        "أي تغيير منيو لازم يتكرر على كل منصة",
        "بيانات العملاء ملك للتطبيقات مش ليك",
      ],
      useCases: [
        "كل براند له منيو ولينك وQR خاص — وإنت بتديرهم من لوحة واحدة",
        "الطلبات المباشرة بتعدّي غير العمولة خالص",
        "تقارير منفصلة لكل براند بتقولك مين يستاهل خانة المطبخ الجاية",
        "بتحدّث الأسعار مرة واحدة على كل البراندات",
      ],
      features: [
        "إدارة منيوهات متعددة البراندات من لوحة واحدة",
        "قناة طلب مباشرة بدون أي عمولة",
        "تحليلات وتوجيه طلبات منفصل لكل براند",
        "بيانات التواصل مع العملاء ملكك انت",
      ],
      faqs: [
        { q: "نقدر ندير كذا براند افتراضي من مكان واحد؟", a: "أيوه — كل براند له منيو ولينك خاص وإنت بتشغّلهم كلهم من لوحة واحدة بتقارير منفصلة." },
        { q: "RESTORA بيشتغل جانب تطبيقات التوصيل؟", a: "طبعًا. سيب التطبيقات علشان الانتشار؛ RESTORA هو قناتك المباشرة اللي الهامش فيها بيبقى ملكك." },
      ],
      seoTitle: "إدارة مطابخ سحابية وطلبات مباشرة | RESTORA",
      seoDescription:
        "أدر براندات توصيل متعددة من لوحة واحدة لمطبخك السحابي. طلبات مباشرة بدون عمولة، تحليلات لكل براند، ومنيوهات موحدة — مع RESTORA.",
    },
  },
  {
    slug: "food-trucks", planSlug: "starter", icon: "🚚", sortOrder: 7,
    en: {
      title: "Your food truck moves — your menu link stays the same",
      subtitle: "FOR FOOD TRUCKS",
      description:
        "Different location every night means customers can't find you twice. RESTORA gives your truck one permanent link and QR — wherever you park, the orders know where to go.",
      problems: [
        "Followers ask \"where are you today?\" in comments every single day",
        "Queues at the window while staff take cash and make change",
        "Instagram posts don't convert into actual orders",
        "No record of which spots and hours actually pay off",
      ],
      useCases: [
        "Post tomorrow's location on your menu page — followers check one link",
        "Pre-orders ready when you open the shutter at the spot",
        "QR sticker on the truck opens the live menu instantly",
        "Spot-by-spot sales show where to park next week",
      ],
      features: [
        "One permanent menu link + QR for every location",
        "Pre-orders and pickup windows",
        "Location note section on your page",
        "Sales by day and time slot",
      ],
      faqs: [
        { q: "We move around a lot — does that complicate things?", a: "Not at all. Your link and QR never change; just update the location note so customers always know where to find tonight's truck." },
      ],
      seoTitle: "Digital Menu & Pre-Orders for Food Trucks | RESTORA",
      seoDescription:
        "One permanent menu link for your food truck wherever it parks: pre-orders ready at arrival, live menu via QR, and spot-by-spot sales insights.",
    },
    ar: {
      title: "الفوود ترك بيتنقل… ولينك منيوك ثابت",
      subtitle: "لفوود ترك",
      description:
        "كل ليلة في مكان مختلف يعني العملاء مش هيلاقوك تاني. RESTORA يدي العربية لينك ثابت وكود QR — أين ما ركنت، الطلبات عارفة تروح فين.",
      problems: [
        "المتابعين بيسألوا في التعليقات كل يوم: «النهاردة فين؟»",
        "طوابير على الشباك والفريق بيقبض كاش ويفكّ فكة",
        "بوستات إنستجرام مش بتتحول لطلبات فعلية",
        "مفيش سجل يوريك أنهي أماكن وأوقات بتعلى فعلاً",
      ],
      useCases: [
        "انشر مكان بكرة على صفحة المنيو — والمتابعين يتابعوا لينك واحد",
        "طلبات مسبقة جاهزة وقت ما تفتح الشباك في المكان",
        "ملصق QR على العربية بيفتح المنيو الحي فورًا",
        "مبيعات مكان بمكان بتحدد تركّز فين الأسبوع الجاي",
      ],
      features: [
        "لينك منيو وQR ثابتين لكل المواقع",
        "طلبات مسبقة ومواعيد استلام",
        "قسم ملاحظة الموقع على صفحتك",
        "مبيعات باليوم وبالفترة الزمنية",
      ],
      faqs: [
        { q: "إحنا بنتنقل كتير — ده يعقّد الحياة؟", a: "خالص. اللينك والـQR مش بيغيّروا؛ بس حدّث ملاحظة الموقع والعملاء هيعرفوا عربية الليلة فين دايمًا." },
      ],
      seoTitle: "منيو إلكتروني وطلبات مسبقة لفوود ترك | RESTORA",
      seoDescription:
        "لينك منيو ثابت لعربيتك أينما ركنت: طلبات مسبقة جاهزة عند الوصول، منيو حي بالـQR، ومبيعات مفصلة بالمكان والوقت — مع RESTORA.",
    },
  },
  {
    slug: "catering", planSlug: "enterprise", icon: "🍱", sortOrder: 8,
    en: {
      title: "Catering orders without the spreadsheet chaos",
      subtitle: "FOR CATERING & BUFFETS",
      description:
        "Big events, custom quantities, tight schedules. RESTORA structures your catering menu, collects complete event briefs inside each order, and keeps every booking visible to your whole team.",
      problems: [
        "Event inquiries arrive by phone, email and social — easy to double-book",
        "Quantities, dates and venue details live in email threads",
        "Quotes are rebuilt from scratch every time",
        "Nothing connects the enquiry to the actual order and invoice",
      ],
      useCases: [
        "Publish packages (weddings, offices, openings) as clear menu sections",
        "Clients request quotes with headcount and date inside the order form",
        "Team calendar view prevents overlapping bookings",
        "Repeat corporate clients reorder in two clicks",
      ],
      features: [
        "Package-based catering catalogue",
        "Structured event details captured per order",
        "Order status pipeline for bookings",
        "Order history per client",
      ],
      faqs: [
        { q: "Can clients request large-quantity quotes online?", a: "Yes — they choose a package, set headcount, date and venue notes, and the request arrives as a structured order your team can confirm." },
        { q: "Does this support repeat corporate clients?", a: "Their order history is saved, so rebooking last month's office lunch takes seconds, not a new negotiation." },
      ],
      seoTitle: "Catering Order Management Software | RESTORA",
      seoDescription:
        "Structure your catering menu, collect complete event briefs and track every booking in one pipeline. RESTORA for caterers, buffets and hospitality teams.",
    },
    ar: {
      title: "طلبات ضيافة من غير فوضى الإكسل والمكالمات",
      subtitle: "للبوفيهات وشركات الضيافة",
      description:
        "مناسبات كبيرة، كميات خاصة، مواعيد مضغوطة. RESTORA ينظم منيو الضيافة، ويجمع تفاصيل المناسبة كاملة جوه كل طلب، ويخلي كل حجز مرئي لفريقك كله.",
      problems: [
        "طلبات المناسبات بتوصل تليفون وإيميل وسوشيال — والحجز المزدوج قريب جدًا",
        "الكميات والتواريخ وتفاصيل المكان عايشة في إيميلات متسلسلة",
        "عرض السعر بيتبنى من الصفر كل مرة",
        "مفيش ربط بين الاستفسار والطلب الفعلي والفاتورة",
      ],
      useCases: [
        "انشر الباكدجات (أفراح، مكاتب، افتتاحات) كأقسام واضحة في المنيو",
        "العميل يطلب عرض سعر بعدد الأفراد والتاريخ من داخل نموذج الطلب",
        "عرض التقويم للفريق يمنع تعارض الحجوزات",
        "عملاء الشركات الدائمين يعيدوا الحجز بضغطتين",
      ],
      features: [
        "كاتالوج ضيافة مبني على الباكدجات",
        "تفاصيل المناسبة بتتسجل جوه كل طلب",
        "مسار حالات للطلب من الاستفسار للتأكيد",
        "سجل طلبات لكل عميل",
      ],
      faqs: [
        { q: "العميل يطلب عروض كميات كبيرة أونلاين؟", a: "أيوه — يختار باكدج ويحدد عدد الأفراد والتاريخ وملاحظات المكان، والطلب بيوصلك منظم وفريقك يؤكد عليه." },
        { q: "بينفع لعملاء الشركات المتكررين؟", a: "سجل طلباتهم محفوظ، فعمل غداء المكتب زي الشهر اللي فات بياخد ثواني مش تفاصيل جديدة." },
      ],
      seoTitle: "نظام إدارة طلبات الضيافة والبوفيهات | RESTORA",
      seoDescription:
        "نظّم منيو الضيافة واجمع تفاصيل المناسبة كاملة وتابع كل حجز في مسار واحد. RESTORA للبوفيهات وشركات الضيافة.",
    },
  },
  {
    slug: "juice-shops", planSlug: "growth", icon: "🧃", sortOrder: 9,
    en: {
      title: "Fresh juice, faster lines: digital menus for juice bars",
      subtitle: "FOR JUICE SHOPS",
      description:
        "Detox Mondays, mango season, sugar-free asks. RESTORA keeps your juice bar's menu flexible, your lines moving, and your best-selling blends easy to reorder.",
      problems: [
        "Fruit availability changes daily — printed menus can't keep up",
        "Custom mixes (less sugar, extra ginger) slow the counter down",
        "Loyalty happens verbally, if it happens at all",
        "Peak-hour queues walk away before ordering",
      ],
      useCases: [
        "Mark what's fresh today directly on the digital menu",
        "Customers customize and pay ahead, then grab and go",
        "Reorder history brings back the regular's exact mix",
        "Seasonal specials launch on the menu in minutes",
      ],
      features: [
        "Fast-edit daily availability",
        "Option groups for custom mixes",
        "Order-ahead for pickup windows",
        "Customer order history",
      ],
      faqs: [
        { q: "Our fruit supply changes daily — is that a problem?", a: "It's exactly what a digital menu solves: toggle today's availability in seconds and the menu everyone sees updates instantly." },
      ],
      seoTitle: "Digital Menu for Juice Bars & Fresh Juice Shops | RESTORA",
      seoDescription:
        "Keep juice-bar menus fresh daily: instant availability updates, custom mix options and order-ahead pickup. See RESTORA for juice shops.",
    },
    ar: {
      title: "عصير فريش وطابور أسرع: منيو رقمي للعصائر",
      subtitle: "لمحلات العصائر",
      description:
        "ديتوكس الإثنين، موسم المانجو، «سكر أقل». RESTORA يخلي منيو محل العصائر مرن، والطابور ماشي، وألذ بلندنق عندك سهل يعيد طلبه.",
      problems: [
        "توفر الفاكهة بيتغير كل يوم — المنيو المطبوع مش هيلاحق",
        "الخلطات الخاصة (سكر أقل، جنزبيل زيادة) بتقلّي الكاونتر",
        "الولاء بيتقال بالكلام، لو بيتم أصلًا",
        "طوابير الذروة بتمشي قبل ما تطلب",
      ],
      useCases: [
        "علّم إيه الفريش النهاردة مباشرة على المنيو الرقمي",
        "العميل يخصص ويدفع مقدمًا وبعدين ياخد ويمشي",
        "سجل الطلبات بيرجع خلطتى الزبون الدائم بالظبط",
        "العروض الموسمية بينزل على المنيو في دقايق",
      ],
      features: [
        "تعديل سريع لتوفر اليوم",
        "مجموعات اختيارات للخلطات الخاصة",
        "طلب مقدم لمواعيد الاستلام",
        "سجل طلبات لكل عميل",
      ],
      faqs: [
        { q: "توريد الفاكهة عندنا بيتغير يوميًا — دي مشكلة؟", a: "دي بالظبط اللي المنيو الرقمي بيحلها: ظبط توفر النهاردة في ثواني والمنيو اللي شايفه كل حد بيتحدث فورًا." },
      ],
      seoTitle: "منيو إلكتروني لمحلات العصائر | RESTORA",
      seoDescription:
        "خلي منيو العصائر فريش كل يوم: تحديث توفر فوري، خلطات مخصصة، وطلب مقدم للاستلام. شوف RESTORA لمحلات العصائر.",
    },
  },
];

const encode = (arr: string[]) => arr.join(" | ");

export async function seedSegmentPages() {
  for (const seg of segmentPagesSeed) {
    const data = {
      planSlug: seg.planSlug,
      icon: seg.icon,
      active: true,
      sortOrder: seg.sortOrder,
    };
    const page = await prisma.segmentPage.upsert({
      where: { slug: seg.slug },
      update: data,
      create: { ...data, slug: seg.slug },
    });

    for (const locale of LOCALES) {
      const t = seg[locale];
      const tData = {
        title: t.title,
        subtitle: t.subtitle,
        description: t.description,
        problems: encode(t.problems),
        useCases: encode(t.useCases),
        features: encode(t.features),
        faqs: encodeFaqs(t.faqs),
        seoTitle: t.seoTitle,
        seoDescription: t.seoDescription,
      };
      await prisma.segmentPageTranslation.upsert({
        where: { segmentId_locale: { segmentId: page.id, locale } },
        update: tData,
        create: { ...tData, segmentId: page.id, locale },
      });
    }
  }
  console.log(`Seeded ${segmentPagesSeed.length} segment pages.`);
}
