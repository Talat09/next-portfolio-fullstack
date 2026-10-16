"use client";

import { useEffect, useState } from "react";
import { Link as LinkScroll, scroller } from "react-scroll";
import { FaPaperPlane } from "react-icons/fa";

const menuItems = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "experience", label: "Experience" },
  { id: "projects", label: "Projects" },
  { id: "contact", label: "Contact" },
];

function CreateMenus({ activeLink, getMenuItems, setActiveLink, compact }) {
  return getMenuItems.map((item) => (
    <li key={item.id}>
      <LinkScroll
        activeClass="active"
        to={item.id}
        href={`#${item.id}`}
        spy={true}
        smooth={true}
        offset={-80}
        duration={1000}
        onSetActive={() => setActiveLink(item.id)}
        className={`${
          compact ? "px-3 py-2 text-xs" : "px-4 py-2 text-[15px]"
        } relative inline-block font-medium cursor-pointer transition-colors after:absolute after:left-2 after:right-2 after:-bottom-0.5 after:h-[2px] after:rounded-full after:transition-transform ${
          activeLink === item.id
            ? "text-[#1a9e55] after:bg-[#1a9e55] after:scale-x-100"
            : "text-[#111827] hover:text-[#1a9e55] after:bg-[#1a9e55] after:scale-x-0"
        }`}
      >
        {item.label}
      </LinkScroll>
    </li>
  ));
}

export default function Navbar() {
  const [activeLink, setActiveLink] = useState("home");
  const [scrollActive, setScrollActive] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrollActive(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function scrollToContact(e) {
    e.preventDefault();
    scroller.scrollTo("contact", {
      duration: 1500,
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
        <nav className="max-w-screen-xl px-6 sm:px-8 lg:px-16 mx-auto flex items-center justify-between py-4">
          <a
            href="#home"
            onClick={(e) => {
              e.preventDefault();
              scroller.scrollTo("home", { duration: 1000, smooth: true, offset: -80 });
            }}
            className="flex gap-1.5 font-extrabold items-center text-[22px] text-[#111827]"
            aria-label="Talat Mahmud - go to top"
          >
            <span className="h-[40px] flex justify-center items-center px-2.5 rounded-[8px] bg-[#1a9e55] text-white-500 text-[22px] font-extrabold shadow-[0_6px_14px_-6px_rgba(26,158,85,0.7)]">
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
            className="inline-flex items-center gap-2 py-3 px-6 bg-[#1a9e55] hover:bg-[#0f7a3d] text-white-500 font-semibold rounded-lg text-[15px] shadow-[0_12px_24px_-10px_rgba(26,158,85,0.8)] transition-all"
          >
            <FaPaperPlane aria-hidden="true" />
            Contact Me
          </a>
        </nav>
      </header>
      <nav
        aria-label="Mobile navigation"
        className="fixed lg:hidden bottom-0 left-0 right-0 z-30 px-2 sm:px-8 bg-white-500 shadow-t"
      >
        <ul className="overflow-x-auto flex w-full justify-between items-center py-2">
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
