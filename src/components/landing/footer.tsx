"use client";

import { motion } from "framer-motion";
import { GraduationCap, Mail, MapPin, Phone } from "lucide-react";
import { CONTACT_INFO, FOOTER_COLUMNS } from "@/data/content";
import { fadeUp, stagger } from "@/lib/motion";
import { SocialIcon, type SocialName } from "./social-icons";
import { sectionViewport } from "./section-heading";

const SOCIALS: { name: SocialName; label: string }[] = [
  { name: "facebook", label: "Facebook" },
  { name: "twitter", label: "X" },
  { name: "linkedin", label: "LinkedIn" },
  { name: "youtube", label: "YouTube" },
];

export function Footer() {
  return (
    <footer id="contact" className="bg-slate-950 text-slate-300">
      <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={sectionViewport} className="mx-auto grid max-w-page gap-12 px-4 py-16 sm:px-8 md:grid-cols-2 lg:grid-cols-4">
        <motion.div variants={fadeUp} className="flex flex-col gap-4">
          <span className="inline-flex items-center gap-2 text-lg font-semibold text-white">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-warm text-onwarm">
              <GraduationCap size={18} aria-hidden />
            </span>
            Learnify
          </span>
          <p className="text-sm text-slate-400">Empowering learners worldwide with quality education and career opportunities.</p>
          <div className="flex gap-2">
            {SOCIALS.map((social) => (
              <a key={social.name} href="#home" aria-label={social.label} className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-800 text-slate-300 transition-colors hover:bg-slate-800 hover:text-white">
                <SocialIcon name={social.name} />
              </a>
            ))}
          </div>
        </motion.div>

        {FOOTER_COLUMNS.map((column) => (
          <motion.nav key={column.title} variants={fadeUp} aria-label={column.title} className="flex flex-col gap-4">
            <h3 className="font-semibold text-white">{column.title}</h3>
            <ul className="flex flex-col gap-3 text-sm">
              {column.links.map((link) => (
                <li key={link}>
                  <a href="/login" className="text-slate-400 transition-colors hover:text-white">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </motion.nav>
        ))}

        <motion.div variants={fadeUp} className="flex flex-col gap-4">
          <h3 className="font-semibold text-white">Contact info</h3>
          <ul className="flex flex-col gap-3 text-sm text-slate-400">
            <li className="flex gap-3"><MapPin size={16} className="mt-0.5 shrink-0 text-warm" aria-hidden /> {CONTACT_INFO.address}</li>
            <li className="flex gap-3"><Phone size={16} className="shrink-0 text-warm" aria-hidden /> {CONTACT_INFO.phone}</li>
            <li className="flex gap-3"><Mail size={16} className="shrink-0 text-warm" aria-hidden /> {CONTACT_INFO.email}</li>
          </ul>
        </motion.div>
      </motion.div>
      <div className="border-t border-slate-800">
        <div className="mx-auto flex max-w-page flex-col items-start justify-between gap-4 px-4 py-6 text-sm text-slate-500 sm:px-8 md:flex-row md:items-center">
          <p>© 2026 Learnify. Demo application with sample data.</p>
          <div className="flex gap-6">
            <a href="/login" className="hover:text-white">Terms</a>
            <a href="/login" className="hover:text-white">Privacy</a>
            <a href="/login" className="hover:text-white">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
