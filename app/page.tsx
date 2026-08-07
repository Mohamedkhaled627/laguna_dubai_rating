import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { RatingStars } from "@/components/rating-stars";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const cafe = await prisma.cafe.findFirst({
    include: { reviews: true, _count: { select: { reviews: true } } },
  });

  if (!cafe) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-16 text-center sm:px-6">
        <p className="text-lg text-ink-700">
          مفيش بيانات لسه. استنى لحظة أو أضف كافيه من الداتاباز.
        </p>
      </div>
    );
  }

  const averageRating =
    cafe.reviews.length > 0
      ? cafe.reviews.reduce((sum, r) => sum + r.rating, 0) / cafe.reviews.length
      : null;

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6">
      <section className="grid gap-8 md:grid-cols-2 md:items-center md:py-14">
        <div>
          <p className="mb-3 text-sm font-medium uppercase tracking-widest text-laguna">
            كافيه شاطئي · دبي
          </p>
          <h1 className="font-display text-4xl font-semibold leading-tight text-laguna-deep sm:text-5xl">
            {cafe.name}
          </h1>
          <p className="mt-4 max-w-xl text-lg leading-relaxed text-ink-700">
            {cafe.description ?? "قهوة وشاطئ، بالترتيب صح."}
          </p>
          <p className="mt-6 flex items-center gap-2 text-ink-500">
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
              />
            </svg>
            {cafe.address ?? "في مكاننا البعبع شط دبي"}
          </p>
        </div>

        <div className="relative overflow-hidden rounded-3xl border border-sand-200">
          {cafe.coverImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={cafe.coverImage}
              alt={`غلاف ${cafe.name}`}
              className="aspect-[4/3] w-full object-cover"
            />
          ) : (
            <div className="flex aspect-[4/3] w-full items-center justify-center bg-gradient-to-br from-lagoon to-laguna-deep text-white">
              <span className="font-display text-4xl">Λ</span>
            </div>
          )}
        </div>
      </section>

      <section className="mt-10 grid gap-6 rounded-3xl border border-sand-200 bg-white p-8 md:grid-cols-3">
        <div className="md:col-span-1">
          <p className="text-sm font-medium uppercase tracking-widest text-ink-500">
            متوسط التقييم
          </p>
          <p className="mt-2 font-display text-5xl font-semibold text-laguna-deep">
            {averageRating === null
              ? "—"
              : averageRating.toFixed(1)}
          </p>
          <div className="mt-3">
            <RatingStars rating={averageRating} size="lg" />
          </div>
          <p className="mt-2 text-sm text-ink-500">
            من {cafe._count.reviews} تقييم
          </p>
        </div>

        <div className="md:col-span-2 flex items-center">
          <Link
            href="/reviews"
            className="rounded-full bg-laguna px-6 py-3 text-white transition-colors hover:bg-laguna-deep"
          >
            شارك تقييمك
          </Link>
        </div>
      </section>
    </div>
  );
}