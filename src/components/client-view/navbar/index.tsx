"use client";

import { useEffect, useState, type MouseEvent } from "react";
import { Link as LinkScroll, scroller } from "react-scroll";
import { FaPaperPlane } from "react-icons/fa";
import { scrollDuration } from "@/lib/motion";

interface MenuItem {
  id: string;
  label: string;
}

const menuItems: MenuItem[] = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "experience", label: "Experience" },
  { id: "projects", label: "Projects" },
  { id: "contact", label: "Contact" },
];

interface CreateMenusProps {
  activeLink: string;
  getMenuItems: MenuItem[];
  setActiveLink: (id: string) => void;
  compact?: boolean;
}

function CreateMenus({ activeLink, getMenuItems, setActiveLink, compact }: CreateMenusProps) {
  return getMenuItems.map((item) => (
    <li key={item.id}>
      <LinkScroll
        activeClass="active"
        to={item.id}
        href={`#${item.id}`}
        spy={true}
        smooth={true}
        offset={-80}
        duration={scrollDuration(1000)}
        onSetActive={() => setActiveLink(item.id)}
        className={`${
          compact
            ? "flex w-full min-h-[44px] items-center justify-center px-1 text-xs"
            : "inline-block px-4 py-2 text-[15px]"
        } relative font-medium cursor-pointer transition-colors after:absolute after:left-2 after:right-2 after:-bottom-0.5 after:h-[2px] after:rounded-full after:transition-transform ${
          activeLink === item.id
            ? "text-green-main after:bg-green-main after:scale-x-100"
            : "text-[#111827] hover:text-green-main after:bg-green-main after:scale-x-0"
        }`}
      >
        {item.label}
      </LinkScroll>
    </li>
  ));
}

export default function Navbar() {
  const [activeLink, setActiveLink] = useState<string>("home");
  const [scrollActive, setScrollActive] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrollActive(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function scrollToContact(e: MouseEvent<HTMLAnchorElement>) {
    e.preventDefault();
    scroller.scrollTo("contact", {
      duration: scrollDuration(1500),
      delay: 100,
      smooth: true,
      offset: -80,
    });
  }

  return (
    <>
      <header
        className={`sticky top-0 w-full z-30 transition-all ${
          scrollActive
            ? "bg-white-500/90 backdrop-blur shadow-md"
            : "bg-transparent"
        }`}
      >
        <nav className="max-w-screen-xl px-6 sm:px-8 lg:px-16 mx-auto flex items-center justify-between gap-3 py-4">
          <a
            href="#home"
            onClick={(e) => {
              e.preventDefault();
              scroller.scrollTo("home", { duration: scrollDuration(1000), smooth: true, offset: -80 });
            }}
            className="flex min-h-11 gap-1.5 font-extrabold items-center text-[18px] sm:text-[22px] text-[#111827] shrink-0"
            aria-label="Talat Mahmud - go to top"
          >
            <span className="h-[34px] sm:h-[40px] flex justify-center items-center px-2 sm:px-2.5 rounded-lg bg-green-main text-white-500 text-[18px] sm:text-[22px] font-extrabold shadow-[0_6px_14px_-6px_rgba(15,122,61,0.7)]">
              Talat
            </span>
            Mahmud
          </a>
          <ul className="hidden lg:flex items-center gap-6">
            <CreateMenus
              setActiveLink={setActiveLink}
              activeLink={activeLink}
              getMenuItems={menuItems}
            />
          </ul>
          <a
            href="#contact"
            onClick={scrollToContact}
            className="btn-primary px-4 sm:px-6 text-sm sm:text-[15px] shrink-0"
          >
            <FaPaperPlane aria-hidden="true" />
            Contact Me
          </a>
        </nav>
      </header>
      <nav
        aria-label="Mobile navigation"
        className="fixed lg:hidden bottom-0 left-0 right-0 z-30 px-2 sm:px-8 pb-[env(safe-area-inset-bottom)] bg-white-500 shadow-t"
      >
        <ul className="grid grid-cols-5 w-full items-center py-1">
          <CreateMenus
            setActiveLink={setActiveLink}
            activeLink={activeLink}
            getMenuItems={menuItems}
            compact
          />
        </ul>
      </nav>
    </>
  );
}
