"use client"
import React, { useState, useEffect, useRef } from 'react';
import { Menu, X, User, UserPlus, ArrowUp } from 'lucide-react';
import Logo from './Logo';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import LanguageSwitcher from './LanguageChecker';
import { Button } from './ui/button';
import { navbarConfig } from '@/lib/navbarconfig';

type MenuItem = {
  label: string;
  href?: string;
  children?: { label: string; to: string }[];
};

const MobileMenu = ({
  isOpen,
  onClose,
  menuItems,
  handleLogin,
  handleSignup,
  pathname,
}: {
  isOpen: boolean;
  onClose: () => void;
  menuItems: MenuItem[];
  handleLogin: () => void;
  handleSignup: () => void;
  pathname: string;
}) => {
  const navigate = useRouter();
  const [expanded, setExpanded] = useState<string | null>(null);

  // Normalize pathname once
  const cleanPath = pathname?.replace(/\/+$/, '') || '';

  // Auto-expand based on current route
  useEffect(() => {
    if (!isOpen || !pathname) return;

    menuItems.forEach((item) => {
      // Match children
      item.children?.forEach((child) => {
        const childPath = child.to.replace(/\/+$/, '');
        if (childPath === cleanPath) {
          setExpanded(item.label);
        }
      });

      // Match parent (for items without children, e.g., NRI Services)
      if (item.href) {
        const parentPath = `/${item.href}`.replace(/\/+$/, '');
        if (parentPath === cleanPath || cleanPath.startsWith(parentPath)) {
          setExpanded(item.label);
        }
      }
    });
  }, [isOpen, cleanPath, menuItems]);

  const toggleExpand = (label: string) => {
    setExpanded((prev) => (prev === label ? null : label));
  };

  return (
    <div
      className={`
        lg:hidden fixed inset-x-0 top-0 z-40
        transform transition-all duration-300 ease-out
        ${isOpen ? 'translate-y-20 opacity-100' : '-translate-y-[150%] opacity-0 pointer-events-none'}
      `}
    >
      <div className="bg-white border-b border-border shadow-xl rounded-b-2xl overflow-hidden">
        <div className="container mx-auto px-4 max-w-7xl py-4">
          {/* MAIN NAV */}
          <nav className="space-y-2" role="menu">
            {menuItems.map((item) => {
              let isParentActive = false;

              // Parent highlight logic
              if (item.children) {
                isParentActive = item.children.some((child) => {
                  const childPath = child.to.replace(/\/+$/, '');
                  return cleanPath === childPath || cleanPath.startsWith(childPath);
                });
              }

              if (!item.children && item.href) {
                const parentPath = `/${item.href}`.replace(/\/+$/, '');
                isParentActive = cleanPath === parentPath || cleanPath.startsWith(parentPath);
              }

              return (
                <div key={item.label}>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      if (item.children) toggleExpand(item.label);
                      else if (item.href) navigate.push(`/${item.href}`);
                    }}
                    aria-expanded={expanded === item.label}
                    className={`
                      w-full flex justify-between items-center
                      px-4 py-3 rounded-lg text-left font-semibold
                      transition-all
                      ${isParentActive ? 'bg-gray-100 text-black' : 'text-gray-700'}
                    `}
                  >
                    <span>{item.label}</span>
                    {item.children && (
                      <ArrowUp
                        className={`w-4 h-4 transition-transform duration-300 ${expanded === item.label ? 'rotate-180 text-black' : 'text-gray-400'
                          }`}
                      />
                    )}
                  </button>

                  {/* Children */}
                  {item.children && expanded === item.label && (
                    <div className="ml-4 mr-2 mt-1 mb-2 border-l border-gray-300 pl-4 space-y-1">
                      {item.children.map((child) => {
                        const childPath = child.to.replace(/\/+$/, '');
                        const isChildActive = cleanPath === childPath;
                        return (
                          <Link
                            key={child.label}
                            href={child.to}
                            onClick={onClose}
                            role="menuitem"
                            className={`
                              block py-2 text-sm rounded transition
                              ${isChildActive
                                ? 'text-black font-semibold bg-gray-300'
                                : 'text-gray-600 hover:text-black hover:bg-gray-50'}
                            `}
                          >
                            {child.label}
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}

            {/* About Us */}
            <button
              onClick={() => {
                navigate.push('/about-us');
                onClose();
              }}
              className={`
                w-full flex justify-between items-center 
                px-4 py-3 mt-3 rounded-lg
                text-left font-semibold
                hover:bg-gray-100 active:bg-gray-200
                transition-all
                ${cleanPath === '/about-us' || cleanPath === '/about-us/' ? 'bg-gray-100 text-black' : 'text-gray-700'}
              `}
            >
              <span>About Us</span>
            </button>
          </nav>

          {/* FOOTER */}
          <div className="py-5 border-t mt-4 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Language</span>
              <LanguageSwitcher onClose={onClose} />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Button
                onClick={handleLogin}
                className="flex items-center justify-center gap-2 h-12 font-semibold bg-white text-black border hover:bg-gray-100"
              >
                <User className="w-4 h-4" /> Login
              </Button>

              <Button
                onClick={handleSignup}
                className="flex items-center justify-center gap-2 h-12 font-semibold"
              >
                <UserPlus className="w-4 h-4" /> Register
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const navigate = useRouter();
  const location = usePathname() || '';
  const config = navbarConfig;
  const router = useRouter()
  const hideHome = config.hideHomeOn.includes(location);
  const hideLang = config.hideLangOn.includes(location);

  useEffect(() => {
    if (window.innerWidth < 1024 && isMenuOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

  const menuItems: MenuItem[] = [
    {
      label: 'Services',
      children: [
        { label: 'Legal Consultation', to: '/services/legal-consultation' },
        { label: 'Legal Representation', to: '/services/legal-representation' },
        { label: 'Enterprise Legal', to: '/services/legal-enterprise' },
      ],
    },
    {
      label: 'Expertise',
      children: [
        { label: 'Civil Law', to: '/expertise/civil' },
        { label: 'Corporate Law', to: '/expertise/corporate' },
        { label: 'Criminal Law', to: '/expertise/criminal' },
        { label: 'Family Law', to: '/expertise/family' },
      ],
    },
    { label: 'NRI Services', href: 'nri-services' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 630);
      const sections = menuItems.map((i) => i.href?.substring(1));
      const currentSection = sections.find((section) => {
        const el = section ? document.getElementById(section) : null;
        return el && el.getBoundingClientRect().top <= 0 && el.getBoundingClientRect().bottom >= 100;
      });
      setActiveSection(currentSection || '');
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <div className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md shadow-sm transition-all duration-300">
        <div className="container-custom pl-2 pr-2 mx-auto px-4 max-w-7xl flex items-center justify-between py-4">
          <Logo onPress={() => {
            router.push('/')
          }} />

          {/* Desktop Menu */}
          <nav className="hidden lg:flex items-center space-x-8 relative">
            <Link
              href="/"
              className={`text-md font-semibold cursor-pointer hover:text-orange-400 ${hideHome ? 'invisible' : ''}`}
            >
              Home
            </Link>

            {menuItems.map((item) => (
              <div
                key={item.label}
                className="relative group"
                onMouseEnter={() => item.children && setActiveSection(item.label)}
                onMouseLeave={() => item.children && setActiveSection('')}
              >
                <Link
                  href={item.href ? `/${item.href}` : '#'}
                  className="text-md font-semibold cursor-pointer hover:text-orange-400"
                >
                  {item.label}
                </Link>

                {/* Dropdown for desktop */}
                {item.children && activeSection === item.label && (
                  <div className="absolute top-full left-0 w-72 bg-white border border-gray-100 shadow-2xl rounded-xl overflow-hidden z-50 backdrop-blur-sm animate-in fade-in slide-in-from-top-3 duration-300">
                    <div className="px-5 py-4 bg-gray-200 border-b border-gray-100">
                      <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                        {`Our ${item.label}`}
                      </h3>
                    </div>
                    <div className="py-2">
                      {item.children.map((child) => (
                        <Link
                          key={child.to}
                          href={child.to}
                          className="group flex items-center justify-between px-5 py-3.5 text-sm font-semibold text-gray-700 hover:bg-gradient-to-r hover:from-gray-50 hover:to-indigo-50 hover:text-gray-700 transition-all duration-300 border-l-4 border-transparent hover:border-gray-600"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-gray-300 group-hover:bg-black transition-colors duration-300" />
                            <span className="font-sm">{child.label}</span>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}


            <Link
              href="/about-us"
              className="text-md font-semibold cursor-pointer hover:text-orange-400"
            >
              About Us
            </Link>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center space-x-4">
            <Button
              onClick={() => navigate.push('/login')}
              className="group bg-white flex items-center gap-2 transform hover:scale-105 hover:bg-gray-100 transition-all duration-200 text-blue-500 cursor-pointer"
            >
              <User className="w-4 h-4 text-yellow-700 group-hover:scale-110 transition-transform" /> Login
            </Button>
            <Button
              onClick={() => navigate.push('/signup')}
              className="group flex items-center gap-2 text-white hover:text-gray-400 transform hover:scale-105 transition-all duration-200 cursor-pointer"
            >
              <UserPlus className="w-4 h-4 text-emerald-700 group-hover:scale-110 transition-transform" /> Subscribe
            </Button>
            {!hideLang && (
              <div className="relative rounded-lg">
                <LanguageSwitcher onClose={() => { }} />
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 text-gray-600 hover:text-gray-900 transition-colors"
            onClick={() => setIsMenuOpen((prev) => !prev)}
          >
            <div className="relative w-6 h-6">
              <Menu
                className={`absolute inset-0 transform transition-all duration-300 ${isMenuOpen ? 'rotate-180 opacity-0' : 'rotate-0 opacity-100'
                  }`}
              />
              <X
                className={`absolute inset-0 transform transition-all duration-300 ${isMenuOpen ? 'rotate-0 opacity-100' : '-rotate-180 opacity-0'
                  }`}
              />
            </div>
          </button>
        </div>

        <MobileMenu
          isOpen={isMenuOpen}
          onClose={() => setIsMenuOpen(false)}
          menuItems={menuItems}
          handleLogin={() => navigate.push('/login')}
          handleSignup={() => navigate.push('/signup')}
          pathname={location}
        />
      </div>

      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden backdrop-blur-sm"
          onClick={() => setIsMenuOpen(false)}
        />
      )}
    </>
  );
};

export default Navbar;
