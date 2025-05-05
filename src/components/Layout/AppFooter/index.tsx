import Link from "next/link";

import { footerLinks, socialLinks } from "@/data";

export const AppFooter = () => {
  return (
    <footer className="p-4 text-sm text-text-gray border-t border-borderLight">
      <div className="container mx-auto flex justify-between items-center flex-col md:flex-row">
        <div className="flex space-x-4 items-center">
          <span>© 2025 Sandworm</span>
          {footerLinks.map(({ label, href }) => (
            <Link
              key={label}
              href={href}
              target="blank_"
              className="hover:text-white"
            >
              {label}
            </Link>
          ))}
        </div>
        <div className="flex space-x-4 mt-2 md:mt-0">
          {socialLinks.map(({ name, icon: Icon, href }) => (
            <Link
              key={name}
              href={href}
              target="blank_"
              className="hover:text-white"
              aria-label={name}
            >
              <Icon size={18} />
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
};
