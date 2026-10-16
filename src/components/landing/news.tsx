"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, CalendarDays, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NEWS_POSTS } from "@/data/content";
import { cardHover, fadeUp, stagger } from "@/lib/motion";
import { SectionHeading, sectionViewport } from "./section-heading";

export function News() {
  return (
    <section id="news" className="border-y border-line bg-subtle">
      <div className="mx-auto max-w-page px-4 py-24 sm:px-8">
        <SectionHeading
          align="left"
          title="Latest news and"
          accent="insights"
          description="Stay updated with the latest trends, tips, and insights from the education world."
          action={
            <Button href="/login" variant="secondary">
              View all articles
            </Button>
          }
        />
        <motion.ul variants={stagger} initial="hidden" whileInView="visible" viewport={sectionViewport} className="mt-12 grid gap-6 md:grid-cols-3">
          {NEWS_POSTS.map((post) => (
            <motion.li key={post.id} variants={fadeUp} whileHover={cardHover}>
              <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-surface">
                <div className="relative aspect-[16/10] bg-subtle">
                  <Image src={post.image} alt="" fill sizes="(min-width: 768px) 380px, 100vw" className="object-cover" unoptimized />
                  <span className="absolute left-3 top-3 rounded-md bg-warm px-2 py-1 text-xs font-medium text-onwarm">{post.category}</span>
                </div>
                <div className="flex flex-1 flex-col gap-3 p-6">
                  <div className="flex items-center justify-between text-xs text-muted">
                    <span className="inline-flex items-center gap-1"><CalendarDays size={14} aria-hidden /> {post.date}</span>
                    <span className="inline-flex items-center gap-1"><Clock size={14} aria-hidden /> {post.readTime}</span>
                  </div>
                  <h3 className="text-lg font-semibold text-ink">{post.title}</h3>
                  <p className="text-sm text-muted">{post.excerpt}</p>
                  <div className="mt-auto flex items-center justify-between pt-3 text-sm">
                    <span className="text-muted">{post.author}</span>
                    <span className="inline-flex items-center gap-1 font-medium text-accent">
                      Read more <ArrowRight size={14} aria-hidden />
                    </span>
                  </div>
                </div>
              </article>
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
}
