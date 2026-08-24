// ---------------------------------------------------------------------------
// Blog articles (original editorial content — EN + AR)
// ---------------------------------------------------------------------------

export type BlogPostSeed = {
  slug: string;
  authorName: string;
  category: string;
  tags: string[];
  featured?: boolean;
  publishedDaysAgo: number;
  seoTitle?: string;
  seoDescription?: string;
  en: { title: string; excerpt: string; content: string };
  ar: { title: string; excerpt: string; content: string };
};

export const blogPostsSeed: BlogPostSeed[] = [
  {
    slug: "why-restaurants-lose-orders",
    authorName: "RESTORA Team",
    category: "operations",
    tags: ["orders", "operations", "management"],
    featured: true,
    publishedDaysAgo: 6,
    seoTitle: "Why Restaurants Lose Orders — And How to Stop It | RESTORA",
    seoDescription:
      "Scattered orders, missed calls and paper tickets cost restaurants real money every week. Here is where orders get lost — and a system to stop it.",
    en: {
      title: "Where Do Your Orders Actually Get Lost?",
      excerpt:
        "Most restaurants don't lose customers because of bad food. They lose them in the gap between the table, the kitchen and the cashier. Here is how to find those gaps.",
      content: `Every restaurant owner knows the feeling: the shift was busy, everyone ran around all evening… and at the end of the month the numbers don't match the effort.

The food wasn't the problem. The problem is that your orders travel through too many hands.

## The five places orders disappear

**1. The verbal order.** A waiter remembers table 7 wanted two extra sauces. The kitchen never hears it. The customer remembers.

**2. The paper ticket.** Wet hands, rush hour, a ticket falls behind the counter. Nobody notices until "where is table 12's order?" echoes across the kitchen.

**3. The phone that rings while you're plating.** You either let it ring (lost order) or answer it mid-chaos (mistaken order).

**4. WhatsApp messages.** Ten chats, three voice notes, one photo of a handwritten list. Every order lives somewhere different, and nothing adds up at closing time.

**5. The menu that lies.** An item sold out at 8pm but stayed on the menu. Now every mention of it creates an apology instead of a sale.

None of these look dramatic on their own. Together they are the reason a busy week can still end with a disappointing revenue number.

## What "organized" actually looks like

An organized restaurant isn't one with more staff. It's one where an order can only exist in **one place**: the moment a customer decides, the order exists digitally — visible to the kitchen, counted in the dashboard, impossible to drop.

That's the core idea behind RESTORA. Not another app to check — one place where:

- the customer orders from the QR menu or your link,
- the kitchen sees exactly what to prepare,
- you see every order, live, from anywhere,
- and at the end of the day the numbers add up by themselves.

## Try this today

Before changing any software, count for one shift how many times an order changes format — spoken, written, retyped, repeated. Most owners are shocked by the number.

Every one of those moments is a chance to get it wrong. RESTORA removes them.`,
    },
    ar: {
      title: "فين بالظبط طلباتك بتضيع؟",
      excerpt:
        "معظم المطاعم مش بتفقد عملائها بسبب الأكل — بتفقدهم في المسافة بين الطاولة والمطبخ والكاشير. اعرف الفجوات دي وإزاي تقفلها.",
      content: `كل صاحب مطعم عارف الإحساس ده: الشيفت كان زحمة، وكل الناس اشتغلت طول اليوم… وفي آخر الشهر الأرقام مش بتطابق المجهود.

الأكل مكانش المشكلة. المشكلة إن الطلب بيمر على إيد كتير أوي.

## الخمس أماكن اللي الطلبات بتضيع فيها

**١. الطلب الشفوي.** الجرسون فاكر إن ترابيزة 7 طلبت صوص زيادة. المطبخ عمره ما سمع بها. العميل فاكرها كويس.

**٢. ورقة الطلبات.** إيد مبلولة، وقت زحمة، والورقة وقعت ورا الكاونتر. محدش ياخد باله غير لما صوت "فين طلب ترابيزة 12؟" يعلي في المطبخ.

**٣. التليفون اللي بيرن وأنت بتجهّز.** يا إما تسيبه (طلب ضايع) يا ترد وهو في وسط الزحمة (طلب غلط).

**٤. رسائل الواتساب.** عشر شاتات، وتلات رسايل صوت، وصورة ليستة مكتوبة بإيد. كل طلب عايش في مكان مختلف، ولا حاجة بتتجمع في آخر اليوم.

**٥. المنيو اللي بيكدب.** صنف خلص من الساعة ٨ بس لسه موجود في المنيو. كل ذكر ليه بقى اعتذار بدل ما يكون بيع.

ولا واحدة من دي شكلها كارثة لوحدها. لكن مع بعض هي السبب إن أسبوع زحمة يخلص برقم مخيب.

## شكل "التنظيم" الحقيقي

المطعم المنظم مش اللي عنده ناس أكتر. المطعم المنظم هو اللي الطلب فيه مش ممكن يعيش إلا في **مكان واحد**: من لحظة ما العميل يقرر، الطلب موجود رقمياً — شايفه المطبخ، وبيتحسب في اللوحة، ومستحيل يضيع.

دي الفكرة الأساسية اللي RESTORA اتبنت عليها. مش تطبيق تاني تفتحه — مكان واحد:

- العميل يطلب من منيو الـQR أو من لينك مطعمك،
- المطبخ يشوف بالظبط المطلوب يتحضر،
- وتتابع كل طلب لايف ومن أي مكان،
- وفي آخر اليوم الأرقام تتجمّع لوحدها.

## جرب ده النهاردة

قبل ما تغير أي برنامج، اعمل حاجة بسيطة: عد في شيفت واحد كام مرة الطلب بيتحول من شكل لشكل — يتقال، يتكتب، يتنقل، يتكرر. أغلب أصحاب المطاعم بيندهشوا من الرقم.

كل مرة من دول كانت فرصة للغلط. RESTORA بتشيلها من الجذر.`,
    },
  },
  {
    slug: "qr-menu-guide-for-restaurants",
    authorName: "RESTORA Team",
    category: "digital-menu",
    tags: ["qr-menu", "digital-menu", "customer-experience"],
    featured: false,
    publishedDaysAgo: 13,
    seoTitle: "The Practical Guide to QR Menus for Restaurants | RESTORA",
    seoDescription:
      "What makes a QR menu actually work: speed, photos, honest prices and instant updates. A practical guide for restaurant and café owners.",
    en: {
      title: "A QR Menu Is Not a PDF With a Code On It",
      excerpt:
        "Most digital menus fail for boring reasons: slow pages, ugly photos, outdated prices. Here's what separates a QR menu customers enjoy from one they tolerate.",
      content: `Since 2020 almost every restaurant has tried a QR menu. Some owners swear by theirs. Others quietly went back to printed cards. The difference is rarely the idea — it's the execution.

## Why most QR menus fail

**They're slow.** A customer scans, waits 6 seconds for a heavy PDF to load, and picks up the paper menu instead. Speed is the feature.

**They're ugly.** A dark photo of a blurry dish sells less than no photo at all. If your menu looks like an afterthought, customers assume the food might be too.

**They lie.** Old prices, unavailable items, seasonal dishes from last winter. A menu that needs "sorry, this is finished" five times a night is worse than paper.

## What a good digital menu does

1. **Opens instantly.** Scan → browsing in under two seconds.
2. **Sells.** Clear photos, short appetizing descriptions, sensible categories.
3. **Never goes stale.** Change a price once and it's updated everywhere — every table, every delivery customer, right now.
4. **Leads somewhere.** The best menus don't just show dishes; they make ordering the natural next step.

## The quiet business case

Printed menus cost money twice: to print, and in lost flexibility. Every price change means a reprint. Every new item waits for the next batch. A living menu turns "menu management" from a printing schedule into a two-minute task you do from your phone.

That's why we built menus in RESTORA as part of the whole system — not a separate PDF tool. When the menu, the orders and the analytics live together, updating a price takes seconds and immediately reflects reality.

## Quick checklist before you switch

- Does it open fast on a cheap phone?
- Can you update prices yourself, without calling anyone?
- Are items easy to browse when the place is full and hands are wet?
- Can the customer go from "looks good" to "order placed" without downloading anything?

If the answer is yes four times, you have a real digital menu — not a code taped to a table.`,
    },
    ar: {
      title: "منيو الـQR مش مجرد PDF عليه كود",
      excerpt:
        "أغلب المنيوهات الإلكترونية بتفشل لأسباب مملة: صفحات بطيئة، صور باهتة، أسعار قديمة. دي الفروقات بين منيو العملاء بيستمتعوا بيه ومنيو بيتحمّلوا.",
      content: `من سنة ٢٠٢٠ تقريباً كل مطعم جرب منيو QR. في أصحاب مطاعم مبسوطين بيه جداً، وفي ناس رجعت بهدوء للكراسي الورقية. الفرق نادراً ما يكون في الفكرة — الفرق في التنفيذ.

## ليه أغلب منيوهات الـQR بتفشل؟

**بطيئة.** العميل يمسح الكود، يستنى ٦ ثواني علشان PDF تقيل يفتح، وبعدها يرفع المنيو الورقي. السرعة هي الميزة الأساسية.

**شكله وحش.** صورة غامقة لطبق مش واضح بتبيع أقل من عدم وجود صورة خالص. لو المنيو شكله مجرد فورم، العملاء هيحسوا إن الأكل ممكن يكون كذلك.

**بيكدب.** أسعار قديمة، أصناف مش متاحة، أطباق موسمية من الشتا اللي فات. منيو محتاج "آسفين، ده خلص" خمس مرات في الليلة، أسوأ من الورق.

## المنيو الإلكتروني الكويس بيعمل إيه؟

١. **بيفتح فوراً.** مسح → تصفح خلال ثانيتين.
٢. **بيبيع.** صور واضحة، وصف قصير يشهّي، وتقسيم منطقي للأقسام.
٣. **عمره ما بيتقادم.** تغيّر السعر مرة واحدة، ويتحدث في كل حاجة — كل ترابيزة، وكل عميل توصيل، حالاً.
٤. **بيوديك لحاجة.** أحسن منيو مش بس بيعرض الأطباق — بيخلّي الطلب هو الخطوة الطبيعية اللي بعدها.

## الحسبة اللي محدش بيتكلم عنها

المنيوهات المطبوعة بتتكلف فلوس مرتين: مرة في الطباعة، ومرة في الصبر. كل تغيير سعر معناه طباعة جديدة. كل صنف جديد بيستنى الدفعة الجاية. المنيو الحي بيحوّل "إدارة المنيو" من جدول طباعة لمهمة دقيقتين تعملها من موبايلك.

علشان كده بنينا المنيوهات في RESTORA كجزء من نظام كامل — مش أداة PDF منفصلة. لما المنيو والطلبات والتحليلات يعيشوا مع بعض، تغيير سعر بياخد ثواني وبيبان في الحقيقة على طول.

## تشيك ليست سريعة قبل ما تنقل

- بيفتح بسرعة على موبايل ضعيف؟
- تقدر تغير الأسعار بنفسك من غير ما تتصل بواحد؟
- الأصناف سهلة التصفح والمكان مليان والإيد مبلولة؟
- العميل يقدر يروح من "شكله حلو" إلى "تم إرسال الطلب" من غير تحميل أي تطبيق؟

لو الإجابة أيوة أربع مرات، يبقى عندك منيو إلكتروني حقيقي — مش كود ملزوق على ترابيزة.`,
    },
  },
  {
    slug: "restaurant-decisions-from-real-numbers",
    authorName: "RESTORA Team",
    category: "analytics",
    tags: ["analytics", "growth", "decisions"],
    featured: false,
    publishedDaysAgo: 20,
    seoTitle: "Running Your Restaurant on Real Numbers, Not Guesses | RESTORA",
    seoDescription:
      "Which dishes actually sell, which hours pay the rent, and what to change first — how restaurant analytics turn daily chaos into clear decisions.",
    en: {
      title: "Stop Managing Your Restaurant From Memory",
      excerpt:
        "Which dish really makes you money? Which weekday deserves a promotion? If the answers come from gut feeling, here's how to get them from numbers you already have.",
      content: `Ask a restaurant owner which item sells best and you'll usually get a confident answer. Ask what the profit margin on that item is, and the room goes quiet.

That gap — between what feels true and what is true — is where most restaurants leak money.

## Three questions memory can't answer

**1. What actually sells?** Not what you're proud of — what moves. Top-seller lists change with seasons, street traffic and trends. Owners who check monthly notice things like "our chicken sandwich quietly became #1".

**2. Which hours earn their keep?** Rent is paid 24/7, but only some hours pay for it. Knowing your real peak hours tells you when to schedule staff, when to run offers, and when a slow Tuesday needs help.

**3. What did that promotion really do?** Offers feel successful when the place is busy. But did the discount bring new customers, or just cheaper meals to people who would've paid full price?

## Decisions become simple with data

Once these numbers exist, decisions stop being fights between opinions:

- The dish at the bottom of the sales list either gets reinvented or replaced.
- Staffing follows the demand curve instead of habit.
- Promotions target genuinely quiet hours instead of stealing margin from busy ones.

None of this requires a data scientist. It requires your orders to be recorded in one system instead of scattered across notebooks, phones and delivery apps.

## How RESTORA fits in

Because every order flows through RESTORA, the analytics aren't an extra chore — they're a byproduct of running your day normally. Top sellers, hourly patterns and growth trends appear on your dashboard automatically, from anywhere.

You don't need to love spreadsheets. You need your restaurant to tell you the truth. Then growing it becomes a series of small, confident moves instead of big guesses.`,
    },
    ar: {
      title: "بطل تدير مطعمك من على ذاكرتك",
      excerpt:
        "إيه الطبق اللي بيكسبك فلوس فعلاً؟ أنهي يوم يستاهل عرض خاص؟ لو إجاباتك بالإحساس، دي إزاي تجيبها بأرقام موجودة عندك أصلاً.",
      content: `اسأل أي صاحب مطعم إيه أكثر صنف بيتباع، هتاخد إجابة واثقة. اسأله إيه هامش ربح الصنف ده، وهيسكت الأوضة.

الفجوة دي — بين اللي حسّناً إنه صح واللي صح فعلاً — هي اللي مطاعم كتير بتسرّب فيها فلوس.

## تلات أسئلة الذاكرة متقدرش تجاوبهم

**١. إيه اللي بيتباع فعلاً؟** مش اللي انت فخور بيه — اللي بيتحرك. قائمة الأكثر مبيعاً بتتغير مع المواسم وحركة الشارع والموضة. أصحاب المطاعم اللي بيراجعوها شهرياً بيكتشفوا حاجات زي "ساندوتش الفراخ بقى الأول من غير ما نحس".

**٢. أنهي ساعات بتدفع الإيجار؟** الإيجار مدفوع ٢٤ ساعة، لكن ساعات معينة بس هي اللي بتغطيه. لما تعرف ساعات الذروة الحقيقية بتعرف تحدد الورديات، وتعمل العروض امتى، والتلاتا الهادية ده محتاج مساعدة إزاي.

**٣. العرض اللي عملته حقق إيه بالظبط؟** العروض بتتحس إنها ناجحة لما المكان يبقى زحمة. لكن هل الخصم جاب عملاء جداد، ولا بيبيع أرخص لناس كانت هتدفع السعر كامل أصلاً؟

## القرارات بتبقى سهلة بالأرقام

لما الأرقام دي تبقى موجودة، القرارات بتبطل تكون معركة آراء:

- الطبق اللي في آخر قائمة المبيعات يا يتطور يا يتبدل.
- الورديات تتحسب على منحنى الطلب مش على العادة.
- العروض تستهدف الساعات الهادية فعلاً، بدل ما تأكل هامش ربح الساعات الزحمة.

مش محتاج عالم بيانات. محتاج طلباتك تتسجل في نظام واحد بدل ما تكون متبعترة بين دفاتر وتليفونات وتطبيقات توصيل.

## RESTORA داخل إزاي في الموضوع؟

لأن كل طلب بيعدي على RESTORA، التحليلات مش مهمة إضافية — هي نتيجة جانبية طبيعية ليوم عادي من شغلك. الأكثر مبيعاً، وأنماط الساعات، واتجاهات النمو بيظهروا على لوحتك أوتوماتيك، ومن أي مكان.

مش لازم تحب جداول الإكسيل. لازم بس مطعمك يقولك الحقيقة. وساعتها تكبيره بيبقى خطوات صغيرة واثقة بدل تخمينات كبيرة.`,
    },
  },
];
