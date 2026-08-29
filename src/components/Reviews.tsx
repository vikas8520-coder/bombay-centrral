import { reviews, reviewStats } from "@/data/reviews";

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} className={i < rating ? "text-[#f0c000]" : "text-[#1f1c18]"}>
          ★
        </span>
      ))}
    </div>
  );
}

export default function Reviews() {
  return (
    <section id="reviews" className="relative bg-[#0a0908]/95 py-24">
      <div className="mx-auto max-w-6xl px-6">
        {/* Header */}
        <div className="mb-16 text-center">
          <p className="mb-2 text-sm font-bold uppercase tracking-widest text-[#f0c000]">
            Reviews
          </p>
          <h2 className="text-4xl font-bold md:text-5xl">
            What our <span className="text-gradient-brand">customers</span> say
          </h2>

          {/* Rating summary */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-6">
            <div className="flex items-center gap-3 rounded-2xl border border-[#1f1c18] bg-[#1f1c18]/40 px-6 py-4">
              <div className="text-4xl font-bold text-[#f0c000]">{reviewStats.googleRating}</div>
              <div className="text-left">
                <Stars rating={5} />
                <p className="mt-1 text-xs text-[#f5f0e8]/50">Google · {reviewStats.googleVotes} reviews</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-2xl border border-[#1f1c18] bg-[#1f1c18]/40 px-6 py-4">
              <div className="text-4xl font-bold text-[#f0c000]">{reviewStats.zomatoRating}</div>
              <div className="text-left">
                <Stars rating={4} />
                <p className="mt-1 text-xs text-[#f5f0e8]/50">Zomato · {reviewStats.zomatoVotes} reviews</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-2xl border border-[#1f1c18] bg-[#1f1c18]/40 px-6 py-4">
              <div className="text-4xl font-bold text-[#f0c000]">{reviewStats.totalReviews}+</div>
              <div className="text-left">
                <p className="text-sm font-bold text-[#f5f0e8]">Total Votes</p>
                <p className="mt-1 text-xs text-[#f5f0e8]/50">Across all platforms</p>
              </div>
            </div>
          </div>
        </div>

        {/* Review cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {reviews.map((review, i) => (
            <div
              key={i}
              className="tilt-card group relative overflow-hidden rounded-2xl border border-[#1f1c18] bg-[#1f1c18]/90 p-6"
            >
              {/* Quote mark */}
              <div className="absolute top-4 right-4 text-5xl text-[#f0c000]/10 font-serif">
                &ldquo;
              </div>

              {/* Stars */}
              <Stars rating={review.rating} />

              {/* Review text */}
              <p className="mt-4 text-sm leading-relaxed text-[#f5f0e8]/80">
                {review.text}
              </p>

              {/* Sub-ratings */}
              <div className="mt-4 flex gap-4 text-xs text-[#f5f0e8]/50">
                <span>Food: <span className="text-[#f0c000]">{review.food}</span></span>
                <span>Service: <span className="text-[#f0c000]">{review.service}</span></span>
                <span>Atmosphere: <span className="text-[#f0c000]">{review.atmosphere}</span></span>
              </div>

              {/* Reviewer */}
              <div className="mt-4 flex items-center gap-3 border-t border-[#1f1c18] pt-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f0c000]/15 text-sm font-bold text-[#f0c000]">
                  {review.name.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-bold text-[#f5f0e8]">{review.name}</p>
                  <p className="text-xs text-[#f5f0e8]/40">
                    {review.time} · {review.platform} · {review.source}
                  </p>
                </div>
              </div>

              {/* Hover glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#f0c000]/0 to-[#f0c000]/0 opacity-0 transition-opacity duration-300 group-hover:from-[#f0c000]/10 group-hover:to-transparent group-hover:opacity-100 pointer-events-none" />
            </div>
          ))}
        </div>

        {/* Write a review CTA */}
        <div className="mt-12 text-center">
          <p className="mb-4 text-[#f5f0e8]/50">Visited us? Share your experience!</p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="https://www.google.com/search?q=Bombay+Centrral+Begumpet+Hyderabad+reviews"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-[#1f1c18] bg-[#1f1c18]/40 px-6 py-3 text-sm font-bold text-[#f5f0e8] transition-all hover:border-[#f0c000] hover:bg-[#f0c000]/10 hover:text-[#f0c000]"
            >
              <span>⭐</span> Review on Google
            </a>
            <a
              href="https://www.zomato.com/hyderabad/bombay-centrral-marredpally-secunderabad"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-[#1f1c18] bg-[#1f1c18]/40 px-6 py-3 text-sm font-bold text-[#f5f0e8] transition-all hover:border-[#f0c000] hover:bg-[#f0c000]/10 hover:text-[#f0c000]"
            >
              <span>🍽️</span> Review on Zomato
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
