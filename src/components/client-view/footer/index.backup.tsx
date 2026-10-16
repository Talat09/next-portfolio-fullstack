"use client";
import { motion } from "framer-motion";
import { scroller } from "react-scroll";
import type { IconType } from "react-icons";
import {
  FaFacebookF,
  FaLinkedinIn,
  FaInstagram,
  FaGithub,
} from "react-icons/fa";

const socialIcons: { id: string; label: string; Icon: IconType; socialLink: string }[] = [
  {
    id: "facebook",
    label: "Facebook",
    Icon: FaFacebookF,
    socialLink: "https://www.facebook.com/profile.php?id=100010332459337",
  },
  {
    id: "github",
    label: "GitHub",
    Icon: FaGithub,
    socialLink: "https://github.com/Talat09",
  },
  {
    id: "linkedin",
    label: "LinkedIn",
    Icon: FaLinkedinIn,
    socialLink: "https://www.linkedin.com/in/talat09/",
  },
  {
    id: "instagram",
    label: "Instagram",
    Icon: FaInstagram,
    socialLink:
      "https://www.instagram.com/dihan.talat/?igshid=NzZlODBkYWE4Ng%3D%3D&fbclid=IwAR0xCmMoc7WR7ZDVZkcKRAf_3gIYMTZYaZEIUG9DU8z_wZz8cIZ69-nktTs",
  },
];

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
    <footer className="bg-[#0b3d26] text-white-500 mt-16 pb-16 lg:pb-0">
      <div className="max-w-screen-xl mx-auto px-6 sm:px-8 lg:px-16 py-10 grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
        <div>
          <p className="flex gap-2 font-bold items-center text-[20px]">
            <span className="h-[40px] flex items-center px-3 rounded-[8px] bg-green-main">
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
                  rel="noopener noreferrer"
                  aria-label={label}
                  whileHover={{ scale: 1.15 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-9 h-9 flex items-center justify-center rounded-lg bg-white-500/10 hover:bg-green-main transition-colors"
                >
                  <Icon className="w-4 h-4" aria-hidden="true" />
                </motion.a>
              </li>
            ))}
          </ul>
          <p className="text-sm text-gray-400 text-center">
            Copyright &copy; {year} - All right reserved by{" "}
            <span className="text-green-main">Talat Mahmud</span>
          </p>
        </div>
        <nav aria-label="Footer navigation" className="md:justify-self-end">
          <ul className="flex flex-wrap gap-4 text-sm">
            {footerLinks.map((link) => (
              <li key={link.id}>
                <a
                  href={`#${link.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    scroller.scrollTo(link.id, {
                      duration: 1000,
                      smooth: true,
                      offset: -80,
                    });
                  }}
                  className="underline underline-offset-4 hover:text-green-main"
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
