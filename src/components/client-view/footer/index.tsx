"use client";
import { motion } from "framer-motion";
import { scroller } from "react-scroll";
import { scrollDuration } from "@/lib/motion";
import type { IconType } from "react-icons";
import { siteConfig, type SocialId } from "@/lib/site-config";
import {
  FaFacebookF,
  FaLinkedinIn,
  FaInstagram,
  FaGithub,
} from "react-icons/fa";

const socialIcons = ([
  {
    id: "facebook",
    label: "Facebook",
    Icon: FaFacebookF,
    socialLink: siteConfig.social.facebook,
  },
  {
    id: "github",
    label: "GitHub",
    Icon: FaGithub,
    socialLink: siteConfig.social.github,
  },
  {
    id: "linkedin",
    label: "LinkedIn",
    Icon: FaLinkedinIn,
    socialLink: siteConfig.social.linkedin,
  },
  {
    id: "instagram",
    label: "Instagram",
    Icon: FaInstagram,
    socialLink: siteConfig.social.instagram,
  },
] as { id: SocialId; label: string; Icon: IconType; socialLink: string }[]).filter((s) => s.socialLink);

const footerLinks = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "experience", label: "Experience" },
  { id: "projects", label: "Projects" },
  { id: "contact", label: "Contact" },
];

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-[#0b3d26] text-white-500 pb-[calc(4.5rem+env(safe-area-inset-bottom))] lg:pb-0">
      <div className="max-w-screen-xl mx-auto px-6 sm:px-8 lg:px-16 py-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-center">
        <div>
          <p className="flex gap-2 font-bold items-center text-[20px]">
            <span className="h-[40px] flex items-center px-3 rounded-lg bg-green-main">
              Talat
            </span>
            Mahmud
          </p>
          <p className="text-sm text-gray-400 mt-3 max-w-xs">
            Building modern web experiences with clean code and great ideas.
          </p>
        </div>
        <div className="flex flex-col items-center gap-4">
          <ul className="flex gap-3">
            {socialIcons.map(({ id, label, Icon, socialLink }) => (
              <li key={id}>
                <motion.a
                  href={socialLink}
                  target="_blank"
                  rel="me noopener noreferrer"
                  aria-label={label}
                  title={`Talat Mahmud on ${label}`}
                  whileHover={{ scale: 1.15 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-11 h-11 flex items-center justify-center rounded-lg bg-white-500/10 hover:bg-green-main transition-colors"
                >
                  <Icon className="w-4 h-4" aria-hidden="true" />
                </motion.a>
              </li>
            ))}
          </ul>
          <p className="text-sm text-gray-400 text-center">
            Copyright &copy; {year} - All right reserved by{" "}
            <span className="text-green-light">Talat Mahmud</span>
          </p>
        </div>
        <nav aria-label="Footer navigation" className="md:col-span-2 lg:col-span-1 justify-self-center lg:justify-self-end">
          <ul className="flex flex-wrap lg:flex-nowrap justify-center gap-x-1 text-sm">
            {footerLinks.map((link) => (
              <li key={link.id}>
                <a
                  href={`#${link.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    scroller.scrollTo(link.id, {
                      duration: scrollDuration(1000),
                      smooth: true,
                      offset: -80,
                    });
                  }}
                  className="inline-flex min-h-11 items-center px-1.5 underline underline-offset-4 hover:text-green-light"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </footer>
  );
}
