'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import menuData from '@/private/menu.json';

interface SubMenuItem {
  id: number;
  label: string;
  href: string;
}

interface MenuItem {
  id: number;
  label: string;
  href: string;
  submenu?: SubMenuItem[];
}

interface HeaderProps {
  onPageTitleChange?: (title: string) => void;
}

export default function Header({ onPageTitleChange }: HeaderProps) {
  const menuItems: MenuItem[] = menuData.menuItems;
  const pathname = usePathname();
  const [hoveredMenu, setHoveredMenu] = useState<number | null>(null);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href);
  };

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY && currentScrollY > 10) {
        setIsVisible(false); // Ẩn header
      }  
      else if (currentScrollY < lastScrollY) {
        // show header
        setIsVisible(true); 
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  // Update page title based on current route
  useEffect(() => {
    if (!onPageTitleChange) return;

    // Find matching menu item or submenu item
    let matchedItem: MenuItem | SubMenuItem | null = null;

    // Check main menu items first
    for (const item of menuItems) {
      if (isActive(item.href)) {
        matchedItem = item;
        break;
      }

      // Check submenu items
      if (item.submenu) {
        for (const subItem of item.submenu) {
          if (isActive(subItem.href)) {
            matchedItem = subItem;
            break;
          }
        }
        if (matchedItem) break;
      }
    }

    if (matchedItem) {
      const title = `${matchedItem.label} - Săn Sell là ghiền`;
      onPageTitleChange(title);
    } else {
      // Default title if no match
      onPageTitleChange('Săn Sell là ghiền');
    }
  }, [pathname, onPageTitleChange, menuItems]);

  return (
    <header className="header">
      <div className={`header-inner ${isVisible ? 'translate-y-0' : '-translate-y-[100px]'}`}>
        <div className="container-fluid px-10">
          <div className="flex items-center justify-between">
            <Link  href="/" className="logo"> 
              <img alt="Next.js logo" loading="lazy" width="150" height="80" className="lazyload" src="/icons/logo.svg"></img>
            </Link>
            
            <ul className="header-menu">
              {menuItems.map((item) => {
                const active = isActive(item.href);
                const hasSubmenu = item.submenu && item.submenu.length > 0;
                return (
                  <li 
                    key={item.id}
                    className="relative py-5"
                    onMouseEnter={() => hasSubmenu && setHoveredMenu(item.id)}
                    onMouseLeave={() => setHoveredMenu(null)}
                  >
                    <Link href={item.href} className={`menu-item ${active ? 'active' : 'inactive'}`}>
                      {item.label}
                      {hasSubmenu && (
                        <svg className="w-4 h-4 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      )}
                    </Link>
                    
                    {hasSubmenu && (
                      <ul 
                        className={`absolute top-full left-0 w-48 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg shadow-lg overflow-hidden py-2 transition-all duration-200 ${
                          hoveredMenu === item.id 
                            ? 'opacity-100 visible translate-y-0' 
                            : 'opacity-0 invisible -translate-y-2 pointer-events-none'
                        }`}
                      >
                        {item.submenu?.map((subItem) => {
                          const subActive = isActive(subItem.href);
                          return (
                            <li key={subItem.id}>
                              <Link
                                href={subItem.href}
                                className={`block px-4 py-2 text-sm transition-colors ${
                                  subActive
                                    ? 'bg-zinc-100 dark:bg-zinc-800 text-black dark:text-white font-medium'
                                    : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-black dark:hover:text-white'
                                }`}
                              >
                                {subItem.label}
                              </Link>
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </li>
                );
              })}
            </ul>

            <div className="header-right">
              <button>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 6.75a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0zM4.5 20.25a8.25 8.25 0 0 1 15 0"
                  />
                </svg>
              </button>

              <button>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 21l-4.35-4.35M9.75 17.25a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15z"
                  />
                </svg>
              </button>

              <button>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 8.25c0-2.486-2.014-4.5-4.5-4.5a4.5 4.5 0 0 0-3.364 1.528A4.5 4.5 0 0 0 9.772 3.75c-2.486 0-4.5 2.014-4.5 4.5 0 5.25 6.75 9.75 6.75 9.75s6.75-4.5 6.75-9.75z"
                  />
                </svg>
              </button>

              <button>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.25 2.25h1.5l1.5 12h12.75l1.5-9H6M9 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0zm9 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0z"
                  />
                </svg>
                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  0
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

