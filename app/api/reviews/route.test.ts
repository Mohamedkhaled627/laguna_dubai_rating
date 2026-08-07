import { describe, expect, it, beforeEach, vi } from "vitest";
import { POST, GET } from "@/app/api/reviews/route";

const { mockedPrisma } = vi.hoisted(() => ({
  mockedPrisma: {
    cafe: { findFirst: vi.fn() },
    review: { findMany: vi.fn(), create: vi.fn() },
  },
}));

vi.mock("@/lib/prisma", () => ({ prisma: mockedPrisma }));

describe("reviews API", () => {
  beforeEach(() => {
    mockedPrisma.cafe.findFirst.mockReset();
    mockedPrisma.review.create.mockReset();
    mockedPrisma.review.findMany.mockReset();
  });

  it("rejects a missing reviewerName", async () => {
    const res = await POST(
      new Request("http://localhost/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating: 4, comment: "ok" }),
      }),
    );
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toBe("الاسم مطلوب");
  });

  it("rejects a rating outside 1-5", async () => {
    const res = await POST(
      new Request("http://localhost/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reviewerName: "عمر", rating: 9 }),
      }),
    );
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toBe("التقييم لازم يكون من 1 لـ 5");
  });

  it("rejects invalid JSON", async () => {
    const res = await POST(
      new Request("http://localhost/api/reviews", {
        method: "POST",
        body: "not-json",
      }),
    );
    expect(res.status).toBe(400);
  });

  it("creates a review attached to the first cafe", async () => {
    mockedPrisma.cafe.findFirst.mockResolvedValue({
      id: "c1",
      name: "Laguna Dubai",
    });
    mockedPrisma.review.create.mockResolvedValue({
      id: "r1",
      cafeId: "c1",
      reviewerName: "عمر",
      rating: 5,
      comment: "تحفة",
    });

    const res = await POST(
      new Request("http://localhost/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reviewerName: "عمر",
          rating: 5,
          comment: "تحفة",
        }),
      }),
    );

    expect(res.status).toBe(201);
    expect(mockedPrisma.review.create).toHaveBeenCalledWith({
      data: {
        cafeId: "c1",
        reviewerName: "عمر",
        rating: 5,
        comment: "تحفة",
      },
    });
  });

  it("converts an empty comment to null", async () => {
    mockedPrisma.cafe.findFirst.mockResolvedValue({ id: "c1" });
    mockedPrisma.review.create.mockResolvedValue({});

    await POST(
      new Request("http://localhost/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reviewerName: "عمر", rating: 4, comment: "" }),
      }),
    );

    expect(mockedPrisma.review.create).toHaveBeenCalledWith({
      data: { cafeId: "c1", reviewerName: "عمر", rating: 4, comment: null },
    });
  });

  it("returns 400 when no cafe is registered", async () => {
    mockedPrisma.cafe.findFirst.mockResolvedValue(null);
    const res = await POST(
      new Request("http://localhost/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reviewerName: "عمر", rating: 4 }),
      }),
    );
    expect(res.status).toBe(400);
    expect((await res.json()).error).toBe("مفيش كافيه متسجل لسه");
  });

  it("GET returns all reviews newest first", async () => {
    mockedPrisma.review.findMany.mockResolvedValue([
      { id: "r1", reviewerName: "سارة", rating: 5 },
    ]);
    const res = await GET();
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.reviews).toHaveLength(1);
    expect(mockedPrisma.review.findMany).toHaveBeenCalledWith({
      orderBy: { createdAt: "desc" },
    });
  });
});