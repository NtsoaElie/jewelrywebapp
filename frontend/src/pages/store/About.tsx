import { Gem, Recycle, Hand } from "lucide-react";
import { products } from "../../data/products";

const VALUES = [
  { icon: Gem, title: "Considered Design", description: "Every piece begins as a sketch, refined over months before it ever reaches production." },
  { icon: Hand, title: "Skilled Craftsmanship", description: "Cast, set, and polished by hand by artisans who have practiced their trade for decades." },
  { icon: Recycle, title: "Responsible Materials", description: "Recycled precious metals and traceable, conflict-free stones in every collection." },
];

const storyImage = products[2]?.images[0];

export function About() {
  return (
    <div>
      <section className="bg-primary-dark">
        <div className="container py-16 text-center sm:py-24">
          <p className="text-label font-semibold uppercase tracking-widest text-accent">Our Story</p>
          <h1 className="mx-auto mt-3 max-w-2xl font-display text-display font-semibold text-primary-foreground">
            Jewelry designed to be lived in
          </h1>
        </div>
      </section>

      <section className="container grid gap-10 py-14 sm:py-20 lg:grid-cols-2 lg:items-center lg:gap-16">
        <div className="aspect-[4/5] overflow-hidden rounded-lg">
          <img src={storyImage} alt="" className="h-full w-full object-cover" />
        </div>
        <div>
          <h2 className="font-display text-h1 font-semibold text-foreground">Founded on a simple idea</h2>
          <p className="mt-4 max-w-prose text-body text-muted-foreground">
            Aurelle was founded on the belief that fine jewelry shouldn't sit in a box waiting for a special
            occasion. We design pieces meant to be worn daily — light enough for everyday comfort, and
            substantial enough to last a lifetime.
          </p>
          <p className="mt-4 max-w-prose text-body text-muted-foreground">
            Every design is developed in-house and produced in small batches, so you're getting a piece made
            with intention rather than mass-manufactured at scale.
          </p>
        </div>
      </section>

      <section className="bg-surface py-14 sm:py-20">
        <div className="container">
          <h2 className="text-center font-display text-h1 font-semibold text-foreground">What We Stand For</h2>
          <div className="mt-10 grid gap-8 sm:grid-cols-3">
            {VALUES.map((value) => (
              <div key={value.title} className="flex flex-col items-center text-center">
                <value.icon className="h-8 w-8 text-primary" aria-hidden="true" />
                <h3 className="mt-3 text-h3 font-display font-semibold text-foreground">{value.title}</h3>
                <p className="mt-1 max-w-xs text-small text-muted-foreground">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
