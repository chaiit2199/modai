'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import menuData from '@/private/menu.json';
import { FacebookShareButton, LinkedInShareButton } from '@/components/SocialShare';
import { isAuthenticated, getUser, clearAuth, getAccountInfo, User } from '@/utils/auth';

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

export default function Header() {
  const menuItems: MenuItem[] = menuData.menuItems;
  const pathname = usePathname();
  const router = useRouter();
  const [hoveredMenu, setHoveredMenu] = useState<number | null>(null);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [currentUrl, setCurrentUrl] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Get current URL for sharing
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setCurrentUrl(window.location.href);
    }
  }, [pathname]);

  // Check authentication status only when needed
  useEffect(() => {
    const checkAuth = () => {
      // Only check if we're on /auth routes or if there's a cookie token
      const isAuthRoute = pathname.startsWith('/auth');
      
      // Check if there's a token cookie (without triggering cache lookup)
      let hasTokenCookie = false;
      if (typeof document !== 'undefined') {
        const cookies = document.cookie.split(';');
        hasTokenCookie = cookies.some(cookie => cookie.trim().startsWith('access_token='));
      }
      
      // Only check authentication if on auth route or if token cookie exists
      if (isAuthRoute || hasTokenCookie) {
        // Use getAccountInfo first to avoid multiple getToken() calls
        const accountInfo = getAccountInfo();
        if (accountInfo && accountInfo.is_login) {
          setIsLoggedIn(true);
          setUser(accountInfo.user);
        } else {
          // Fallback to isAuthenticated if account_info not in cache
          const authenticated = isAuthenticated();
          setIsLoggedIn(authenticated);
          if (authenticated) {
            const userData = getUser();
            setUser(userData);
          } else {
            setUser(null);
          }
        }
      } else {
        // Not on auth route and no token cookie, clear state
        setIsLoggedIn(false);
        setUser(null);
      }
    };

    checkAuth();
    // Only re-check on pathname change, not periodically
  }, [pathname]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowUserDropdown(false);
      }
    };

    if (showUserDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showUserDropdown]);

  const handleLogout = () => {
    clearAuth();
    setIsLoggedIn(false);
    setUser(null);
    setShowUserDropdown(false);
    router.push('/auth/login');
  };

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
        setIsVisible(false); // hide header
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
  }, [pathname, menuItems]);

  return (
    <header className="header">
      <div className={`header-inner ${isVisible ? 'translate-y-0' : '-translate-y-[100px]'}`}>
        <div className="container px-4">
          <div className="flex items-center justify-between">
            <Link  href="/" className="logo"> 
              MODAI
            </Link>
            
            <ul className="header-menu">
              {menuItems.map((item) => {
                const active = isActive(item.href);
                const hasSubmenu = item.submenu && item.submenu.length > 0;
                return (
                  <li 
                    key={item.id}
                    className="relative py-6"
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
              <FacebookShareButton url={currentUrl} /> 

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

              {isLoggedIn && user ? (
                <div className="user-component" ref={dropdownRef}>
                  <button onClick={() => setShowUserDropdown(!showUserDropdown)}
                    className="cursor-pointer font-bold line-clamp-1 text-ellipsis user-component--title"
                  >
                    {user.username}
                  </button>

                  {showUserDropdown && (
                    <div className="user-component--dropdown">
                      <div className="px-4 py-3 border-b border-line">
                        <p className="user-component--title">
                          {user.username}
                        </p>
                        <p className="user-component--email">
                          {user.email}
                        </p>
                      </div> 
                     
                      <div className="py-1"> 
                        <Link href={`/auth/admin`}  className="w-full text-left px-4 pt-2 text-sm font-bold block">
                          Quản lý
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="w-full text-left px-4 py-2 text-sm text-red-600 transition-colors cursor-pointer"
                        >
                          Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link href="/auth/login">
                  <img src="/icons/login.svg" alt="Login" className="w-6 h-6" />
                </Link>
              )}
            </div> 
          </div>
        </div>
      </div>
    </header>
  );
}

