"use client";
import { FaFacebookF, FaLinkedinIn, FaInstagram } from "react-icons/fa";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
const socialIcons = [
  {
    id: "facebook",
    icon: (
      <FaFacebookF
        color="rgba(13, 183, 96, 1)"
        className="w-[40px] h-[40px] "
      />
    ),
    socialLink: "https://www.facebook.com/profile.php?id=100010332459337",
  },

  {
    id: "linkedin",
    icon: (
      <FaLinkedinIn
        color="rgba(13, 183, 96, 1)"
        className="w-[40px] h-[40px] "
      />
    ),
    socialLink: "https://www.linkedin.com/in/talat09/",
  },
  {
    id: "instagram",
    icon: (
      <FaInstagram
        color="rgba(13, 183, 96, 1)"
        className="w-[40px] h-[40px] "
      />
    ),
    socialLink:
      "https://www.instagram.com/dihan.talat/?igshid=NzZlODBkYWE4Ng%3D%3D&fbclid=IwAR0xCmMoc7WR7ZDVZkcKRAf_3gIYMTZYaZEIUG9DU8z_wZz8cIZ69-nktTs",
  },
];
export function Footer() {
  const router = useRouter();
  return (
    <div className="my-16 py-8">
      <p className="text-center text-4xl mb-4 font-bold">
        Talat <span className="text-green-main">Mahmud</span>{" "}
      </p>
      <motion.div className="flex gap-3 justify-center cursor-pointer">
        {socialIcons.map((item, i) => (
          <motion.div
            key={i}
            initial={{ scale: 0 }}
            animate={{ rotate: 360, scale: 1 }}
            transition={{
              type: "spring",
              damping: 20,
              stiffness: 80,
              duration: 4,
            }}
            whileHover={{ scale: 1.2, rotate: 360 }}
            whileTap={{ scale: 0.8, rotate: -360, borderRadius: "100%" }}
            onClick={() => router.push(item.socialLink)}
          >
            {item.icon}
          </motion.div>
        ))}
      </motion.div>
      <p className="text-center mt-4">
        Copyright &copy; <span className="text-green-main">2023</span> - All
        right reserved by <span className="text-green-main ">Talat </span>Mahmud
      </p>
    </div>
  );
}
