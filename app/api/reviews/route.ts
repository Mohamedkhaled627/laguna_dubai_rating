import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const reviewSchema = z.object({
  reviewerName: z
    .string({ error: "الاسم مطلوب" })
    .trim()
    .min(1, "الاسم مطلوب")
    .max(60, "الاسم طويل أوي"),
  rating: z.coerce
    .number({ error: "التقييم لازم يكون رقم" })
    .int("التقييم لازم يكون رقم صحيح")
    .min(1, "التقييم لازم يكون من 1 لـ 5")
    .max(5, "التقييم لازم يكون من 1 لـ 5"),
  comment: z
    .string({ error: "التعليق لازم يكون نص" })
    .trim()
    .max(500, "التعليق طويل أوي")
    .optional()
    .or(z.literal("")),
});

export async function GET() {
  const reviews = await prisma.review.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ reviews });
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "بيانات مش صالحة" }, { status: 400 });
  }

  const parsed = reviewSchema.safeParse(body);
  if (!parsed.success) {
    const message = parsed.error.issues[0]?.message ?? "بيانات مش صالحة";
    return NextResponse.json({ error: message }, { status: 400 });
  }

  const cafe = await prisma.cafe.findFirst();
  if (!cafe) {
    return NextResponse.json(
      { error: "مفيش كافيه متسجل لسه" },
      { status: 400 },
    );
  }

  const review = await prisma.review.create({
    data: {
      cafeId: cafe.id,
      reviewerName: parsed.data.reviewerName,
      rating: parsed.data.rating,
      comment: parsed.data.comment || null,
    },
  });

  return NextResponse.json({ review }, { status: 201 });
}