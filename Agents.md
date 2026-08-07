# مشروع Laguna Dubai — سياق المشروع

## الوصف
موقع لتقييم كافيه اسمه "Laguna Dubai". الزوار يقدروا يشوفوا معلومات الكافيه ويضيفوا تقييمات (نجوم + تعليق).

## الـ Stack
- Next.js 14+ (App Router) + TypeScript
- Tailwind CSS
- Prisma ORM
- PostgreSQL (Supabase)
- Deployment: Vercel

## قواعد عامة للكود
- كل كود API لازم يعمل validation على المدخلات (استخدم zod)
- ممنوع أي secrets أو connection strings تتكتب في الكود — كلها في environment variables
- استخدم Server Components لما يكون ممكن، وClient Components بس لما يبقى فيه تفاعل (فورم، أزرار)
- الكود لازم يبقى بسيط ومقروء، من غير over-engineering
- كل جدول في الداتابيز يتعرف في schema.prisma قبل ما يتكتب أي كود بيستخدمه