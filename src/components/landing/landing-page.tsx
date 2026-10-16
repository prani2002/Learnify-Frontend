"use client";

import { Categories } from "./categories";
import { FeaturedCourses } from "./featured-courses";
import { Footer } from "./footer";
import { Hero } from "./hero";
import { Navbar } from "./navbar";
import { News } from "./news";
import { Newsletter } from "./newsletter";
import { BackToTop, ScrollProgress } from "./scroll-effects";
import { StatsRow } from "./stats-row";
import { Testimonials } from "./testimonials";
import { Trainers } from "./trainers";
import { WhyChooseUs } from "./why-choose-us";

export function LandingPage() {
  return (
    <div className="min-h-screen bg-canvas">
      <ScrollProgress />
      <Navbar />
      <main>
        <Hero />
        <StatsRow />
        <FeaturedCourses />
        <Categories />
        <WhyChooseUs />
        <News />
        <Trainers />
        <Testimonials />
        <Newsletter />
      </main>
      <Footer />
      <BackToTop />
    </div>
  );
}
