// ---------------------------------------------------------------------------
// Blog articles — intent-driven content (EN + AR)
// Targets problem/commercial queries: digital menu, commissions, Google
// visibility, home food business, software buying guide.
// ---------------------------------------------------------------------------

import type { BlogPostSeed } from "./seed-blog";

export const moreBlogPostsSeed: BlogPostSeed[] = [
  {
    slug: "how-to-create-a-digital-menu",
    authorName: "RESTORA Team",
    category: "digital-menu",
    tags: ["digital menu", "menu design", "getting started"],
    publishedDaysAgo: 2,
    seoTitle: "How to Create a Digital Menu for Your Restaurant (2026 Guide) | RESTORA",
    seoDescription:
      "A practical step-by-step guide to creating a digital menu for your restaurant or café: what to include, how to structure it, and how customers actually use it.",
    en: {
      title: "How to Create a Digital Menu That Customers Actually Use",
      excerpt:
        "A digital menu is more than a PDF on a link. Here is the practical, no-fluff process for building one that loads fast, sells well and stays up to date.",
      content: `Most digital menus fail for boring reasons: they are slow, they hide prices behind downloads, or they were beautiful on launch day and wrong a week later.

Here is how to build one that works every day.

## 1. Start with structure, not design

Group your menu the way customers think, not the way your kitchen runs:

- Drinks / Hot / Cold — not "Beverage operations"
- 5–8 items per category maximum
- Best-sellers first inside each category

If a category needs scrolling to understand, split it.

## 2. Photos only where they sell

Every photo slows the menu down. Use photos for your top 10 items — the ones people argue about — and clean typography for the rest. A menu that loads in two seconds outsells a beautiful one that loads in ten.

## 3. Prices visible, always

Never gate prices behind a download or a login. A customer comparing two cafés on the street picks the one whose menu answered their question fastest.

## 4. Make updating someone's five-minute job

The real test of a digital menu is not launch day — it's the day mango season ends. If changing a price means calling a developer, the menu will rot. Pick a system where the person who owns the menu can edit it from their phone.

## 5. Put the menu everywhere it can be opened

- A QR code on every table
- The link in your Instagram and TikTok bios
- The link in your Google Business Profile
- Printed small on receipts and packaging

One menu, many doors.

## 6. Watch what customers do with it

Views without orders mean descriptions or prices need work. Items nobody opens should be redesigned or removed. Your menu is a sales floor — treat it like one.

## The shortcut

RESTORA does all of the above out of the box: a phone-editable digital menu, automatic QR codes, multi-language support and item-level analytics — connected directly to your orders so the menu never drifts from reality.

Want to see it with your own menu? Open an account and you will have a working link in minutes.`,
    },
    ar: {
      title: "إزاي تعمل منيو إلكتروني يستاهل العميل يستخدمه؟",
      excerpt:
        "المنيو الإلكتروني مش PDF على لينك. دي خطوات عملية من غير حشو لبناء منيو سريع، بيبيع، ويفضل محدّث.",
      content: `أغلب المنيوهات الإلكترونية بتفشل لأسباب مملة: بطيئة، أو بتخبي الأسعار ورا تحميل، أو كانت جميلة يوم الإطلاق وبقت غلط بعد أسبوع.

دي الطريقة الصح تبني بيها منيو يشتغل كل يوم.

## ١. ابدأ بالهيكل مش بالتصميم

قسّم المنيو زي ما العميل بيفكر، مش زي ما مطبخك بيشتغل:

- مشروبات/ساخن/بارد — مش «عمليات المشروبات»
- من ٥ لـ٨ أصناف في كل قسم كحد أقصى
- الأكثر مبيعًا أولًا جوه كل قسم

لو القسم محتاج تدوير عشان يتفهم، قسّمه.

## ٢. صور بس اللي بتبيع

كل صورة بتبطّئ المنيو. استخدم الصور لأعلى ١٠ أصناف — اللي الناس بتتحير فيهم — وتايبوغرافي نظيف للباقي. منيو بيفتح في ثانيتين بيبيع أحسن من جميل بياخد عشر ثواني.

## ٣. الأسعار ظاهرة دايمًا

ممنوع تخبي الأسعار ورا تحميل أو تسجيل. العميل اللي واقف يقارن بين كافيهين هيختار اللي منيوه جاوب على سؤاله الأول.

## ٤. خلي التحديث شغل ٥ دقايق

الاختبار الحقيقي للمنيو الإلكتروني مش يوم الإطلاق — ده اليوم اللي موسم المانجو بينتهي فيه. لو تغيير سعر معناه تتصل بمبرمج، المنيو هيتعفّن. اختار نظام صاحب المنيو يقدر يعدّله من تليفونه.

## ٥. حط المنيو في كل مكان ينفتح منه

- كود QR على كل طاولة
- اللينك في بايو إنستجرام وتيك توك
- اللينك في ملف جوجل للأعمال
- مطبوع صغير على الفواتير والعبوات

منيو واحد، أبواب كتير.

## ٦. بصّ على اللي بيحصل

مشاهدات من غير طلبات معناها الوصف أو الأسعار محتاجة شغل. أصناف محدش بيفتحها: إما تتعاد صياغتها أو تتشال. المنيو أرضية بيع — تعامل معاه كده.

## الاختصار

RESTORA بيعمل كل اللي فات ده جاهز: منيو رقمي بتتحكم فيه من التليفون، أكواد QR أوتوماتيك، دعم أكتر من لغة، وتحليلات لكل صنف — ومربوطين بطلباتك مباشرة فالمنيو ما بيبتعدش عن الحقيقة.

عايز تشوفوه بمنيوك الحقيقي؟ افتح حساب و هيبقى معاك لينك شغال في دقايق.`,
    },
  },
  {
    slug: "restaurant-online-ordering-without-commissions",
    authorName: "RESTORA Team",
    category: "online-ordering",
    tags: ["online ordering", "delivery", "commissions"],
    publishedDaysAgo: 9,
    seoTitle: "How Restaurants Take Online Orders Without App Commissions | RESTORA",
    seoDescription:
      "Delivery apps bring reach but eat your margin. Here's how to build a direct online-ordering channel your customers use anyway — honestly explained.",
    en: {
      title: "Taking Online Orders Without Giving Away Your Margin",
      excerpt:
        "Aggregator apps solve discovery but charge for it forever. Here's how to build a direct ordering channel alongside them — and shift regulars onto it.",
      content: `Let's be honest about the trade-off: delivery apps give you reach in exchange for a percentage of every order, forever. For many restaurants that percentage is the difference between profit and breaking even.

You don't have to choose between the apps and nothing. You need both channels — and a plan to grow the direct one.

## What a direct channel needs to work

Customers won't switch because it's better for you. They switch when it's easier for them:

**1. One permanent link.** Your own ordering page, in your bio, on your receipts, on your table QR codes. It must be as easy as opening an app.

**2. The full menu, live.** Photos, prices, sold-out states updated in real time. Nothing kills trust like ordering something that doesn't exist.

**3. Order clarity.** The customer wants the same certainty the app gives: confirmation, timing, and a way to ask questions.

**4. A reason to come back.** Direct customers can get things apps don't offer: loyalty pricing, first access to seasonal items, a human reply on WhatsApp.

## How to move your regulars over

- Put the QR code physically in front of every dine-in guest — the highest-intent moment you will ever get.
- Offer pickup through your own channel first; pickup has no delivery economics attached.
- Say it plainly: "Ordering direct keeps our prices lower." Customers respect honesty more than marketing.

## Keep the apps — strategically

Aggregators are advertising with a revenue share. Use them for discovery of new areas or new brands, and let every bag you hand out carry your direct link. Over months, the mix shifts toward the channel where the margin is yours.

## The system side

Running a second channel by hand (chats, screenshots, spreadsheets) fails within weeks. RESTORA gives you the direct channel as infrastructure: your own menu page, order dashboard, live availability and analytics — with zero commission per order, because it's yours.

See what it looks like for your type of business on our business types page, or go straight to plans and pricing.`,
    },
    ar: {
      title: "استقبل طلبات أونلاين من غير ما تدّي هامشك للتطبيقات",
      excerpt:
        "تطبيقات التوصيل بتديك انتشار مقابل نسبة من كل طلب للأبد. إزاي تبني قناة طلب مباشرة جنبها — وتحوّل الزباين الدائمين ليها بشفافية.",
      content: `خلينا نكون صريحين في المعادلة: تطبيقات التوصيل بتديك انتشار مقابل نسبة من كل طلب، للأبد. لكثير من المطاعم النسبة دي هي الفرق بين مكسب وتعادل.

انت مش مضطر تختار بين التطبيقات ولا لا شيء. انت محتاج القناتين — وخطة تكبير القناة المباشرة.

## القناة المباشرة محتاجة إيه عشان تشتغل؟

العميل مش هيغيّر لأنه أفضل لك. هيغير لما يبقى أسهل له:

**١. لينك واحد دائم.** صفحة الطلب بتاعتك في البايو وعلى الفواتير وعلى أكواد الطاولات. لازم تكون بأسهلية فتح تطبيق.

**٢. المنيو كامل وحي.** صور وأسعار وحالات نفاد محدثة لحظيًا. مفيش حاجة بتضيع الثقة زي إن العميل يطلب صنف مش موجود.

**٣. وضوح الطلب.** العميل عايز نفس الاطمئنان اللي التطبيق بيديه: تأكيد، وتوقيت، وطريقة يسأل بيها.

**٤. سبب يرجع تاني.** عملاء القناة المباشرة ممكن يحصلهم حاجات التطبيقات متقدمهاش: أسعار ولاء، وصول مبكر للموسميات، ورد إنسان فعلي على الواتساب.

## إزاي تنقل الزباين الدائمين؟

- حط كود الـQR قدام كل زائر داخل — أعلى لحظة نيّة شراء ممكن تحصلك.
- خلّي الاستلام من خلال قناتك الأول؛ الاستلام ملوش اقتصاديات توصيل.
- قولها بصراحة: «الطلب المباشر بيخلي أسعارنا أقل». العملاء بيحترموا الصراحة أكتر من التسويق.

## فضّل التطبيقات — بذكاء

التطبيقات الإجمالية إعلانات بحصة من الإيراد. استخدمها لاستكشاف مناطق جديدة أو براندات جديدة، وخلّي كل كيس تسلّمه يشيل لينكك المباشر. مع الشهور، الميزان يميل للقناة اللي الهامش فيها ملكك.

## جانب النظام

تشغيل قناة تانية يدويًا (شاتات وسكرين شوت وإكسل) بيفشل في أسابيع. RESTORA بيديك القناة المباشرة كبنية تحتية: صفحة منيو خاصة بيك، لوحة طلبات، توفر لحظي، وتحليلات — بدون أي عمولة على الطلب، لأنها بتاعتك.

شوف شكلها مع نوع مشروعك على صفحة أنواع الأعمال، أو ادخل على طول على الباقات والأسعار.`,
    },
  },
  {
    slug: "how-to-show-your-restaurant-on-google",
    authorName: "RESTORA Team",
    category: "growth",
    tags: ["google business profile", "local seo", "marketing"],
    publishedDaysAgo: 16,
    seoTitle: "How to Get Your Restaurant Found on Google (Practical Guide) | RESTORA",
    seoDescription:
      "Customers search 'food near me' before they walk anywhere. A practical guide to showing up: Google Business Profile, photos, reviews and your own links.",
    en: {
      title: '"Food Near Me": How to Show Up When Hungry People Search',
      excerpt:
        'Before a customer walks or orders, they search. Here\'s the practical checklist for being findable on Google Maps and Search — no agency required.',
      content: `The most valuable marketing asset your restaurant owns isn't its Instagram — it's the moment someone nearby searches "food near me" and Google decides who to show.

That decision is mostly influenced by things you control. Here's the checklist.

## 1. Claim and complete your Google Business Profile

This is free and non-negotiable:

- Exact category ("Egyptian restaurant", not just "Restaurant")
- Full hours — including holidays
- Your menu link (this matters — see below)
- Real photos of food, interior and exterior, updated monthly

Incomplete profiles simply rank below complete ones. This alone puts you ahead of many competitors.

## 2. Your menu link must open instantly

Google shows a "menu" button on your profile. Where it points decides whether that curious searcher becomes a guest. It must:

- Open fast on phones
- Show prices without downloads or logins
- Be current — a wrong menu converts worse than none

This is exactly why RESTORA gives every business a permanent menu link: one URL that's always right, ready to paste into your profile.

## 3. Reviews: earn them systematically

Reviews decide rankings and conversions. The system that works:

- Ask at the happiest moment (after paying a compliment, not after the bill)
- Make it one tap: a QR code or short link straight to the review box
- Reply to everything, especially negatives — replies are public proof you care

Ten honest reviews beat a hundred bought ones, every time.

## 4. Post like a place that exists

Photos of today's special, the seasonal setup, the new corner seat. Fresh content signals an alive business — to customers and to Google alike.

## 5. Connect the loop

Search → profile → menu link → order. Every broken step loses people. RESTORA closes the loop: your Google profile points to your RESTORA menu, where the same visitor can order without switching apps.

Hungry customers are already searching. Set up your system so they find you.`,
    },
    ar: {
      title: "«أكل قريب مني»: إزاي تظهر لما الناس تجوع وتدور",
      excerpt:
        "قبل ما العميل يمشي أو يطلب، بيدوّر. تشيك ليست عملية علشان تظهر في خرائط وبحث جوجل — من غير وكالة تسويق.",
      content: `أغلى أصل تسويقي عند مطعمك مش الإنستجرام — هو اللحظة اللي حد قريب بيدور على «أكل قريب مني» وجوجل بيقرر مين يظهر.

القرار ده غالبًا بيتأثر بحاجات انت مسيطر عليها. دي التشيك ليست.

## ١. احجز وكمّل ملفك على جوجل للأعمال

ده مجاني ومش قابل للتفاوض:

- تصنيف دقيق («مطعم مصري»، مش «مطعم» وخلاص)
- المواعيد كاملة — بما فيها الإجازات
- لينك المنيو بتاعك (ده مهم — شوف تحت)
- صور حقيقية للأكل والمكان من جوة وبره، بتتجدد شهريًا

الملفات الناقصة بتترتب تحت المكتملة ببساطة. الخطوة دي لوحدها بتقدّمك عن كتير من المنافسين.

## ٢. لينك المنيو لازم يفتح فورًا

جوجل بيعرض زرار «منيو» في ملفك. واللينك اللي بيوصله بيحدد إن كان الباحث المتحمس هيبقى عميل. لازم:

- يفتح بسرعة على الموبايل
- يعرض الأسعار من غير تحميل أو تسجيل
- يكون محدّث — منيو غلط بيبيع أسوأ من عدمه

وده بالظبط سبب إن RESTORA بيدي كل مشروع لينك منيو دائم: عنوان واحد دايمًا صح، جاهز تلزقه في ملفك.

## ٣. التقييمات: اجمعها بنظام

التقييمات بتحدد الترتيب والتحويل. النظام الشغال:

- اطلبها في أسعد لحظة (بعد مجاملة للأكل، مش بعد الحساب)
- خليها ضغطة واحدة: QR أو لينك قصير على صندوق التقييم مباشرة
- رُد على الكل، خصوصًا السلبي — الردود إثبات عام إنك مهتم

عشر تقييمات صادقة بتتغلب على مية مشترية، دايمًا.

## ٤. انشر كأنك موجود فعلًا

صور طبق النهاردة، ترتيب الموسم، الكرسي الجديد. المحتوى الجديد بيقول لمكان عايش — للعملاء ولجوجل بنفس الوقت.

## ٥. اقفل الحلقة

بحث ← ملف ← لينك المنيو ← طلب. كل خطوة مكسورة بتفقدك ناس. RESTORA بقفل الحلقة: ملف جوجل بيوصل لمنيو RESTORA، والزائر نفسه يقدر يطلب من غير ما يبدّل تطبيق.

العملاء الجعانة بتدوّر أصلًا. جهّز نظامك عشان يلاقوك انت.`,
    },
  },
  {
    slug: "start-home-food-business-right-way",
    authorName: "RESTORA Team",
    category: "home-food-business",
    tags: ["home food business", "getting started", "pricing"],
    publishedDaysAgo: 23,
    seoTitle: "Starting a Home Food Business: The Practical Guide | RESTORA",
    seoDescription:
      "Cooking from home and thinking of selling? Costs, menus, taking organized orders and growing past WhatsApp — a practical guide for home food businesses.",
    en: {
      title: "From Home Kitchen to Real Orders: Starting the Right Way",
      excerpt:
        'Your food already sells itself in the family group chat. Here\'s what changes — practically — when you decide to treat cooking as a business.',
      content: `Almost every home food business starts the same way: one message in the family group — "who wants food this week?" — and suddenly you're cooking for forty people.

Turning that into a stable business is less about cooking and more about systems. Here's what actually matters.

## 1. Decide what you sell — and what you refuse

The fastest way to burn out is a menu of everything. Choose:

- 5–10 dishes you can produce consistently well
- Fixed days/cities for delivery (chaos kills margins)
- What you will NOT do: daily custom requests, tiny quantities, far areas

Saying no early is what makes saying yes profitable.

## 2. Price with your time included

Write down ingredient cost per dish. Then add packaging, delivery and — the part everyone skips — your hours. If a dish takes an hour of prep and sells for barely twice its ingredients' cost, it's a hobby, not a product.

## 3. Replace chat chaos with one menu link

The WhatsApp era of home kitchens hits a ceiling fast: messages buried, orders forgotten, prices negotiated per customer. A shared menu link changes the game:

- Customers see dishes and fixed prices themselves
- Orders arrive written down, with names and details
- Nobody asks "what do you have?" anymore — the link answers

This single change is usually the line between "helping friends" and running a business.

## 4. Collect feedback like data, not compliments

Track three numbers weekly: repeat customers, best-selling dish, worst-selling dish. Adjust the menu monthly. Compliments feel good; reorder rates pay rent.

## 5. Grow only when the system holds

New areas, new dishes, catering events — each adds load. Add them when the current menu, pricing and ordering flow run without drama, not because someone asked once.

## Where RESTORA fits

RESTORA started simple for exactly this stage: a professional menu link you can put in your bio, organized orders instead of chat archaeology, and a dashboard that shows what's really selling — at starter pricing built for businesses without a storefront.

When you're ready to look official, you already will be.`,
    },
    ar: {
      title: "من مطبخ البيت لطلبات حقيقية: البداية الصح",
      excerpt:
        "أكلك بيبيع نفسه في جروب العيلة. دي الحاجات اللي بتتغير — عمليًا — لما تقرر تتعامل مع الطبخ كمشروع.",
      content: `تقريبًا كل مشروع أكل من البيت بيبدأ بنفس الطريقة: رسالة واحدة في جروب العيلة — «محد عايز أكل الأسبوع ده؟» — وفجأة انت بتطبخ لأربعين شخص.

تحويل ده لمشروع ثابت مش موضوع طبخ بقدر ما هو موضوع أنظمة. دي الحاجات اللي بتحقق فرق فعلًا.

## ١. حدد بتبيع إيه — وبترفض إيه

أسرع طريق للإنهاك منيو بكل حاجة. اختار:

- ٥–١٠ أطباق تقدر تنتجهم بنفس الجودة باستمرار
- أيام ومناطق توصيل ثابتة (العشوائية بتحرق الهامش)
- إيه اللي مش هتعمله: طلبات مخصصة يومية، كميات صغيرة، مناطق بعيدة

قول «لأ» بدري هو اللي بيخلي «نعم» مربحة.

## ٢. احسب السعر ووقتك جواه

اكتب تكلفة مكونات كل طبق. وبعدين ضيف التغليف والتوصيل — والجزء اللي كل حد بيتجاوزه: ساعتك. لو طبق بياخد ساعة تحضير وبيتباع بأقل من ضعف تكلفته، فهواية مش منتج.

## ٣. بدّل فوضى الشات بلينك منيو واحد

مرحلة الواتساب في مطابخ البيت بتطق سقفها بسرعة: رسائل مدفونة، طلبات منسية، وأسعار بتتفاضل لكل عميل. لينك منيو تتشاركه بيغيّر القواعد:

- العملاء يشوفوا الأطباق والأسعار الثابتة بنفسهم
- الطلبات توصل مكتوبة بالأسماء والتفاصيل
- محدش يسأل تاني «عندك إيه؟» — اللينك بيجاوب

التغيير الواحد ده هو غالبًا الخط الفاصل بين «مساعدة الأصحاب» وإدارة مشروع.

## ٤. خد الفيدباك كأرقام مش كمجاميل

تابع تلات أرقام أسبوعيًا: عدد العملاء المتكررين، أكثر طبق مبيعًا، أقل طبق مبيعًا. عدّل المنيو شهريًا. المجامل بتفرح؛ معدل إعادة الطلب هو اللي بيدفع الإيجار.

## ٥. كبّر بس لما النظام يثبت

مناطق جديدة، أطباق جديدة، مناسبات — كل واحدة بتضيف حمل. ضيفهم لما المنيو والتسعير وتدفق الطلبات الحالي ماشيين بدون دراما، مش لأن حد طلب مرة.

## RESTORA داخل فين في الحكاية؟

RESTORA بدأ بسيط للمرحلة دي بالذات: لينك منيو احترافي تحطه في البايو، وطلبات منظمة بدل حفريات الشات، ولوحة بتوريك اللي بيتباع فعلًا — وبأسعار باقة البداية المخصصة للمشاريع من غير محل.

لما تيجي وقت تبقى رسمي، هتكون كده أصلًا.`,
    },
  },
  {
    slug: "choosing-restaurant-management-software",
    authorName: "RESTORA Team",
    category: "management",
    tags: ["management software", "comparison", "buying guide"],
    publishedDaysAgo: 30,
    seoTitle: "How to Choose Restaurant Management Software (Honest Checklist) | RESTORA",
    seoDescription:
      "Features, pricing models, hidden costs and the questions to ask any vendor before committing — an honest buying guide for restaurant owners.",
    en: {
      title: "Choosing Restaurant Management Software Without Regret",
      excerpt:
        "Every vendor claims to be complete. Here's the honest checklist that separates real systems from demos — written so it helps even if you don't pick us.",
      content: `Buying software for a restaurant feels like buying a promise: shiny demo today, unknown Tuesday night next month. This checklist exists so you can judge any system — including ours — on what matters.

## 1. Map your actual pain, not feature lists

Write down the three most expensive problems of your last month. Missed orders? Stock surprises? Slow reporting? Software earns its price only where it removes a cost you already pay. Features that don't map to a pain are decoration.

## 2. Ask who updates the menu

The hidden failure of restaurant software is maintenance: if every price change needs a support ticket, the system quietly dies. The test: hand the phone to whoever would own the menu daily. Can they change a price in under a minute?

## 3. Understand the total bill

Compare systems on the whole number, not the headline:

- Monthly fee × 12, plus setup costs
- Per-order commissions, if any — this is often the real price
- Extra charges per branch, user or language
- Hardware requirements you didn't budget for

A slightly higher flat fee often beats a "cheap" plan with commission on every plate.

## 4. Check what happens during rush hour

Ask for a live trial during service, not a conference-room demo. Does the order flow survive fifty simultaneous tickets? Can staff learn it in one shift? Systems are proven on busy nights, not in presentations.

## 5. Own your data and your customers

Whoever holds your order history holds leverage over your future. Confirm you can export your data, keep customer contacts, and leave without punishment.

## 6. Match the tool to your size

A solo cloud kitchen and a four-branch restaurant group shouldn't buy the same thing. Look for a ladder: start with what solves today's pains, upgrade only when growth demands it.

## Applying this to RESTORA

We built RESTORA around this exact list: menu edits take seconds from a phone, pricing is flat and published openly (see our plans), your data is exportable, and the ladder starts small — presence, menu and ordering — then grows into reservations, employees and multi-branch analytics when you do.

Whatever you choose, choose with the checklist. Your Tuesday nights will thank you.`,
    },
    ar: {
      title: "تختار برنامج إدارة مطاعم من غير ندمان",
      excerpt:
        "كل شركة بتقول إن نظامها كامل. دي التشيك ليست الصريحة اللي تفصل الأنظمة الحقيقية عن العروض التسويقية — ومكتوبة علشان تفيدك حتى لو ما اخترتنايش.",
      content: `شراء برنامج لمطعم بيشبه شراء وعد: عرض لامع النهاردة، وليلة ثلاثاء مجهولة الشهر الجاي. التشيك ليست دي موجودة علشان تحكم على أي نظام — بما فيهم نظامنا — على اللي يهم فعلًا.

## ١. حدد وجعك الحقيقي مش قايمة المميزات

اكتب أغلى تلات مشاكل في الشهر اللي فات. طلبات ضايعة؟ مفاجآت مخزون؟ تقارير بطيئة؟ البرنامج بيستحق سعره بس في المكان اللي بيوقف تكلفة انت دافعها أصلًا. المميزات اللي ملهاش وجع مرتبط بيها ديكور.

## ٢. اسأل: مين هيحدّث المنيو؟

الفشل الخفي لبرامج المطاعم هو الصيانة: لو كل تغيير سعر محتاج تذكرة دعم، النظام بيموت بهدوء. الاختبار: سلّم التليفون للشخص اللي هيكون صاحب المنيو يوميًا. يقدر يغيّر سعر في أقل من دقيقة؟

## ٣. افهم الفاتورة الكاملة

قارن الأنظمة على الرقم الكامل مش العنوان:

- الرسم الشهري × ١٢ + تكاليف التركيب
- عمولة على كل طلب لو موجودة — دي غالبًا السعر الحقيقي
- مصاريف إضافية لكل فرع أو مستخدم أو لغة
- أجهزة مطلوبة مش مخطط لها

رسوم ثابتة أعلى شوية غالبًا بتتغلب على باقة «رخيصة» بعمولة على كل طبق.

## ٤. جرّبه وقت الزحمة

اطلب تجربة حية أثناء الخدمة مش عرض في قاعة اجتماعات. هل تدفق الطلبات يعيش مع خمسين تذكرة في نفس اللحظة؟ هل الفريق يتعلمه في شيفت واحد؟ الأنظمة بتتختبر في الليالي الزحمة مش في البريزنتيشن.

## ٥. امتلك بياناتك وعملاؤك

اللي ماسك سجل طلباتك ماسك ورقة ضغط على مستقبلك. اتأكد إنك تقدر تصدّر بياناتك، وتحتفظ بجهات اتصال عملائك، وتخرج من غير عقوبات.

## ٦. طابق الأداة مع حجمك

مطبخ سحابي لشخص واحد ومجموعة أربع فروع مش المفروض يشتروا نفس الشيء. دوّر على سلم: ابدأ باللي بيحل وجع النهاردة، وكبّر بس لما النمو يطلب.

## تطبيق ده على RESTORA

بنينا RESTORA على نفس القايمة دي: تعديل المنيو بياخد ثواني من التليفون، والتسعير ثابت ومنشور بشفافية (شوف الباقات)، وبياناتك قابلة للتصدير، والسلم بيبدأ صغير — حضور ومنيو وطلبات — وبينمو للحجز والموظفين وتحليلات الفروع لما انت تكبر.

أيًا كان اللي هتختاره، اختار بالتشيك ليست. ليالي الثلاثاء هتشكرك.`,
    },
  },
];
